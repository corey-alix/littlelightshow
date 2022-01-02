var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

// node_modules/fn-annotate/index.js
var require_fn_annotate = __commonJS({
  "node_modules/fn-annotate/index.js"(exports, module) {
    "use strict";
    module.exports = annotate;
    function annotate(fn) {
      if (typeof fn !== "function") {
        throw new Error("Could not parse function signature for injection dependencies: Object is not a function");
      }
      if (!fn.length)
        return [];
      var injects = /^()\(?([^)=]*)\)? *=>/.exec(fn + "") || /^[^(]+([^ \(]*) *\(([^\)]*)\)/.exec(fn + "");
      if (!injects) {
        throw new Error("Could not parse function signature for injection dependencies: " + fn + "");
      }
      var argumentString = injects[2].replace(/\/\*[\S\s]*?\*\//g, " ").replace(/\/\/.*/g, " ");
      function groupSubArguments(_, type, keys) {
        return type + keys.split(",").map(function(arg) {
          return arg && arg.trim();
        }).filter(Boolean).join("@");
      }
      argumentString = argumentString.replace(/(\{)([^}]*)\}/g, groupSubArguments);
      argumentString = argumentString.replace(/(\[)([^}]*)\]/g, groupSubArguments);
      return argumentString.split(",").map(function(arg) {
        return arg && arg.trim();
      }).map(function(arg) {
        if (arg[0] === "{") {
          return arg.substring(1).split("@");
        }
        if (arg[0] === "[") {
          return { items: arg.substring(1).split("@") };
        }
        return arg;
      }).filter(Boolean);
    }
  }
});

// node_modules/util-deprecate/browser.js
var require_browser = __commonJS({
  "node_modules/util-deprecate/browser.js"(exports, module) {
    module.exports = deprecate;
    function deprecate(fn, msg) {
      if (config("noDeprecation")) {
        return fn;
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (config("throwDeprecation")) {
            throw new Error(msg);
          } else if (config("traceDeprecation")) {
            console.trace(msg);
          } else {
            console.warn(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    }
    function config(name) {
      try {
        if (!global.localStorage)
          return false;
      } catch (_) {
        return false;
      }
      var val = global.localStorage[name];
      if (val == null)
        return false;
      return String(val).toLowerCase() === "true";
    }
  }
});

// node_modules/faunadb/package.json
var require_package = __commonJS({
  "node_modules/faunadb/package.json"(exports, module) {
    module.exports = {
      name: "faunadb",
      version: "4.4.1",
      apiVersion: "4",
      description: "FaunaDB Javascript driver for Node.JS and Browsers",
      homepage: "https://fauna.com",
      repository: "fauna/faunadb-js",
      license: "MPL-2.0",
      keywords: [
        "database",
        "fauna",
        "official",
        "driver"
      ],
      bugs: {
        url: "https://github.com/fauna/faunadb-js/issues"
      },
      files: [
        "index.d.ts",
        "src/",
        "dist/",
        "tools/printReleaseNotes.js"
      ],
      main: "index.js",
      scripts: {
        doc: "jsdoc -c ./jsdoc.json",
        browserify: "browserify index.js --standalone faunadb -o dist/faunadb.js",
        "browserify-min": "browserify index.js --standalone faunadb | terser -c -m --keep-fnames --keep-classnames -o dist/faunadb-min.js",
        prettify: 'prettier --write "{src,test}/**/*.{js,ts}"',
        test: "jest --env=node --verbose=false --forceExit ./test",
        "semantic-release": "semantic-release",
        wp: "webpack",
        postinstall: "node ./tools/printReleaseNotes",
        postupdate: "node ./tools/printReleaseNotes",
        "load-test": "node ./tools/loadTest"
      },
      types: "index.d.ts",
      dependencies: {
        "abort-controller": "^3.0.0",
        "base64-js": "^1.2.0",
        boxen: "^5.0.1",
        "btoa-lite": "^1.0.0",
        chalk: "^4.1.1",
        "cross-fetch": "^3.0.6",
        dotenv: "^8.2.0",
        "fn-annotate": "^1.1.3",
        "object-assign": "^4.1.0",
        "util-deprecate": "^1.0.2"
      },
      devDependencies: {
        browserify: "^16.2.2",
        eslint: "^5.3.0",
        "eslint-config-prettier": "^6.5.0",
        "eslint-plugin-prettier": "^3.1.1",
        husky: ">=1",
        "ink-docstrap": "^1.2.1",
        jest: "^24.9.0",
        jsdoc: "^3.6.3",
        "lint-staged": ">=8",
        prettier: "1.18.2",
        "semantic-release": "^17.1.2",
        terser: "^4.3.9",
        webpack: "^5.23.0",
        "webpack-cli": "^4.5.0",
        yargs: "^16.2.0"
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged"
        }
      },
      "lint-staged": {
        "*.{js,css,json,md}": [
          "prettier --write",
          "git add"
        ],
        "*.js": [
          "eslint --fix",
          "git add"
        ]
      },
      release: {
        branches: [
          "main"
        ]
      },
      browser: {
        http2: false,
        http: false,
        https: false,
        os: false,
        util: false,
        boxen: false,
        chalk: false
      }
    };
  }
});

// (disabled):node_modules/faunadb/node_modules/chalk/source/index.js
var require_source = __commonJS({
  "(disabled):node_modules/faunadb/node_modules/chalk/source/index.js"() {
  }
});

// (disabled):node_modules/boxen/index.js
var require_boxen = __commonJS({
  "(disabled):node_modules/boxen/index.js"() {
  }
});

// node_modules/cross-fetch/dist/browser-ponyfill.js
var require_browser_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/browser-ponyfill.js"(exports, module) {
    var global2 = typeof self !== "undefined" ? self : exports;
    var __self__ = function() {
      function F() {
        this.fetch = false;
        this.DOMException = global2.DOMException;
      }
      F.prototype = global2;
      return new F();
    }();
    (function(self2) {
      var irrelevant = function(exports2) {
        var support = {
          searchParams: "URLSearchParams" in self2,
          iterable: "Symbol" in self2 && "iterator" in Symbol,
          blob: "FileReader" in self2 && "Blob" in self2 && function() {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          }(),
          formData: "FormData" in self2,
          arrayBuffer: "ArrayBuffer" in self2
        };
        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }
        if (support.arrayBuffer) {
          var viewClasses = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]"
          ];
          var isArrayBufferView = ArrayBuffer.isView || function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }
        function normalizeName(name) {
          if (typeof name !== "string") {
            name = String(name);
          }
          if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError("Invalid character in header field name");
          }
          return name.toLowerCase();
        }
        function normalizeValue(value) {
          if (typeof value !== "string") {
            value = String(value);
          }
          return value;
        }
        function iteratorFor(items) {
          var iterator = {
            next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            }
          };
          if (support.iterable) {
            iterator[Symbol.iterator] = function() {
              return iterator;
            };
          }
          return iterator;
        }
        function Headers(headers) {
          this.map = {};
          if (headers instanceof Headers) {
            headers.forEach(function(value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function(header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function(name) {
              this.append(name, headers[name]);
            }, this);
          }
        }
        Headers.prototype.append = function(name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ", " + value : value;
        };
        Headers.prototype["delete"] = function(name) {
          delete this.map[normalizeName(name)];
        };
        Headers.prototype.get = function(name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };
        Headers.prototype.has = function(name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };
        Headers.prototype.set = function(name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };
        Headers.prototype.forEach = function(callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };
        Headers.prototype.keys = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };
        Headers.prototype.values = function() {
          var items = [];
          this.forEach(function(value) {
            items.push(value);
          });
          return iteratorFor(items);
        };
        Headers.prototype.entries = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };
        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }
        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError("Already read"));
          }
          body.bodyUsed = true;
        }
        function fileReaderReady(reader) {
          return new Promise(function(resolve, reject) {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.onerror = function() {
              reject(reader.error);
            };
          });
        }
        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }
        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }
        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);
          for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
          }
          return chars.join("");
        }
        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }
        function Body() {
          this.bodyUsed = false;
          this._initBody = function(body) {
            this._bodyInit = body;
            if (!body) {
              this._bodyText = "";
            } else if (typeof body === "string") {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer);
              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }
            if (!this.headers.get("content-type")) {
              if (typeof body === "string") {
                this.headers.set("content-type", "text/plain;charset=UTF-8");
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set("content-type", this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
              }
            }
          };
          if (support.blob) {
            this.blob = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as blob");
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };
            this.arrayBuffer = function() {
              if (this._bodyArrayBuffer) {
                return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }
          this.text = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as text");
            } else {
              return Promise.resolve(this._bodyText);
            }
          };
          if (support.formData) {
            this.formData = function() {
              return this.text().then(decode);
            };
          }
          this.json = function() {
            return this.text().then(JSON.parse);
          };
          return this;
        }
        var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }
        function Request(input, options) {
          options = options || {};
          var body = options.body;
          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError("Already read");
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;
            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }
          this.credentials = options.credentials || this.credentials || "same-origin";
          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }
          this.method = normalizeMethod(options.method || this.method || "GET");
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;
          if ((this.method === "GET" || this.method === "HEAD") && body) {
            throw new TypeError("Body not allowed for GET or HEAD requests");
          }
          this._initBody(body);
        }
        Request.prototype.clone = function() {
          return new Request(this, { body: this._bodyInit });
        };
        function decode(body) {
          var form = new FormData();
          body.trim().split("&").forEach(function(bytes) {
            if (bytes) {
              var split2 = bytes.split("=");
              var name = split2.shift().replace(/\+/g, " ");
              var value = split2.join("=").replace(/\+/g, " ");
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }
        function parseHeaders(rawHeaders) {
          var headers = new Headers();
          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
          preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
            var parts = line.split(":");
            var key = parts.shift().trim();
            if (key) {
              var value = parts.join(":").trim();
              headers.append(key, value);
            }
          });
          return headers;
        }
        Body.call(Request.prototype);
        function Response(bodyInit, options) {
          if (!options) {
            options = {};
          }
          this.type = "default";
          this.status = options.status === void 0 ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = "statusText" in options ? options.statusText : "OK";
          this.headers = new Headers(options.headers);
          this.url = options.url || "";
          this._initBody(bodyInit);
        }
        Body.call(Response.prototype);
        Response.prototype.clone = function() {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };
        Response.error = function() {
          var response = new Response(null, { status: 0, statusText: "" });
          response.type = "error";
          return response;
        };
        var redirectStatuses = [301, 302, 303, 307, 308];
        Response.redirect = function(url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError("Invalid status code");
          }
          return new Response(null, { status, headers: { location: url } });
        };
        exports2.DOMException = self2.DOMException;
        try {
          new exports2.DOMException();
        } catch (err) {
          exports2.DOMException = function(message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };
          exports2.DOMException.prototype = Object.create(Error.prototype);
          exports2.DOMException.prototype.constructor = exports2.DOMException;
        }
        function fetch(input, init3) {
          return new Promise(function(resolve, reject) {
            var request = new Request(input, init3);
            if (request.signal && request.signal.aborted) {
              return reject(new exports2.DOMException("Aborted", "AbortError"));
            }
            var xhr = new XMLHttpRequest();
            function abortXhr() {
              xhr.abort();
            }
            xhr.onload = function() {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || "")
              };
              options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
              var body = "response" in xhr ? xhr.response : xhr.responseText;
              resolve(new Response(body, options));
            };
            xhr.onerror = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.ontimeout = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.onabort = function() {
              reject(new exports2.DOMException("Aborted", "AbortError"));
            };
            xhr.open(request.method, request.url, true);
            if (request.credentials === "include") {
              xhr.withCredentials = true;
            } else if (request.credentials === "omit") {
              xhr.withCredentials = false;
            }
            if ("responseType" in xhr && support.blob) {
              xhr.responseType = "blob";
            }
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value);
            });
            if (request.signal) {
              request.signal.addEventListener("abort", abortXhr);
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener("abort", abortXhr);
                }
              };
            }
            xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
          });
        }
        fetch.polyfill = true;
        if (!self2.fetch) {
          self2.fetch = fetch;
          self2.Headers = Headers;
          self2.Request = Request;
          self2.Response = Response;
        }
        exports2.Headers = Headers;
        exports2.Request = Request;
        exports2.Response = Response;
        exports2.fetch = fetch;
        Object.defineProperty(exports2, "__esModule", { value: true });
        return exports2;
      }({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    delete __self__.fetch.polyfill;
    var ctx = __self__;
    exports = ctx.fetch;
    exports.default = ctx.fetch;
    exports.fetch = ctx.fetch;
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
  }
});

// node_modules/faunadb/src/_util.js
var require_util = __commonJS({
  "node_modules/faunadb/src/_util.js"(exports, module) {
    "use strict";
    var packageJson = require_package();
    var chalk = require_source();
    var boxen = require_boxen();
    var crossGlobal = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : self;
    function inherits(ctor, superCtor) {
      if (ctor === void 0 || ctor === null) {
        throw new TypeError('The constructor to "inherits" must not be null or undefined');
      }
      if (superCtor === void 0 || superCtor === null) {
        throw new TypeError('The super constructor to "inherits" must not be null or undefined');
      }
      if (superCtor.prototype === void 0) {
        throw new TypeError('The super constructor to "inherits" must have a prototype');
      }
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
    function isNodeEnv() {
      return typeof window === "undefined" && typeof process !== "undefined" && process.versions != null && process.versions.node != null;
    }
    function getEnvVariable(envKey) {
      var areEnvVarsAvailable = !!(typeof process !== "undefined" && process && process.env);
      if (areEnvVarsAvailable && process.env[envKey] != null) {
        return process.env[envKey];
      }
    }
    function getBrowserDetails() {
      var browser = navigator.appName;
      var browserVersion = "" + parseFloat(navigator.appVersion);
      var nameOffset, verOffset, ix;
      if ((verOffset = navigator.userAgent.indexOf("Opera")) != -1) {
        browser = "Opera";
        browserVersion = navigator.userAgent.substring(verOffset + 6);
        if ((verOffset = navigator.userAgent.indexOf("Version")) != -1) {
          browserVersion = navigator.userAgent.substring(verOffset + 8);
        }
      } else if ((verOffset = navigator.userAgent.indexOf("MSIE")) != -1) {
        browser = "Microsoft Internet Explorer";
        browserVersion = navigator.userAgent.substring(verOffset + 5);
      } else if (browser == "Netscape" && navigator.userAgent.indexOf("Trident/") != -1) {
        browser = "Microsoft Internet Explorer";
        browserVersion = navigator.userAgent.substring(verOffset + 5);
        if ((verOffset = navigator.userAgent.indexOf("rv:")) != -1) {
          browserVersion = navigator.userAgent.substring(verOffset + 3);
        }
      } else if ((verOffset = navigator.userAgent.indexOf("Chrome")) != -1) {
        browser = "Chrome";
        browserVersion = navigator.userAgent.substring(verOffset + 7);
      } else if ((verOffset = navigator.userAgent.indexOf("Safari")) != -1) {
        browser = "Safari";
        browserVersion = navigator.userAgent.substring(verOffset + 7);
        if ((verOffset = navigator.userAgent.indexOf("Version")) != -1) {
          browserVersion = navigator.userAgent.substring(verOffset + 8);
        }
        if (navigator.userAgent.indexOf("CriOS") != -1) {
          browser = "Chrome";
        }
      } else if ((verOffset = navigator.userAgent.indexOf("Firefox")) != -1) {
        browser = "Firefox";
        browserVersion = navigator.userAgent.substring(verOffset + 8);
      } else if ((nameOffset = navigator.userAgent.lastIndexOf(" ") + 1) < (verOffset = navigator.userAgent.lastIndexOf("/"))) {
        browser = navigator.userAgent.substring(nameOffset, verOffset);
        browserVersion = navigator.userAgent.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
          browser = navigator.appName;
        }
      }
      if ((ix = browserVersion.indexOf(";")) != -1)
        browserVersion = browserVersion.substring(0, ix);
      if ((ix = browserVersion.indexOf(" ")) != -1)
        browserVersion = browserVersion.substring(0, ix);
      if ((ix = browserVersion.indexOf(")")) != -1)
        browserVersion = browserVersion.substring(0, ix);
      return [browser, browserVersion].join("-");
    }
    function getBrowserOsDetails() {
      var os = "unknown";
      var clientStrings = [
        { s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
        { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
        { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
        { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
        { s: "Windows Vista", r: /Windows NT 6.0/ },
        { s: "Windows Server 2003", r: /Windows NT 5.2/ },
        { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
        { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
        { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
        { s: "Windows 98", r: /(Windows 98|Win98)/ },
        { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
        { s: "Windows NT 4.0", r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
        { s: "Windows CE", r: /Windows CE/ },
        { s: "Windows 3.11", r: /Win16/ },
        { s: "Android", r: /Android/ },
        { s: "Open BSD", r: /OpenBSD/ },
        { s: "Sun OS", r: /SunOS/ },
        { s: "Chrome OS", r: /CrOS/ },
        { s: "Linux", r: /(Linux|X11(?!.*CrOS))/ },
        { s: "iOS", r: /(iPhone|iPad|iPod)/ },
        { s: "Mac OS X", r: /Mac OS X/ },
        { s: "Mac OS", r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
        { s: "QNX", r: /QNX/ },
        { s: "UNIX", r: /UNIX/ },
        { s: "BeOS", r: /BeOS/ },
        { s: "OS/2", r: /OS\/2/ },
        {
          s: "Search Bot",
          r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
        }
      ];
      for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(navigator.userAgent)) {
          os = cs.s;
          break;
        }
      }
      var osVersion = "unknown";
      if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = "Windows";
      }
      switch (os) {
        case "Mac OS":
        case "Mac OS X":
        case "Android":
          osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(navigator.userAgent)[1];
          break;
        case "iOS":
          osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
          osVersion = osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0);
          break;
      }
      return [os, osVersion].join("-");
    }
    function getNodeRuntimeEnv() {
      var runtimeEnvs = [
        {
          name: "Netlify",
          check: function() {
            return process.env.hasOwnProperty("NETLIFY_IMAGES_CDN_DOMAIN");
          }
        },
        {
          name: "Vercel",
          check: function() {
            return process.env.hasOwnProperty("VERCEL");
          }
        },
        {
          name: "Heroku",
          check: function() {
            return process.env.hasOwnProperty("PATH") && process.env.PATH.indexOf(".heroku") !== -1;
          }
        },
        {
          name: "AWS Lambda",
          check: function() {
            return process.env.hasOwnProperty("AWS_LAMBDA_FUNCTION_VERSION");
          }
        },
        {
          name: "GCP Cloud Functions",
          check: function() {
            return process.env.hasOwnProperty("_") && process.env._.indexOf("google") !== -1;
          }
        },
        {
          name: "GCP Compute Instances",
          check: function() {
            return process.env.hasOwnProperty("GOOGLE_CLOUD_PROJECT");
          }
        },
        {
          name: "Azure Cloud Functions",
          check: function() {
            return process.env.hasOwnProperty("WEBSITE_FUNCTIONS_AZUREMONITOR_CATEGORIES");
          }
        },
        {
          name: "Azure Compute",
          check: function() {
            return process.env.hasOwnProperty("ORYX_ENV_TYPE") && process.env.hasOwnProperty("WEBSITE_INSTANCE_ID") && process.env.ORYX_ENV_TYPE === "AppService";
          }
        },
        {
          name: "Mongo Stitch",
          check: function() {
            return typeof crossGlobal.StitchError === "function";
          }
        },
        {
          name: "Render",
          check: function() {
            return process.env.hasOwnProperty("RENDER_SERVICE_ID");
          }
        },
        {
          name: "Begin",
          check: function() {
            return process.env.hasOwnProperty("BEGIN_DATA_SCOPE_ID");
          }
        }
      ];
      var detectedEnv = runtimeEnvs.find((env) => env.check());
      return detectedEnv ? detectedEnv.name : "unknown";
    }
    function defaults2(obj, def) {
      if (obj === void 0) {
        return def;
      } else {
        return obj;
      }
    }
    function applyDefaults(provided, defaults3) {
      var out = {};
      for (var providedKey in provided) {
        if (!(providedKey in defaults3)) {
          throw new Error("No such option " + providedKey);
        }
        out[providedKey] = provided[providedKey];
      }
      for (var defaultsKey in defaults3) {
        if (!(defaultsKey in out)) {
          out[defaultsKey] = defaults3[defaultsKey];
        }
      }
      return out;
    }
    function removeNullAndUndefinedValues(object) {
      var res = {};
      for (var key in object) {
        var val = object[key];
        if (val !== null && val !== void 0) {
          res[key] = val;
        }
      }
      return res;
    }
    function removeUndefinedValues(object) {
      var res = {};
      for (var key in object) {
        var val = object[key];
        if (val !== void 0) {
          res[key] = val;
        }
      }
      return res;
    }
    function checkInstanceHasProperty(obj, prop) {
      return typeof obj === "object" && obj !== null && Boolean(obj[prop]);
    }
    function formatUrl(base, path, query) {
      query = typeof query === "object" ? querystringify(query) : query;
      return [
        base,
        path ? path.charAt(0) === "/" ? "" : "/" + path : "",
        query ? query.charAt(0) === "?" ? "" : "?" + query : ""
      ].join("");
    }
    function querystringify(obj, prefix) {
      prefix = prefix || "";
      var pairs = [], value, key;
      if (typeof prefix !== "string")
        prefix = "?";
      for (key in obj) {
        if (checkInstanceHasProperty(obj, key)) {
          value = obj[key];
          if (!value && (value === null || value === void 0 || isNaN(value))) {
            value = "";
          }
          key = encode(key);
          value = encode(value);
          if (key === null || value === null)
            continue;
          pairs.push(key + "=" + value);
        }
      }
      return pairs.length ? prefix + pairs.join("&") : "";
    }
    function encode(input) {
      try {
        return encodeURIComponent(input);
      } catch (e) {
        return null;
      }
    }
    function mergeObjects(obj1, obj2) {
      var obj3 = {};
      for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
      }
      for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
      }
      return obj3;
    }
    function resolveFetch(fetchOverride) {
      if (typeof fetchOverride === "function") {
        return fetchOverride;
      }
      if (typeof crossGlobal.fetch === "function") {
        return crossGlobal.fetch.bind(crossGlobal);
      }
      return require_browser_ponyfill();
    }
    function notifyAboutNewVersion() {
      var isNotified;
      const checkAndNotify = (checkNewVersion) => {
        if (!isNodeEnv() || isNotified || !checkNewVersion)
          return;
        function onResponse(latestVersion) {
          var isNewVersionAvailable = latestVersion > packageJson.version;
          if (isNewVersionAvailable) {
            console.info(boxen("New " + packageJson.name + " version available " + chalk.dim(packageJson.version) + chalk.reset(" \u2192 ") + chalk.green(latestVersion) + `
Changelog: https://github.com/${packageJson.repository}/blob/main/CHANGELOG.md`, { padding: 1, borderColor: "yellow" }));
          }
        }
        isNotified = true;
        resolveFetch()("https://registry.npmjs.org/" + packageJson.name).then((resp) => resp.json()).then((json) => onResponse(json["dist-tags"].latest)).catch((err) => {
          console.error("Unable to check new driver version");
          console.error(err);
        });
      };
      return checkAndNotify;
    }
    module.exports = {
      notifyAboutNewVersion,
      crossGlobal,
      mergeObjects,
      formatUrl,
      querystringify,
      inherits,
      isNodeEnv,
      getEnvVariable,
      defaults: defaults2,
      applyDefaults,
      removeNullAndUndefinedValues,
      removeUndefinedValues,
      checkInstanceHasProperty,
      getBrowserDetails,
      getBrowserOsDetails,
      getNodeRuntimeEnv,
      resolveFetch
    };
  }
});

// node_modules/faunadb/src/Expr.js
var require_Expr = __commonJS({
  "node_modules/faunadb/src/Expr.js"(exports, module) {
    "use strict";
    var util = require_util();
    function Expr(obj) {
      this.raw = obj;
    }
    Expr.prototype._isFaunaExpr = true;
    Expr.prototype.toJSON = function() {
      return this.raw;
    };
    Expr.prototype.toFQL = function() {
      return exprToString(this.raw);
    };
    var varArgsFunctions = [
      "Do",
      "Call",
      "Union",
      "Intersection",
      "Difference",
      "Equals",
      "Add",
      "BitAnd",
      "BitOr",
      "BitXor",
      "Divide",
      "Max",
      "Min",
      "Modulo",
      "Multiply",
      "Subtract",
      "LT",
      "LTE",
      "GT",
      "GTE",
      "And",
      "Or"
    ];
    var specialCases = {
      containsstrregex: "ContainsStrRegex",
      endswith: "EndsWith",
      findstr: "FindStr",
      findstrregex: "FindStrRegex",
      gt: "GT",
      gte: "GTE",
      is_nonempty: "is_non_empty",
      lowercase: "LowerCase",
      lt: "LT",
      lte: "LTE",
      ltrim: "LTrim",
      ngram: "NGram",
      rtrim: "RTrim",
      regexescape: "RegexEscape",
      replacestr: "ReplaceStr",
      replacestrregex: "ReplaceStrRegex",
      startswith: "StartsWith",
      substring: "SubString",
      titlecase: "TitleCase",
      uppercase: "UpperCase"
    };
    function isExpr(expression) {
      return expression instanceof Expr || util.checkInstanceHasProperty(expression, "_isFaunaExpr");
    }
    function printObject(obj) {
      return "{" + Object.keys(obj).map(function(k) {
        return '"' + k + '": ' + exprToString(obj[k]);
      }).join(", ") + "}";
    }
    function printArray(arr, toStr) {
      return arr.map(function(item) {
        return toStr(item);
      }).join(", ");
    }
    function convertToCamelCase(fn) {
      if (fn in specialCases)
        fn = specialCases[fn];
      return fn.split("_").map(function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }).join("");
    }
    var exprToString = function(expr, caller) {
      if (isExpr(expr)) {
        if ("value" in expr)
          return expr.toString();
        expr = expr.raw;
      }
      if (expr === null) {
        return "null";
      }
      switch (typeof expr) {
        case "string":
          return JSON.stringify(expr);
        case "symbol":
        case "number":
        case "boolean":
          return expr.toString();
        case "undefined":
          return "undefined";
      }
      if (Array.isArray(expr)) {
        var array = printArray(expr, exprToString);
        return varArgsFunctions.indexOf(caller) != -1 ? array : "[" + array + "]";
      }
      if ("match" in expr) {
        var matchStr = exprToString(expr["match"]);
        var terms = expr["terms"] || [];
        if (isExpr(terms))
          terms = terms.raw;
        if (Array.isArray(terms) && terms.length == 0)
          return "Match(" + matchStr + ")";
        if (Array.isArray(terms)) {
          return "Match(" + matchStr + ", [" + printArray(terms, exprToString) + "])";
        }
        return "Match(" + matchStr + ", " + exprToString(terms) + ")";
      }
      if ("paginate" in expr) {
        var exprKeys = Object.keys(expr);
        if (exprKeys.length === 1) {
          return "Paginate(" + exprToString(expr["paginate"]) + ")";
        }
        var expr2 = Object.assign({}, expr);
        delete expr2["paginate"];
        return "Paginate(" + exprToString(expr["paginate"]) + ", " + printObject(expr2) + ")";
      }
      if ("let" in expr && "in" in expr) {
        var letExpr = "";
        if (Array.isArray(expr["let"]))
          letExpr = "[" + printArray(expr["let"], printObject) + "]";
        else
          letExpr = printObject(expr["let"]);
        return "Let(" + letExpr + ", " + exprToString(expr["in"]) + ")";
      }
      if ("object" in expr)
        return printObject(expr["object"]);
      if ("merge" in expr) {
        if (expr.lambda) {
          return "Merge(" + exprToString(expr.merge) + ", " + exprToString(expr.with) + ", " + exprToString(expr.lambda) + ")";
        }
        return "Merge(" + exprToString(expr.merge) + ", " + exprToString(expr.with) + ")";
      }
      if ("lambda" in expr) {
        return "Lambda(" + exprToString(expr["lambda"]) + ", " + exprToString(expr["expr"]) + ")";
      }
      if ("filter" in expr) {
        return "Filter(" + exprToString(expr["collection"]) + ", " + exprToString(expr["filter"]) + ")";
      }
      if ("call" in expr) {
        return "Call(" + exprToString(expr["call"]) + ", " + exprToString(expr["arguments"]) + ")";
      }
      if ("map" in expr) {
        return "Map(" + exprToString(expr["collection"]) + ", " + exprToString(expr["map"]) + ")";
      }
      if ("foreach" in expr) {
        return "Foreach(" + exprToString(expr["collection"]) + ", " + exprToString(expr["foreach"]) + ")";
      }
      var keys = Object.keys(expr);
      var fn = keys[0];
      fn = convertToCamelCase(fn);
      var args = keys.filter((k) => expr[k] !== null || keys.length > 1).map((k) => exprToString(expr[k], fn)).join(", ");
      return fn + "(" + args + ")";
    };
    Expr.toString = exprToString;
    module.exports = Expr;
  }
});

// node_modules/faunadb/src/errors.js
var require_errors = __commonJS({
  "node_modules/faunadb/src/errors.js"(exports, module) {
    "use strict";
    var util = require_util();
    function FaunaError(name, message, description) {
      Error.call(this);
      this.name = name;
      this.message = message;
      this.description = description;
    }
    util.inherits(FaunaError, Error);
    function InvalidValue(message) {
      FaunaError.call(this, "InvalidValue", message);
    }
    util.inherits(InvalidValue, FaunaError);
    function InvalidArity(min, max, actual, callerFunc) {
      var arityInfo = `${callerFunc} function requires ${messageForArity(min, max)} argument(s) but ${actual} were given`;
      var documentationLink = logDocumentationLink(callerFunc);
      FaunaError.call(this, "InvalidArity", `${arityInfo}
${documentationLink}`);
      this.min = min;
      this.max = max;
      this.actual = actual;
      function messageForArity(min2, max2) {
        if (max2 === null)
          return "at least " + min2;
        if (min2 === null)
          return "up to " + max2;
        if (min2 === max2)
          return min2;
        return "from " + min2 + " to " + max2;
      }
      function logDocumentationLink(functionName) {
        var docsURL = "https://docs.fauna.com/fauna/current/api/fql/functions/";
        return `For more info, see the docs: ${docsURL}${functionName.toLowerCase()}`;
      }
    }
    util.inherits(InvalidArity, FaunaError);
    function FaunaHTTPError(name, requestResult) {
      var response = requestResult.responseContent;
      var errors = response.errors;
      var message = errors.length === 0 ? '(empty "errors")' : errors[0].code;
      var description = errors.length === 0 ? '(empty "errors")' : errors[0].description;
      FaunaError.call(this, name, message, description);
      this.requestResult = requestResult;
    }
    util.inherits(FaunaHTTPError, FaunaError);
    FaunaHTTPError.prototype.errors = function() {
      return this.requestResult.responseContent.errors;
    };
    FaunaHTTPError.raiseForStatusCode = function(requestResult) {
      var code = requestResult.statusCode;
      if (code < 200 || code >= 300) {
        switch (code) {
          case 400:
            throw new BadRequest(requestResult);
          case 401:
            throw new Unauthorized(requestResult);
          case 403:
            throw new PermissionDenied(requestResult);
          case 404:
            throw new NotFound(requestResult);
          case 405:
            throw new MethodNotAllowed(requestResult);
          case 429:
            throw new TooManyRequests(requestResult);
          case 500:
            throw new InternalError(requestResult);
          case 503:
            throw new UnavailableError(requestResult);
          default:
            throw new FaunaHTTPError("UnknownError", requestResult);
        }
      }
    };
    function BadRequest(requestResult) {
      FaunaHTTPError.call(this, "BadRequest", requestResult);
    }
    util.inherits(BadRequest, FaunaHTTPError);
    function Unauthorized(requestResult) {
      FaunaHTTPError.call(this, "Unauthorized", requestResult);
    }
    util.inherits(Unauthorized, FaunaHTTPError);
    function PermissionDenied(requestResult) {
      FaunaHTTPError.call(this, "PermissionDenied", requestResult);
    }
    util.inherits(PermissionDenied, FaunaHTTPError);
    function NotFound(requestResult) {
      FaunaHTTPError.call(this, "NotFound", requestResult);
    }
    util.inherits(NotFound, FaunaHTTPError);
    function MethodNotAllowed(requestResult) {
      FaunaHTTPError.call(this, "MethodNotAllowed", requestResult);
    }
    util.inherits(MethodNotAllowed, FaunaHTTPError);
    function TooManyRequests(requestResult) {
      FaunaHTTPError.call(this, "TooManyRequests", requestResult);
    }
    util.inherits(TooManyRequests, FaunaHTTPError);
    function InternalError(requestResult) {
      FaunaHTTPError.call(this, "InternalError", requestResult);
    }
    util.inherits(InternalError, FaunaHTTPError);
    function UnavailableError(requestResult) {
      FaunaHTTPError.call(this, "UnavailableError", requestResult);
    }
    util.inherits(UnavailableError, FaunaHTTPError);
    function StreamError(name, message, description) {
      FaunaError.call(this, name, message, description);
    }
    util.inherits(StreamError, FaunaError);
    function StreamsNotSupported(description) {
      FaunaError.call(this, "StreamsNotSupported", "streams not supported", description);
    }
    util.inherits(StreamsNotSupported, StreamError);
    function StreamErrorEvent(event) {
      var error = event.data || {};
      FaunaError.call(this, "StreamErrorEvent", error.code, error.description);
      this.event = event;
    }
    util.inherits(StreamErrorEvent, StreamError);
    function ClientClosed(message, description) {
      FaunaError.call(this, "ClientClosed", message, description);
    }
    util.inherits(ClientClosed, FaunaError);
    module.exports = {
      FaunaError,
      ClientClosed,
      FaunaHTTPError,
      InvalidValue,
      InvalidArity,
      BadRequest,
      Unauthorized,
      PermissionDenied,
      NotFound,
      MethodNotAllowed,
      TooManyRequests,
      InternalError,
      UnavailableError,
      StreamError,
      StreamsNotSupported,
      StreamErrorEvent
    };
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }
});

// (disabled):node_modules/util/util.js
var require_util2 = __commonJS({
  "(disabled):node_modules/util/util.js"() {
  }
});

// node_modules/faunadb/src/values.js
var require_values = __commonJS({
  "node_modules/faunadb/src/values.js"(exports, module) {
    "use strict";
    var base64 = require_base64_js();
    var deprecate = require_browser();
    var errors = require_errors();
    var Expr = require_Expr();
    var util = require_util();
    var nodeUtil = util.isNodeEnv() ? require_util2() : null;
    var customInspect = nodeUtil && nodeUtil.inspect.custom;
    var stringify = nodeUtil ? nodeUtil.inspect : JSON.stringify;
    function Value() {
    }
    Value.prototype._isFaunaValue = true;
    util.inherits(Value, Expr);
    function Ref(id, collection, database) {
      if (!id)
        throw new errors.InvalidValue("id cannot be null or undefined");
      this.value = { id };
      if (collection)
        this.value["collection"] = collection;
      if (database)
        this.value["database"] = database;
    }
    Ref.prototype._isFaunaRef = true;
    util.inherits(Ref, Value);
    Object.defineProperty(Ref.prototype, "collection", {
      get: function() {
        return this.value["collection"];
      }
    });
    Object.defineProperty(Ref.prototype, "class", {
      get: deprecate(function() {
        return this.value["collection"];
      }, "class is deprecated, use collection instead")
    });
    Object.defineProperty(Ref.prototype, "database", {
      get: function() {
        return this.value["database"];
      }
    });
    Object.defineProperty(Ref.prototype, "id", {
      get: function() {
        return this.value["id"];
      }
    });
    Ref.prototype.toJSON = function() {
      return { "@ref": this.value };
    };
    wrapToString(Ref, function() {
      var constructors = {
        collections: "Collection",
        databases: "Database",
        indexes: "Index",
        functions: "Function",
        roles: "Role",
        access_providers: "AccessProvider"
      };
      var isNative = function(ref) {
        return ref.collection === void 0;
      };
      var toString = function(ref) {
        if (isNative(ref)) {
          var db = ref.database !== void 0 ? ref.database.toString() : "";
          if (ref.id === "access_providers")
            return "AccessProviders(" + db + ")";
          return ref.id.charAt(0).toUpperCase() + ref.id.slice(1) + "(" + db + ")";
        }
        if (isNative(ref.collection)) {
          var constructor = constructors[ref.collection.id];
          if (constructor !== void 0) {
            var db = ref.database !== void 0 ? ", " + ref.database.toString() : "";
            return constructor + '("' + ref.id + '"' + db + ")";
          }
        }
        return "Ref(" + toString(ref.collection) + ', "' + ref.id + '")';
      };
      return toString(this);
    });
    Ref.prototype.valueOf = function() {
      return this.value;
    };
    Ref.prototype.equals = function(other) {
      return (other instanceof Ref || util.checkInstanceHasProperty(other, "_isFaunaRef")) && this.id === other.id && (this.collection === void 0 && other.collection === void 0 || this.collection.equals(other.collection)) && (this.database === void 0 && other.database === void 0 || this.database.equals(other.database));
    };
    var Native = {
      COLLECTIONS: new Ref("collections"),
      INDEXES: new Ref("indexes"),
      DATABASES: new Ref("databases"),
      FUNCTIONS: new Ref("functions"),
      ROLES: new Ref("roles"),
      KEYS: new Ref("keys"),
      ACCESS_PROVIDERS: new Ref("access_providers")
    };
    Native.fromName = function(name) {
      switch (name) {
        case "collections":
          return Native.COLLECTIONS;
        case "indexes":
          return Native.INDEXES;
        case "databases":
          return Native.DATABASES;
        case "functions":
          return Native.FUNCTIONS;
        case "roles":
          return Native.ROLES;
        case "keys":
          return Native.KEYS;
        case "access_providers":
          return Native.ACCESS_PROVIDERS;
      }
      return new Ref(name);
    };
    function SetRef(value) {
      this.value = value;
    }
    util.inherits(SetRef, Value);
    wrapToString(SetRef, function() {
      return Expr.toString(this.value);
    });
    SetRef.prototype.toJSON = function() {
      return { "@set": this.value };
    };
    function FaunaTime(value) {
      if (value instanceof Date) {
        value = value.toISOString();
      } else if (!(value.charAt(value.length - 1) === "Z")) {
        throw new errors.InvalidValue("Only allowed timezone is 'Z', got: " + value);
      }
      this.value = value;
    }
    util.inherits(FaunaTime, Value);
    Object.defineProperty(FaunaTime.prototype, "date", {
      get: function() {
        return new Date(this.value);
      }
    });
    wrapToString(FaunaTime, function() {
      return 'Time("' + this.value + '")';
    });
    FaunaTime.prototype.toJSON = function() {
      return { "@ts": this.value };
    };
    function FaunaDate(value) {
      if (value instanceof Date) {
        value = value.toISOString().slice(0, 10);
      }
      this.value = value;
    }
    util.inherits(FaunaDate, Value);
    Object.defineProperty(FaunaDate.prototype, "date", {
      get: function() {
        return new Date(this.value);
      }
    });
    wrapToString(FaunaDate, function() {
      return 'Date("' + this.value + '")';
    });
    FaunaDate.prototype.toJSON = function() {
      return { "@date": this.value };
    };
    function Bytes(value) {
      if (value instanceof ArrayBuffer) {
        this.value = new Uint8Array(value);
      } else if (typeof value === "string") {
        this.value = base64.toByteArray(value);
      } else if (value instanceof Uint8Array) {
        this.value = value;
      } else {
        throw new errors.InvalidValue("Bytes type expect argument to be either Uint8Array|ArrayBuffer|string, got: " + stringify(value));
      }
    }
    util.inherits(Bytes, Value);
    wrapToString(Bytes, function() {
      return 'Bytes("' + base64.fromByteArray(this.value) + '")';
    });
    Bytes.prototype.toJSON = function() {
      return { "@bytes": base64.fromByteArray(this.value) };
    };
    function Query(value) {
      this.value = value;
    }
    util.inherits(Query, Value);
    wrapToString(Query, function() {
      return "Query(" + Expr.toString(this.value) + ")";
    });
    Query.prototype.toJSON = function() {
      return { "@query": this.value };
    };
    function wrapToString(type, fn) {
      type.prototype.toString = fn;
      type.prototype.inspect = fn;
      if (customInspect) {
        type.prototype[customInspect] = fn;
      }
    }
    module.exports = {
      Value,
      Ref,
      Native,
      SetRef,
      FaunaTime,
      FaunaDate,
      Bytes,
      Query
    };
  }
});

// node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports, module) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/faunadb/src/query.js
var require_query = __commonJS({
  "node_modules/faunadb/src/query.js"(exports, module) {
    "use strict";
    var annotate = require_fn_annotate();
    var deprecate = require_browser();
    var Expr = require_Expr();
    var errors = require_errors();
    var values = require_values();
    var objectAssign = require_object_assign();
    var util = require_util();
    function Ref() {
      arity.between(1, 2, arguments, Ref.name);
      switch (arguments.length) {
        case 1:
          return new Expr({ "@ref": wrap(arguments[0]) });
        case 2:
          return new Expr({ ref: wrap(arguments[0]), id: wrap(arguments[1]) });
      }
    }
    function Bytes(bytes) {
      arity.exact(1, arguments, Bytes.name);
      return new values.Bytes(bytes);
    }
    function Abort(msg) {
      arity.exact(1, arguments, Abort.name);
      return new Expr({ abort: wrap(msg) });
    }
    function At(timestamp, expr) {
      arity.exact(2, arguments, At.name);
      return new Expr({ at: wrap(timestamp), expr: wrap(expr) });
    }
    function Let(vars, expr) {
      arity.exact(2, arguments, Let.name);
      var bindings = [];
      if (Array.isArray(vars)) {
        bindings = vars.map(function(item) {
          return wrapValues(item);
        });
      } else {
        bindings = Object.keys(vars).filter(function(k) {
          return vars[k] !== void 0;
        }).map(function(k) {
          var b = {};
          b[k] = wrap(vars[k]);
          return b;
        });
      }
      if (typeof expr === "function") {
        if (Array.isArray(vars)) {
          var expr_vars = [];
          vars.forEach(function(item) {
            Object.keys(item).forEach(function(name) {
              expr_vars.push(Var(name));
            });
          });
          expr = expr.apply(null, expr_vars);
        } else {
          expr = expr.apply(null, Object.keys(vars).map(function(name) {
            return Var(name);
          }));
        }
      }
      return new Expr({ let: bindings, in: wrap(expr) });
    }
    function Var(varName) {
      arity.exact(1, arguments, Var.name);
      return new Expr({ var: wrap(varName) });
    }
    function If(condition, then, _else) {
      arity.exact(3, arguments, If.name);
      return new Expr({ if: wrap(condition), then: wrap(then), else: wrap(_else) });
    }
    function Do() {
      arity.min(1, arguments, Do.name);
      var args = argsToArray(arguments);
      return new Expr({ do: wrap(args) });
    }
    var objectFunction = function(fields) {
      arity.exact(1, arguments, objectFunction.name);
      return new Expr({ object: wrapValues(fields) });
    };
    function Lambda() {
      arity.between(1, 2, arguments, Lambda.name);
      switch (arguments.length) {
        case 1:
          var value = arguments[0];
          if (typeof value === "function") {
            return _lambdaFunc(value);
          } else if (value instanceof Expr || util.checkInstanceHasProperty(value, "_isFaunaExpr")) {
            return value;
          } else {
            throw new errors.InvalidValue("Lambda function takes either a Function or an Expr.");
          }
        case 2:
          var var_name = arguments[0];
          var expr = arguments[1];
          return _lambdaExpr(var_name, expr);
      }
    }
    function _lambdaFunc(func) {
      var vars = annotate(func);
      switch (vars.length) {
        case 0:
          throw new errors.InvalidValue("Provided Function must take at least 1 argument.");
        case 1:
          return _lambdaExpr(vars[0], func(Var(vars[0])));
        default:
          return _lambdaExpr(vars, func.apply(null, vars.map(function(name) {
            return Var(name);
          })));
      }
    }
    function _lambdaExpr(var_name, expr) {
      return new Expr({ lambda: wrap(var_name), expr: wrap(expr) });
    }
    function Call(ref) {
      arity.min(1, arguments, Call.name);
      var args = argsToArray(arguments);
      args.shift();
      return new Expr({ call: wrap(ref), arguments: wrap(varargs(args)) });
    }
    function Query(lambda) {
      arity.exact(1, arguments, Query.name);
      return new Expr({ query: wrap(lambda) });
    }
    function Map2(collection, lambda_expr) {
      arity.exact(2, arguments, Map2.name);
      return new Expr({ map: wrap(lambda_expr), collection: wrap(collection) });
    }
    function Foreach(collection, lambda_expr) {
      arity.exact(2, arguments, Foreach.name);
      return new Expr({ foreach: wrap(lambda_expr), collection: wrap(collection) });
    }
    function Filter(collection, lambda_expr) {
      arity.exact(2, arguments, Filter.name);
      return new Expr({ filter: wrap(lambda_expr), collection: wrap(collection) });
    }
    function Take(number, collection) {
      arity.exact(2, arguments, Take.name);
      return new Expr({ take: wrap(number), collection: wrap(collection) });
    }
    function Drop(number, collection) {
      arity.exact(2, arguments, Drop.name);
      return new Expr({ drop: wrap(number), collection: wrap(collection) });
    }
    function Prepend(elements, collection) {
      arity.exact(2, arguments, Prepend.name);
      return new Expr({ prepend: wrap(elements), collection: wrap(collection) });
    }
    function Append(elements, collection) {
      arity.exact(2, arguments, Append.name);
      return new Expr({ append: wrap(elements), collection: wrap(collection) });
    }
    function IsEmpty(collection) {
      arity.exact(1, arguments, IsEmpty.name);
      return new Expr({ is_empty: wrap(collection) });
    }
    function IsNonEmpty(collection) {
      arity.exact(1, arguments, IsNonEmpty.name);
      return new Expr({ is_nonempty: wrap(collection) });
    }
    function IsNumber(expr) {
      arity.exact(1, arguments, IsNumber.name);
      return new Expr({ is_number: wrap(expr) });
    }
    function IsDouble(expr) {
      arity.exact(1, arguments, IsDouble.name);
      return new Expr({ is_double: wrap(expr) });
    }
    function IsInteger(expr) {
      arity.exact(1, arguments, IsInteger.name);
      return new Expr({ is_integer: wrap(expr) });
    }
    function IsBoolean(expr) {
      arity.exact(1, arguments, IsBoolean.name);
      return new Expr({ is_boolean: wrap(expr) });
    }
    function IsNull(expr) {
      arity.exact(1, arguments, IsNull.name);
      return new Expr({ is_null: wrap(expr) });
    }
    function IsBytes(expr) {
      arity.exact(1, arguments, IsBytes.name);
      return new Expr({ is_bytes: wrap(expr) });
    }
    function IsTimestamp(expr) {
      arity.exact(1, arguments, IsTimestamp.name);
      return new Expr({ is_timestamp: wrap(expr) });
    }
    function IsDate(expr) {
      arity.exact(1, arguments, IsDate.name);
      return new Expr({ is_date: wrap(expr) });
    }
    function IsString(expr) {
      arity.exact(1, arguments, IsString.name);
      return new Expr({ is_string: wrap(expr) });
    }
    function IsArray(expr) {
      arity.exact(1, arguments, IsArray.name);
      return new Expr({ is_array: wrap(expr) });
    }
    function IsObject(expr) {
      arity.exact(1, arguments, IsObject.name);
      return new Expr({ is_object: wrap(expr) });
    }
    function IsRef(expr) {
      arity.exact(1, arguments, IsRef.name);
      return new Expr({ is_ref: wrap(expr) });
    }
    function IsSet(expr) {
      arity.exact(1, arguments, IsSet.name);
      return new Expr({ is_set: wrap(expr) });
    }
    function IsDoc(expr) {
      arity.exact(1, arguments, IsDoc.name);
      return new Expr({ is_doc: wrap(expr) });
    }
    function IsLambda(expr) {
      arity.exact(1, arguments, IsLambda.name);
      return new Expr({ is_lambda: wrap(expr) });
    }
    function IsCollection(expr) {
      arity.exact(1, arguments, IsCollection.name);
      return new Expr({ is_collection: wrap(expr) });
    }
    function IsDatabase(expr) {
      arity.exact(1, arguments, IsDatabase.name);
      return new Expr({ is_database: wrap(expr) });
    }
    function IsIndex(expr) {
      arity.exact(1, arguments, IsIndex.name);
      return new Expr({ is_index: wrap(expr) });
    }
    function IsFunction(expr) {
      arity.exact(1, arguments, IsFunction.name);
      return new Expr({ is_function: wrap(expr) });
    }
    function IsKey(expr) {
      arity.exact(1, arguments, IsKey.name);
      return new Expr({ is_key: wrap(expr) });
    }
    function IsToken(expr) {
      arity.exact(1, arguments, IsToken.name);
      return new Expr({ is_token: wrap(expr) });
    }
    function IsCredentials(expr) {
      arity.exact(1, arguments, IsCredentials.name);
      return new Expr({ is_credentials: wrap(expr) });
    }
    function IsRole(expr) {
      arity.exact(1, arguments, IsRole.name);
      return new Expr({ is_role: wrap(expr) });
    }
    function Get(ref, ts) {
      arity.between(1, 2, arguments, Get.name);
      ts = util.defaults(ts, null);
      return new Expr(params({ get: wrap(ref) }, { ts: wrap(ts) }));
    }
    function KeyFromSecret(secret) {
      arity.exact(1, arguments, KeyFromSecret.name);
      return new Expr({ key_from_secret: wrap(secret) });
    }
    function Reduce(lambda, initial, collection) {
      arity.exact(3, arguments, Reduce.name);
      return new Expr({
        reduce: wrap(lambda),
        initial: wrap(initial),
        collection: wrap(collection)
      });
    }
    function Paginate(set, opts) {
      arity.between(1, 2, arguments, Paginate.name);
      opts = util.defaults(opts, {});
      return new Expr(objectAssign({ paginate: wrap(set) }, wrapValues(opts)));
    }
    function Exists(ref, ts) {
      arity.between(1, 2, arguments, Exists.name);
      ts = util.defaults(ts, null);
      return new Expr(params({ exists: wrap(ref) }, { ts: wrap(ts) }));
    }
    function Create(collection_ref, params2) {
      arity.between(1, 2, arguments, Create.name);
      return new Expr({ create: wrap(collection_ref), params: wrap(params2) });
    }
    function Update(ref, params2) {
      arity.exact(2, arguments, Update.name);
      return new Expr({ update: wrap(ref), params: wrap(params2) });
    }
    function Replace(ref, params2) {
      arity.exact(2, arguments, Replace.name);
      return new Expr({ replace: wrap(ref), params: wrap(params2) });
    }
    function Delete(ref) {
      arity.exact(1, arguments, Delete.name);
      return new Expr({ delete: wrap(ref) });
    }
    function Insert(ref, ts, action, params2) {
      arity.exact(4, arguments, Insert.name);
      return new Expr({
        insert: wrap(ref),
        ts: wrap(ts),
        action: wrap(action),
        params: wrap(params2)
      });
    }
    function Remove(ref, ts, action) {
      arity.exact(3, arguments, Remove.name);
      return new Expr({ remove: wrap(ref), ts: wrap(ts), action: wrap(action) });
    }
    function CreateClass(params2) {
      arity.exact(1, arguments, CreateClass.name);
      return new Expr({ create_class: wrap(params2) });
    }
    function CreateCollection(params2) {
      arity.exact(1, arguments, CreateCollection.name);
      return new Expr({ create_collection: wrap(params2) });
    }
    function CreateDatabase(params2) {
      arity.exact(1, arguments, CreateDatabase.name);
      return new Expr({ create_database: wrap(params2) });
    }
    function CreateIndex(params2) {
      arity.exact(1, arguments, CreateIndex.name);
      return new Expr({ create_index: wrap(params2) });
    }
    function CreateKey(params2) {
      arity.exact(1, arguments, CreateKey.name);
      return new Expr({ create_key: wrap(params2) });
    }
    function CreateFunction(params2) {
      arity.exact(1, arguments, CreateFunction.name);
      return new Expr({ create_function: wrap(params2) });
    }
    function CreateRole(params2) {
      arity.exact(1, arguments, CreateRole.name);
      return new Expr({ create_role: wrap(params2) });
    }
    function CreateAccessProvider(params2) {
      arity.exact(1, arguments, CreateAccessProvider.name);
      return new Expr({ create_access_provider: wrap(params2) });
    }
    function Singleton(ref) {
      arity.exact(1, arguments, Singleton.name);
      return new Expr({ singleton: wrap(ref) });
    }
    function Events(ref_set) {
      arity.exact(1, arguments, Events.name);
      return new Expr({ events: wrap(ref_set) });
    }
    function Match(index) {
      arity.min(1, arguments, Match.name);
      var args = argsToArray(arguments);
      args.shift();
      return new Expr({ match: wrap(index), terms: wrap(varargs(args)) });
    }
    function Union() {
      arity.min(1, arguments, Union.name);
      return new Expr({ union: wrap(varargs(arguments)) });
    }
    function Merge(merge, _with, lambda) {
      arity.between(2, 3, arguments, Merge.name);
      return new Expr(params({ merge: wrap(merge), with: wrap(_with) }, { lambda: wrap(lambda) }));
    }
    function Intersection() {
      arity.min(1, arguments, Intersection.name);
      return new Expr({ intersection: wrap(varargs(arguments)) });
    }
    function Difference() {
      arity.min(1, arguments, Difference.name);
      return new Expr({ difference: wrap(varargs(arguments)) });
    }
    function Distinct(set) {
      arity.exact(1, arguments, Distinct.name);
      return new Expr({ distinct: wrap(set) });
    }
    function Join(source, target) {
      arity.exact(2, arguments, Join.name);
      return new Expr({ join: wrap(source), with: wrap(target) });
    }
    function Range(set, from, to) {
      arity.exact(3, arguments, Range.name);
      return new Expr({ range: wrap(set), from: wrap(from), to: wrap(to) });
    }
    function Login(ref, params2) {
      arity.exact(2, arguments, Login.name);
      return new Expr({ login: wrap(ref), params: wrap(params2) });
    }
    function Logout(delete_tokens) {
      arity.exact(1, arguments, Logout.name);
      return new Expr({ logout: wrap(delete_tokens) });
    }
    function Identify(ref, password) {
      arity.exact(2, arguments, Identify.name);
      return new Expr({ identify: wrap(ref), password: wrap(password) });
    }
    function Identity() {
      arity.exact(0, arguments, Identity.name);
      return new Expr({ identity: null });
    }
    function CurrentIdentity() {
      arity.exact(0, arguments, CurrentIdentity.name);
      return new Expr({ current_identity: null });
    }
    function HasIdentity() {
      arity.exact(0, arguments, HasIdentity.name);
      return new Expr({ has_identity: null });
    }
    function HasCurrentIdentity() {
      arity.exact(0, arguments, HasCurrentIdentity.name);
      return new Expr({ has_current_identity: null });
    }
    function CurrentToken() {
      arity.exact(0, arguments, CurrentToken.name);
      return new Expr({ current_token: null });
    }
    function HasCurrentToken() {
      arity.exact(0, arguments, HasCurrentToken.name);
      return new Expr({ has_current_token: null });
    }
    function Concat(strings, separator) {
      arity.min(1, arguments, Concat.name);
      separator = util.defaults(separator, null);
      return new Expr(params({ concat: wrap(strings) }, { separator: wrap(separator) }));
    }
    function Casefold(string, normalizer) {
      arity.min(1, arguments, Casefold.name);
      return new Expr(params({ casefold: wrap(string) }, { normalizer: wrap(normalizer) }));
    }
    function ContainsStr(value, search) {
      arity.exact(2, arguments, ContainsStr.name);
      return new Expr({ containsstr: wrap(value), search: wrap(search) });
    }
    function ContainsStrRegex(value, pattern) {
      arity.exact(2, arguments, ContainsStrRegex.name);
      return new Expr({ containsstrregex: wrap(value), pattern: wrap(pattern) });
    }
    function StartsWith(value, search) {
      arity.exact(2, arguments, StartsWith.name);
      return new Expr({ startswith: wrap(value), search: wrap(search) });
    }
    function EndsWith(value, search) {
      arity.exact(2, arguments, EndsWith.name);
      return new Expr({ endswith: wrap(value), search: wrap(search) });
    }
    function RegexEscape(value) {
      arity.exact(1, arguments, RegexEscape.name);
      return new Expr({ regexescape: wrap(value) });
    }
    function FindStr(value, find, start) {
      arity.between(2, 3, arguments, FindStr.name);
      start = util.defaults(start, null);
      return new Expr(params({ findstr: wrap(value), find: wrap(find) }, { start: wrap(start) }));
    }
    function FindStrRegex(value, pattern, start, numResults) {
      arity.between(2, 4, arguments, FindStrRegex.name);
      start = util.defaults(start, null);
      return new Expr(params({ findstrregex: wrap(value), pattern: wrap(pattern) }, { start: wrap(start), num_results: wrap(numResults) }));
    }
    function Length(value) {
      arity.exact(1, arguments, Length.name);
      return new Expr({ length: wrap(value) });
    }
    function LowerCase(value) {
      arity.exact(1, arguments, LowerCase.name);
      return new Expr({ lowercase: wrap(value) });
    }
    function LTrim(value) {
      arity.exact(1, arguments, LTrim.name);
      return new Expr({ ltrim: wrap(value) });
    }
    function NGram(terms, min, max) {
      arity.between(1, 3, arguments, NGram.name);
      min = util.defaults(min, null);
      max = util.defaults(max, null);
      return new Expr(params({ ngram: wrap(terms) }, { min: wrap(min), max: wrap(max) }));
    }
    function Repeat(value, number) {
      arity.between(1, 2, arguments, Repeat.name);
      number = util.defaults(number, null);
      return new Expr(params({ repeat: wrap(value) }, { number: wrap(number) }));
    }
    function ReplaceStr(value, find, replace) {
      arity.exact(3, arguments, ReplaceStr.name);
      return new Expr({
        replacestr: wrap(value),
        find: wrap(find),
        replace: wrap(replace)
      });
    }
    function ReplaceStrRegex(value, pattern, replace, first) {
      arity.between(3, 4, arguments, ReplaceStrRegex.name);
      first = util.defaults(first, null);
      return new Expr(params({
        replacestrregex: wrap(value),
        pattern: wrap(pattern),
        replace: wrap(replace)
      }, { first: wrap(first) }));
    }
    function RTrim(value) {
      arity.exact(1, arguments, RTrim.name);
      return new Expr({ rtrim: wrap(value) });
    }
    function Space(num) {
      arity.exact(1, arguments, Space.name);
      return new Expr({ space: wrap(num) });
    }
    function SubString(value, start, length) {
      arity.between(1, 3, arguments, SubString.name);
      start = util.defaults(start, null);
      length = util.defaults(length, null);
      return new Expr(params({ substring: wrap(value) }, { start: wrap(start), length: wrap(length) }));
    }
    function TitleCase(value) {
      arity.exact(1, arguments, TitleCase.name);
      return new Expr({ titlecase: wrap(value) });
    }
    function Trim(value) {
      arity.exact(1, arguments, Trim.name);
      return new Expr({ trim: wrap(value) });
    }
    function UpperCase(value) {
      arity.exact(1, arguments, UpperCase.name);
      return new Expr({ uppercase: wrap(value) });
    }
    function Format(string) {
      arity.min(1, arguments, Format.name);
      var args = argsToArray(arguments);
      args.shift();
      return new Expr({ format: wrap(string), values: wrap(varargs(args)) });
    }
    function Time(string) {
      arity.exact(1, arguments, Time.name);
      return new Expr({ time: wrap(string) });
    }
    function Epoch(number, unit) {
      arity.exact(2, arguments, Epoch.name);
      return new Expr({ epoch: wrap(number), unit: wrap(unit) });
    }
    function TimeAdd(base, offset, unit) {
      arity.exact(3, arguments, TimeAdd.name);
      return new Expr({
        time_add: wrap(base),
        offset: wrap(offset),
        unit: wrap(unit)
      });
    }
    function TimeSubtract(base, offset, unit) {
      arity.exact(3, arguments, TimeSubtract.name);
      return new Expr({
        time_subtract: wrap(base),
        offset: wrap(offset),
        unit: wrap(unit)
      });
    }
    function TimeDiff(start, finish, unit) {
      arity.exact(3, arguments, TimeDiff.name);
      return new Expr({
        time_diff: wrap(start),
        other: wrap(finish),
        unit: wrap(unit)
      });
    }
    function Date2(string) {
      arity.exact(1, arguments, Date2.name);
      return new Expr({ date: wrap(string) });
    }
    function Now() {
      arity.exact(0, arguments, Now.name);
      return new Expr({ now: wrap(null) });
    }
    function NextId() {
      arity.exact(0, arguments, NextId.name);
      return new Expr({ next_id: null });
    }
    function NewId() {
      arity.exact(0, arguments, NewId.name);
      return new Expr({ new_id: null });
    }
    function Database(name, scope) {
      arity.between(1, 2, arguments, Database.name);
      switch (arguments.length) {
        case 1:
          return new Expr({ database: wrap(name) });
        case 2:
          return new Expr({ database: wrap(name), scope: wrap(scope) });
      }
    }
    function Index(name, scope) {
      arity.between(1, 2, arguments, Index.name);
      switch (arguments.length) {
        case 1:
          return new Expr({ index: wrap(name) });
        case 2:
          return new Expr({ index: wrap(name), scope: wrap(scope) });
      }
    }
    function Class(name, scope) {
      arity.between(1, 2, arguments, Class.name);
      switch (arguments.length) {
        case 1:
          return new Expr({ class: wrap(name) });
        case 2:
          return new Expr({ class: wrap(name), scope: wrap(scope) });
      }
    }
    function Collection(name, scope) {
      arity.between(1, 2, arguments, Collection.name);
      switch (arguments.length) {
        case 1:
          return new Expr({ collection: wrap(name) });
        case 2:
          return new Expr({ collection: wrap(name), scope: wrap(scope) });
      }
    }
    function FunctionFn(name, scope) {
      arity.between(1, 2, arguments, FunctionFn.name);
      switch (arguments.length) {
        case 1:
          return new Expr({ function: wrap(name) });
        case 2:
          return new Expr({ function: wrap(name), scope: wrap(scope) });
      }
    }
    function Role(name, scope) {
      arity.between(1, 2, arguments, Role.name);
      scope = util.defaults(scope, null);
      return new Expr(params({ role: wrap(name) }, { scope: wrap(scope) }));
    }
    function AccessProviders(scope) {
      arity.max(1, arguments, AccessProviders.name);
      scope = util.defaults(scope, null);
      return new Expr({ access_providers: wrap(scope) });
    }
    function Classes(scope) {
      arity.max(1, arguments, Classes.name);
      scope = util.defaults(scope, null);
      return new Expr({ classes: wrap(scope) });
    }
    function Collections(scope) {
      arity.max(1, arguments, Collections.name);
      scope = util.defaults(scope, null);
      return new Expr({ collections: wrap(scope) });
    }
    function Databases(scope) {
      arity.max(1, arguments, Databases.name);
      scope = util.defaults(scope, null);
      return new Expr({ databases: wrap(scope) });
    }
    function Indexes(scope) {
      arity.max(1, arguments, Indexes.name);
      scope = util.defaults(scope, null);
      return new Expr({ indexes: wrap(scope) });
    }
    function Functions(scope) {
      arity.max(1, arguments, Functions.name);
      scope = util.defaults(scope, null);
      return new Expr({ functions: wrap(scope) });
    }
    function Roles(scope) {
      arity.max(1, arguments, Roles.name);
      scope = util.defaults(scope, null);
      return new Expr({ roles: wrap(scope) });
    }
    function Keys(scope) {
      arity.max(1, arguments, Keys.name);
      scope = util.defaults(scope, null);
      return new Expr({ keys: wrap(scope) });
    }
    function Tokens(scope) {
      arity.max(1, arguments, Tokens.name);
      scope = util.defaults(scope, null);
      return new Expr({ tokens: wrap(scope) });
    }
    function Credentials(scope) {
      arity.max(1, arguments, Credentials.name);
      scope = util.defaults(scope, null);
      return new Expr({ credentials: wrap(scope) });
    }
    function Equals() {
      arity.min(1, arguments, Equals.name);
      return new Expr({ equals: wrap(varargs(arguments)) });
    }
    function Contains(path, _in) {
      arity.exact(2, arguments, Contains.name);
      return new Expr({ contains: wrap(path), in: wrap(_in) });
    }
    function ContainsValue(value, _in) {
      arity.exact(2, arguments, ContainsValue.name);
      return new Expr({ contains_value: wrap(value), in: wrap(_in) });
    }
    function ContainsField(field, obj) {
      arity.exact(2, arguments, ContainsField.name);
      return new Expr({ contains_field: wrap(field), in: wrap(obj) });
    }
    function ContainsPath(path, _in) {
      arity.exact(2, arguments, ContainsPath.name);
      return new Expr({ contains_path: wrap(path), in: wrap(_in) });
    }
    function Select(path, from, _default) {
      arity.between(2, 3, arguments, Select.name);
      var exprObj = { select: wrap(path), from: wrap(from) };
      if (_default !== void 0) {
        exprObj.default = wrap(_default);
      }
      return new Expr(exprObj);
    }
    function SelectAll(path, from) {
      arity.exact(2, arguments, SelectAll.name);
      return new Expr({ select_all: wrap(path), from: wrap(from) });
    }
    function Abs(expr) {
      arity.exact(1, arguments, Abs.name);
      return new Expr({ abs: wrap(expr) });
    }
    function Add() {
      arity.min(1, arguments, Add.name);
      return new Expr({ add: wrap(varargs(arguments)) });
    }
    function BitAnd() {
      arity.min(1, arguments, BitAnd.name);
      return new Expr({ bitand: wrap(varargs(arguments)) });
    }
    function BitNot(expr) {
      arity.exact(1, arguments, BitNot.name);
      return new Expr({ bitnot: wrap(expr) });
    }
    function BitOr() {
      arity.min(1, arguments, BitOr.name);
      return new Expr({ bitor: wrap(varargs(arguments)) });
    }
    function BitXor() {
      arity.min(1, arguments, BitXor.name);
      return new Expr({ bitxor: wrap(varargs(arguments)) });
    }
    function Ceil(expr) {
      arity.exact(1, arguments, Ceil.name);
      return new Expr({ ceil: wrap(expr) });
    }
    function Divide() {
      arity.min(1, arguments, Divide.name);
      return new Expr({ divide: wrap(varargs(arguments)) });
    }
    function Floor(expr) {
      arity.exact(1, arguments, Floor.name);
      return new Expr({ floor: wrap(expr) });
    }
    function Max() {
      arity.min(1, arguments, Max.name);
      return new Expr({ max: wrap(varargs(arguments)) });
    }
    function Min() {
      arity.min(1, arguments, Min.name);
      return new Expr({ min: wrap(varargs(arguments)) });
    }
    function Modulo() {
      arity.min(1, arguments, Modulo.name);
      return new Expr({ modulo: wrap(varargs(arguments)) });
    }
    function Multiply() {
      arity.min(1, arguments, Multiply.name);
      return new Expr({ multiply: wrap(varargs(arguments)) });
    }
    function Round(value, precision) {
      arity.min(1, arguments, Round.name);
      precision = util.defaults(precision, null);
      return new Expr(params({ round: wrap(value) }, { precision: wrap(precision) }));
    }
    function Subtract() {
      arity.min(1, arguments, Subtract.name);
      return new Expr({ subtract: wrap(varargs(arguments)) });
    }
    function Sign(expr) {
      arity.exact(1, arguments, Sign.name);
      return new Expr({ sign: wrap(expr) });
    }
    function Sqrt(expr) {
      arity.exact(1, arguments, Sqrt.name);
      return new Expr({ sqrt: wrap(expr) });
    }
    function Trunc(value, precision) {
      arity.min(1, arguments, Trunc.name);
      precision = util.defaults(precision, null);
      return new Expr(params({ trunc: wrap(value) }, { precision: wrap(precision) }));
    }
    function Count(collection) {
      arity.exact(1, arguments, Count.name);
      return new Expr({ count: wrap(collection) });
    }
    function Sum(collection) {
      arity.exact(1, arguments, Sum.name);
      return new Expr({ sum: wrap(collection) });
    }
    function Mean(collection) {
      arity.exact(1, arguments, Mean.name);
      return new Expr({ mean: wrap(collection) });
    }
    function Any(collection) {
      arity.exact(1, arguments, Any.name);
      return new Expr({ any: wrap(collection) });
    }
    function All(collection) {
      arity.exact(1, arguments, All.name);
      return new Expr({ all: wrap(collection) });
    }
    function Acos(expr) {
      arity.exact(1, arguments, Acos.name);
      return new Expr({ acos: wrap(expr) });
    }
    function Asin(expr) {
      arity.exact(1, arguments, Asin.name);
      return new Expr({ asin: wrap(expr) });
    }
    function Atan(expr) {
      arity.exact(1, arguments, Atan.name);
      return new Expr({ atan: wrap(expr) });
    }
    function Cos(expr) {
      arity.exact(1, arguments, Cos.name);
      return new Expr({ cos: wrap(expr) });
    }
    function Cosh(expr) {
      arity.exact(1, arguments, Cosh.name);
      return new Expr({ cosh: wrap(expr) });
    }
    function Degrees(expr) {
      arity.exact(1, arguments, Degrees.name);
      return new Expr({ degrees: wrap(expr) });
    }
    function Exp(expr) {
      arity.exact(1, arguments, Exp.name);
      return new Expr({ exp: wrap(expr) });
    }
    function Hypot(value, side) {
      arity.min(1, arguments, Hypot.name);
      side = util.defaults(side, null);
      return new Expr(params({ hypot: wrap(value) }, { b: wrap(side) }));
    }
    function Ln(expr) {
      arity.exact(1, arguments, Ln.name);
      return new Expr({ ln: wrap(expr) });
    }
    function Log(expr) {
      arity.exact(1, arguments, Log.name);
      return new Expr({ log: wrap(expr) });
    }
    function Pow(value, exponent) {
      arity.min(1, arguments, Pow.name);
      exponent = util.defaults(exponent, null);
      return new Expr(params({ pow: wrap(value) }, { exp: wrap(exponent) }));
    }
    function Radians(expr) {
      arity.exact(1, arguments, Radians.name);
      return new Expr({ radians: wrap(expr) });
    }
    function Sin(expr) {
      arity.exact(1, arguments, Sin.name);
      return new Expr({ sin: wrap(expr) });
    }
    function Sinh(expr) {
      arity.exact(1, arguments, Sinh.name);
      return new Expr({ sinh: wrap(expr) });
    }
    function Tan(expr) {
      arity.exact(1, arguments, Tan.name);
      return new Expr({ tan: wrap(expr) });
    }
    function Tanh(expr) {
      arity.exact(1, arguments, Tanh.name);
      return new Expr({ tanh: wrap(expr) });
    }
    function LT() {
      arity.min(1, arguments, LT.name);
      return new Expr({ lt: wrap(varargs(arguments)) });
    }
    function LTE() {
      arity.min(1, arguments, LTE.name);
      return new Expr({ lte: wrap(varargs(arguments)) });
    }
    function GT() {
      arity.min(1, arguments, GT.name);
      return new Expr({ gt: wrap(varargs(arguments)) });
    }
    function GTE() {
      arity.min(1, arguments, GTE.name);
      return new Expr({ gte: wrap(varargs(arguments)) });
    }
    function And() {
      arity.min(1, arguments, And.name);
      return new Expr({ and: wrap(varargs(arguments)) });
    }
    function Or() {
      arity.min(1, arguments, Or.name);
      return new Expr({ or: wrap(varargs(arguments)) });
    }
    function Not(boolean) {
      arity.exact(1, arguments, Not.name);
      return new Expr({ not: wrap(boolean) });
    }
    function ToString(expr) {
      arity.exact(1, arguments, ToString.name);
      return new Expr({ to_string: wrap(expr) });
    }
    function ToNumber(expr) {
      arity.exact(1, arguments, ToNumber.name);
      return new Expr({ to_number: wrap(expr) });
    }
    function ToObject(expr) {
      arity.exact(1, arguments, ToObject.name);
      return new Expr({ to_object: wrap(expr) });
    }
    function ToArray(expr) {
      arity.exact(1, arguments, ToArray.name);
      return new Expr({ to_array: wrap(expr) });
    }
    function ToDouble(expr) {
      arity.exact(1, arguments, ToDouble.name);
      return new Expr({ to_double: wrap(expr) });
    }
    function ToInteger(expr) {
      arity.exact(1, arguments, ToInteger.name);
      return new Expr({ to_integer: wrap(expr) });
    }
    function ToTime(expr) {
      arity.exact(1, arguments, ToTime.name);
      return new Expr({ to_time: wrap(expr) });
    }
    function ToSeconds(expr) {
      arity.exact(1, arguments, ToSeconds.name);
      return new Expr({ to_seconds: wrap(expr) });
    }
    function ToMillis(expr) {
      arity.exact(1, arguments, ToMillis.name);
      return new Expr({ to_millis: wrap(expr) });
    }
    function ToMicros(expr) {
      arity.exact(1, arguments, ToMicros.name);
      return new Expr({ to_micros: wrap(expr) });
    }
    function DayOfWeek(expr) {
      arity.exact(1, arguments, DayOfWeek.name);
      return new Expr({ day_of_week: wrap(expr) });
    }
    function DayOfYear(expr) {
      arity.exact(1, arguments, DayOfYear.name);
      return new Expr({ day_of_year: wrap(expr) });
    }
    function DayOfMonth(expr) {
      arity.exact(1, arguments, DayOfMonth.name);
      return new Expr({ day_of_month: wrap(expr) });
    }
    function Hour(expr) {
      arity.exact(1, arguments, Hour.name);
      return new Expr({ hour: wrap(expr) });
    }
    function Minute(expr) {
      arity.exact(1, arguments, Minute.name);
      return new Expr({ minute: wrap(expr) });
    }
    function Second(expr) {
      arity.exact(1, arguments, Second.name);
      return new Expr({ second: wrap(expr) });
    }
    function Month(expr) {
      arity.exact(1, arguments, Month.name);
      return new Expr({ month: wrap(expr) });
    }
    function Year(expr) {
      arity.exact(1, arguments, Year.name);
      return new Expr({ year: wrap(expr) });
    }
    function ToDate(expr) {
      arity.exact(1, arguments, ToDate.name);
      return new Expr({ to_date: wrap(expr) });
    }
    function MoveDatabase(from, to) {
      arity.exact(2, arguments, MoveDatabase.name);
      return new Expr({ move_database: wrap(from), to: wrap(to) });
    }
    function Documents(collection) {
      arity.exact(1, arguments, Documents.name);
      return new Expr({ documents: wrap(collection) });
    }
    function Reverse(expr) {
      arity.exact(1, arguments, Reverse.name);
      return new Expr({ reverse: wrap(expr) });
    }
    function AccessProvider(name) {
      arity.exact(1, arguments, AccessProvider.name);
      return new Expr({ access_provider: wrap(name) });
    }
    function arity(min, max, args, callerFunc) {
      if (min !== null && args.length < min || max !== null && args.length > max) {
        throw new errors.InvalidArity(min, max, args.length, callerFunc);
      }
    }
    arity.exact = function(n, args, callerFunc) {
      arity(n, n, args, callerFunc);
    };
    arity.max = function(n, args, callerFunc) {
      arity(null, n, args, callerFunc);
    };
    arity.min = function(n, args, callerFunc) {
      arity(n, null, args, callerFunc);
    };
    arity.between = function(min, max, args, callerFunc) {
      arity(min, max, args, callerFunc);
    };
    function params(mainParams, optionalParams) {
      for (var key in optionalParams) {
        var val = optionalParams[key];
        if (val !== null && val !== void 0) {
          mainParams[key] = val;
        }
      }
      return mainParams;
    }
    function varargs(values2) {
      var valuesAsArr = Array.isArray(values2) ? values2 : Array.prototype.slice.call(values2);
      return values2.length === 1 ? values2[0] : valuesAsArr;
    }
    function argsToArray(args) {
      var rv = [];
      rv.push.apply(rv, args);
      return rv;
    }
    function wrap(obj) {
      arity.exact(1, arguments, wrap.name);
      if (obj === null) {
        return null;
      } else if (obj instanceof Expr || util.checkInstanceHasProperty(obj, "_isFaunaExpr")) {
        return obj;
      } else if (typeof obj === "symbol") {
        return obj.toString().replace(/Symbol\((.*)\)/, function(str, symbol) {
          return symbol;
        });
      } else if (typeof obj === "function") {
        return Lambda(obj);
      } else if (Array.isArray(obj)) {
        return new Expr(obj.map(function(elem) {
          return wrap(elem);
        }));
      } else if (obj instanceof Uint8Array || obj instanceof ArrayBuffer) {
        return new values.Bytes(obj);
      } else if (typeof obj === "object") {
        return new Expr({ object: wrapValues(obj) });
      } else {
        return obj;
      }
    }
    function wrapValues(obj) {
      if (obj !== null) {
        var rv = {};
        Object.keys(obj).forEach(function(key) {
          rv[key] = wrap(obj[key]);
        });
        return rv;
      } else {
        return null;
      }
    }
    module.exports = {
      Ref,
      Bytes,
      Abort,
      At,
      Let,
      Var,
      If,
      Do,
      Object: objectFunction,
      Lambda,
      Call,
      Query,
      Map: Map2,
      Foreach,
      Filter,
      Take,
      Drop,
      Prepend,
      Append,
      IsEmpty,
      IsNonEmpty,
      IsNumber,
      IsDouble,
      IsInteger,
      IsBoolean,
      IsNull,
      IsBytes,
      IsTimestamp,
      IsDate,
      IsString,
      IsArray,
      IsObject,
      IsRef,
      IsSet,
      IsDoc,
      IsLambda,
      IsCollection,
      IsDatabase,
      IsIndex,
      IsFunction,
      IsKey,
      IsToken,
      IsCredentials,
      IsRole,
      Get,
      KeyFromSecret,
      Reduce,
      Paginate,
      Exists,
      Create,
      Update,
      Replace,
      Delete,
      Insert,
      Remove,
      CreateClass: deprecate(CreateClass, "CreateClass() is deprecated, use CreateCollection() instead"),
      CreateCollection,
      CreateDatabase,
      CreateIndex,
      CreateKey,
      CreateFunction,
      CreateRole,
      CreateAccessProvider,
      Singleton,
      Events,
      Match,
      Union,
      Merge,
      Intersection,
      Difference,
      Distinct,
      Join,
      Range,
      Login,
      Logout,
      Identify,
      Identity: deprecate(Identity, "Identity() is deprecated, use CurrentIdentity() instead"),
      CurrentIdentity,
      HasIdentity: deprecate(HasIdentity, "HasIdentity() is deprecated, use HasCurrentIdentity() instead"),
      HasCurrentIdentity,
      CurrentToken,
      HasCurrentToken,
      Concat,
      Casefold,
      ContainsStr,
      ContainsStrRegex,
      StartsWith,
      EndsWith,
      FindStr,
      FindStrRegex,
      Length,
      LowerCase,
      LTrim,
      NGram,
      Repeat,
      ReplaceStr,
      ReplaceStrRegex,
      RegexEscape,
      RTrim,
      Space,
      SubString,
      TitleCase,
      Trim,
      UpperCase,
      Format,
      Time,
      TimeAdd,
      TimeSubtract,
      TimeDiff,
      Epoch,
      Date: Date2,
      Now,
      NextId: deprecate(NextId, "NextId() is deprecated, use NewId() instead"),
      NewId,
      Database,
      Index,
      Class: deprecate(Class, "Class() is deprecated, use Collection() instead"),
      Collection,
      Function: FunctionFn,
      Role,
      AccessProviders,
      Classes: deprecate(Classes, "Classes() is deprecated, use Collections() instead"),
      Collections,
      Databases,
      Indexes,
      Functions,
      Roles,
      Keys,
      Tokens,
      Credentials,
      Equals,
      Contains: deprecate(Contains, "Contains() is deprecated, use ContainsPath() instead"),
      ContainsPath,
      ContainsField,
      ContainsValue,
      Select,
      SelectAll: deprecate(SelectAll, "SelectAll() is deprecated. Avoid use."),
      Abs,
      Add,
      BitAnd,
      BitNot,
      BitOr,
      BitXor,
      Ceil,
      Divide,
      Floor,
      Max,
      Min,
      Modulo,
      Multiply,
      Round,
      Subtract,
      Sign,
      Sqrt,
      Trunc,
      Count,
      Sum,
      Mean,
      Any,
      All,
      Acos,
      Asin,
      Atan,
      Cos,
      Cosh,
      Degrees,
      Exp,
      Hypot,
      Ln,
      Log,
      Pow,
      Radians,
      Sin,
      Sinh,
      Tan,
      Tanh,
      LT,
      LTE,
      GT,
      GTE,
      And,
      Or,
      Not,
      ToString,
      ToNumber,
      ToObject,
      ToArray,
      ToDouble,
      ToInteger,
      ToTime,
      ToSeconds,
      ToMicros,
      ToMillis,
      DayOfMonth,
      DayOfWeek,
      DayOfYear,
      Second,
      Minute,
      Hour,
      Month,
      Year,
      ToDate,
      MoveDatabase,
      Documents,
      Reverse,
      AccessProvider,
      wrap
    };
  }
});

// node_modules/faunadb/src/_json.js
var require_json = __commonJS({
  "node_modules/faunadb/src/_json.js"(exports, module) {
    "use strict";
    var values = require_values();
    function toJSON(object, pretty) {
      pretty = typeof pretty !== "undefined" ? pretty : false;
      if (pretty) {
        return JSON.stringify(object, null, "  ");
      } else {
        return JSON.stringify(object);
      }
    }
    function parseJSON(json) {
      return JSON.parse(json, json_parse);
    }
    function parseJSONStreaming(content) {
      var values2 = [];
      try {
        values2.push(parseJSON(content));
        content = "";
      } catch (err) {
        while (true) {
          var pos = content.indexOf("\n") + 1;
          if (pos <= 0) {
            break;
          }
          var slice = content.slice(0, pos).trim();
          if (slice.length > 0) {
            values2.push(parseJSON(slice));
          }
          content = content.slice(pos);
        }
      }
      return {
        values: values2,
        buffer: content
      };
    }
    function json_parse(_, val) {
      if (typeof val !== "object" || val === null) {
        return val;
      } else if ("@ref" in val) {
        var ref = val["@ref"];
        if (!("collection" in ref) && !("database" in ref)) {
          return values.Native.fromName(ref["id"]);
        }
        var col = json_parse("collection", ref["collection"]);
        var db = json_parse("database", ref["database"]);
        return new values.Ref(ref["id"], col, db);
      } else if ("@obj" in val) {
        return val["@obj"];
      } else if ("@set" in val) {
        return new values.SetRef(val["@set"]);
      } else if ("@ts" in val) {
        return new values.FaunaTime(val["@ts"]);
      } else if ("@date" in val) {
        return new values.FaunaDate(val["@date"]);
      } else if ("@bytes" in val) {
        return new values.Bytes(val["@bytes"]);
      } else if ("@query" in val) {
        return new values.Query(val["@query"]);
      } else {
        return val;
      }
    }
    module.exports = {
      toJSON,
      parseJSON,
      parseJSONStreaming
    };
  }
});

// node_modules/faunadb/src/PageHelper.js
var require_PageHelper = __commonJS({
  "node_modules/faunadb/src/PageHelper.js"(exports, module) {
    "use strict";
    var query = require_query();
    var objectAssign = require_object_assign();
    function PageHelper(client, set, params, options) {
      if (params === void 0) {
        params = {};
      }
      if (options === void 0) {
        options = {};
      }
      this.reverse = false;
      this.params = {};
      this.before = void 0;
      this.after = void 0;
      objectAssign(this.params, params);
      var cursorParams = this.params.cursor || this.params;
      if ("before" in cursorParams) {
        this.before = cursorParams.before;
        delete cursorParams.before;
      } else if ("after" in cursorParams) {
        this.after = cursorParams.after;
        delete cursorParams.after;
      }
      this.options = {};
      objectAssign(this.options, options);
      this.client = client;
      this.set = set;
      this._faunaFunctions = [];
    }
    PageHelper.prototype.map = function(lambda) {
      var rv = this._clone();
      rv._faunaFunctions.push(function(q4) {
        return query.Map(q4, lambda);
      });
      return rv;
    };
    PageHelper.prototype.filter = function(lambda) {
      var rv = this._clone();
      rv._faunaFunctions.push(function(q4) {
        return query.Filter(q4, lambda);
      });
      return rv;
    };
    PageHelper.prototype.each = function(lambda) {
      return this._retrieveNextPage(this.after, false).then(this._consumePages(lambda, false));
    };
    PageHelper.prototype.eachReverse = function(lambda) {
      return this._retrieveNextPage(this.before, true).then(this._consumePages(lambda, true));
    };
    PageHelper.prototype.previousPage = function() {
      var self2 = this;
      return this._retrieveNextPage(this.before, true).then(this._adjustCursors.bind(self2));
    };
    PageHelper.prototype.nextPage = function() {
      var self2 = this;
      return this._retrieveNextPage(this.after, false).then(this._adjustCursors.bind(self2));
    };
    PageHelper.prototype._adjustCursors = function(page) {
      if (page.after !== void 0) {
        this.after = page.after;
      }
      if (page.before !== void 0) {
        this.before = page.before;
      }
      return page.data;
    };
    PageHelper.prototype._consumePages = function(lambda, reverse) {
      var self2 = this;
      return function(page) {
        var data = [];
        page.data.forEach(function(item) {
          if (item.document) {
            item.instance = item.document;
          }
          if (item.value && item.value.document) {
            item.value.instance = item.value.document;
          }
          data.push(item);
        });
        lambda(data);
        var nextCursor;
        if (reverse) {
          nextCursor = page.before;
        } else {
          nextCursor = page.after;
        }
        if (nextCursor !== void 0) {
          return self2._retrieveNextPage(nextCursor, reverse).then(self2._consumePages(lambda, reverse));
        } else {
          return Promise.resolve();
        }
      };
    };
    PageHelper.prototype._retrieveNextPage = function(cursor, reverse) {
      var opts = {};
      objectAssign(opts, this.params);
      var cursorOpts = opts.cursor || opts;
      if (cursor !== void 0) {
        if (reverse) {
          cursorOpts.before = cursor;
        } else {
          cursorOpts.after = cursor;
        }
      } else {
        if (reverse) {
          cursorOpts.before = null;
        }
      }
      var q4 = query.Paginate(this.set, opts);
      if (this._faunaFunctions.length > 0) {
        this._faunaFunctions.forEach(function(lambda) {
          q4 = lambda(q4);
        });
      }
      return this.client.query(q4, this.options);
    };
    PageHelper.prototype._clone = function() {
      return Object.create(PageHelper.prototype, {
        client: { value: this.client },
        set: { value: this.set },
        _faunaFunctions: { value: this._faunaFunctions },
        before: { value: this.before },
        after: { value: this.after },
        params: { value: this.params }
      });
    };
    module.exports = PageHelper;
  }
});

// node_modules/faunadb/src/RequestResult.js
var require_RequestResult = __commonJS({
  "node_modules/faunadb/src/RequestResult.js"(exports, module) {
    "use strict";
    function RequestResult(method, path, query, requestRaw, requestContent, responseRaw, responseContent, statusCode, responseHeaders, startTime, endTime) {
      this.method = method;
      this.path = path;
      this.query = query;
      this.requestRaw = requestRaw;
      this.requestContent = requestContent;
      this.responseRaw = responseRaw;
      this.responseContent = responseContent;
      this.statusCode = statusCode;
      this.responseHeaders = responseHeaders;
      this.startTime = startTime;
      this.endTime = endTime;
    }
    Object.defineProperty(RequestResult.prototype, "timeTaken", {
      get: function() {
        return this.endTime - this.startTime;
      }
    });
    module.exports = RequestResult;
  }
});

// node_modules/faunadb/src/_http/errors.js
var require_errors2 = __commonJS({
  "node_modules/faunadb/src/_http/errors.js"(exports, module) {
    "use strict";
    var util = require_util();
    function TimeoutError(message) {
      Error.call(this);
      this.message = message || "Request aborted due to timeout";
      this.isTimeoutError = true;
    }
    util.inherits(TimeoutError, Error);
    function AbortError(message) {
      Error.call(this);
      this.message = message || "Request aborted";
      this.isAbortError = true;
    }
    util.inherits(AbortError, Error);
    module.exports = {
      TimeoutError,
      AbortError
    };
  }
});

// (disabled):http2
var require_http2 = __commonJS({
  "(disabled):http2"() {
  }
});

// node_modules/faunadb/src/_http/http2Adapter.js
var require_http2Adapter = __commonJS({
  "node_modules/faunadb/src/_http/http2Adapter.js"(exports, module) {
    "use strict";
    var http2 = require_http2();
    var errors = require_errors2();
    var faunaErrors = require_errors();
    var util = require_util();
    var STREAM_PREFIX = "stream::";
    function Http2Adapter(options) {
      this.type = "http2";
      this._sessionMap = {};
      this._http2SessionIdleTime = options.http2SessionIdleTime;
      this._closed = false;
    }
    Http2Adapter.prototype._resolveSessionFor = function(origin, isStreaming) {
      var sessionKey = isStreaming ? STREAM_PREFIX + origin : origin;
      if (this._sessionMap[sessionKey]) {
        return this._sessionMap[sessionKey];
      }
      var self2 = this;
      var timerId = null;
      var ongoingRequests = 0;
      var cleanup = function() {
        self2._cleanupSessionFor(origin, isStreaming);
      };
      var clearInactivityTimeout = function() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      };
      var setInactivityTimeout = function() {
        clearInactivityTimeout();
        if (self2._http2SessionIdleTime === Infinity) {
          return;
        }
        var onTimeout = function() {
          timerId = null;
          if (ongoingRequests === 0) {
            cleanup();
          }
        };
        timerId = setTimeout(onTimeout, self2._http2SessionIdleTime);
      };
      var close = function(force) {
        clearInactivityTimeout();
        var shouldDestroy = force || isStreaming;
        if (shouldDestroy) {
          session.destroy();
          return Promise.resolve();
        }
        return new Promise(function(resolve) {
          session.close(resolve);
        });
      };
      var onRequestStart = function() {
        ++ongoingRequests;
        clearInactivityTimeout();
      };
      var onRequestEnd = function() {
        --ongoingRequests;
        var noOngoingRequests = ongoingRequests === 0;
        var isSessionClosed = self2._closed || session.closed || session.destroyed;
        if (noOngoingRequests && !isSessionClosed) {
          setInactivityTimeout();
        }
      };
      var session = http2.connect(origin).once("error", cleanup).once("goaway", cleanup);
      var sessionInterface = {
        session,
        close,
        onRequestStart,
        onRequestEnd
      };
      this._sessionMap[sessionKey] = sessionInterface;
      return sessionInterface;
    };
    Http2Adapter.prototype._cleanupSessionFor = function(origin, isStreaming) {
      var sessionKey = isStreaming ? STREAM_PREFIX + origin : origin;
      if (this._sessionMap[sessionKey]) {
        this._sessionMap[sessionKey].session.close();
        delete this._sessionMap[sessionKey];
      }
    };
    Http2Adapter.prototype.execute = function(options) {
      if (this._closed) {
        return Promise.reject(new faunaErrors.ClientClosed("The Client has already been closed", "No subsequent requests can be issued after the .close method is called. Consider creating a new Client instance"));
      }
      var self2 = this;
      var isStreaming = options.streamConsumer != null;
      return new Promise(function(resolvePromise, rejectPromise) {
        var isPromiseSettled = false;
        var isCanceled = false;
        var resolve = function(value) {
          isPromiseSettled = true;
          resolvePromise(value);
        };
        var rejectOrOnError = function(error) {
          var remapped = remapHttp2Error({ error, isClosed: self2._closed });
          if (isPromiseSettled && isStreaming) {
            return options.streamConsumer.onError(remapped);
          }
          isPromiseSettled = true;
          rejectPromise(remapped);
        };
        var onSettled = function() {
          sessionInterface.onRequestEnd();
          if (options.signal) {
            options.signal.removeEventListener("abort", onAbort);
          }
        };
        var onError = function(error) {
          onSettled();
          rejectOrOnError(error);
        };
        var onAbort = function() {
          isCanceled = true;
          onSettled();
          request.close(http2.constants.NGHTTP2_CANCEL);
          rejectOrOnError(new errors.AbortError());
        };
        var onTimeout = function() {
          isCanceled = true;
          onSettled();
          request.close(http2.constants.NGHTTP2_CANCEL);
          rejectOrOnError(new errors.TimeoutError());
        };
        var onResponse = function(responseHeaders) {
          var status = responseHeaders[http2.constants.HTTP2_HEADER_STATUS];
          var isOkStatus = status >= 200 && status < 400;
          var processStream = isOkStatus && isStreaming;
          var responseBody = "";
          var onData = function(chunk) {
            if (processStream) {
              return options.streamConsumer.onData(chunk);
            }
            responseBody += chunk;
          };
          var onEnd = function() {
            if (!isCanceled) {
              onSettled();
            }
            if (!processStream) {
              return resolve({
                body: responseBody,
                headers: responseHeaders,
                status
              });
            }
            if (!isCanceled && !self2._closed) {
              options.streamConsumer.onError(new TypeError("network error"));
            }
          };
          if (processStream) {
            resolve({
              body: "[stream]",
              headers: responseHeaders,
              status
            });
          }
          request.on("data", onData).on("end", onEnd);
        };
        try {
          var pathname = (options.path[0] === "/" ? options.path : "/" + options.path) + util.querystringify(options.query, "?");
          var requestHeaders = Object.assign({}, options.headers, {
            [http2.constants.HTTP2_HEADER_PATH]: pathname,
            [http2.constants.HTTP2_HEADER_METHOD]: options.method
          });
          var sessionInterface = self2._resolveSessionFor(options.origin, isStreaming);
          var request = sessionInterface.session.request(requestHeaders).setEncoding("utf8").on("error", onError).on("response", onResponse);
          sessionInterface.onRequestStart();
          if (!options.signal && options.timeout) {
            request.setTimeout(options.timeout, onTimeout);
          }
          if (options.signal) {
            options.signal.addEventListener("abort", onAbort);
          }
          if (options.body != null) {
            request.write(options.body);
          }
          request.end();
        } catch (error) {
          self2._cleanupSessionFor(options.origin, isStreaming);
          rejectOrOnError(error);
        }
      });
    };
    Http2Adapter.prototype.close = function(opts) {
      opts = opts || {};
      this._closed = true;
      var noop = function() {
      };
      return Promise.all(Object.values(this._sessionMap).map(function(sessionInterface) {
        return sessionInterface.close(opts.force);
      })).then(noop);
    };
    function remapHttp2Error({ error, isClosed }) {
      var shouldRemap = isClosed && (error.code === "ERR_HTTP2_GOAWAY_SESSION" || error.code === "ERR_HTTP2_STREAM_CANCEL");
      if (shouldRemap) {
        return new faunaErrors.ClientClosed("The request is aborted due to the Client#close call");
      }
      return error;
    }
    module.exports = Http2Adapter;
  }
});

// node_modules/event-target-shim/dist/event-target-shim.js
var require_event_target_shim = __commonJS({
  "node_modules/event-target-shim/dist/event-target-shim.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var privateData = new WeakMap();
    var wrappers = new WeakMap();
    function pd(event) {
      const retv = privateData.get(event);
      console.assert(retv != null, "'this' is expected an Event object, but got", event);
      return retv;
    }
    function setCancelFlag(data) {
      if (data.passiveListener != null) {
        if (typeof console !== "undefined" && typeof console.error === "function") {
          console.error("Unable to preventDefault inside passive event listener invocation.", data.passiveListener);
        }
        return;
      }
      if (!data.event.cancelable) {
        return;
      }
      data.canceled = true;
      if (typeof data.event.preventDefault === "function") {
        data.event.preventDefault();
      }
    }
    function Event2(eventTarget, event) {
      privateData.set(this, {
        eventTarget,
        event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        immediateStopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now()
      });
      Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });
      const keys = Object.keys(event);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in this)) {
          Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
      }
    }
    Event2.prototype = {
      get type() {
        return pd(this).event.type;
      },
      get target() {
        return pd(this).eventTarget;
      },
      get currentTarget() {
        return pd(this).currentTarget;
      },
      composedPath() {
        const currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
          return [];
        }
        return [currentTarget];
      },
      get NONE() {
        return 0;
      },
      get CAPTURING_PHASE() {
        return 1;
      },
      get AT_TARGET() {
        return 2;
      },
      get BUBBLING_PHASE() {
        return 3;
      },
      get eventPhase() {
        return pd(this).eventPhase;
      },
      stopPropagation() {
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.stopPropagation === "function") {
          data.event.stopPropagation();
        }
      },
      stopImmediatePropagation() {
        const data = pd(this);
        data.stopped = true;
        data.immediateStopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
          data.event.stopImmediatePropagation();
        }
      },
      get bubbles() {
        return Boolean(pd(this).event.bubbles);
      },
      get cancelable() {
        return Boolean(pd(this).event.cancelable);
      },
      preventDefault() {
        setCancelFlag(pd(this));
      },
      get defaultPrevented() {
        return pd(this).canceled;
      },
      get composed() {
        return Boolean(pd(this).event.composed);
      },
      get timeStamp() {
        return pd(this).timeStamp;
      },
      get srcElement() {
        return pd(this).eventTarget;
      },
      get cancelBubble() {
        return pd(this).stopped;
      },
      set cancelBubble(value) {
        if (!value) {
          return;
        }
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.cancelBubble === "boolean") {
          data.event.cancelBubble = true;
        }
      },
      get returnValue() {
        return !pd(this).canceled;
      },
      set returnValue(value) {
        if (!value) {
          setCancelFlag(pd(this));
        }
      },
      initEvent() {
      }
    };
    Object.defineProperty(Event2.prototype, "constructor", {
      value: Event2,
      configurable: true,
      writable: true
    });
    if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
      Object.setPrototypeOf(Event2.prototype, window.Event.prototype);
      wrappers.set(window.Event.prototype, Event2);
    }
    function defineRedirectDescriptor(key) {
      return {
        get() {
          return pd(this).event[key];
        },
        set(value) {
          pd(this).event[key] = value;
        },
        configurable: true,
        enumerable: true
      };
    }
    function defineCallDescriptor(key) {
      return {
        value() {
          const event = pd(this).event;
          return event[key].apply(event, arguments);
        },
        configurable: true,
        enumerable: true
      };
    }
    function defineWrapper(BaseEvent, proto) {
      const keys = Object.keys(proto);
      if (keys.length === 0) {
        return BaseEvent;
      }
      function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
      }
      CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: { value: CustomEvent, configurable: true, writable: true }
      });
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in BaseEvent.prototype)) {
          const descriptor = Object.getOwnPropertyDescriptor(proto, key);
          const isFunc = typeof descriptor.value === "function";
          Object.defineProperty(CustomEvent.prototype, key, isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key));
        }
      }
      return CustomEvent;
    }
    function getWrapper(proto) {
      if (proto == null || proto === Object.prototype) {
        return Event2;
      }
      let wrapper = wrappers.get(proto);
      if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
      }
      return wrapper;
    }
    function wrapEvent(eventTarget, event) {
      const Wrapper = getWrapper(Object.getPrototypeOf(event));
      return new Wrapper(eventTarget, event);
    }
    function isStopped(event) {
      return pd(event).immediateStopped;
    }
    function setEventPhase(event, eventPhase) {
      pd(event).eventPhase = eventPhase;
    }
    function setCurrentTarget(event, currentTarget) {
      pd(event).currentTarget = currentTarget;
    }
    function setPassiveListener(event, passiveListener) {
      pd(event).passiveListener = passiveListener;
    }
    var listenersMap = new WeakMap();
    var CAPTURE = 1;
    var BUBBLE = 2;
    var ATTRIBUTE = 3;
    function isObject(x) {
      return x !== null && typeof x === "object";
    }
    function getListeners(eventTarget) {
      const listeners = listenersMap.get(eventTarget);
      if (listeners == null) {
        throw new TypeError("'this' is expected an EventTarget object, but got another value.");
      }
      return listeners;
    }
    function defineEventAttributeDescriptor(eventName) {
      return {
        get() {
          const listeners = getListeners(this);
          let node = listeners.get(eventName);
          while (node != null) {
            if (node.listenerType === ATTRIBUTE) {
              return node.listener;
            }
            node = node.next;
          }
          return null;
        },
        set(listener) {
          if (typeof listener !== "function" && !isObject(listener)) {
            listener = null;
          }
          const listeners = getListeners(this);
          let prev = null;
          let node = listeners.get(eventName);
          while (node != null) {
            if (node.listenerType === ATTRIBUTE) {
              if (prev !== null) {
                prev.next = node.next;
              } else if (node.next !== null) {
                listeners.set(eventName, node.next);
              } else {
                listeners.delete(eventName);
              }
            } else {
              prev = node;
            }
            node = node.next;
          }
          if (listener !== null) {
            const newNode = {
              listener,
              listenerType: ATTRIBUTE,
              passive: false,
              once: false,
              next: null
            };
            if (prev === null) {
              listeners.set(eventName, newNode);
            } else {
              prev.next = newNode;
            }
          }
        },
        configurable: true,
        enumerable: true
      };
    }
    function defineEventAttribute(eventTargetPrototype, eventName) {
      Object.defineProperty(eventTargetPrototype, `on${eventName}`, defineEventAttributeDescriptor(eventName));
    }
    function defineCustomEventTarget(eventNames) {
      function CustomEventTarget() {
        EventTarget.call(this);
      }
      CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: {
          value: CustomEventTarget,
          configurable: true,
          writable: true
        }
      });
      for (let i = 0; i < eventNames.length; ++i) {
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
      }
      return CustomEventTarget;
    }
    function EventTarget() {
      if (this instanceof EventTarget) {
        listenersMap.set(this, /* @__PURE__ */ new Map());
        return;
      }
      if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0]);
      }
      if (arguments.length > 0) {
        const types = new Array(arguments.length);
        for (let i = 0; i < arguments.length; ++i) {
          types[i] = arguments[i];
        }
        return defineCustomEventTarget(types);
      }
      throw new TypeError("Cannot call a class as a function");
    }
    EventTarget.prototype = {
      addEventListener(eventName, listener, options) {
        if (listener == null) {
          return;
        }
        if (typeof listener !== "function" && !isObject(listener)) {
          throw new TypeError("'listener' should be a function or an object.");
        }
        const listeners = getListeners(this);
        const optionsIsObj = isObject(options);
        const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        const newNode = {
          listener,
          listenerType,
          passive: optionsIsObj && Boolean(options.passive),
          once: optionsIsObj && Boolean(options.once),
          next: null
        };
        let node = listeners.get(eventName);
        if (node === void 0) {
          listeners.set(eventName, newNode);
          return;
        }
        let prev = null;
        while (node != null) {
          if (node.listener === listener && node.listenerType === listenerType) {
            return;
          }
          prev = node;
          node = node.next;
        }
        prev.next = newNode;
      },
      removeEventListener(eventName, listener, options) {
        if (listener == null) {
          return;
        }
        const listeners = getListeners(this);
        const capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        let prev = null;
        let node = listeners.get(eventName);
        while (node != null) {
          if (node.listener === listener && node.listenerType === listenerType) {
            if (prev !== null) {
              prev.next = node.next;
            } else if (node.next !== null) {
              listeners.set(eventName, node.next);
            } else {
              listeners.delete(eventName);
            }
            return;
          }
          prev = node;
          node = node.next;
        }
      },
      dispatchEvent(event) {
        if (event == null || typeof event.type !== "string") {
          throw new TypeError('"event.type" should be a string.');
        }
        const listeners = getListeners(this);
        const eventName = event.type;
        let node = listeners.get(eventName);
        if (node == null) {
          return true;
        }
        const wrappedEvent = wrapEvent(this, event);
        let prev = null;
        while (node != null) {
          if (node.once) {
            if (prev !== null) {
              prev.next = node.next;
            } else if (node.next !== null) {
              listeners.set(eventName, node.next);
            } else {
              listeners.delete(eventName);
            }
          } else {
            prev = node;
          }
          setPassiveListener(wrappedEvent, node.passive ? node.listener : null);
          if (typeof node.listener === "function") {
            try {
              node.listener.call(this, wrappedEvent);
            } catch (err) {
              if (typeof console !== "undefined" && typeof console.error === "function") {
                console.error(err);
              }
            }
          } else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
            node.listener.handleEvent(wrappedEvent);
          }
          if (isStopped(wrappedEvent)) {
            break;
          }
          node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);
        return !wrappedEvent.defaultPrevented;
      }
    };
    Object.defineProperty(EventTarget.prototype, "constructor", {
      value: EventTarget,
      configurable: true,
      writable: true
    });
    if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") {
      Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
    }
    exports.defineEventAttribute = defineEventAttribute;
    exports.EventTarget = EventTarget;
    exports.default = EventTarget;
    module.exports = EventTarget;
    module.exports.EventTarget = module.exports["default"] = EventTarget;
    module.exports.defineEventAttribute = defineEventAttribute;
  }
});

// node_modules/abort-controller/dist/abort-controller.js
var require_abort_controller = __commonJS({
  "node_modules/abort-controller/dist/abort-controller.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var eventTargetShim = require_event_target_shim();
    var AbortSignal = class extends eventTargetShim.EventTarget {
      constructor() {
        super();
        throw new TypeError("AbortSignal cannot be constructed directly");
      }
      get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
          throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
      }
    };
    eventTargetShim.defineEventAttribute(AbortSignal.prototype, "abort");
    function createAbortSignal() {
      const signal = Object.create(AbortSignal.prototype);
      eventTargetShim.EventTarget.call(signal);
      abortedFlags.set(signal, false);
      return signal;
    }
    function abortSignal(signal) {
      if (abortedFlags.get(signal) !== false) {
        return;
      }
      abortedFlags.set(signal, true);
      signal.dispatchEvent({ type: "abort" });
    }
    var abortedFlags = new WeakMap();
    Object.defineProperties(AbortSignal.prototype, {
      aborted: { enumerable: true }
    });
    if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
      Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal"
      });
    }
    var AbortController2 = class {
      constructor() {
        signals.set(this, createAbortSignal());
      }
      get signal() {
        return getSignal(this);
      }
      abort() {
        abortSignal(getSignal(this));
      }
    };
    var signals = new WeakMap();
    function getSignal(controller) {
      const signal = signals.get(controller);
      if (signal == null) {
        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
      }
      return signal;
    }
    Object.defineProperties(AbortController2.prototype, {
      signal: { enumerable: true },
      abort: { enumerable: true }
    });
    if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
      Object.defineProperty(AbortController2.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController"
      });
    }
    exports.AbortController = AbortController2;
    exports.AbortSignal = AbortSignal;
    exports.default = AbortController2;
    module.exports = AbortController2;
    module.exports.AbortController = module.exports["default"] = AbortController2;
    module.exports.AbortSignal = AbortSignal;
  }
});

// node_modules/abort-controller/polyfill.js
var require_polyfill = __commonJS({
  "node_modules/abort-controller/polyfill.js"() {
    "use strict";
    var ac = require_abort_controller();
    var g = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : void 0;
    if (g) {
      if (typeof g.AbortController === "undefined") {
        g.AbortController = ac.AbortController;
      }
      if (typeof g.AbortSignal === "undefined") {
        g.AbortSignal = ac.AbortSignal;
      }
    }
  }
});

// (disabled):https
var require_https = __commonJS({
  "(disabled):https"() {
  }
});

// (disabled):http
var require_http = __commonJS({
  "(disabled):http"() {
  }
});

// node_modules/faunadb/src/_http/fetchAdapter.js
var require_fetchAdapter = __commonJS({
  "node_modules/faunadb/src/_http/fetchAdapter.js"(exports, module) {
    "use strict";
    require_polyfill();
    var util = require_util();
    var faunaErrors = require_errors();
    var errors = require_errors2();
    function FetchAdapter(options) {
      options = options || {};
      this.type = "fetch";
      this._closed = false;
      this._fetch = util.resolveFetch(options.fetch);
      this._pendingRequests = /* @__PURE__ */ new Map();
      if (util.isNodeEnv() && options.keepAlive) {
        this._keepAliveEnabledAgent = new (options.isHttps ? require_https() : require_http()).Agent({ keepAlive: true });
      }
    }
    FetchAdapter.prototype.execute = function(options) {
      if (this._closed) {
        return Promise.reject(new faunaErrors.ClientClosed("The Client has already been closed", "No subsequent requests can be issued after the .close method is called. Consider creating a new Client instance"));
      }
      var self2 = this;
      var timerId = null;
      var isStreaming = options.streamConsumer != null;
      var useTimeout = !options.signal && !!options.timeout;
      var ctrl = new AbortController();
      var pendingRequest = {
        isStreaming,
        isAbortedByClose: false,
        onComplete: null
      };
      self2._pendingRequests.set(ctrl, pendingRequest);
      var onComplete = function() {
        self2._pendingRequests.delete(ctrl);
        if (options.signal) {
          options.signal.removeEventListener("abort", onAbort);
        }
        if (pendingRequest.onComplete) {
          pendingRequest.onComplete();
        }
      };
      var onSettle = function() {
        if (timerId) {
          clearTimeout(timerId);
        }
      };
      var onResponse = function(response) {
        onSettle();
        var headers = responseHeadersAsObject(response.headers);
        var processStream = isStreaming && response.ok;
        if (!processStream) {
          onComplete();
          return response.text().then(function(content) {
            return {
              body: content,
              headers,
              status: response.status
            };
          });
        }
        attachStreamConsumer(response, options.streamConsumer, onComplete);
        return {
          body: "[stream]",
          headers,
          status: response.status
        };
      };
      var onError = function(error) {
        onSettle();
        onComplete();
        return Promise.reject(remapIfAbortError(error, function() {
          if (!isStreaming && pendingRequest.isAbortedByClose) {
            return new faunaErrors.ClientClosed("The request is aborted due to the Client#close call with the force=true option");
          }
          return useTimeout ? new errors.TimeoutError() : new errors.AbortError();
        }));
      };
      var onAbort = function() {
        ctrl.abort();
      };
      if (useTimeout) {
        timerId = setTimeout(function() {
          timerId = null;
          ctrl.abort();
        }, options.timeout);
      }
      if (options.signal) {
        options.signal.addEventListener("abort", onAbort);
      }
      return this._fetch(util.formatUrl(options.origin, options.path, options.query), {
        method: options.method,
        headers: options.headers,
        body: options.body,
        agent: this._keepAliveEnabledAgent,
        signal: ctrl.signal
      }).then(onResponse).catch(onError);
    };
    FetchAdapter.prototype.close = function(opts) {
      opts = opts || {};
      this._closed = true;
      var promises = [];
      var abortOrWait = function(pendingRequest, ctrl) {
        var shouldAbort = pendingRequest.isStreaming || opts.force;
        if (shouldAbort) {
          pendingRequest.isAbortedByClose = true;
          return ctrl.abort();
        }
        promises.push(new Promise(function(resolve) {
          pendingRequest.onComplete = resolve;
        }));
      };
      this._pendingRequests.forEach(abortOrWait);
      var noop = function() {
      };
      return Promise.all(promises).then(noop);
    };
    function attachStreamConsumer(response, consumer, onComplete) {
      var onError = function(error) {
        onComplete();
        consumer.onError(remapIfAbortError(error));
      };
      if (util.isNodeEnv()) {
        response.body.on("error", onError).on("data", consumer.onData).on("end", function() {
          onComplete();
          consumer.onError(new TypeError("network error"));
        });
        return;
      }
      try {
        let pump = function() {
          return reader.read().then(function(msg) {
            if (!msg.done) {
              var chunk = decoder.decode(msg.value, { stream: true });
              consumer.onData(chunk);
              return pump();
            }
            onComplete();
            consumer.onError(new TypeError("network error"));
          });
        };
        var reader = response.body.getReader();
        var decoder = new TextDecoder("utf-8");
        pump().catch(onError);
      } catch (err) {
        throw new faunaErrors.StreamsNotSupported("Please, consider providing a Fetch API-compatible function with streamable response bodies. " + err);
      }
    }
    function remapIfAbortError(error, errorFactory) {
      var isAbortError = error && error.name === "AbortError";
      if (!isAbortError) {
        return error;
      }
      if (errorFactory) {
        return errorFactory();
      }
      return new errors.AbortError();
    }
    function responseHeadersAsObject(headers) {
      var result = {};
      for (var header of headers.entries()) {
        var key = header[0];
        var value = header[1];
        result[key] = value;
      }
      return result;
    }
    module.exports = FetchAdapter;
  }
});

// (disabled):os
var require_os = __commonJS({
  "(disabled):os"() {
  }
});

// node_modules/faunadb/src/_http/index.js
var require_http3 = __commonJS({
  "node_modules/faunadb/src/_http/index.js"(exports, module) {
    "use strict";
    var packageJson = require_package();
    var { getBrowserOsDetails } = require_util();
    var util = require_util();
    var errors = require_errors2();
    function HttpClient(options) {
      var isHttps = options.scheme === "https";
      if (!options.port) {
        options.port = isHttps ? 443 : 80;
      }
      var useHttp2Adapter = !options.fetch && util.isNodeEnv() && isHttp2Supported();
      this._adapter = useHttp2Adapter ? new (require_http2Adapter())({
        http2SessionIdleTime: options.http2SessionIdleTime
      }) : new (require_fetchAdapter())({
        isHttps,
        fetch: options.fetch,
        keepAlive: options.keepAlive
      });
      this._baseUrl = options.scheme + "://" + options.domain + ":" + options.port;
      this._secret = options.secret;
      this._headers = Object.assign({}, options.headers, getDefaultHeaders());
      this._queryTimeout = options.queryTimeout;
      this._lastSeen = null;
      this._timeout = Math.floor(options.timeout * 1e3);
    }
    HttpClient.prototype.getLastTxnTime = function() {
      return this._lastSeen;
    };
    HttpClient.prototype.syncLastTxnTime = function(time) {
      if (this._lastSeen == null || this._lastSeen < time) {
        this._lastSeen = time;
      }
    };
    HttpClient.prototype.close = function(opts) {
      return this._adapter.close(opts);
    };
    HttpClient.prototype.execute = function(options) {
      options = options || {};
      var invalidStreamConsumer = options.streamConsumer && (typeof options.streamConsumer.onData !== "function" || typeof options.streamConsumer.onError !== "function");
      if (invalidStreamConsumer) {
        return Promise.reject(new TypeError('Invalid "streamConsumer" provided'));
      }
      var secret = options.secret || this._secret;
      var queryTimeout = options.queryTimeout || this._queryTimeout;
      var headers = this._headers;
      headers["Authorization"] = secret && secretHeader(secret);
      headers["X-Last-Seen-Txn"] = this._lastSeen;
      headers["X-Query-Timeout"] = queryTimeout;
      return this._adapter.execute({
        origin: this._baseUrl,
        path: options.path || "/",
        query: options.query,
        method: options.method || "GET",
        headers: util.removeNullAndUndefinedValues(headers),
        body: options.body,
        signal: options.signal,
        timeout: this._timeout,
        streamConsumer: options.streamConsumer
      });
    };
    function secretHeader(secret) {
      return "Bearer " + secret;
    }
    function getDefaultHeaders() {
      var driverEnv = {
        driver: ["javascript", packageJson.version].join("-")
      };
      var isServiceWorker;
      try {
        isServiceWorker = global instanceof ServiceWorkerGlobalScope;
      } catch (error) {
        isServiceWorker = false;
      }
      try {
        if (util.isNodeEnv()) {
          driverEnv.runtime = ["nodejs", process.version].join("-");
          driverEnv.env = util.getNodeRuntimeEnv();
          var os = require_os();
          driverEnv.os = [os.platform(), os.release()].join("-");
        } else if (isServiceWorker) {
          driverEnv.runtime = "Service Worker";
        } else {
          driverEnv.runtime = util.getBrowserDetails();
          driverEnv.env = "browser";
          driverEnv.os = getBrowserOsDetails();
        }
      } catch (_) {
      }
      var headers = {
        "X-FaunaDB-API-Version": packageJson.apiVersion
      };
      if (util.isNodeEnv()) {
        headers["X-Driver-Env"] = Object.keys(driverEnv).map((key) => [key, driverEnv[key].toLowerCase()].join("=")).join("; ");
      }
      return headers;
    }
    function isHttp2Supported() {
      try {
        require_http2();
        return true;
      } catch (_) {
        return false;
      }
    }
    module.exports = {
      HttpClient,
      TimeoutError: errors.TimeoutError,
      AbortError: errors.AbortError
    };
  }
});

// node_modules/faunadb/src/stream.js
var require_stream = __commonJS({
  "node_modules/faunadb/src/stream.js"(exports, module) {
    "use strict";
    require_polyfill();
    var RequestResult = require_RequestResult();
    var errors = require_errors();
    var json = require_json();
    var http = require_http3();
    var q4 = require_query();
    var util = require_util();
    var DefaultEvents = ["start", "error", "version", "history_rewrite"];
    var DocumentStreamEvents = DefaultEvents.concat(["snapshot"]);
    function StreamClient(client, expression, options, onEvent) {
      options = util.applyDefaults(options, {
        fields: null
      });
      this._client = client;
      this._onEvent = onEvent;
      this._query = q4.wrap(expression);
      this._urlParams = options.fields ? { fields: options.fields.join(",") } : null;
      this._abort = new AbortController();
      this._state = "idle";
    }
    StreamClient.prototype.snapshot = function() {
      var self2 = this;
      self2._client.query(q4.Get(self2._query)).then(function(doc) {
        self2._onEvent({
          type: "snapshot",
          event: doc
        });
      }).catch(function(error) {
        self2._onEvent({
          type: "error",
          event: error
        });
      });
    };
    StreamClient.prototype.subscribe = function() {
      var self2 = this;
      if (self2._state === "idle") {
        self2._state = "open";
      } else {
        throw new Error("Subscription#start should not be called several times, consider instantiating a new stream instead.");
      }
      var body = JSON.stringify(self2._query);
      var startTime = Date.now();
      var buffer = "";
      function onResponse(response) {
        var endTime = Date.now();
        var parsed;
        try {
          parsed = json.parseJSON(response.body);
        } catch (_) {
          parsed = response.body;
        }
        var result = new RequestResult("POST", "stream", self2._urlParams, body, self2._query, response.body, parsed, response.status, response.headers, startTime, endTime);
        self2._client._handleRequestResult(response, result);
      }
      function onData(data) {
        var result = json.parseJSONStreaming(buffer + data);
        buffer = result.buffer;
        result.values.forEach(function(event) {
          if (event.txn !== void 0) {
            self2._client.syncLastTxnTime(event.txn);
          }
          if (event.event === "error") {
            onError(new errors.StreamErrorEvent(event));
          } else {
            self2._onEvent(event);
          }
        });
      }
      function onError(error) {
        if (error instanceof http.AbortError) {
          return;
        }
        self2._onEvent({
          type: "error",
          event: error
        });
      }
      self2._client._http.execute({
        method: "POST",
        path: "stream",
        body,
        query: self2._urlParams,
        signal: this._abort.signal,
        streamConsumer: {
          onError,
          onData
        }
      }).then(onResponse).catch(onError);
    };
    StreamClient.prototype.close = function() {
      if (this._state !== "closed") {
        this._state = "closed";
        this._abort.abort();
      }
    };
    function EventDispatcher(allowedEvents) {
      this._allowedEvents = allowedEvents;
      this._listeners = {};
    }
    EventDispatcher.prototype.on = function(type, callback) {
      if (this._allowedEvents.indexOf(type) === -1) {
        throw new Error("Unknown event type: " + type);
      }
      if (this._listeners[type] === void 0) {
        this._listeners[type] = [];
      }
      this._listeners[type].push(callback);
    };
    EventDispatcher.prototype.dispatch = function(event) {
      var listeners = this._listeners[event.type];
      if (!listeners) {
        return;
      }
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].call(null, event.event, event);
      }
    };
    function Subscription(client, dispatcher) {
      this._client = client;
      this._dispatcher = dispatcher;
    }
    Subscription.prototype.on = function(type, callback) {
      this._dispatcher.on(type, callback);
      return this;
    };
    Subscription.prototype.start = function() {
      this._client.subscribe();
      return this;
    };
    Subscription.prototype.close = function() {
      this._client.close();
    };
    function StreamAPI(client) {
      var api = function(expression, options) {
        var dispatcher = new EventDispatcher(DefaultEvents);
        var streamClient = new StreamClient(client, expression, options, function(event) {
          dispatcher.dispatch(event);
        });
        return new Subscription(streamClient, dispatcher);
      };
      api.document = function(expression, options) {
        var buffer = [];
        var buffering = true;
        var dispatcher = new EventDispatcher(DocumentStreamEvents);
        var streamClient = new StreamClient(client, expression, options, onEvent);
        function onEvent(event) {
          switch (event.type) {
            case "start":
              dispatcher.dispatch(event);
              streamClient.snapshot();
              break;
            case "snapshot":
              resume(event);
              break;
            case "error":
              dispatcher.dispatch(event);
              break;
            default:
              if (buffering) {
                buffer.push(event);
              } else {
                dispatcher.dispatch(event);
              }
          }
        }
        function resume(snapshotEvent) {
          dispatcher.dispatch(snapshotEvent);
          for (var i = 0; i < buffer.length; i++) {
            var bufferedEvent = buffer[i];
            if (bufferedEvent.txn > snapshotEvent.event.ts) {
              dispatcher.dispatch(bufferedEvent);
            }
          }
          buffering = false;
          buffer = null;
        }
        return new Subscription(streamClient, dispatcher);
      };
      return api;
    }
    module.exports = {
      StreamAPI
    };
  }
});

// node_modules/faunadb/src/Client.js
var require_Client = __commonJS({
  "node_modules/faunadb/src/Client.js"(exports, module) {
    "use strict";
    var packageJson = require_package();
    var PageHelper = require_PageHelper();
    var RequestResult = require_RequestResult();
    var errors = require_errors();
    var http = require_http3();
    var json = require_json();
    var query = require_query();
    var stream = require_stream();
    var util = require_util();
    var values = require_values();
    var notifyAboutNewVersion = util.notifyAboutNewVersion();
    function Client(options) {
      var http2SessionIdleTime = getHttp2SessionIdleTime();
      options = util.applyDefaults(options, {
        domain: "db.fauna.com",
        scheme: "https",
        port: null,
        secret: null,
        timeout: 60,
        observer: null,
        keepAlive: true,
        headers: {},
        fetch: void 0,
        queryTimeout: null,
        http2SessionIdleTime: http2SessionIdleTime.value,
        checkNewVersion: true
      });
      notifyAboutNewVersion(options.checkNewVersion);
      if (http2SessionIdleTime.shouldOverride) {
        options.http2SessionIdleTime = http2SessionIdleTime.value;
      }
      this._observer = options.observer;
      this._http = new http.HttpClient(options);
      this.stream = stream.StreamAPI(this);
    }
    Client.apiVersion = packageJson.apiVersion;
    Client.prototype.query = function(expression, options) {
      return this._execute("POST", "", query.wrap(expression), null, options);
    };
    Client.prototype.paginate = function(expression, params, options) {
      params = util.defaults(params, {});
      options = util.defaults(options, {});
      return new PageHelper(this, expression, params, options);
    };
    Client.prototype.ping = function(scope, timeout) {
      return this._execute("GET", "ping", null, { scope, timeout });
    };
    Client.prototype.getLastTxnTime = function() {
      return this._http.getLastTxnTime();
    };
    Client.prototype.syncLastTxnTime = function(time) {
      this._http.syncLastTxnTime(time);
    };
    Client.prototype.close = function(opts) {
      return this._http.close(opts);
    };
    Client.prototype._execute = function(method, path, data, query2, options) {
      query2 = util.defaults(query2, null);
      if (path instanceof values.Ref || util.checkInstanceHasProperty(path, "_isFaunaRef")) {
        path = path.value;
      }
      if (query2 !== null) {
        query2 = util.removeUndefinedValues(query2);
      }
      var startTime = Date.now();
      var self2 = this;
      var body = ["GET", "HEAD"].indexOf(method) >= 0 ? void 0 : JSON.stringify(data);
      return this._http.execute(Object.assign({}, options, {
        path,
        query: query2,
        method,
        body
      })).then(function(response) {
        var endTime = Date.now();
        var responseObject = json.parseJSON(response.body);
        var result = new RequestResult(method, path, query2, body, data, response.body, responseObject, response.status, response.headers, startTime, endTime);
        self2._handleRequestResult(response, result, options);
        return responseObject["resource"];
      });
    };
    Client.prototype._handleRequestResult = function(response, result, options) {
      var txnTimeHeaderKey = "x-txn-time";
      if (response.headers[txnTimeHeaderKey] != null) {
        this.syncLastTxnTime(parseInt(response.headers[txnTimeHeaderKey], 10));
      }
      var observers = [this._observer, options && options.observer];
      observers.forEach((observer) => {
        if (typeof observer == "function") {
          observer(result, this);
        }
      });
      errors.FaunaHTTPError.raiseForStatusCode(result);
    };
    function getHttp2SessionIdleTime() {
      var fromEnv = util.getEnvVariable("FAUNADB_HTTP2_SESSION_IDLE_TIME");
      var parsed = fromEnv === "Infinity" ? Infinity : parseInt(fromEnv, 10);
      var useEnvVar = !isNaN(parsed);
      return {
        shouldOverride: useEnvVar,
        value: useEnvVar ? parsed : 500
      };
    }
    module.exports = Client;
    module.exports.resetNotifyAboutNewVersion = function() {
      notifyAboutNewVersion = util.notifyAboutNewVersion();
    };
  }
});

// node_modules/faunadb/src/clientLogger.js
var require_clientLogger = __commonJS({
  "node_modules/faunadb/src/clientLogger.js"(exports, module) {
    "use strict";
    var json = require_json();
    function logger(loggerFunction) {
      return function(requestResult, client) {
        return loggerFunction(showRequestResult(requestResult), client);
      };
    }
    function showRequestResult(requestResult) {
      var query = requestResult.query, method = requestResult.method, path = requestResult.path, requestContent = requestResult.requestContent, responseHeaders = requestResult.responseHeaders, responseContent = requestResult.responseContent, statusCode = requestResult.statusCode, timeTaken = requestResult.timeTaken;
      var out = "";
      function log2(str) {
        out = out + str;
      }
      log2("Fauna " + method + " /" + path + _queryString(query) + "\n");
      if (requestContent != null) {
        log2("  Request JSON: " + _showJSON(requestContent) + "\n");
      }
      log2("  Response headers: " + _showJSON(responseHeaders) + "\n");
      log2("  Response JSON: " + _showJSON(responseContent) + "\n");
      log2("  Response (" + statusCode + "): Network latency " + timeTaken + "ms\n");
      return out;
    }
    function _indent(str) {
      var indentStr = "  ";
      return str.split("\n").join("\n" + indentStr);
    }
    function _showJSON(object) {
      return _indent(json.toJSON(object, true));
    }
    function _queryString(query) {
      if (query == null) {
        return "";
      }
      var keys = Object.keys(query);
      if (keys.length === 0) {
        return "";
      }
      var pairs = keys.map(function(key) {
        return key + "=" + query[key];
      });
      return "?" + pairs.join("&");
    }
    module.exports = {
      logger,
      showRequestResult
    };
  }
});

// node_modules/faunadb/index.js
var require_faunadb = __commonJS({
  "node_modules/faunadb/index.js"(exports, module) {
    var query = require_query();
    var util = require_util();
    var parseJSON = require_json().parseJSON;
    module.exports = util.mergeObjects({
      Client: require_Client(),
      Expr: require_Expr(),
      PageHelper: require_PageHelper(),
      RequestResult: require_RequestResult(),
      clientLogger: require_clientLogger(),
      errors: require_errors(),
      values: require_values(),
      query,
      parseJSON
    }, query);
  }
});

// app/fun/sort.ts
var sortOps = {
  number: (a, b) => a - b,
  "-number": (a, b) => -(a - b),
  gl: (a, b) => a >= 0 ? a - b : b - a,
  "abs(number)": (a, b) => Math.abs(a) - Math.abs(b),
  "-abs(number)": (a, b) => -(Math.abs(a) - Math.abs(b)),
  string: (a, b) => a.localeCompare(b),
  date: (a, b) => a.valueOf() - b.valueOf(),
  noop: () => 0
};
Array.prototype.sortBy = function(sortBy) {
  return sort(this, sortBy);
};
function sort(items, sortBy) {
  const keys = Object.keys(sortBy);
  return [...items].sort((a, b) => {
    let result = 0;
    keys.some((k) => !!(result = sortOps[sortBy[k]](a[k], b[k])));
    return result;
  });
}

// app/fun/setMode.ts
var modes = {
  light_mode: "light",
  dark_mode: "dark",
  holiday_mode: "holiday"
};
function setMode(mode) {
  if (!mode)
    mode = localStorage.getItem("mode") || modes.light_mode;
  localStorage.setItem("mode", mode);
  document.body.classList.remove(...Object.values(modes));
  document.body.classList.add(mode);
}

// app/globals.ts
var import_faunadb = __toModule(require_faunadb());

// app/fun/globalState.ts
var globalState;
function forceGlobalState() {
  return globalState = globalState || JSON.parse(localStorage.getItem("__GLOBAL_STATE__") || "{}");
}
function setGlobalState(key, value) {
  const state = forceGlobalState();
  const [head, ...tail] = key.split(".");
  if (!tail.length) {
    state[key] = value;
  } else {
    let o = state[head] = state[head] || {};
    tail.forEach((k) => o[k] = o[k] || {});
    o[tail[tail.length - 1]] = value;
  }
  localStorage.setItem("__GLOBAL_STATE__", JSON.stringify(state));
}
function getGlobalState(key) {
  const state = forceGlobalState();
  const [head, ...tail] = key.split(".");
  if (!tail.length)
    return state[head];
  let value = state[head];
  if (!!value && typeof value !== "object")
    throw `key does not define an object: ${head}`;
  tail.every((k) => typeof value === "object" && (value = value[k]) && true);
  return value;
}

// app/globals.ts
var _accessKeys;
var GlobalModel = class {
  constructor() {
    __privateAdd(this, _accessKeys, {
      FAUNADB_SERVER_SECRET: localStorage.getItem("FAUNADB_SERVER_SECRET"),
      FAUNADB_DOMAIN: "db.us.fauna.com"
    });
    this.CURRENT_USER = localStorage.getItem("user");
    this.TAXRATE = 0.01 * (getGlobalState("TAX_RATE") || 6);
    this.BATCH_SIZE = getGlobalState("BATCH_SIZE") || 10;
    this.primaryContact = getGlobalState("primaryContact") || {
      companyName: "Little Light Show",
      fullName: "Nathan Alix",
      addressLine1: "4 Andrea Lane",
      addressLine2: "Greenville, SC 29615",
      telephone: ""
    };
    if (!__privateGet(this, _accessKeys).FAUNADB_SERVER_SECRET) {
      const secret = prompt("Provide the FAUNADB_SERVER_SECRET") || "";
      __privateGet(this, _accessKeys).FAUNADB_SERVER_SECRET = secret;
      localStorage.setItem("FAUNADB_SERVER_SECRET", secret);
    }
  }
  createClient() {
    return new import_faunadb.default.Client({
      secret: __privateGet(this, _accessKeys).FAUNADB_SERVER_SECRET,
      domain: __privateGet(this, _accessKeys).FAUNADB_DOMAIN
    });
  }
};
_accessKeys = new WeakMap();
var globals = new GlobalModel();
var createClient = () => globals.createClient();
var isDebug = location.href.includes("localhost") || location.search.includes("debug");
var isOffline = () => getGlobalState("work_offline") === true;
function isNetlifyBuildContext() {
  return 0 <= location.href.indexOf("netlify");
}
var CONTEXT = isNetlifyBuildContext() ? "NETLIFY" : "dev";

// app/services/validateAccessToken.ts
var import_faunadb2 = __toModule(require_faunadb());
async function validate() {
  const client = createClient();
  await client.ping();
}

// app/router.ts
var routes = {
  home: () => "/index.html",
  identity: ({ context, target }) => `/app/identity.html?target=${target}&context=${context}`,
  createInvoice: () => `/app/invoice/invoice.html`,
  invoice: (id) => `/app/invoice/invoice.html?id=${id}`,
  allInvoices: () => `/app/invoice/invoices.html`,
  inventory: (id) => `/app/inventory/index.html?id=${id}`,
  allInventoryItems: () => `/app/inventory/index.html`,
  allLedgers: () => `/app/gl/index.html?print=all`,
  printLedger: (id) => `/app/gl/index.html?print=${id}`,
  createLedger: () => "/app/gl/index.html",
  editLedger: (id) => `/app/gl/index.html?id=${id}`,
  dashboard: () => "/app/index.html",
  admin: () => "/app/admin/index.html",
  gl: {
    byAccount: (id) => `/app/gl/index.html?account=${id}`
  }
};

// app/ux/Toaster.ts
var DEFAULT_DELAY = 5e3;
var Toaster = class {
  toast(options) {
    let target = document.querySelector("#toaster");
    if (!target) {
      target = document.createElement("div");
      target.id = "toaster";
      target.classList.add("toaster", "border", "rounded-top", "fixed", "bottom", "right");
      document.body.appendChild(target);
    }
    const message = document.createElement("div");
    message.classList.add(options.mode || "error", "padding", "margin");
    message.innerHTML = options.message;
    message.addEventListener("click", () => message.remove());
    setTimeout(() => message.remove(), DEFAULT_DELAY);
    target.insertBefore(message, null);
  }
};
var toaster = new Toaster();
function toast(message, options) {
  if (!options)
    options = { mode: "info" };
  console.info(message, options);
  toaster.toast({
    message,
    ...options
  });
}
function reportError(message) {
  toast(message + "", {
    mode: "error"
  });
}

// app/identify.ts
async function identify() {
  if (!localStorage.getItem("user")) {
    location.href = routes.identity({
      target: location.href,
      context: CONTEXT
    });
    return false;
  }
  try {
    await validate();
  } catch (ex) {
    reportError(ex);
    return false;
  }
  return true;
}

// app/fun/on.ts
function log(...message) {
  if (!isDebug)
    return;
  console.log(...message);
}
function on(domNode, eventName, cb) {
  domNode.addEventListener(eventName, cb);
}
function trigger(domNode, eventName) {
  log("trigger", eventName);
  domNode.dispatchEvent(new Event(eventName));
}

// app/fun/behavior/input.ts
function selectOnFocus(element) {
  on(element, "focus", () => element.select());
}
function formatAsCurrency(input) {
  input.step = "0.01";
  input.addEventListener("change", () => {
    const textValue = input.value;
    const numericValue = input.valueAsNumber?.toFixed(2);
    if (textValue != numericValue) {
      input.value = numericValue;
    }
  });
}
function formatTrim(input) {
  const change = () => {
    const textValue = (input.value || "").trim();
    if (textValue != input.value) {
      input.value = textValue;
    }
  };
  change();
  input.addEventListener("change", change);
}

// app/fun/behavior/form.ts
function extendNumericInputBehaviors(form) {
  const numberInput = Array.from(form.querySelectorAll("input[type=number]"));
  numberInput.forEach(selectOnFocus);
  const currencyInput = numberInput.filter((i) => i.classList.contains("currency"));
  currencyInput.forEach(formatAsCurrency);
}
function extendTextInputBehaviors(form) {
  const textInput = Array.from(form.querySelectorAll("input[type=text]"));
  textInput.forEach(selectOnFocus);
  const trimInput = textInput.filter((i) => i.classList.contains("trim"));
  trimInput.forEach(formatTrim);
}

// app/fun/hookupTriggers.ts
function hookupTriggers(domNode) {
  domNode.querySelectorAll("[data-event]").forEach((eventItem) => {
    const eventName = eventItem.dataset["event"];
    if (!eventName)
      throw "item must define a data-event";
    const isInput = isInputElement(eventItem);
    const inputType = getInputType(eventItem);
    const isButton = isButtonElement(eventItem, isInput);
    const isCheckbox = isCheckboxInput(eventItem);
    if (isButton)
      on(eventItem, "click", () => {
        trigger(domNode, eventName);
      });
    else if (isCheckbox)
      on(eventItem, "click", () => {
        const checked = eventItem.checked;
        trigger(domNode, eventName + (checked ? ":yes" : ":no"));
      });
    else if (isInput)
      on(eventItem, "change", () => {
        trigger(domNode, eventName);
      });
    else
      throw `data-event not supported for this item: ${eventItem.outerHTML}`;
  });
  domNode.querySelectorAll("[data-bind]").forEach((eventItem) => {
    const bindTo = eventItem.dataset["bind"];
    if (!bindTo)
      throw "item must define a data-bind";
    const valueInfo = getGlobalState(bindTo);
    if (isCheckboxInput(eventItem)) {
      eventItem.checked = valueInfo === true;
      on(eventItem, "change", () => {
        setGlobalState(bindTo, eventItem.checked);
      });
    } else if (isNumericInputElement(eventItem)) {
      const item = eventItem;
      item.valueAsNumber = valueInfo || 0;
      on(eventItem, "change", () => {
        setGlobalState(bindTo, item.valueAsNumber);
      });
    } else if (isInputElement(eventItem)) {
      const item = eventItem;
      item.value = valueInfo || "";
      on(eventItem, "change", () => {
        setGlobalState(bindTo, item.value);
      });
    } else {
      throw `unimplemented data-bind on element: ${eventItem.outerHTML}`;
    }
  });
}
function isCheckboxInput(eventItem) {
  return isInputElement(eventItem) && getInputType(eventItem) === "checkbox";
}
function isButtonElement(eventItem, isInput) {
  return eventItem.tagName === "BUTTON" || isInput && getInputType(eventItem) === "button";
}
function getInputType(eventItem) {
  return isInputElement(eventItem) && eventItem.type;
}
function isInputElement(eventItem) {
  return eventItem.tagName === "INPUT";
}
function isNumericInputElement(item) {
  return isInputElement(item) && getInputType(item) === "number";
}

// app/dom.ts
function asStyle(o) {
  if (typeof o === "string")
    return o;
  return Object.keys(o).map((k) => `${k}:${o[k]}`).join(";");
}
function defaults(a, ...b) {
  b.filter((b2) => !!b2).forEach((b2) => {
    Object.keys(b2).filter((k) => a[k] === void 0).forEach((k) => a[k] = b2[k]);
  });
  return a;
}
var rules = {
  style: asStyle
};
var default_args = {
  button: {
    type: "button"
  }
};
function dom(tag, args, ...children) {
  if (typeof tag === "string") {
    let element = document.createElement(tag);
    if (default_args[tag]) {
      args = defaults(args ?? {}, default_args[tag]);
    }
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = rules[key] ? rules[key](args[key]) : args[key];
        if (typeof value === "string") {
          element.setAttribute(key, value);
        } else if (value instanceof Function) {
          element.addEventListener(key, value);
        } else {
          element.setAttribute(key, value + "");
        }
      });
    }
    let addChildren = (children2) => {
      children2 && children2.forEach((c) => {
        if (typeof c === "string") {
          element.appendChild(document.createTextNode(c));
        } else if (c instanceof HTMLElement) {
          element.appendChild(c);
        } else if (c instanceof Array) {
          addChildren(c);
        } else {
          console.log("addChildren cannot add to dom node", c);
        }
      });
    };
    children && addChildren(children);
    return element;
  }
  {
    let element = tag(args);
    let addChildren = (children2) => {
      children2 && children2.forEach((c) => {
        if (typeof c === "string" || c instanceof HTMLElement) {
          element.setContent(c);
        } else if (c instanceof Array) {
          addChildren(c);
        } else if (typeof c === "object") {
          element.addChild(c);
        } else {
          console.log("addChildren cannot add to widget", c);
        }
      });
    };
    children && addChildren(children);
    return element;
  }
}

// app/ux/injectLabels.ts
function injectLabels(domNode) {
  const inputsToWrap = Array.from(domNode.querySelectorAll("input.auto-label"));
  inputsToWrap.forEach((input) => {
    const label = dom("label");
    label.className = "border padding rounded wrap " + input.className;
    label.innerText = input.placeholder;
    input.parentElement.insertBefore(label, input);
    label.appendChild(input);
  });
}

// app/services/admin.ts
var import_faunadb5 = __toModule(require_faunadb());

// app/fun/ticksInSeconds.ts
function ticksInSeconds(ticks) {
  return ticks / 1e3;
}

// app/services/ServiceCache.ts
var MAX_AGE = getGlobalState("CACHE_MAX_AGE") || 0;
var ServiceCache = class {
  constructor(options) {
    this.options = options;
    options.maxAge = options.maxAge || MAX_AGE;
    this.table = options.table;
    const raw = localStorage.getItem(`table_${this.table}`);
    if (!raw) {
      this.data = [];
      this.lastWrite = 0;
    } else {
      const info = JSON.parse(raw);
      this.lastWrite = info.lastWrite;
      this.data = info.data;
    }
  }
  lastWriteTime() {
    return this.lastWrite;
  }
  renew() {
    this.lastWrite = Date.now();
    this.save();
  }
  save() {
    localStorage.setItem(`table_${this.table}`, JSON.stringify({
      lastWrite: this.lastWrite,
      data: this.data
    }));
  }
  deleteLineItem(id) {
    const index = this.data.findIndex((i) => i.id === id);
    if (-1 < index)
      this.data.splice(index, 1);
    this.save();
  }
  updateLineItem(lineItem) {
    const index = this.data.findIndex((i) => i.id === lineItem.id);
    if (-1 < index) {
      this.data[index] = lineItem;
    } else {
      this.data.push(lineItem);
    }
    this.save();
  }
  expired() {
    const age = ticksInSeconds(Date.now() - this.lastWrite);
    return this.options.maxAge < age;
  }
  getById(id) {
    return this.data.find((item) => item.id === id);
  }
  get() {
    return this.data;
  }
};

// app/services/StorageModel.ts
var import_faunadb4 = __toModule(require_faunadb());

// app/services/getDatabaseTime.ts
var import_faunadb3 = __toModule(require_faunadb());
async function getDatabaseTime() {
  const client = createClient();
  const response = await client.query(import_faunadb3.query.Now());
  return new Date(response.value).valueOf();
}

// app/services/StorageModel.ts
var { BATCH_SIZE, CURRENT_USER } = globals;
var StorageModel = class {
  constructor(options) {
    this.options = options;
    this.tableName = options.tableName;
    this.cache = new ServiceCache({
      table: options.tableName,
      maxAge: options.maxAge
    });
  }
  isOffline() {
    return this.options.offline || isOffline();
  }
  async loadLatestData(args) {
    const size = BATCH_SIZE;
    const upperBound = args.before_date;
    const lowerBound = args.after_date;
    let after = null;
    const client = createClient();
    const result = [];
    while (true) {
      const response = await client.query(import_faunadb4.query.Map(import_faunadb4.query.Paginate(import_faunadb4.query.Filter(import_faunadb4.query.Match(import_faunadb4.query.Index(`${this.tableName}_updates`)), import_faunadb4.query.Lambda("item", import_faunadb4.query.And(import_faunadb4.query.LTE(lowerBound, import_faunadb4.query.Select([0], import_faunadb4.query.Var("item"))), import_faunadb4.query.LT(import_faunadb4.query.Select([0], import_faunadb4.query.Var("item")), upperBound)))), after ? {
        size,
        after
      } : { size }), import_faunadb4.query.Lambda("item", import_faunadb4.query.Get(import_faunadb4.query.Select([1], import_faunadb4.query.Var("item"))))));
      const dataToImport = response.data.map((item) => ({
        ...item.data,
        id: item.ref.value.id
      }));
      result.push(...dataToImport);
      dataToImport.forEach((item) => {
        if (!item.id)
          throw `item must have an id`;
        const currentItem = this.cache.getById(item.id);
        if (currentItem && this.isUpdated(currentItem)) {
          toast(`item changed remotely and locally: ${item.id}`);
        }
        if (!!item.delete_date) {
          this.cache.deleteLineItem(item.id);
        } else {
          this.cache.updateLineItem(item);
        }
      });
      this.cache.renew();
      dataToImport.length && setFutureSyncTime(this.tableName, dataToImport[dataToImport.length - 1].update_date);
      if (dataToImport.length < size)
        break;
      after = response.after;
    }
    return result;
  }
  async synchronize() {
    if (!CURRENT_USER)
      throw "user must be signed in";
    if (this.isOffline())
      throw "cannot synchronize in offline mode";
    const priorSyncTime = getPriorSyncTime(this.tableName);
    const currentSyncTime = await getDatabaseTime();
    const dataToExport = this.cache.get().filter((item) => item.update_date && item.update_date > priorSyncTime);
    await this.loadLatestData({
      after_date: priorSyncTime,
      before_date: currentSyncTime
    });
    this.cache.get().filter((item) => !!item.delete_date).forEach(async (item) => {
      if (!item.id)
        throw "all items must have an id";
      if (isOfflineId(item.id)) {
        this.cache.deleteLineItem(item.id);
      } else {
        await this.removeItem(item.id);
      }
    });
    dataToExport.forEach(async (item) => {
      await this.upsertItem(item);
    });
    setFutureSyncTime(this.tableName, currentSyncTime);
    this.cache.renew();
  }
  async removeItem(id) {
    if (!CURRENT_USER)
      throw "user must be signed in";
    if (isOfflineId(id)) {
      this.cache.deleteLineItem(id);
      return;
    }
    if (this.isOffline()) {
      const item = this.cache.getById(id);
      if (!item)
        throw "cannot remove an item that is not already there";
      item.delete_date = Date.now();
      this.cache.updateLineItem(item);
      return;
    }
    const client = createClient();
    await client.query(import_faunadb4.query.Replace(import_faunadb4.query.Ref(import_faunadb4.query.Collection(this.tableName), id), {
      data: {
        id,
        user: CURRENT_USER,
        update_date: import_faunadb4.query.ToMillis(import_faunadb4.query.Now()),
        delete_date: import_faunadb4.query.ToMillis(import_faunadb4.query.Now())
      }
    }));
    this.cache.deleteLineItem(id);
  }
  async getItem(id) {
    if (!CURRENT_USER)
      throw "user must be signed in";
    if (!this.isOffline() && this.cache.expired()) {
      await this.synchronize();
    } else {
      if (!!this.cache.getById(id)) {
        this.cache.renew();
      } else {
        await this.synchronize();
      }
    }
    const result = this.cache.getById(id);
    if (!result)
      throw `unable to load item: ${this.tableName} ${id}`;
    if (!!result.delete_date)
      throw "item marked for deletion";
    return result;
  }
  async upsertItem(data) {
    if (!CURRENT_USER)
      throw "user must be signed in";
    const client = createClient();
    data.id = data.id || `${this.tableName}:${Date.now().toFixed()}`;
    data.update_date = Date.now();
    this.cache.updateLineItem(data);
    if (this.isOffline()) {
      return;
    }
    const offlineId = data.id && isOfflineId(data.id) ? data.id : "";
    if (offlineId)
      data.id = "";
    if (!data.id) {
      const result = await client.query(import_faunadb4.query.Create(import_faunadb4.query.Collection(this.tableName), {
        data: {
          ...data,
          user: CURRENT_USER,
          create_date: import_faunadb4.query.ToMillis(import_faunadb4.query.Now()),
          update_date: import_faunadb4.query.ToMillis(import_faunadb4.query.Now())
        }
      }));
      {
        offlineId && this.cache.deleteLineItem(offlineId);
        data.id = result.ref.value.id;
        this.cache.updateLineItem(data);
      }
      return;
    }
    await client.query(import_faunadb4.query.Replace(import_faunadb4.query.Ref(import_faunadb4.query.Collection(this.tableName), data.id), {
      data: {
        ...data,
        user: CURRENT_USER,
        update_date: import_faunadb4.query.ToMillis(import_faunadb4.query.Now())
      }
    }));
    this.cache.updateLineItem(data);
  }
  isUpdated(data) {
    return (data.update_date || 0) > this.cache.lastWriteTime();
  }
  async getItems() {
    if (!CURRENT_USER)
      throw "user must be signed in";
    if (this.cache.expired() && !this.isOffline()) {
      await this.synchronize();
    } else {
      this.cache.renew();
    }
    return this.cache.get().filter((item) => !item.delete_date);
  }
};
function isOfflineId(itemId) {
  return !!itemId && "9" < itemId[0];
}
function getPriorSyncTime(tableName) {
  return getGlobalState(`timeOfLastSynchronization_${tableName}`) || 0;
}
function setFutureSyncTime(tableName, syncTime) {
  setGlobalState(`timeOfLastSynchronization_${tableName}`, syncTime);
}

// app/services/gl.ts
var LEDGER_TABLE = "general_ledger";
var ledgerModel = new StorageModel({
  tableName: LEDGER_TABLE,
  offline: false
});

// app/fun/asCurrency.ts
function asCurrency(value) {
  return (value || 0).toFixed(2);
}

// app/services/invoices.ts
var INVOICE_TABLE = "invoices";
var invoiceModel = new StorageModel({
  tableName: INVOICE_TABLE,
  offline: false
});

// app/services/inventory.ts
var INVENTORY_TABLE = "inventory";
var InventoryModel = class extends StorageModel {
  async upgradeTo104() {
    const deleteTheseItems = this.cache.get().filter((i) => i.id && i.id === i.code).map((i) => i.id);
    deleteTheseItems.forEach((id) => this.cache.deleteLineItem(id));
  }
};
var inventoryModel = new InventoryModel({
  tableName: INVENTORY_TABLE,
  offline: false
});

// app/index.ts
var { primaryContact } = globals;
var VERSION = "1.0.4";
async function init() {
  const domNode = document.body;
  setInitialState({ VERSION: "1.0.3" });
  setInitialState({
    TAX_RATE: 6,
    CACHE_MAX_AGE: 600,
    BATCH_SIZE: 64,
    work_offline: true,
    VERSION
  });
  setInitialState({ primaryContact });
  await upgradeFromCurrentVersion();
  await identify();
  injectLabels(domNode);
  extendNumericInputBehaviors(domNode);
  hookupTriggers(domNode);
  setMode();
}
function setInitialState(data) {
  Object.keys(data).forEach((key) => {
    const value = getGlobalState(key);
    if (isUndefined(value)) {
      setGlobalState(key, data[key]);
    }
  });
}
function isUndefined(value) {
  return typeof value === "undefined";
}
async function upgradeFromCurrentVersion() {
  const currentVersion = getGlobalState("VERSION");
  switch (currentVersion) {
    case "1.0.3":
      await upgradeFrom103To104();
      break;
    case "1.0.4":
      break;
    default:
      throw `unexpected version: ${currentVersion}`;
  }
}
async function upgradeFrom103To104() {
  inventoryModel.upgradeTo104();
  await inventoryModel.synchronize();
  setGlobalState("VERSION", VERSION);
  toast("upgraded from 1.0.3 to 1.0.4");
}

// app/fun/dom.ts
function moveChildrenBefore(items, report) {
  while (items.firstChild)
    report.before(items.firstChild);
}

// app/inventory/templates/inventory.tsx
function create(inventoryItems) {
  const report = /* @__PURE__ */ dom("div", {
    class: "grid-6"
  }, /* @__PURE__ */ dom("div", {
    class: "col-1-4 line"
  }, "Item Code"), /* @__PURE__ */ dom("div", {
    class: "col-5 line currency"
  }, "Price"), /* @__PURE__ */ dom("div", {
    class: "col-last line taxrate"
  }, "Tax Rate"), /* @__PURE__ */ dom("div", {
    class: "placeholder lineitems"
  }));
  const lineItems = inventoryItems.map((item) => {
    return /* @__PURE__ */ dom("div", null, /* @__PURE__ */ dom("div", {
      class: "col-1-4"
    }, /* @__PURE__ */ dom("a", {
      href: routes.inventory(item.id)
    }, item.code)), /* @__PURE__ */ dom("div", {
      class: "col-5 currency"
    }, asCurrency(item.price)), /* @__PURE__ */ dom("div", {
      class: "col-last taxrate"
    }, asTaxRate(item.taxrate)), /* @__PURE__ */ dom("div", {
      class: "col-1-last text smaller"
    }, item.description || ""));
  });
  const lineItemTarget = report.querySelector(".lineitems.placeholder");
  lineItems.forEach((i) => moveChildrenBefore(i, lineItemTarget));
  return report;
}
function asTaxRate(v) {
  return v ? v.toFixed(2) : "0";
}

// app/inventory/templates/inventory-item.tsx
function create2(inventoryItem) {
  if (!inventoryItem)
    return /* @__PURE__ */ dom("form", null, "Item not found");
  return /* @__PURE__ */ dom("form", {
    class: "grid-6"
  }, /* @__PURE__ */ dom("div", {
    class: "col-1-c line"
  }, "Item Code"), /* @__PURE__ */ dom("div", {
    class: "col-b line currency"
  }, "Price"), /* @__PURE__ */ dom("div", {
    class: "col-a line taxrate"
  }, "Tax Rate"), /* @__PURE__ */ dom("input", {
    class: "col-1-c trim text",
    name: "code",
    type: "text",
    value: inventoryItem.code
  }), /* @__PURE__ */ dom("input", {
    class: "col-b currency",
    name: "price",
    type: "number",
    value: inventoryItem.price
  }), /* @__PURE__ */ dom("input", {
    class: "col-a taxrate",
    name: "taxrate",
    type: "number",
    value: inventoryItem.taxrate
  }), /* @__PURE__ */ dom("div", {
    class: "col-1-a line"
  }, "Description"), /* @__PURE__ */ dom("input", {
    class: "col-1-a text trim",
    name: "description",
    type: "text",
    value: inventoryItem.description || inventoryItem.code
  }), /* @__PURE__ */ dom("button", {
    class: "bold button col-1",
    "data-event": "submit"
  }, "Save"), /* @__PURE__ */ dom("button", {
    class: "button col-a",
    "data-event": "delete"
  }, "Delete"));
}

// app/inventory/inventory.ts
async function init2(target = document.body) {
  await init();
  const inventoryItems = await inventoryModel.getItems();
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has("id")) {
    const id = queryParams.get("id");
    const inventoryItem = {
      ...await inventoryModel.getItem(id)
    };
    const formDom = create2(inventoryItem);
    target.appendChild(formDom);
    on(formDom, "submit", async () => {
      if (!formDom.checkValidity()) {
        formDom.reportValidity();
        return false;
      }
      const priorCode = inventoryItem.code;
      inventoryItem.code = getValue(formDom, "code", inventoryItem.code);
      await renameInvoiceItems(priorCode, inventoryItem.code);
      inventoryItem.description = getValue(formDom, "description", inventoryItem.description);
      inventoryItem.price = getValue(formDom, "price", inventoryItem.price);
      try {
        await inventoryModel.upsertItem(inventoryItem);
      } catch (ex) {
        reportError(ex);
      }
      toast("Changes saved");
    });
    on(formDom, "delete", async () => {
      try {
        await inventoryModel.removeItem(inventoryItem.id);
      } catch (ex) {
        reportError(ex);
      }
      toast("Item Deleted");
    });
    hookupTriggers(formDom);
    extendNumericInputBehaviors(formDom);
    extendTextInputBehaviors(formDom);
  } else {
    const report = create(inventoryItems.sortBy({
      code: "string"
    }));
    target.appendChild(report);
  }
}
function getValue(form, name, defaultValue) {
  const value = form[name].value;
  if (value) {
    if (typeof defaultValue === "number")
      return parseFloat(value);
    return value;
  }
  return defaultValue;
}
async function renameInvoiceItems(priorCode, code) {
  if (priorCode === code)
    return;
  const invoices = await invoiceModel.getItems();
  for (let invoice of invoices) {
    const itemsToRename = invoice.items?.filter((item) => item.item == priorCode);
    if (!!itemsToRename?.length) {
      for (let item of itemsToRename) {
        item.item = code;
        item.description = item.description || priorCode.trim();
        await invoiceModel.upsertItem(invoice);
        toast(`updated invoice ${invoice.id}`);
      }
    }
  }
}
export {
  init2 as init
};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
//# sourceMappingURL=inventory.js.map
