import { sys, native } from 'cc';
import { getWeatherText } from './TipCopy';

export interface WeatherInfo {
    temperature: number;   // 当前温度（℃）
    code: number;          // Open‑Meteo weathercode
    text: string;          // 我们映射后的文案
}

// 保持兼容：若有地方仍直接读取 WEATHER_TEXT_MAP，则通过 getter 暴露只读 map
export const WEATHER_TEXT_MAP: Record<number, string> = new Proxy({}, {
    get(_target, prop: string | symbol) {
        const code = typeof prop === 'string' ? Number(prop) : NaN;
        if (!Number.isFinite(code)) return undefined;
        return getWeatherText(code);
    }
});

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast';

async function httpGetJson(url: string): Promise<any | null> {
    try {
        // 大部分平台上优先用 fetch
        if (typeof fetch === 'function') {
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
        }
    } catch {
        // fall through to XHR
    }

    // 兜底：XMLHttpRequest（Cocos 原生 / 某些环境下）
    return new Promise((resolve) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                if (xhr.status < 200 || xhr.status >= 300) {
                    resolve(null);
                    return;
                }
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } catch {
                    resolve(null);
                }
            };
            xhr.onerror = () => resolve(null);
            xhr.send();
        } catch {
            resolve(null);
        }
    });
}

export interface CityLocation {
    latitude: number;
    longitude: number;
    name: string;
    country?: string;
}

/** 通过城市名查询经纬度（使用 Open‑Meteo Geocoding API） */
export async function getLocationByCityName(name: string): Promise<CityLocation | null> {
    if (!name) return null;
    const encoded = encodeURIComponent(name);
    const url = `${GEO_BASE}?name=${encoded}&count=1&language=zh&format=json`;
    const data = await httpGetJson(url);
    const first = data?.results?.[0];
    if (!first) return null;
    return {
        latitude: Number(first.latitude),
        longitude: Number(first.longitude),
        name: String(first.name ?? name),
        country: first.country ? String(first.country) : undefined,
    };
}

/** 通过经纬度获取当前天气（温度 + 文案） */
export async function getCurrentWeatherByCoords(latitude: number, longitude: number): Promise<WeatherInfo | null> {
    if (!isFinite(latitude) || !isFinite(longitude)) return null;
    const url =
        `${WEATHER_BASE}?latitude=${latitude}&longitude=${longitude}` +
        `&current_weather=true&timezone=auto`;
    const data = await httpGetJson(url);
    const cw = data?.current_weather;
    if (!cw || typeof cw.temperature !== 'number' || typeof cw.weathercode !== 'number') {
        return null;
    }
    const code = cw.weathercode as number;
    const text = getWeatherText(code) || '多云';
    return {
        temperature: cw.temperature,
        code,
        text,
    };
}

/** 通过城市名直接获取当前天气（内部先查经纬度） */
export async function getCurrentWeatherByCity(name: string): Promise<WeatherInfo | null> {
    const loc = await getLocationByCityName(name);
    if (!loc) return null;
    return getCurrentWeatherByCoords(loc.latitude, loc.longitude);
}

/** 简单示例：按系统语言猜一个默认城市（你可以在 UI 里自己传城市名更精确） */
export async function getCurrentWeatherWithGuess(): Promise<WeatherInfo | null> {
    let city = 'Beijing';
    try {
        const lang = (sys.languageCode || sys.language).toLowerCase();
        if (lang.startsWith('zh')) {
            city = 'Beijing';
        } else if (lang.startsWith('ja')) {
            city = 'Tokyo';
        } else if (lang.startsWith('ko')) {
            city = 'Seoul';
        } else if (lang.startsWith('en')) {
            city = 'London';
        }
    } catch {
        // ignore, 使用默认 Beijing
    }
    return getCurrentWeatherByCity(city);
}

/** Android 原生：使用设备当前位置获取天气（需要粗略定位权限），失败时退回 getCurrentWeatherWithGuess。 */
export async function getCurrentWeatherByDeviceLocation(): Promise<WeatherInfo | null> {
    // 仅在 Android 原生上尝试读取设备位置，其它平台直接退回猜城市逻辑
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) {
        return getCurrentWeatherWithGuess();
    }
    try {
        const nat = native as any;
        if (!nat?.reflection?.callStaticMethod) {
            return getCurrentWeatherWithGuess();
        }
        const locStr = nat.reflection.callStaticMethod(
            'com/cocos/game/AppActivity',
            'getLastKnownLocation',
            '()Ljava/lang/String;'
        ) as string | null | undefined;
        if (!locStr) {
            // 可能刚触发权限弹窗，或系统没有缓存位置，退回猜城市
            return getCurrentWeatherWithGuess();
        }
        const parts = locStr.split(',');
        if (parts.length !== 2) return getCurrentWeatherWithGuess();
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (!isFinite(lat) || !isFinite(lon)) {
            return getCurrentWeatherWithGuess();
        }
        return getCurrentWeatherByCoords(lat, lon);
    } catch {
        return getCurrentWeatherWithGuess();
    }
}

