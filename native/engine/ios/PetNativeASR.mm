#import "PetNativeASR.h"

#import <AVFoundation/AVFoundation.h>
#import <Speech/Speech.h>

@implementation PetNativeASR

static AVAudioEngine *_engine = nil;
static SFSpeechRecognizer *_recognizer = nil;
static SFSpeechAudioBufferRecognitionRequest *_request = nil;
static SFSpeechRecognitionTask *_task = nil;
static NSString *_latest = @"";
static BOOL _running = NO;

+ (void)startAutoAsr {
    _running = YES;

    if (@available(iOS 10.0, *)) {
        if (_recognizer == nil) {
            // Default to zh-CN. If unavailable, system may fallback.
            _recognizer = [[SFSpeechRecognizer alloc] initWithLocale:[NSLocale localeWithLocaleIdentifier:@"zh-CN"]];
        }

        [SFSpeechRecognizer requestAuthorization:^(SFSpeechRecognizerAuthorizationStatus status) {
            if (status != SFSpeechRecognizerAuthorizationStatusAuthorized) {
                return;
            }

            dispatch_async(dispatch_get_main_queue(), ^{
                if (!_running) return;

                AVAudioSession *session = [AVAudioSession sharedInstance];
                NSError *err = nil;
                [session setCategory:AVAudioSessionCategoryRecord mode:AVAudioSessionModeMeasurement options:AVAudioSessionCategoryOptionDuckOthers error:&err];
                [session setActive:YES withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation error:&err];

                if (_engine == nil) _engine = [[AVAudioEngine alloc] init];

                // Reset previous
                if (_task) { [_task cancel]; _task = nil; }
                if (_request) { _request = nil; }

                _request = [[SFSpeechAudioBufferRecognitionRequest alloc] init];
                _request.shouldReportPartialResults = NO;

                AVAudioInputNode *input = _engine.inputNode;
                if (input == nil) return;

                AVAudioFormat *format = [input outputFormatForBus:0];
                [input removeTapOnBus:0];
                [input installTapOnBus:0 bufferSize:1024 format:format block:^(AVAudioPCMBuffer *buffer, AVAudioTime *when) {
                    if (_request) [_request appendAudioPCMBuffer:buffer];
                }];

                __weak typeof(self) weakSelf = self;
                _task = [_recognizer recognitionTaskWithRequest:_request resultHandler:^(SFSpeechRecognitionResult * _Nullable result, NSError * _Nullable error) {
                    (void)weakSelf;
                    if (!_running) return;

                    if (result && result.isFinal) {
                        NSString *txt = result.bestTranscription.formattedString ?: @"";
                        _latest = txt;
                        // Restart listening to keep "always listening" while app is foreground.
                        [PetNativeASR stopAutoAsrInternal:NO];
                        [PetNativeASR startAutoAsr];
                        return;
                    }
                    if (error) {
                        // Try restart on error while running.
                        [PetNativeASR stopAutoAsrInternal:NO];
                        [PetNativeASR startAutoAsr];
                    }
                }];

                [_engine prepare];
                NSError *startErr = nil;
                [_engine startAndReturnError:&startErr];
            });
        }];
    }
}

+ (void)stopAutoAsrInternal:(BOOL)deactivateSession {
    if (@available(iOS 10.0, *)) {
        if (_engine) {
            @try {
                [[_engine inputNode] removeTapOnBus:0];
            } @catch (__unused NSException *e) {}
            [_engine stop];
        }
        if (_request) { [_request endAudio]; _request = nil; }
        if (_task) { [_task cancel]; _task = nil; }
        if (deactivateSession) {
            NSError *err = nil;
            [[AVAudioSession sharedInstance] setActive:NO withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation error:&err];
        }
    }
}

+ (void)stopAutoAsr {
    _running = NO;
    [self stopAutoAsrInternal:YES];
}

+ (NSString *)pollAutoAsrResult {
    NSString *t = _latest ?: @"";
    _latest = @"";
    return t;
}

+ (NSString *)getAppVersionName {
    NSString *v = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    return v ?: @"";
}

@end

