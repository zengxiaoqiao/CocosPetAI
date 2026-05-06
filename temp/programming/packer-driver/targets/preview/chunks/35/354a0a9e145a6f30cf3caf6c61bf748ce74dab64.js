System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, native, getWeatherText, _crd, WEATHER_TEXT_MAP, GEO_BASE, WEATHER_BASE;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function httpGetJson(_x) {
    return _httpGetJson.apply(this, arguments);
  }

  function _httpGetJson() {
    _httpGetJson = _asyncToGenerator(function* (url) {
      try {
        // 大部分平台上优先用 fetch
        if (typeof fetch === 'function') {
          var res = yield fetch(url);
          if (!res.ok) return null;
          return yield res.json();
        }
      } catch (_unused) {// fall through to XHR
      } // 兜底：XMLHttpRequest（Cocos 原生 / 某些环境下）


      return new Promise(resolve => {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);

          xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;

            if (xhr.status < 200 || xhr.status >= 300) {
              resolve(null);
              return;
            }

            try {
              var data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (_unused2) {
              resolve(null);
            }
          };

          xhr.onerror = () => resolve(null);

          xhr.send();
        } catch (_unused3) {
          resolve(null);
        }
      });
    });
    return _httpGetJson.apply(this, arguments);
  }

  /** 通过城市名查询经纬度（使用 Open‑Meteo Geocoding API） */
  function getLocationByCityName(_x2) {
    return _getLocationByCityName.apply(this, arguments);
  }
  /** 通过经纬度获取当前天气（温度 + 文案） */


  function _getLocationByCityName() {
    _getLocationByCityName = _asyncToGenerator(function* (name) {
      var _data$results, _first$name;

      if (!name) return null;
      var encoded = encodeURIComponent(name);
      var url = GEO_BASE + "?name=" + encoded + "&count=1&language=zh&format=json";
      var data = yield httpGetJson(url);
      var first = data == null || (_data$results = data.results) == null ? void 0 : _data$results[0];
      if (!first) return null;
      return {
        latitude: Number(first.latitude),
        longitude: Number(first.longitude),
        name: String((_first$name = first.name) != null ? _first$name : name),
        country: first.country ? String(first.country) : undefined
      };
    });
    return _getLocationByCityName.apply(this, arguments);
  }

  function getCurrentWeatherByCoords(_x3, _x4) {
    return _getCurrentWeatherByCoords.apply(this, arguments);
  }
  /** 通过城市名直接获取当前天气（内部先查经纬度） */


  function _getCurrentWeatherByCoords() {
    _getCurrentWeatherByCoords = _asyncToGenerator(function* (latitude, longitude) {
      if (!isFinite(latitude) || !isFinite(longitude)) return null;
      var url = WEATHER_BASE + "?latitude=" + latitude + "&longitude=" + longitude + "&current_weather=true&timezone=auto";
      var data = yield httpGetJson(url);
      var cw = data == null ? void 0 : data.current_weather;

      if (!cw || typeof cw.temperature !== 'number' || typeof cw.weathercode !== 'number') {
        return null;
      }

      var code = cw.weathercode;
      var text = (_crd && getWeatherText === void 0 ? (_reportPossibleCrUseOfgetWeatherText({
        error: Error()
      }), getWeatherText) : getWeatherText)(code) || '多云';
      return {
        temperature: cw.temperature,
        code,
        text
      };
    });
    return _getCurrentWeatherByCoords.apply(this, arguments);
  }

  function getCurrentWeatherByCity(_x5) {
    return _getCurrentWeatherByCity.apply(this, arguments);
  }
  /** 简单示例：按系统语言猜一个默认城市（你可以在 UI 里自己传城市名更精确） */


  function _getCurrentWeatherByCity() {
    _getCurrentWeatherByCity = _asyncToGenerator(function* (name) {
      var loc = yield getLocationByCityName(name);
      if (!loc) return null;
      return getCurrentWeatherByCoords(loc.latitude, loc.longitude);
    });
    return _getCurrentWeatherByCity.apply(this, arguments);
  }

  function getCurrentWeatherWithGuess() {
    return _getCurrentWeatherWithGuess.apply(this, arguments);
  }
  /** Android 原生：使用设备当前位置获取天气（需要粗略定位权限），失败时退回 getCurrentWeatherWithGuess。 */


  function _getCurrentWeatherWithGuess() {
    _getCurrentWeatherWithGuess = _asyncToGenerator(function* () {
      var city = 'Beijing';

      try {
        var lang = (sys.languageCode || sys.language).toLowerCase();

        if (lang.startsWith('zh')) {
          city = 'Beijing';
        } else if (lang.startsWith('ja')) {
          city = 'Tokyo';
        } else if (lang.startsWith('ko')) {
          city = 'Seoul';
        } else if (lang.startsWith('en')) {
          city = 'London';
        }
      } catch (_unused4) {// ignore, 使用默认 Beijing
      }

      return getCurrentWeatherByCity(city);
    });
    return _getCurrentWeatherWithGuess.apply(this, arguments);
  }

  function getCurrentWeatherByDeviceLocation() {
    return _getCurrentWeatherByDeviceLocation.apply(this, arguments);
  }

  function _getCurrentWeatherByDeviceLocation() {
    _getCurrentWeatherByDeviceLocation = _asyncToGenerator(function* () {
      // 仅在 Android 原生上尝试读取设备位置，其它平台直接退回猜城市逻辑
      if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) {
        return getCurrentWeatherWithGuess();
      }

      try {
        var _nat$reflection;

        var nat = native;

        if (!(nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod)) {
          return getCurrentWeatherWithGuess();
        }

        var locStr = nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getLastKnownLocation', '()Ljava/lang/String;');

        if (!locStr) {
          // 可能刚触发权限弹窗，或系统没有缓存位置，退回猜城市
          return getCurrentWeatherWithGuess();
        }

        var parts = locStr.split(',');
        if (parts.length !== 2) return getCurrentWeatherWithGuess();
        var lat = parseFloat(parts[0].trim());
        var lon = parseFloat(parts[1].trim());

        if (!isFinite(lat) || !isFinite(lon)) {
          return getCurrentWeatherWithGuess();
        }

        return getCurrentWeatherByCoords(lat, lon);
      } catch (_unused5) {
        return getCurrentWeatherWithGuess();
      }
    });
    return _getCurrentWeatherByDeviceLocation.apply(this, arguments);
  }

  function _reportPossibleCrUseOfgetWeatherText(extras) {
    _reporterNs.report("getWeatherText", "./TipCopy", _context.meta, extras);
  }

  _export({
    getLocationByCityName: getLocationByCityName,
    getCurrentWeatherByCoords: getCurrentWeatherByCoords,
    getCurrentWeatherByCity: getCurrentWeatherByCity,
    getCurrentWeatherWithGuess: getCurrentWeatherWithGuess,
    getCurrentWeatherByDeviceLocation: getCurrentWeatherByDeviceLocation
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
      native = _cc.native;
    }, function (_unresolved_2) {
      getWeatherText = _unresolved_2.getWeatherText;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "104fb+UnH5Bl7RUUTOTAfWK", "WeatherService", undefined);

      __checkObsolete__(['sys', 'native']);

      // 保持兼容：若有地方仍直接读取 WEATHER_TEXT_MAP，则通过 getter 暴露只读 map
      _export("WEATHER_TEXT_MAP", WEATHER_TEXT_MAP = new Proxy({}, {
        get(_target, prop) {
          var code = typeof prop === 'string' ? Number(prop) : NaN;
          if (!Number.isFinite(code)) return undefined;
          return (_crd && getWeatherText === void 0 ? (_reportPossibleCrUseOfgetWeatherText({
            error: Error()
          }), getWeatherText) : getWeatherText)(code);
        }

      }));

      GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
      WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=354a0a9e145a6f30cf3caf6c61bf748ce74dab64.js.map