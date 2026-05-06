package com.cocos.game;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.text.TextUtils;
import android.util.Log;

import com.iflytek.sparkchain.core.asr.ASR;
import com.iflytek.sparkchain.core.asr.AsrCallbacks;
import com.iflytek.sparkchain.core.asr.AudioAttributes;

import java.util.Locale;
import java.util.concurrent.atomic.AtomicBoolean;

final class IflytekAsrEngine {
    private static final String TAG = "IflytekAsrEngine";
    private static final int SAMPLE_RATE = 16000;
    private static final int FRAME_BYTES = 1280;

    private final Context appContext;
    private final AtomicBoolean writing = new AtomicBoolean(false);
    private final Object lock = new Object();

    private ASR asr;
    private AudioRecord audioRecord;
    private Thread recordThread;
    private volatile boolean running = false;
    private volatile int lastError = 0;
    private volatile String latestText = "";
    private volatile long writeFrameCount = 0;
    private volatile long totalWriteBytes = 0;

    IflytekAsrEngine(Context context) {
        this.appContext = context.getApplicationContext();
    }

    boolean start(boolean onceMode) {
        synchronized (lock) {
            if (running) return true;
            initAsrIfNeeded();
            configureAsr();

            AudioAttributes attr = new AudioAttributes();
            attr.setSampleRate(SAMPLE_RATE);
            attr.setEncoding("raw");
            attr.setChannels(1);
            attr.setBitdepth(16);

            int ret = asr.start(attr, String.valueOf(System.currentTimeMillis()));
            if (ret != 0) {
                lastError = ret;
                Log.e(TAG, "ASR start failed, code=" + ret);
                return false;
            }

            if (!startRecorder()) {
                try {
                    asr.stop(true);
                } catch (Throwable ignored) {
                }
                return false;
            }

            running = true;
            writing.set(true);
            writeFrameCount = 0;
            totalWriteBytes = 0;
            lastError = 0;
            Log.d(TAG, "ASR recorder started, sampleRate=" + SAMPLE_RATE + ", frameBytes=" + FRAME_BYTES);
            return true;
        }
    }

    void stop(boolean waitFinalResult) {
        synchronized (lock) {
            if (!running && !writing.get()) return;
            running = false;
            writing.set(false);
            stopRecorder();
            if (asr != null) {
                try {
                    asr.stop(!waitFinalResult);
                } catch (Throwable t) {
                    Log.e(TAG, "ASR stop failed", t);
                    lastError = -20;
                }
            }
        }
    }

    void release() {
        stop(false);
        synchronized (lock) {
            asr = null;
        }
    }

    String pollText() {
        String text = latestText;
        latestText = "";
        return text == null ? "" : text;
    }

    int getLastError() {
        return lastError;
    }

    boolean isRunning() {
        return running;
    }

    private void initAsrIfNeeded() {
        if (asr != null) return;
        asr = new ASR();
        asr.registerCallbacks(new AsrCallbacks() {
            @Override
            public void onResult(ASR.ASRResult result, Object tag) {
                if (result == null) return;
                String text = result.getBestMatchText();
                int status = result.getStatus();
                Log.d(TAG, "ASR result status=" + status + ", text=" + text);
                if (text != null && !text.isEmpty()) {
                    latestText = text;
                }
                if (status == 2) {
                    running = false;
                    writing.set(false);
                    stopRecorder();
                    lastError = 0;
                }
            }

            @Override
            public void onError(ASR.ASRError error, Object tag) {
                int code = error != null ? error.getCode() : -1;
                String msg = error != null ? error.getErrMsg() : "";
                Log.e(TAG, "ASR error code=" + code + ", msg=" + msg);
                lastError = code;
                running = false;
                writing.set(false);
                stopRecorder();
            }

            @Override
            public void onBeginOfSpeech() {
                Log.d(TAG, "ASR onBeginOfSpeech");
            }

            @Override
            public void onEndOfSpeech() {
                Log.d(TAG, "ASR onEndOfSpeech");
            }
        });
    }

    private void configureAsr() {
        String asrLanguage = "en_us";
        if (isChinese()) {
            asrLanguage = "zh_cn";
        }
        asr.language(asrLanguage);
        asr.domain("iat");
        asr.accent("mandarin");
        asr.vinfo(true);
        if (isChinese()) {
            asr.dwa("wpgs");
        }
    }

    private boolean isChinese() {
        String language = Locale.getDefault().getLanguage();
        return !TextUtils.isEmpty(language) && language.contains("zh");
    }

    @SuppressLint("MissingPermission")
    private boolean startRecorder() {
        int minBytes = AudioRecord.getMinBufferSize(
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT
        );
        int bufferSize = Math.max(minBytes, FRAME_BYTES * 4);
        if (bufferSize <= 0) {
            lastError = -10;
            return false;
        }

        try {
            audioRecord = new AudioRecord(
                    MediaRecorder.AudioSource.VOICE_RECOGNITION,
                    SAMPLE_RATE,
                    AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    bufferSize
            );
            if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
                lastError = -11;
                stopRecorder();
                return false;
            }
            audioRecord.startRecording();
            recordThread = new Thread(this::recordLoop, "iflytek-asr-recorder");
            recordThread.start();
            return true;
        } catch (Throwable t) {
            Log.e(TAG, "startRecorder failed", t);
            lastError = -12;
            stopRecorder();
            return false;
        }
    }

    private void recordLoop() {
        byte[] buffer = new byte[FRAME_BYTES];
        while (writing.get()) {
            AudioRecord recorder = audioRecord;
            if (recorder == null) break;
            int size = recorder.read(buffer, 0, buffer.length);
            if (size <= 0) continue;
            ASR currentAsr = asr;
            if (currentAsr == null) break;
            byte[] frame = new byte[size];
            System.arraycopy(buffer, 0, frame, 0, size);
            long frameIndex = ++writeFrameCount;
            totalWriteBytes += size;
            if (frameIndex <= 5 || frameIndex % 25 == 0) {
                Log.d(TAG, "ASR write -> frame=" + frameIndex
                        + ", size=" + size
                        + ", totalBytes=" + totalWriteBytes
                        + ", preview=" + previewBytes(frame, Math.min(size, 12)));
            }
            int ret = currentAsr.write(frame);
            if (ret == 0 && (frameIndex <= 5 || frameIndex % 25 == 0)) {
                Log.d(TAG, "ASR write <- frame=" + frameIndex + ", ret=0");
            }
            if (ret != 0) {
                Log.e(TAG, "ASR write failed, frame=" + frameIndex + ", size=" + size + ", code=" + ret);
                lastError = ret;
                writing.set(false);
                running = false;
                break;
            }
        }
    }

    private String previewBytes(byte[] data, int len) {
        if (data == null || len <= 0) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++) {
            if (i > 0) sb.append(' ');
            int v = data[i] & 0xff;
            if (v < 16) sb.append('0');
            sb.append(Integer.toHexString(v));
        }
        return sb.toString();
    }

    private void stopRecorder() {
        AudioRecord recorder = audioRecord;
        audioRecord = null;
        if (recorder != null) {
            try {
                recorder.stop();
            } catch (Throwable ignored) {
            }
            try {
                recorder.release();
            } catch (Throwable ignored) {
            }
        }
        Thread thread = recordThread;
        recordThread = null;
        if (thread != null && thread != Thread.currentThread()) {
            try {
                thread.join(300);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
