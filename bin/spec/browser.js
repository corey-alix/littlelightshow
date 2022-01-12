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

// test/node_modules/assertion-error/index.js
var require_assertion_error = __commonJS({
  "test/node_modules/assertion-error/index.js"(exports, module) {
    function exclude() {
      var excludes = [].slice.call(arguments);
      function excludeProps(res, obj) {
        Object.keys(obj).forEach(function(key) {
          if (!~excludes.indexOf(key))
            res[key] = obj[key];
        });
      }
      return function extendExclude() {
        var args = [].slice.call(arguments), i = 0, res = {};
        for (; i < args.length; i++) {
          excludeProps(res, args[i]);
        }
        return res;
      };
    }
    module.exports = AssertionError2;
    function AssertionError2(message, _props, ssf) {
      var extend = exclude("name", "message", "stack", "constructor", "toJSON"), props = extend(_props || {});
      this.message = message || "Unspecified AssertionError";
      this.showDiff = false;
      for (var key in props) {
        this[key] = props[key];
      }
      ssf = ssf || AssertionError2;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ssf);
      } else {
        try {
          throw new Error();
        } catch (e) {
          this.stack = e.stack;
        }
      }
    }
    AssertionError2.prototype = Object.create(Error.prototype);
    AssertionError2.prototype.name = "AssertionError";
    AssertionError2.prototype.constructor = AssertionError2;
    AssertionError2.prototype.toJSON = function(stack) {
      var extend = exclude("constructor", "toJSON", "stack"), props = extend({ name: this.name }, this);
      if (stack !== false && this.stack) {
        props.stack = this.stack;
      }
      return props;
    };
  }
});

// test/node_modules/pathval/index.js
var require_pathval = __commonJS({
  "test/node_modules/pathval/index.js"(exports, module) {
    "use strict";
    function hasProperty(obj, name) {
      if (typeof obj === "undefined" || obj === null) {
        return false;
      }
      return name in Object(obj);
    }
    function parsePath(path) {
      var str = path.replace(/([^\\])\[/g, "$1.[");
      var parts = str.match(/(\\\.|[^.]+?)+/g);
      return parts.map(function mapMatches(value) {
        if (value === "constructor" || value === "__proto__" || value === "prototype") {
          return {};
        }
        var regexp = /^\[(\d+)\]$/;
        var mArr = regexp.exec(value);
        var parsed = null;
        if (mArr) {
          parsed = { i: parseFloat(mArr[1]) };
        } else {
          parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
        }
        return parsed;
      });
    }
    function internalGetPathValue(obj, parsed, pathDepth) {
      var temporaryValue = obj;
      var res = null;
      pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
      for (var i = 0; i < pathDepth; i++) {
        var part = parsed[i];
        if (temporaryValue) {
          if (typeof part.p === "undefined") {
            temporaryValue = temporaryValue[part.i];
          } else {
            temporaryValue = temporaryValue[part.p];
          }
          if (i === pathDepth - 1) {
            res = temporaryValue;
          }
        }
      }
      return res;
    }
    function internalSetPathValue(obj, val, parsed) {
      var tempObj = obj;
      var pathDepth = parsed.length;
      var part = null;
      for (var i = 0; i < pathDepth; i++) {
        var propName = null;
        var propVal = null;
        part = parsed[i];
        if (i === pathDepth - 1) {
          propName = typeof part.p === "undefined" ? part.i : part.p;
          tempObj[propName] = val;
        } else if (typeof part.p !== "undefined" && tempObj[part.p]) {
          tempObj = tempObj[part.p];
        } else if (typeof part.i !== "undefined" && tempObj[part.i]) {
          tempObj = tempObj[part.i];
        } else {
          var next = parsed[i + 1];
          propName = typeof part.p === "undefined" ? part.i : part.p;
          propVal = typeof next.p === "undefined" ? [] : {};
          tempObj[propName] = propVal;
          tempObj = tempObj[propName];
        }
      }
    }
    function getPathInfo(obj, path) {
      var parsed = parsePath(path);
      var last = parsed[parsed.length - 1];
      var info = {
        parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
        name: last.p || last.i,
        value: internalGetPathValue(obj, parsed)
      };
      info.exists = hasProperty(info.parent, info.name);
      return info;
    }
    function getPathValue(obj, path) {
      var info = getPathInfo(obj, path);
      return info.value;
    }
    function setPathValue(obj, path, val) {
      var parsed = parsePath(path);
      internalSetPathValue(obj, val, parsed);
      return obj;
    }
    module.exports = {
      hasProperty,
      getPathInfo,
      getPathValue,
      setPathValue
    };
  }
});

// test/node_modules/chai/lib/chai/utils/flag.js
var require_flag = __commonJS({
  "test/node_modules/chai/lib/chai/utils/flag.js"(exports, module) {
    module.exports = function flag(obj, key, value) {
      var flags = obj.__flags || (obj.__flags = Object.create(null));
      if (arguments.length === 3) {
        flags[key] = value;
      } else {
        return flags[key];
      }
    };
  }
});

// test/node_modules/chai/lib/chai/utils/test.js
var require_test = __commonJS({
  "test/node_modules/chai/lib/chai/utils/test.js"(exports, module) {
    var flag = require_flag();
    module.exports = function test(obj, args) {
      var negate = flag(obj, "negate"), expr = args[0];
      return negate ? !expr : expr;
    };
  }
});

// test/node_modules/type-detect/type-detect.js
var require_type_detect = __commonJS({
  "test/node_modules/type-detect/type-detect.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.typeDetect = factory();
    })(exports, function() {
      "use strict";
      var promiseExists = typeof Promise === "function";
      var globalObject = typeof self === "object" ? self : global;
      var symbolExists = typeof Symbol !== "undefined";
      var mapExists = typeof Map !== "undefined";
      var setExists = typeof Set !== "undefined";
      var weakMapExists = typeof WeakMap !== "undefined";
      var weakSetExists = typeof WeakSet !== "undefined";
      var dataViewExists = typeof DataView !== "undefined";
      var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
      var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
      var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
      var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
      var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf((/* @__PURE__ */ new Set()).entries());
      var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf((/* @__PURE__ */ new Map()).entries());
      var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
      var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
      var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
      var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
      var toStringLeftSliceLength = 8;
      var toStringRightSliceLength = -1;
      function typeDetect(obj) {
        var typeofObj = typeof obj;
        if (typeofObj !== "object") {
          return typeofObj;
        }
        if (obj === null) {
          return "null";
        }
        if (obj === globalObject) {
          return "global";
        }
        if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
          return "Array";
        }
        if (typeof window === "object" && window !== null) {
          if (typeof window.location === "object" && obj === window.location) {
            return "Location";
          }
          if (typeof window.document === "object" && obj === window.document) {
            return "Document";
          }
          if (typeof window.navigator === "object") {
            if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
              return "MimeTypeArray";
            }
            if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
              return "PluginArray";
            }
          }
          if ((typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") && obj instanceof window.HTMLElement) {
            if (obj.tagName === "BLOCKQUOTE") {
              return "HTMLQuoteElement";
            }
            if (obj.tagName === "TD") {
              return "HTMLTableDataCellElement";
            }
            if (obj.tagName === "TH") {
              return "HTMLTableHeaderCellElement";
            }
          }
        }
        var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
        if (typeof stringTag === "string") {
          return stringTag;
        }
        var objPrototype = Object.getPrototypeOf(obj);
        if (objPrototype === RegExp.prototype) {
          return "RegExp";
        }
        if (objPrototype === Date.prototype) {
          return "Date";
        }
        if (promiseExists && objPrototype === Promise.prototype) {
          return "Promise";
        }
        if (setExists && objPrototype === Set.prototype) {
          return "Set";
        }
        if (mapExists && objPrototype === Map.prototype) {
          return "Map";
        }
        if (weakSetExists && objPrototype === WeakSet.prototype) {
          return "WeakSet";
        }
        if (weakMapExists && objPrototype === WeakMap.prototype) {
          return "WeakMap";
        }
        if (dataViewExists && objPrototype === DataView.prototype) {
          return "DataView";
        }
        if (mapExists && objPrototype === mapIteratorPrototype) {
          return "Map Iterator";
        }
        if (setExists && objPrototype === setIteratorPrototype) {
          return "Set Iterator";
        }
        if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
          return "Array Iterator";
        }
        if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
          return "String Iterator";
        }
        if (objPrototype === null) {
          return "Object";
        }
        return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
      }
      return typeDetect;
    });
  }
});

// test/node_modules/chai/lib/chai/utils/expectTypes.js
var require_expectTypes = __commonJS({
  "test/node_modules/chai/lib/chai/utils/expectTypes.js"(exports, module) {
    var AssertionError2 = require_assertion_error();
    var flag = require_flag();
    var type = require_type_detect();
    module.exports = function expectTypes(obj, types) {
      var flagMsg = flag(obj, "message");
      var ssfi = flag(obj, "ssfi");
      flagMsg = flagMsg ? flagMsg + ": " : "";
      obj = flag(obj, "object");
      types = types.map(function(t) {
        return t.toLowerCase();
      });
      types.sort();
      var str = types.map(function(t, index) {
        var art = ~["a", "e", "i", "o", "u"].indexOf(t.charAt(0)) ? "an" : "a";
        var or = types.length > 1 && index === types.length - 1 ? "or " : "";
        return or + art + " " + t;
      }).join(", ");
      var objType = type(obj).toLowerCase();
      if (!types.some(function(expected) {
        return objType === expected;
      })) {
        throw new AssertionError2(flagMsg + "object tested must be " + str + ", but " + objType + " given", void 0, ssfi);
      }
    };
  }
});

// test/node_modules/chai/lib/chai/utils/getActual.js
var require_getActual = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getActual.js"(exports, module) {
    module.exports = function getActual(obj, args) {
      return args.length > 4 ? args[4] : obj._obj;
    };
  }
});

// test/node_modules/get-func-name/index.js
var require_get_func_name = __commonJS({
  "test/node_modules/get-func-name/index.js"(exports, module) {
    "use strict";
    var toString = Function.prototype.toString;
    var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
    function getFuncName(aFunc) {
      if (typeof aFunc !== "function") {
        return null;
      }
      var name = "";
      if (typeof Function.prototype.name === "undefined" && typeof aFunc.name === "undefined") {
        var match = toString.call(aFunc).match(functionNameMatch);
        if (match) {
          name = match[1];
        }
      } else {
        name = aFunc.name;
      }
      return name;
    }
    module.exports = getFuncName;
  }
});

// test/node_modules/chai/lib/chai/utils/getProperties.js
var require_getProperties = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getProperties.js"(exports, module) {
    module.exports = function getProperties(object) {
      var result = Object.getOwnPropertyNames(object);
      function addProperty(property) {
        if (result.indexOf(property) === -1) {
          result.push(property);
        }
      }
      var proto = Object.getPrototypeOf(object);
      while (proto !== null) {
        Object.getOwnPropertyNames(proto).forEach(addProperty);
        proto = Object.getPrototypeOf(proto);
      }
      return result;
    };
  }
});

// test/node_modules/chai/lib/chai/utils/getEnumerableProperties.js
var require_getEnumerableProperties = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getEnumerableProperties.js"(exports, module) {
    module.exports = function getEnumerableProperties(object) {
      var result = [];
      for (var name in object) {
        result.push(name);
      }
      return result;
    };
  }
});

// test/node_modules/chai/lib/chai/config.js
var require_config = __commonJS({
  "test/node_modules/chai/lib/chai/config.js"(exports, module) {
    module.exports = {
      includeStack: false,
      showDiff: true,
      truncateThreshold: 40,
      useProxy: true,
      proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"]
    };
  }
});

// test/node_modules/chai/lib/chai/utils/inspect.js
var require_inspect = __commonJS({
  "test/node_modules/chai/lib/chai/utils/inspect.js"(exports, module) {
    var getName = require_get_func_name();
    var getProperties = require_getProperties();
    var getEnumerableProperties = require_getEnumerableProperties();
    var config2 = require_config();
    module.exports = inspect;
    function inspect(obj, showHidden, depth, colors) {
      var ctx = {
        showHidden,
        seen: [],
        stylize: function(str) {
          return str;
        }
      };
      return formatValue(ctx, obj, typeof depth === "undefined" ? 2 : depth);
    }
    var isDOMElement = function(object) {
      if (typeof HTMLElement === "object") {
        return object instanceof HTMLElement;
      } else {
        return object && typeof object === "object" && "nodeType" in object && object.nodeType === 1 && typeof object.nodeName === "string";
      }
    };
    function formatValue(ctx, value, recurseTimes) {
      if (value && typeof value.inspect === "function" && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (typeof ret !== "string") {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      if (isDOMElement(value)) {
        if ("outerHTML" in value) {
          return value.outerHTML;
        } else {
          try {
            if (document.xmlVersion) {
              var xmlSerializer = new XMLSerializer();
              return xmlSerializer.serializeToString(value);
            } else {
              var ns = "http://www.w3.org/1999/xhtml";
              var container = document.createElementNS(ns, "_");
              container.appendChild(value.cloneNode(false));
              var html = container.innerHTML.replace("><", ">" + value.innerHTML + "<");
              container.innerHTML = "";
              return html;
            }
          } catch (err) {
          }
        }
      }
      var visibleKeys = getEnumerableProperties(value);
      var keys = ctx.showHidden ? getProperties(value) : visibleKeys;
      var name, nameSuffix;
      if (keys.length === 0 || isError(value) && (keys.length === 1 && keys[0] === "stack" || keys.length === 2 && keys[0] === "description" && keys[1] === "stack")) {
        if (typeof value === "function") {
          name = getName(value);
          nameSuffix = name ? ": " + name : "";
          return ctx.stylize("[Function" + nameSuffix + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toUTCString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, typedArray = false, braces = ["{", "}"];
      if (isTypedArray(value)) {
        typedArray = true;
        braces = ["[", "]"];
      }
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (typeof value === "function") {
        name = getName(value);
        nameSuffix = name ? ": " + name : "";
        base = " [Function" + nameSuffix + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        return formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else if (typedArray) {
        return formatTypedArray(value);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    function formatPrimitive(ctx, value) {
      switch (typeof value) {
        case "undefined":
          return ctx.stylize("undefined", "undefined");
        case "string":
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        case "number":
          if (value === 0 && 1 / value === -Infinity) {
            return ctx.stylize("-0", "number");
          }
          return ctx.stylize("" + value, "number");
        case "boolean":
          return ctx.stylize("" + value, "boolean");
        case "symbol":
          return ctx.stylize(value.toString(), "symbol");
        case "bigint":
          return ctx.stylize(value.toString() + "n", "bigint");
      }
      if (value === null) {
        return ctx.stylize("null", "null");
      }
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (Object.prototype.hasOwnProperty.call(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
        }
      });
      return output;
    }
    function formatTypedArray(value) {
      var str = "[ ";
      for (var i = 0; i < value.length; ++i) {
        if (str.length >= config2.truncateThreshold - 7) {
          str += "...";
          break;
        }
        str += value[i] + ", ";
      }
      str += " ]";
      if (str.indexOf(",  ]") !== -1) {
        str = str.replace(",  ]", " ]");
      }
      return str;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name;
      var propDescriptor = Object.getOwnPropertyDescriptor(value, key);
      var str;
      if (propDescriptor) {
        if (propDescriptor.get) {
          if (propDescriptor.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (propDescriptor.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
      }
      if (visibleKeys.indexOf(key) < 0) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = formatValue(ctx, value[key], null);
          } else {
            str = formatValue(ctx, value[key], recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line) {
                return "  " + line;
              }).join("\n").substr(2);
            } else {
              str = "\n" + str.split("\n").map(function(line) {
                return "   " + line;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (typeof name === "undefined") {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var length = output.reduce(function(prev, cur) {
        return prev + cur.length + 1;
      }, 0);
      if (length > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    function isTypedArray(ar) {
      return typeof ar === "object" && /\w+Array]$/.test(objectToString(ar));
    }
    function isArray(ar) {
      return Array.isArray(ar) || typeof ar === "object" && objectToString(ar) === "[object Array]";
    }
    function isRegExp(re) {
      return typeof re === "object" && objectToString(re) === "[object RegExp]";
    }
    function isDate(d) {
      return typeof d === "object" && objectToString(d) === "[object Date]";
    }
    function isError(e) {
      return typeof e === "object" && objectToString(e) === "[object Error]";
    }
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// test/node_modules/chai/lib/chai/utils/objDisplay.js
var require_objDisplay = __commonJS({
  "test/node_modules/chai/lib/chai/utils/objDisplay.js"(exports, module) {
    var inspect = require_inspect();
    var config2 = require_config();
    module.exports = function objDisplay(obj) {
      var str = inspect(obj), type = Object.prototype.toString.call(obj);
      if (config2.truncateThreshold && str.length >= config2.truncateThreshold) {
        if (type === "[object Function]") {
          return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
        } else if (type === "[object Array]") {
          return "[ Array(" + obj.length + ") ]";
        } else if (type === "[object Object]") {
          var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
          return "{ Object (" + kstr + ") }";
        } else {
          return str;
        }
      } else {
        return str;
      }
    };
  }
});

// test/node_modules/chai/lib/chai/utils/getMessage.js
var require_getMessage = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getMessage.js"(exports, module) {
    var flag = require_flag();
    var getActual = require_getActual();
    var objDisplay = require_objDisplay();
    module.exports = function getMessage(obj, args) {
      var negate = flag(obj, "negate"), val = flag(obj, "object"), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, "message");
      if (typeof msg === "function")
        msg = msg();
      msg = msg || "";
      msg = msg.replace(/#\{this\}/g, function() {
        return objDisplay(val);
      }).replace(/#\{act\}/g, function() {
        return objDisplay(actual);
      }).replace(/#\{exp\}/g, function() {
        return objDisplay(expected);
      });
      return flagMsg ? flagMsg + ": " + msg : msg;
    };
  }
});

// test/node_modules/chai/lib/chai/utils/transferFlags.js
var require_transferFlags = __commonJS({
  "test/node_modules/chai/lib/chai/utils/transferFlags.js"(exports, module) {
    module.exports = function transferFlags(assertion, object, includeAll) {
      var flags = assertion.__flags || (assertion.__flags = Object.create(null));
      if (!object.__flags) {
        object.__flags = Object.create(null);
      }
      includeAll = arguments.length === 3 ? includeAll : true;
      for (var flag in flags) {
        if (includeAll || flag !== "object" && flag !== "ssfi" && flag !== "lockSsfi" && flag != "message") {
          object.__flags[flag] = flags[flag];
        }
      }
    };
  }
});

// test/node_modules/deep-eql/index.js
var require_deep_eql = __commonJS({
  "test/node_modules/deep-eql/index.js"(exports, module) {
    "use strict";
    var type = require_type_detect();
    function FakeMap() {
      this._key = "chai/deep-eql__" + Math.random() + Date.now();
    }
    FakeMap.prototype = {
      get: function getMap(key) {
        return key[this._key];
      },
      set: function setMap(key, value) {
        if (Object.isExtensible(key)) {
          Object.defineProperty(key, this._key, {
            value,
            configurable: true
          });
        }
      }
    };
    var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
    function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
      if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return null;
      }
      var leftHandMap = memoizeMap.get(leftHandOperand);
      if (leftHandMap) {
        var result = leftHandMap.get(rightHandOperand);
        if (typeof result === "boolean") {
          return result;
        }
      }
      return null;
    }
    function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
      if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return;
      }
      var leftHandMap = memoizeMap.get(leftHandOperand);
      if (leftHandMap) {
        leftHandMap.set(rightHandOperand, result);
      } else {
        leftHandMap = new MemoizeMap();
        leftHandMap.set(rightHandOperand, result);
        memoizeMap.set(leftHandOperand, leftHandMap);
      }
    }
    module.exports = deepEqual;
    module.exports.MemoizeMap = MemoizeMap;
    function deepEqual(leftHandOperand, rightHandOperand, options) {
      if (options && options.comparator) {
        return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
      }
      var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
      if (simpleResult !== null) {
        return simpleResult;
      }
      return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
    }
    function simpleEqual(leftHandOperand, rightHandOperand) {
      if (leftHandOperand === rightHandOperand) {
        return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
      }
      if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
        return true;
      }
      if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return false;
      }
      return null;
    }
    function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
      options = options || {};
      options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
      var comparator = options && options.comparator;
      var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
      if (memoizeResultLeft !== null) {
        return memoizeResultLeft;
      }
      var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
      if (memoizeResultRight !== null) {
        return memoizeResultRight;
      }
      if (comparator) {
        var comparatorResult = comparator(leftHandOperand, rightHandOperand);
        if (comparatorResult === false || comparatorResult === true) {
          memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
          return comparatorResult;
        }
        var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
        if (simpleResult !== null) {
          return simpleResult;
        }
      }
      var leftHandType = type(leftHandOperand);
      if (leftHandType !== type(rightHandOperand)) {
        memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
        return false;
      }
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
      var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
      return result;
    }
    function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
      switch (leftHandType) {
        case "String":
        case "Number":
        case "Boolean":
        case "Date":
          return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
        case "Promise":
        case "Symbol":
        case "function":
        case "WeakMap":
        case "WeakSet":
        case "Error":
          return leftHandOperand === rightHandOperand;
        case "Arguments":
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "Array":
          return iterableEqual(leftHandOperand, rightHandOperand, options);
        case "RegExp":
          return regexpEqual(leftHandOperand, rightHandOperand);
        case "Generator":
          return generatorEqual(leftHandOperand, rightHandOperand, options);
        case "DataView":
          return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
        case "ArrayBuffer":
          return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
        case "Set":
          return entriesEqual(leftHandOperand, rightHandOperand, options);
        case "Map":
          return entriesEqual(leftHandOperand, rightHandOperand, options);
        default:
          return objectEqual(leftHandOperand, rightHandOperand, options);
      }
    }
    function regexpEqual(leftHandOperand, rightHandOperand) {
      return leftHandOperand.toString() === rightHandOperand.toString();
    }
    function entriesEqual(leftHandOperand, rightHandOperand, options) {
      if (leftHandOperand.size !== rightHandOperand.size) {
        return false;
      }
      if (leftHandOperand.size === 0) {
        return true;
      }
      var leftHandItems = [];
      var rightHandItems = [];
      leftHandOperand.forEach(function gatherEntries(key, value) {
        leftHandItems.push([key, value]);
      });
      rightHandOperand.forEach(function gatherEntries(key, value) {
        rightHandItems.push([key, value]);
      });
      return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
    }
    function iterableEqual(leftHandOperand, rightHandOperand, options) {
      var length = leftHandOperand.length;
      if (length !== rightHandOperand.length) {
        return false;
      }
      if (length === 0) {
        return true;
      }
      var index = -1;
      while (++index < length) {
        if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
          return false;
        }
      }
      return true;
    }
    function generatorEqual(leftHandOperand, rightHandOperand, options) {
      return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
    }
    function hasIteratorFunction(target) {
      return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
    }
    function getIteratorEntries(target) {
      if (hasIteratorFunction(target)) {
        try {
          return getGeneratorEntries(target[Symbol.iterator]());
        } catch (iteratorError) {
          return [];
        }
      }
      return [];
    }
    function getGeneratorEntries(generator) {
      var generatorResult = generator.next();
      var accumulator = [generatorResult.value];
      while (generatorResult.done === false) {
        generatorResult = generator.next();
        accumulator.push(generatorResult.value);
      }
      return accumulator;
    }
    function getEnumerableKeys(target) {
      var keys = [];
      for (var key in target) {
        keys.push(key);
      }
      return keys;
    }
    function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
      var length = keys.length;
      if (length === 0) {
        return true;
      }
      for (var i = 0; i < length; i += 1) {
        if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
          return false;
        }
      }
      return true;
    }
    function objectEqual(leftHandOperand, rightHandOperand, options) {
      var leftHandKeys = getEnumerableKeys(leftHandOperand);
      var rightHandKeys = getEnumerableKeys(rightHandOperand);
      if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
        leftHandKeys.sort();
        rightHandKeys.sort();
        if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
          return false;
        }
        return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
      }
      var leftHandEntries = getIteratorEntries(leftHandOperand);
      var rightHandEntries = getIteratorEntries(rightHandOperand);
      if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
        leftHandEntries.sort();
        rightHandEntries.sort();
        return iterableEqual(leftHandEntries, rightHandEntries, options);
      }
      if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
        return true;
      }
      return false;
    }
    function isPrimitive(value) {
      return value === null || typeof value !== "object";
    }
  }
});

// test/node_modules/chai/lib/chai/utils/isProxyEnabled.js
var require_isProxyEnabled = __commonJS({
  "test/node_modules/chai/lib/chai/utils/isProxyEnabled.js"(exports, module) {
    var config2 = require_config();
    module.exports = function isProxyEnabled() {
      return config2.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
    };
  }
});

// test/node_modules/chai/lib/chai/utils/addProperty.js
var require_addProperty = __commonJS({
  "test/node_modules/chai/lib/chai/utils/addProperty.js"(exports, module) {
    var chai2 = require_chai();
    var flag = require_flag();
    var isProxyEnabled = require_isProxyEnabled();
    var transferFlags = require_transferFlags();
    module.exports = function addProperty(ctx, name, getter) {
      getter = getter === void 0 ? function() {
      } : getter;
      Object.defineProperty(ctx, name, {
        get: function propertyGetter() {
          if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
            flag(this, "ssfi", propertyGetter);
          }
          var result = getter.call(this);
          if (result !== void 0)
            return result;
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        },
        configurable: true
      });
    };
  }
});

// test/node_modules/chai/lib/chai/utils/addLengthGuard.js
var require_addLengthGuard = __commonJS({
  "test/node_modules/chai/lib/chai/utils/addLengthGuard.js"(exports, module) {
    var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {
    }, "length");
    module.exports = function addLengthGuard(fn, assertionName, isChainable) {
      if (!fnLengthDesc.configurable)
        return fn;
      Object.defineProperty(fn, "length", {
        get: function() {
          if (isChainable) {
            throw Error("Invalid Chai property: " + assertionName + '.length. Due to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
          }
          throw Error("Invalid Chai property: " + assertionName + '.length. See docs for proper usage of "' + assertionName + '".');
        }
      });
      return fn;
    };
  }
});

// test/node_modules/chai/lib/chai/utils/proxify.js
var require_proxify = __commonJS({
  "test/node_modules/chai/lib/chai/utils/proxify.js"(exports, module) {
    var config2 = require_config();
    var flag = require_flag();
    var getProperties = require_getProperties();
    var isProxyEnabled = require_isProxyEnabled();
    var builtins = ["__flags", "__methods", "_obj", "assert"];
    module.exports = function proxify(obj, nonChainableMethodName) {
      if (!isProxyEnabled())
        return obj;
      return new Proxy(obj, {
        get: function proxyGetter(target, property) {
          if (typeof property === "string" && config2.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
            if (nonChainableMethodName) {
              throw Error("Invalid Chai property: " + nonChainableMethodName + "." + property + '. See docs for proper usage of "' + nonChainableMethodName + '".');
            }
            var suggestion = null;
            var suggestionDistance = 4;
            getProperties(target).forEach(function(prop) {
              if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
                var dist = stringDistanceCapped(property, prop, suggestionDistance);
                if (dist < suggestionDistance) {
                  suggestion = prop;
                  suggestionDistance = dist;
                }
              }
            });
            if (suggestion !== null) {
              throw Error("Invalid Chai property: " + property + '. Did you mean "' + suggestion + '"?');
            } else {
              throw Error("Invalid Chai property: " + property);
            }
          }
          if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) {
            flag(target, "ssfi", proxyGetter);
          }
          return Reflect.get(target, property);
        }
      });
    };
    function stringDistanceCapped(strA, strB, cap) {
      if (Math.abs(strA.length - strB.length) >= cap) {
        return cap;
      }
      var memo = [];
      for (var i = 0; i <= strA.length; i++) {
        memo[i] = Array(strB.length + 1).fill(0);
        memo[i][0] = i;
      }
      for (var j = 0; j < strB.length; j++) {
        memo[0][j] = j;
      }
      for (var i = 1; i <= strA.length; i++) {
        var ch = strA.charCodeAt(i - 1);
        for (var j = 1; j <= strB.length; j++) {
          if (Math.abs(i - j) >= cap) {
            memo[i][j] = cap;
            continue;
          }
          memo[i][j] = Math.min(memo[i - 1][j] + 1, memo[i][j - 1] + 1, memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1));
        }
      }
      return memo[strA.length][strB.length];
    }
  }
});

// test/node_modules/chai/lib/chai/utils/addMethod.js
var require_addMethod = __commonJS({
  "test/node_modules/chai/lib/chai/utils/addMethod.js"(exports, module) {
    var addLengthGuard = require_addLengthGuard();
    var chai2 = require_chai();
    var flag = require_flag();
    var proxify = require_proxify();
    var transferFlags = require_transferFlags();
    module.exports = function addMethod(ctx, name, method) {
      var methodWrapper = function() {
        if (!flag(this, "lockSsfi")) {
          flag(this, "ssfi", methodWrapper);
        }
        var result = method.apply(this, arguments);
        if (result !== void 0)
          return result;
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
      addLengthGuard(methodWrapper, name, false);
      ctx[name] = proxify(methodWrapper, name);
    };
  }
});

// test/node_modules/chai/lib/chai/utils/overwriteProperty.js
var require_overwriteProperty = __commonJS({
  "test/node_modules/chai/lib/chai/utils/overwriteProperty.js"(exports, module) {
    var chai2 = require_chai();
    var flag = require_flag();
    var isProxyEnabled = require_isProxyEnabled();
    var transferFlags = require_transferFlags();
    module.exports = function overwriteProperty(ctx, name, getter) {
      var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function() {
      };
      if (_get && typeof _get.get === "function")
        _super = _get.get;
      Object.defineProperty(ctx, name, {
        get: function overwritingPropertyGetter() {
          if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
            flag(this, "ssfi", overwritingPropertyGetter);
          }
          var origLockSsfi = flag(this, "lockSsfi");
          flag(this, "lockSsfi", true);
          var result = getter(_super).call(this);
          flag(this, "lockSsfi", origLockSsfi);
          if (result !== void 0) {
            return result;
          }
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        },
        configurable: true
      });
    };
  }
});

// test/node_modules/chai/lib/chai/utils/overwriteMethod.js
var require_overwriteMethod = __commonJS({
  "test/node_modules/chai/lib/chai/utils/overwriteMethod.js"(exports, module) {
    var addLengthGuard = require_addLengthGuard();
    var chai2 = require_chai();
    var flag = require_flag();
    var proxify = require_proxify();
    var transferFlags = require_transferFlags();
    module.exports = function overwriteMethod(ctx, name, method) {
      var _method = ctx[name], _super = function() {
        throw new Error(name + " is not a function");
      };
      if (_method && typeof _method === "function")
        _super = _method;
      var overwritingMethodWrapper = function() {
        if (!flag(this, "lockSsfi")) {
          flag(this, "ssfi", overwritingMethodWrapper);
        }
        var origLockSsfi = flag(this, "lockSsfi");
        flag(this, "lockSsfi", true);
        var result = method(_super).apply(this, arguments);
        flag(this, "lockSsfi", origLockSsfi);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
      addLengthGuard(overwritingMethodWrapper, name, false);
      ctx[name] = proxify(overwritingMethodWrapper, name);
    };
  }
});

// test/node_modules/chai/lib/chai/utils/addChainableMethod.js
var require_addChainableMethod = __commonJS({
  "test/node_modules/chai/lib/chai/utils/addChainableMethod.js"(exports, module) {
    var addLengthGuard = require_addLengthGuard();
    var chai2 = require_chai();
    var flag = require_flag();
    var proxify = require_proxify();
    var transferFlags = require_transferFlags();
    var canSetPrototype = typeof Object.setPrototypeOf === "function";
    var testFn = function() {
    };
    var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
      var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
      if (typeof propDesc !== "object")
        return true;
      return !propDesc.configurable;
    });
    var call = Function.prototype.call;
    var apply = Function.prototype.apply;
    module.exports = function addChainableMethod(ctx, name, method, chainingBehavior) {
      if (typeof chainingBehavior !== "function") {
        chainingBehavior = function() {
        };
      }
      var chainableBehavior = {
        method,
        chainingBehavior
      };
      if (!ctx.__methods) {
        ctx.__methods = {};
      }
      ctx.__methods[name] = chainableBehavior;
      Object.defineProperty(ctx, name, {
        get: function chainableMethodGetter() {
          chainableBehavior.chainingBehavior.call(this);
          var chainableMethodWrapper = function() {
            if (!flag(this, "lockSsfi")) {
              flag(this, "ssfi", chainableMethodWrapper);
            }
            var result = chainableBehavior.method.apply(this, arguments);
            if (result !== void 0) {
              return result;
            }
            var newAssertion = new chai2.Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
          };
          addLengthGuard(chainableMethodWrapper, name, true);
          if (canSetPrototype) {
            var prototype = Object.create(this);
            prototype.call = call;
            prototype.apply = apply;
            Object.setPrototypeOf(chainableMethodWrapper, prototype);
          } else {
            var asserterNames = Object.getOwnPropertyNames(ctx);
            asserterNames.forEach(function(asserterName) {
              if (excludeNames.indexOf(asserterName) !== -1) {
                return;
              }
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
              Object.defineProperty(chainableMethodWrapper, asserterName, pd);
            });
          }
          transferFlags(this, chainableMethodWrapper);
          return proxify(chainableMethodWrapper);
        },
        configurable: true
      });
    };
  }
});

// test/node_modules/chai/lib/chai/utils/overwriteChainableMethod.js
var require_overwriteChainableMethod = __commonJS({
  "test/node_modules/chai/lib/chai/utils/overwriteChainableMethod.js"(exports, module) {
    var chai2 = require_chai();
    var transferFlags = require_transferFlags();
    module.exports = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
      var chainableBehavior = ctx.__methods[name];
      var _chainingBehavior = chainableBehavior.chainingBehavior;
      chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
        var result = chainingBehavior(_chainingBehavior).call(this);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
      var _method = chainableBehavior.method;
      chainableBehavior.method = function overwritingChainableMethodWrapper() {
        var result = method(_method).apply(this, arguments);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
    };
  }
});

// test/node_modules/chai/lib/chai/utils/compareByInspect.js
var require_compareByInspect = __commonJS({
  "test/node_modules/chai/lib/chai/utils/compareByInspect.js"(exports, module) {
    var inspect = require_inspect();
    module.exports = function compareByInspect(a, b) {
      return inspect(a) < inspect(b) ? -1 : 1;
    };
  }
});

// test/node_modules/chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js
var require_getOwnEnumerablePropertySymbols = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js"(exports, module) {
    module.exports = function getOwnEnumerablePropertySymbols(obj) {
      if (typeof Object.getOwnPropertySymbols !== "function")
        return [];
      return Object.getOwnPropertySymbols(obj).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
      });
    };
  }
});

// test/node_modules/chai/lib/chai/utils/getOwnEnumerableProperties.js
var require_getOwnEnumerableProperties = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getOwnEnumerableProperties.js"(exports, module) {
    var getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
    module.exports = function getOwnEnumerableProperties(obj) {
      return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
    };
  }
});

// test/node_modules/check-error/index.js
var require_check_error = __commonJS({
  "test/node_modules/check-error/index.js"(exports, module) {
    "use strict";
    function compatibleInstance(thrown, errorLike) {
      return errorLike instanceof Error && thrown === errorLike;
    }
    function compatibleConstructor(thrown, errorLike) {
      if (errorLike instanceof Error) {
        return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
      } else if (errorLike.prototype instanceof Error || errorLike === Error) {
        return thrown.constructor === errorLike || thrown instanceof errorLike;
      }
      return false;
    }
    function compatibleMessage(thrown, errMatcher) {
      var comparisonString = typeof thrown === "string" ? thrown : thrown.message;
      if (errMatcher instanceof RegExp) {
        return errMatcher.test(comparisonString);
      } else if (typeof errMatcher === "string") {
        return comparisonString.indexOf(errMatcher) !== -1;
      }
      return false;
    }
    var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
    function getFunctionName(constructorFn) {
      var name = "";
      if (typeof constructorFn.name === "undefined") {
        var match = String(constructorFn).match(functionNameMatch);
        if (match) {
          name = match[1];
        }
      } else {
        name = constructorFn.name;
      }
      return name;
    }
    function getConstructorName(errorLike) {
      var constructorName = errorLike;
      if (errorLike instanceof Error) {
        constructorName = getFunctionName(errorLike.constructor);
      } else if (typeof errorLike === "function") {
        constructorName = getFunctionName(errorLike).trim() || getFunctionName(new errorLike());
      }
      return constructorName;
    }
    function getMessage(errorLike) {
      var msg = "";
      if (errorLike && errorLike.message) {
        msg = errorLike.message;
      } else if (typeof errorLike === "string") {
        msg = errorLike;
      }
      return msg;
    }
    module.exports = {
      compatibleInstance,
      compatibleConstructor,
      compatibleMessage,
      getMessage,
      getConstructorName
    };
  }
});

// test/node_modules/chai/lib/chai/utils/isNaN.js
var require_isNaN = __commonJS({
  "test/node_modules/chai/lib/chai/utils/isNaN.js"(exports, module) {
    function isNaN2(value) {
      return value !== value;
    }
    module.exports = Number.isNaN || isNaN2;
  }
});

// test/node_modules/chai/lib/chai/utils/getOperator.js
var require_getOperator = __commonJS({
  "test/node_modules/chai/lib/chai/utils/getOperator.js"(exports, module) {
    var type = require_type_detect();
    var flag = require_flag();
    function isObjectType(obj) {
      var objectType = type(obj);
      var objectTypes = ["Array", "Object", "function"];
      return objectTypes.indexOf(objectType) !== -1;
    }
    module.exports = function getOperator(obj, args) {
      var operator = flag(obj, "operator");
      var negate = flag(obj, "negate");
      var expected = args[3];
      var msg = negate ? args[2] : args[1];
      if (operator) {
        return operator;
      }
      if (typeof msg === "function")
        msg = msg();
      msg = msg || "";
      if (!msg) {
        return void 0;
      }
      if (/\shave\s/.test(msg)) {
        return void 0;
      }
      var isObject = isObjectType(expected);
      if (/\snot\s/.test(msg)) {
        return isObject ? "notDeepStrictEqual" : "notStrictEqual";
      }
      return isObject ? "deepStrictEqual" : "strictEqual";
    };
  }
});

// test/node_modules/chai/lib/chai/utils/index.js
var require_utils = __commonJS({
  "test/node_modules/chai/lib/chai/utils/index.js"(exports) {
    var pathval = require_pathval();
    exports.test = require_test();
    exports.type = require_type_detect();
    exports.expectTypes = require_expectTypes();
    exports.getMessage = require_getMessage();
    exports.getActual = require_getActual();
    exports.inspect = require_inspect();
    exports.objDisplay = require_objDisplay();
    exports.flag = require_flag();
    exports.transferFlags = require_transferFlags();
    exports.eql = require_deep_eql();
    exports.getPathInfo = pathval.getPathInfo;
    exports.hasProperty = pathval.hasProperty;
    exports.getName = require_get_func_name();
    exports.addProperty = require_addProperty();
    exports.addMethod = require_addMethod();
    exports.overwriteProperty = require_overwriteProperty();
    exports.overwriteMethod = require_overwriteMethod();
    exports.addChainableMethod = require_addChainableMethod();
    exports.overwriteChainableMethod = require_overwriteChainableMethod();
    exports.compareByInspect = require_compareByInspect();
    exports.getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
    exports.getOwnEnumerableProperties = require_getOwnEnumerableProperties();
    exports.checkError = require_check_error();
    exports.proxify = require_proxify();
    exports.addLengthGuard = require_addLengthGuard();
    exports.isProxyEnabled = require_isProxyEnabled();
    exports.isNaN = require_isNaN();
    exports.getOperator = require_getOperator();
  }
});

// test/node_modules/chai/lib/chai/assertion.js
var require_assertion = __commonJS({
  "test/node_modules/chai/lib/chai/assertion.js"(exports, module) {
    var config2 = require_config();
    module.exports = function(_chai, util2) {
      var AssertionError2 = _chai.AssertionError, flag = util2.flag;
      _chai.Assertion = Assertion2;
      function Assertion2(obj, msg, ssfi, lockSsfi) {
        flag(this, "ssfi", ssfi || Assertion2);
        flag(this, "lockSsfi", lockSsfi);
        flag(this, "object", obj);
        flag(this, "message", msg);
        return util2.proxify(this);
      }
      Object.defineProperty(Assertion2, "includeStack", {
        get: function() {
          console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
          return config2.includeStack;
        },
        set: function(value) {
          console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
          config2.includeStack = value;
        }
      });
      Object.defineProperty(Assertion2, "showDiff", {
        get: function() {
          console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
          return config2.showDiff;
        },
        set: function(value) {
          console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
          config2.showDiff = value;
        }
      });
      Assertion2.addProperty = function(name, fn) {
        util2.addProperty(this.prototype, name, fn);
      };
      Assertion2.addMethod = function(name, fn) {
        util2.addMethod(this.prototype, name, fn);
      };
      Assertion2.addChainableMethod = function(name, fn, chainingBehavior) {
        util2.addChainableMethod(this.prototype, name, fn, chainingBehavior);
      };
      Assertion2.overwriteProperty = function(name, fn) {
        util2.overwriteProperty(this.prototype, name, fn);
      };
      Assertion2.overwriteMethod = function(name, fn) {
        util2.overwriteMethod(this.prototype, name, fn);
      };
      Assertion2.overwriteChainableMethod = function(name, fn, chainingBehavior) {
        util2.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
      };
      Assertion2.prototype.assert = function(expr, msg, negateMsg, expected, _actual, showDiff) {
        var ok = util2.test(this, arguments);
        if (showDiff !== false)
          showDiff = true;
        if (expected === void 0 && _actual === void 0)
          showDiff = false;
        if (config2.showDiff !== true)
          showDiff = false;
        if (!ok) {
          msg = util2.getMessage(this, arguments);
          var actual = util2.getActual(this, arguments);
          var assertionErrorObjectProperties = {
            actual,
            expected,
            showDiff
          };
          var operator = util2.getOperator(this, arguments);
          if (operator) {
            assertionErrorObjectProperties.operator = operator;
          }
          throw new AssertionError2(msg, assertionErrorObjectProperties, config2.includeStack ? this.assert : flag(this, "ssfi"));
        }
      };
      Object.defineProperty(Assertion2.prototype, "_obj", {
        get: function() {
          return flag(this, "object");
        },
        set: function(val) {
          flag(this, "object", val);
        }
      });
    };
  }
});

// test/node_modules/chai/lib/chai/core/assertions.js
var require_assertions = __commonJS({
  "test/node_modules/chai/lib/chai/core/assertions.js"(exports, module) {
    module.exports = function(chai2, _) {
      var Assertion2 = chai2.Assertion, AssertionError2 = chai2.AssertionError, flag = _.flag;
      [
        "to",
        "be",
        "been",
        "is",
        "and",
        "has",
        "have",
        "with",
        "that",
        "which",
        "at",
        "of",
        "same",
        "but",
        "does",
        "still",
        "also"
      ].forEach(function(chain) {
        Assertion2.addProperty(chain);
      });
      Assertion2.addProperty("not", function() {
        flag(this, "negate", true);
      });
      Assertion2.addProperty("deep", function() {
        flag(this, "deep", true);
      });
      Assertion2.addProperty("nested", function() {
        flag(this, "nested", true);
      });
      Assertion2.addProperty("own", function() {
        flag(this, "own", true);
      });
      Assertion2.addProperty("ordered", function() {
        flag(this, "ordered", true);
      });
      Assertion2.addProperty("any", function() {
        flag(this, "any", true);
        flag(this, "all", false);
      });
      Assertion2.addProperty("all", function() {
        flag(this, "all", true);
        flag(this, "any", false);
      });
      function an(type, msg) {
        if (msg)
          flag(this, "message", msg);
        type = type.toLowerCase();
        var obj = flag(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type.charAt(0)) ? "an " : "a ";
        this.assert(type === _.type(obj).toLowerCase(), "expected #{this} to be " + article + type, "expected #{this} not to be " + article + type);
      }
      Assertion2.addChainableMethod("an", an);
      Assertion2.addChainableMethod("a", an);
      function SameValueZero(a, b) {
        return _.isNaN(a) && _.isNaN(b) || a === b;
      }
      function includeChainingBehavior() {
        flag(this, "contains", true);
      }
      function include(val, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), negate = flag(this, "negate"), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), descriptor = isDeep ? "deep " : "";
        flagMsg = flagMsg ? flagMsg + ": " : "";
        var included = false;
        switch (objType) {
          case "string":
            included = obj.indexOf(val) !== -1;
            break;
          case "weakset":
            if (isDeep) {
              throw new AssertionError2(flagMsg + "unable to use .deep.include with WeakSet", void 0, ssfi);
            }
            included = obj.has(val);
            break;
          case "map":
            var isEql = isDeep ? _.eql : SameValueZero;
            obj.forEach(function(item) {
              included = included || isEql(item, val);
            });
            break;
          case "set":
            if (isDeep) {
              obj.forEach(function(item) {
                included = included || _.eql(item, val);
              });
            } else {
              included = obj.has(val);
            }
            break;
          case "array":
            if (isDeep) {
              included = obj.some(function(item) {
                return _.eql(item, val);
              });
            } else {
              included = obj.indexOf(val) !== -1;
            }
            break;
          default:
            if (val !== Object(val)) {
              throw new AssertionError2(flagMsg + "the given combination of arguments (" + objType + " and " + _.type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + _.type(val).toLowerCase(), void 0, ssfi);
            }
            var props = Object.keys(val), firstErr = null, numErrs = 0;
            props.forEach(function(prop) {
              var propAssertion = new Assertion2(obj);
              _.transferFlags(this, propAssertion, true);
              flag(propAssertion, "lockSsfi", true);
              if (!negate || props.length === 1) {
                propAssertion.property(prop, val[prop]);
                return;
              }
              try {
                propAssertion.property(prop, val[prop]);
              } catch (err) {
                if (!_.checkError.compatibleConstructor(err, AssertionError2)) {
                  throw err;
                }
                if (firstErr === null)
                  firstErr = err;
                numErrs++;
              }
            }, this);
            if (negate && props.length > 1 && numErrs === props.length) {
              throw firstErr;
            }
            return;
        }
        this.assert(included, "expected #{this} to " + descriptor + "include " + _.inspect(val), "expected #{this} to not " + descriptor + "include " + _.inspect(val));
      }
      Assertion2.addChainableMethod("include", include, includeChainingBehavior);
      Assertion2.addChainableMethod("contain", include, includeChainingBehavior);
      Assertion2.addChainableMethod("contains", include, includeChainingBehavior);
      Assertion2.addChainableMethod("includes", include, includeChainingBehavior);
      Assertion2.addProperty("ok", function() {
        this.assert(flag(this, "object"), "expected #{this} to be truthy", "expected #{this} to be falsy");
      });
      Assertion2.addProperty("true", function() {
        this.assert(flag(this, "object") === true, "expected #{this} to be true", "expected #{this} to be false", flag(this, "negate") ? false : true);
      });
      Assertion2.addProperty("false", function() {
        this.assert(flag(this, "object") === false, "expected #{this} to be false", "expected #{this} to be true", flag(this, "negate") ? true : false);
      });
      Assertion2.addProperty("null", function() {
        this.assert(flag(this, "object") === null, "expected #{this} to be null", "expected #{this} not to be null");
      });
      Assertion2.addProperty("undefined", function() {
        this.assert(flag(this, "object") === void 0, "expected #{this} to be undefined", "expected #{this} not to be undefined");
      });
      Assertion2.addProperty("NaN", function() {
        this.assert(_.isNaN(flag(this, "object")), "expected #{this} to be NaN", "expected #{this} not to be NaN");
      });
      function assertExist() {
        var val = flag(this, "object");
        this.assert(val !== null && val !== void 0, "expected #{this} to exist", "expected #{this} to not exist");
      }
      Assertion2.addProperty("exist", assertExist);
      Assertion2.addProperty("exists", assertExist);
      Assertion2.addProperty("empty", function() {
        var val = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), itemsCount;
        flagMsg = flagMsg ? flagMsg + ": " : "";
        switch (_.type(val).toLowerCase()) {
          case "array":
          case "string":
            itemsCount = val.length;
            break;
          case "map":
          case "set":
            itemsCount = val.size;
            break;
          case "weakmap":
          case "weakset":
            throw new AssertionError2(flagMsg + ".empty was passed a weak collection", void 0, ssfi);
          case "function":
            var msg = flagMsg + ".empty was passed a function " + _.getName(val);
            throw new AssertionError2(msg.trim(), void 0, ssfi);
          default:
            if (val !== Object(val)) {
              throw new AssertionError2(flagMsg + ".empty was passed non-string primitive " + _.inspect(val), void 0, ssfi);
            }
            itemsCount = Object.keys(val).length;
        }
        this.assert(itemsCount === 0, "expected #{this} to be empty", "expected #{this} not to be empty");
      });
      function checkArguments() {
        var obj = flag(this, "object"), type = _.type(obj);
        this.assert(type === "Arguments", "expected #{this} to be arguments but got " + type, "expected #{this} to not be arguments");
      }
      Assertion2.addProperty("arguments", checkArguments);
      Assertion2.addProperty("Arguments", checkArguments);
      function assertEqual(val, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        if (flag(this, "deep")) {
          var prevLockSsfi = flag(this, "lockSsfi");
          flag(this, "lockSsfi", true);
          this.eql(val);
          flag(this, "lockSsfi", prevLockSsfi);
        } else {
          this.assert(val === obj, "expected #{this} to equal #{exp}", "expected #{this} to not equal #{exp}", val, this._obj, true);
        }
      }
      Assertion2.addMethod("equal", assertEqual);
      Assertion2.addMethod("equals", assertEqual);
      Assertion2.addMethod("eq", assertEqual);
      function assertEql(obj, msg) {
        if (msg)
          flag(this, "message", msg);
        this.assert(_.eql(obj, flag(this, "object")), "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", obj, this._obj, true);
      }
      Assertion2.addMethod("eql", assertEql);
      Assertion2.addMethod("eqls", assertEql);
      function assertAbove(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to above must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to above must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount > n, "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " above #{exp}", n, itemsCount);
        } else {
          this.assert(obj > n, "expected #{this} to be above #{exp}", "expected #{this} to be at most #{exp}", n);
        }
      }
      Assertion2.addMethod("above", assertAbove);
      Assertion2.addMethod("gt", assertAbove);
      Assertion2.addMethod("greaterThan", assertAbove);
      function assertLeast(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to least must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to least must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount >= n, "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " below #{exp}", n, itemsCount);
        } else {
          this.assert(obj >= n, "expected #{this} to be at least #{exp}", "expected #{this} to be below #{exp}", n);
        }
      }
      Assertion2.addMethod("least", assertLeast);
      Assertion2.addMethod("gte", assertLeast);
      Assertion2.addMethod("greaterThanOrEqual", assertLeast);
      function assertBelow(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to below must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to below must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount < n, "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " below #{exp}", n, itemsCount);
        } else {
          this.assert(obj < n, "expected #{this} to be below #{exp}", "expected #{this} to be at least #{exp}", n);
        }
      }
      Assertion2.addMethod("below", assertBelow);
      Assertion2.addMethod("lt", assertBelow);
      Assertion2.addMethod("lessThan", assertBelow);
      function assertMost(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to most must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to most must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount <= n, "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " above #{exp}", n, itemsCount);
        } else {
          this.assert(obj <= n, "expected #{this} to be at most #{exp}", "expected #{this} to be above #{exp}", n);
        }
      }
      Assertion2.addMethod("most", assertMost);
      Assertion2.addMethod("lte", assertMost);
      Assertion2.addMethod("lessThanOrEqual", assertMost);
      Assertion2.addMethod("within", function(start, finish, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), startType = _.type(start).toLowerCase(), finishType = _.type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toUTCString() + ".." + finish.toUTCString() : start + ".." + finish;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && (startType !== "date" || finishType !== "date"))) {
          errorMessage = msgPrefix + "the arguments to within must be dates";
        } else if ((startType !== "number" || finishType !== "number") && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the arguments to within must be numbers";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount >= start && itemsCount <= finish, "expected #{this} to have a " + descriptor + " within " + range, "expected #{this} to not have a " + descriptor + " within " + range);
        } else {
          this.assert(obj >= start && obj <= finish, "expected #{this} to be within " + range, "expected #{this} to not be within " + range);
        }
      });
      function assertInstanceOf(constructor, msg) {
        if (msg)
          flag(this, "message", msg);
        var target = flag(this, "object");
        var ssfi = flag(this, "ssfi");
        var flagMsg = flag(this, "message");
        try {
          var isInstanceOf = target instanceof constructor;
        } catch (err) {
          if (err instanceof TypeError) {
            flagMsg = flagMsg ? flagMsg + ": " : "";
            throw new AssertionError2(flagMsg + "The instanceof assertion needs a constructor but " + _.type(constructor) + " was given.", void 0, ssfi);
          }
          throw err;
        }
        var name = _.getName(constructor);
        if (name === null) {
          name = "an unnamed constructor";
        }
        this.assert(isInstanceOf, "expected #{this} to be an instance of " + name, "expected #{this} to not be an instance of " + name);
      }
      ;
      Assertion2.addMethod("instanceof", assertInstanceOf);
      Assertion2.addMethod("instanceOf", assertInstanceOf);
      function assertProperty(name, val, msg) {
        if (msg)
          flag(this, "message", msg);
        var isNested = flag(this, "nested"), isOwn = flag(this, "own"), flagMsg = flag(this, "message"), obj = flag(this, "object"), ssfi = flag(this, "ssfi"), nameType = typeof name;
        flagMsg = flagMsg ? flagMsg + ": " : "";
        if (isNested) {
          if (nameType !== "string") {
            throw new AssertionError2(flagMsg + "the argument to property must be a string when using nested syntax", void 0, ssfi);
          }
        } else {
          if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") {
            throw new AssertionError2(flagMsg + "the argument to property must be a string, number, or symbol", void 0, ssfi);
          }
        }
        if (isNested && isOwn) {
          throw new AssertionError2(flagMsg + 'The "nested" and "own" flags cannot be combined.', void 0, ssfi);
        }
        if (obj === null || obj === void 0) {
          throw new AssertionError2(flagMsg + "Target cannot be null or undefined.", void 0, ssfi);
        }
        var isDeep = flag(this, "deep"), negate = flag(this, "negate"), pathInfo = isNested ? _.getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name];
        var descriptor = "";
        if (isDeep)
          descriptor += "deep ";
        if (isOwn)
          descriptor += "own ";
        if (isNested)
          descriptor += "nested ";
        descriptor += "property ";
        var hasProperty;
        if (isOwn)
          hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
        else if (isNested)
          hasProperty = pathInfo.exists;
        else
          hasProperty = _.hasProperty(obj, name);
        if (!negate || arguments.length === 1) {
          this.assert(hasProperty, "expected #{this} to have " + descriptor + _.inspect(name), "expected #{this} to not have " + descriptor + _.inspect(name));
        }
        if (arguments.length > 1) {
          this.assert(hasProperty && (isDeep ? _.eql(val, value) : val === value), "expected #{this} to have " + descriptor + _.inspect(name) + " of #{exp}, but got #{act}", "expected #{this} to not have " + descriptor + _.inspect(name) + " of #{act}", val, value);
        }
        flag(this, "object", value);
      }
      Assertion2.addMethod("property", assertProperty);
      function assertOwnProperty(name, value, msg) {
        flag(this, "own", true);
        assertProperty.apply(this, arguments);
      }
      Assertion2.addMethod("ownProperty", assertOwnProperty);
      Assertion2.addMethod("haveOwnProperty", assertOwnProperty);
      function assertOwnPropertyDescriptor(name, descriptor, msg) {
        if (typeof descriptor === "string") {
          msg = descriptor;
          descriptor = null;
        }
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
        if (actualDescriptor && descriptor) {
          this.assert(_.eql(descriptor, actualDescriptor), "expected the own property descriptor for " + _.inspect(name) + " on #{this} to match " + _.inspect(descriptor) + ", got " + _.inspect(actualDescriptor), "expected the own property descriptor for " + _.inspect(name) + " on #{this} to not match " + _.inspect(descriptor), descriptor, actualDescriptor, true);
        } else {
          this.assert(actualDescriptor, "expected #{this} to have an own property descriptor for " + _.inspect(name), "expected #{this} to not have an own property descriptor for " + _.inspect(name));
        }
        flag(this, "object", actualDescriptor);
      }
      Assertion2.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
      Assertion2.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
      function assertLengthChain() {
        flag(this, "doLength", true);
      }
      function assertLength(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), descriptor = "length", itemsCount;
        switch (objType) {
          case "map":
          case "set":
            descriptor = "size";
            itemsCount = obj.size;
            break;
          default:
            new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
            itemsCount = obj.length;
        }
        this.assert(itemsCount == n, "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " of #{act}", n, itemsCount);
      }
      Assertion2.addChainableMethod("length", assertLength, assertLengthChain);
      Assertion2.addChainableMethod("lengthOf", assertLength, assertLengthChain);
      function assertMatch(re, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        this.assert(re.exec(obj), "expected #{this} to match " + re, "expected #{this} not to match " + re);
      }
      Assertion2.addMethod("match", assertMatch);
      Assertion2.addMethod("matches", assertMatch);
      Assertion2.addMethod("string", function(str, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion2(obj, flagMsg, ssfi, true).is.a("string");
        this.assert(~obj.indexOf(str), "expected #{this} to contain " + _.inspect(str), "expected #{this} to not contain " + _.inspect(str));
      });
      function assertKeys(keys) {
        var obj = flag(this, "object"), objType = _.type(obj), keysType = _.type(keys), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag(this, "message");
        flagMsg = flagMsg ? flagMsg + ": " : "";
        var mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
        if (objType === "Map" || objType === "Set") {
          deepStr = isDeep ? "deeply " : "";
          actual = [];
          obj.forEach(function(val, key) {
            actual.push(key);
          });
          if (keysType !== "Array") {
            keys = Array.prototype.slice.call(arguments);
          }
        } else {
          actual = _.getOwnEnumerableProperties(obj);
          switch (keysType) {
            case "Array":
              if (arguments.length > 1) {
                throw new AssertionError2(mixedArgsMsg, void 0, ssfi);
              }
              break;
            case "Object":
              if (arguments.length > 1) {
                throw new AssertionError2(mixedArgsMsg, void 0, ssfi);
              }
              keys = Object.keys(keys);
              break;
            default:
              keys = Array.prototype.slice.call(arguments);
          }
          keys = keys.map(function(val) {
            return typeof val === "symbol" ? val : String(val);
          });
        }
        if (!keys.length) {
          throw new AssertionError2(flagMsg + "keys required", void 0, ssfi);
        }
        var len = keys.length, any = flag(this, "any"), all = flag(this, "all"), expected = keys;
        if (!any && !all) {
          all = true;
        }
        if (any) {
          ok = expected.some(function(expectedKey) {
            return actual.some(function(actualKey) {
              if (isDeep) {
                return _.eql(expectedKey, actualKey);
              } else {
                return expectedKey === actualKey;
              }
            });
          });
        }
        if (all) {
          ok = expected.every(function(expectedKey) {
            return actual.some(function(actualKey) {
              if (isDeep) {
                return _.eql(expectedKey, actualKey);
              } else {
                return expectedKey === actualKey;
              }
            });
          });
          if (!flag(this, "contains")) {
            ok = ok && keys.length == actual.length;
          }
        }
        if (len > 1) {
          keys = keys.map(function(key) {
            return _.inspect(key);
          });
          var last = keys.pop();
          if (all) {
            str = keys.join(", ") + ", and " + last;
          }
          if (any) {
            str = keys.join(", ") + ", or " + last;
          }
        } else {
          str = _.inspect(keys[0]);
        }
        str = (len > 1 ? "keys " : "key ") + str;
        str = (flag(this, "contains") ? "contain " : "have ") + str;
        this.assert(ok, "expected #{this} to " + deepStr + str, "expected #{this} to not " + deepStr + str, expected.slice(0).sort(_.compareByInspect), actual.sort(_.compareByInspect), true);
      }
      Assertion2.addMethod("keys", assertKeys);
      Assertion2.addMethod("key", assertKeys);
      function assertThrows(errorLike, errMsgMatcher, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), negate = flag(this, "negate") || false;
        new Assertion2(obj, flagMsg, ssfi, true).is.a("function");
        if (errorLike instanceof RegExp || typeof errorLike === "string") {
          errMsgMatcher = errorLike;
          errorLike = null;
        }
        var caughtErr;
        try {
          obj();
        } catch (err) {
          caughtErr = err;
        }
        var everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
        var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
        var errorLikeFail = false;
        var errMsgMatcherFail = false;
        if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
          var errorLikeString = "an error";
          if (errorLike instanceof Error) {
            errorLikeString = "#{exp}";
          } else if (errorLike) {
            errorLikeString = _.checkError.getConstructorName(errorLike);
          }
          this.assert(caughtErr, "expected #{this} to throw " + errorLikeString, "expected #{this} to not throw an error but #{act} was thrown", errorLike && errorLike.toString(), caughtErr instanceof Error ? caughtErr.toString() : typeof caughtErr === "string" ? caughtErr : caughtErr && _.checkError.getConstructorName(caughtErr));
        }
        if (errorLike && caughtErr) {
          if (errorLike instanceof Error) {
            var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);
            if (isCompatibleInstance === negate) {
              if (everyArgIsDefined && negate) {
                errorLikeFail = true;
              } else {
                this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""), errorLike.toString(), caughtErr.toString());
              }
            }
          }
          var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
          if (isCompatibleConstructor === negate) {
            if (everyArgIsDefined && negate) {
              errorLikeFail = true;
            } else {
              this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr));
            }
          }
        }
        if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
          var placeholder = "including";
          if (errMsgMatcher instanceof RegExp) {
            placeholder = "matching";
          }
          var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
          if (isCompatibleMessage === negate) {
            if (everyArgIsDefined && negate) {
              errMsgMatcherFail = true;
            } else {
              this.assert(negate, "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}", "expected #{this} to throw error not " + placeholder + " #{exp}", errMsgMatcher, _.checkError.getMessage(caughtErr));
            }
          }
        }
        if (errorLikeFail && errMsgMatcherFail) {
          this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr));
        }
        flag(this, "object", caughtErr);
      }
      ;
      Assertion2.addMethod("throw", assertThrows);
      Assertion2.addMethod("throws", assertThrows);
      Assertion2.addMethod("Throw", assertThrows);
      function respondTo(method, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), itself = flag(this, "itself"), context = typeof obj === "function" && !itself ? obj.prototype[method] : obj[method];
        this.assert(typeof context === "function", "expected #{this} to respond to " + _.inspect(method), "expected #{this} to not respond to " + _.inspect(method));
      }
      Assertion2.addMethod("respondTo", respondTo);
      Assertion2.addMethod("respondsTo", respondTo);
      Assertion2.addProperty("itself", function() {
        flag(this, "itself", true);
      });
      function satisfy(matcher, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        var result = matcher(obj);
        this.assert(result, "expected #{this} to satisfy " + _.objDisplay(matcher), "expected #{this} to not satisfy" + _.objDisplay(matcher), flag(this, "negate") ? false : true, result);
      }
      Assertion2.addMethod("satisfy", satisfy);
      Assertion2.addMethod("satisfies", satisfy);
      function closeTo(expected, delta, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion2(obj, flagMsg, ssfi, true).is.a("number");
        if (typeof expected !== "number" || typeof delta !== "number") {
          flagMsg = flagMsg ? flagMsg + ": " : "";
          var deltaMessage = delta === void 0 ? ", and a delta is required" : "";
          throw new AssertionError2(flagMsg + "the arguments to closeTo or approximately must be numbers" + deltaMessage, void 0, ssfi);
        }
        this.assert(Math.abs(obj - expected) <= delta, "expected #{this} to be close to " + expected + " +/- " + delta, "expected #{this} not to be close to " + expected + " +/- " + delta);
      }
      Assertion2.addMethod("closeTo", closeTo);
      Assertion2.addMethod("approximately", closeTo);
      function isSubsetOf(subset, superset, cmp, contains, ordered) {
        if (!contains) {
          if (subset.length !== superset.length)
            return false;
          superset = superset.slice();
        }
        return subset.every(function(elem, idx) {
          if (ordered)
            return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
          if (!cmp) {
            var matchIdx = superset.indexOf(elem);
            if (matchIdx === -1)
              return false;
            if (!contains)
              superset.splice(matchIdx, 1);
            return true;
          }
          return superset.some(function(elem2, matchIdx2) {
            if (!cmp(elem, elem2))
              return false;
            if (!contains)
              superset.splice(matchIdx2, 1);
            return true;
          });
        });
      }
      Assertion2.addMethod("members", function(subset, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion2(obj, flagMsg, ssfi, true).to.be.an("array");
        new Assertion2(subset, flagMsg, ssfi, true).to.be.an("array");
        var contains = flag(this, "contains");
        var ordered = flag(this, "ordered");
        var subject, failMsg, failNegateMsg;
        if (contains) {
          subject = ordered ? "an ordered superset" : "a superset";
          failMsg = "expected #{this} to be " + subject + " of #{exp}";
          failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
        } else {
          subject = ordered ? "ordered members" : "members";
          failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
          failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
        }
        var cmp = flag(this, "deep") ? _.eql : void 0;
        this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
      });
      function oneOf(list, msg) {
        if (msg)
          flag(this, "message", msg);
        var expected = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), contains = flag(this, "contains"), isDeep = flag(this, "deep");
        new Assertion2(list, flagMsg, ssfi, true).to.be.an("array");
        if (contains) {
          this.assert(list.some(function(possibility) {
            return expected.indexOf(possibility) > -1;
          }), "expected #{this} to contain one of #{exp}", "expected #{this} to not contain one of #{exp}", list, expected);
        } else {
          if (isDeep) {
            this.assert(list.some(function(possibility) {
              return _.eql(expected, possibility);
            }), "expected #{this} to deeply equal one of #{exp}", "expected #{this} to deeply equal one of #{exp}", list, expected);
          } else {
            this.assert(list.indexOf(expected) > -1, "expected #{this} to be one of #{exp}", "expected #{this} to not be one of #{exp}", list, expected);
          }
        }
      }
      Assertion2.addMethod("oneOf", oneOf);
      function assertChanges(subject, prop, msg) {
        if (msg)
          flag(this, "message", msg);
        var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion2(fn, flagMsg, ssfi, true).is.a("function");
        var initial;
        if (!prop) {
          new Assertion2(subject, flagMsg, ssfi, true).is.a("function");
          initial = subject();
        } else {
          new Assertion2(subject, flagMsg, ssfi, true).to.have.property(prop);
          initial = subject[prop];
        }
        fn();
        var final = prop === void 0 || prop === null ? subject() : subject[prop];
        var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
        flag(this, "deltaMsgObj", msgObj);
        flag(this, "initialDeltaValue", initial);
        flag(this, "finalDeltaValue", final);
        flag(this, "deltaBehavior", "change");
        flag(this, "realDelta", final !== initial);
        this.assert(initial !== final, "expected " + msgObj + " to change", "expected " + msgObj + " to not change");
      }
      Assertion2.addMethod("change", assertChanges);
      Assertion2.addMethod("changes", assertChanges);
      function assertIncreases(subject, prop, msg) {
        if (msg)
          flag(this, "message", msg);
        var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion2(fn, flagMsg, ssfi, true).is.a("function");
        var initial;
        if (!prop) {
          new Assertion2(subject, flagMsg, ssfi, true).is.a("function");
          initial = subject();
        } else {
          new Assertion2(subject, flagMsg, ssfi, true).to.have.property(prop);
          initial = subject[prop];
        }
        new Assertion2(initial, flagMsg, ssfi, true).is.a("number");
        fn();
        var final = prop === void 0 || prop === null ? subject() : subject[prop];
        var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
        flag(this, "deltaMsgObj", msgObj);
        flag(this, "initialDeltaValue", initial);
        flag(this, "finalDeltaValue", final);
        flag(this, "deltaBehavior", "increase");
        flag(this, "realDelta", final - initial);
        this.assert(final - initial > 0, "expected " + msgObj + " to increase", "expected " + msgObj + " to not increase");
      }
      Assertion2.addMethod("increase", assertIncreases);
      Assertion2.addMethod("increases", assertIncreases);
      function assertDecreases(subject, prop, msg) {
        if (msg)
          flag(this, "message", msg);
        var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion2(fn, flagMsg, ssfi, true).is.a("function");
        var initial;
        if (!prop) {
          new Assertion2(subject, flagMsg, ssfi, true).is.a("function");
          initial = subject();
        } else {
          new Assertion2(subject, flagMsg, ssfi, true).to.have.property(prop);
          initial = subject[prop];
        }
        new Assertion2(initial, flagMsg, ssfi, true).is.a("number");
        fn();
        var final = prop === void 0 || prop === null ? subject() : subject[prop];
        var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
        flag(this, "deltaMsgObj", msgObj);
        flag(this, "initialDeltaValue", initial);
        flag(this, "finalDeltaValue", final);
        flag(this, "deltaBehavior", "decrease");
        flag(this, "realDelta", initial - final);
        this.assert(final - initial < 0, "expected " + msgObj + " to decrease", "expected " + msgObj + " to not decrease");
      }
      Assertion2.addMethod("decrease", assertDecreases);
      Assertion2.addMethod("decreases", assertDecreases);
      function assertDelta(delta, msg) {
        if (msg)
          flag(this, "message", msg);
        var msgObj = flag(this, "deltaMsgObj");
        var initial = flag(this, "initialDeltaValue");
        var final = flag(this, "finalDeltaValue");
        var behavior = flag(this, "deltaBehavior");
        var realDelta = flag(this, "realDelta");
        var expression;
        if (behavior === "change") {
          expression = Math.abs(final - initial) === Math.abs(delta);
        } else {
          expression = realDelta === Math.abs(delta);
        }
        this.assert(expression, "expected " + msgObj + " to " + behavior + " by " + delta, "expected " + msgObj + " to not " + behavior + " by " + delta);
      }
      Assertion2.addMethod("by", assertDelta);
      Assertion2.addProperty("extensible", function() {
        var obj = flag(this, "object");
        var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
        this.assert(isExtensible, "expected #{this} to be extensible", "expected #{this} to not be extensible");
      });
      Assertion2.addProperty("sealed", function() {
        var obj = flag(this, "object");
        var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
        this.assert(isSealed, "expected #{this} to be sealed", "expected #{this} to not be sealed");
      });
      Assertion2.addProperty("frozen", function() {
        var obj = flag(this, "object");
        var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
        this.assert(isFrozen, "expected #{this} to be frozen", "expected #{this} to not be frozen");
      });
      Assertion2.addProperty("finite", function(msg) {
        var obj = flag(this, "object");
        this.assert(typeof obj === "number" && isFinite(obj), "expected #{this} to be a finite number", "expected #{this} to not be a finite number");
      });
    };
  }
});

// test/node_modules/chai/lib/chai/interface/expect.js
var require_expect = __commonJS({
  "test/node_modules/chai/lib/chai/interface/expect.js"(exports, module) {
    module.exports = function(chai2, util2) {
      chai2.expect = function(val, message) {
        return new chai2.Assertion(val, message);
      };
      chai2.expect.fail = function(actual, expected, message, operator) {
        if (arguments.length < 2) {
          message = actual;
          actual = void 0;
        }
        message = message || "expect.fail()";
        throw new chai2.AssertionError(message, {
          actual,
          expected,
          operator
        }, chai2.expect.fail);
      };
    };
  }
});

// test/node_modules/chai/lib/chai/interface/should.js
var require_should = __commonJS({
  "test/node_modules/chai/lib/chai/interface/should.js"(exports, module) {
    module.exports = function(chai2, util2) {
      var Assertion2 = chai2.Assertion;
      function loadShould() {
        function shouldGetter() {
          if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) {
            return new Assertion2(this.valueOf(), null, shouldGetter);
          }
          return new Assertion2(this, null, shouldGetter);
        }
        function shouldSetter(value) {
          Object.defineProperty(this, "should", {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        }
        Object.defineProperty(Object.prototype, "should", {
          set: shouldSetter,
          get: shouldGetter,
          configurable: true
        });
        var should2 = {};
        should2.fail = function(actual, expected, message, operator) {
          if (arguments.length < 2) {
            message = actual;
            actual = void 0;
          }
          message = message || "should.fail()";
          throw new chai2.AssertionError(message, {
            actual,
            expected,
            operator
          }, should2.fail);
        };
        should2.equal = function(val1, val2, msg) {
          new Assertion2(val1, msg).to.equal(val2);
        };
        should2.Throw = function(fn, errt, errs, msg) {
          new Assertion2(fn, msg).to.Throw(errt, errs);
        };
        should2.exist = function(val, msg) {
          new Assertion2(val, msg).to.exist;
        };
        should2.not = {};
        should2.not.equal = function(val1, val2, msg) {
          new Assertion2(val1, msg).to.not.equal(val2);
        };
        should2.not.Throw = function(fn, errt, errs, msg) {
          new Assertion2(fn, msg).to.not.Throw(errt, errs);
        };
        should2.not.exist = function(val, msg) {
          new Assertion2(val, msg).to.not.exist;
        };
        should2["throw"] = should2["Throw"];
        should2.not["throw"] = should2.not["Throw"];
        return should2;
      }
      ;
      chai2.should = loadShould;
      chai2.Should = loadShould;
    };
  }
});

// test/node_modules/chai/lib/chai/interface/assert.js
var require_assert = __commonJS({
  "test/node_modules/chai/lib/chai/interface/assert.js"(exports, module) {
    module.exports = function(chai2, util2) {
      var Assertion2 = chai2.Assertion, flag = util2.flag;
      var assert2 = chai2.assert = function(express, errmsg) {
        var test = new Assertion2(null, null, chai2.assert, true);
        test.assert(express, errmsg, "[ negation message unavailable ]");
      };
      assert2.fail = function(actual, expected, message, operator) {
        if (arguments.length < 2) {
          message = actual;
          actual = void 0;
        }
        message = message || "assert.fail()";
        throw new chai2.AssertionError(message, {
          actual,
          expected,
          operator
        }, assert2.fail);
      };
      assert2.isOk = function(val, msg) {
        new Assertion2(val, msg, assert2.isOk, true).is.ok;
      };
      assert2.isNotOk = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotOk, true).is.not.ok;
      };
      assert2.equal = function(act, exp, msg) {
        var test = new Assertion2(act, msg, assert2.equal, true);
        test.assert(exp == flag(test, "object"), "expected #{this} to equal #{exp}", "expected #{this} to not equal #{act}", exp, act, true);
      };
      assert2.notEqual = function(act, exp, msg) {
        var test = new Assertion2(act, msg, assert2.notEqual, true);
        test.assert(exp != flag(test, "object"), "expected #{this} to not equal #{exp}", "expected #{this} to equal #{act}", exp, act, true);
      };
      assert2.strictEqual = function(act, exp, msg) {
        new Assertion2(act, msg, assert2.strictEqual, true).to.equal(exp);
      };
      assert2.notStrictEqual = function(act, exp, msg) {
        new Assertion2(act, msg, assert2.notStrictEqual, true).to.not.equal(exp);
      };
      assert2.deepEqual = assert2.deepStrictEqual = function(act, exp, msg) {
        new Assertion2(act, msg, assert2.deepEqual, true).to.eql(exp);
      };
      assert2.notDeepEqual = function(act, exp, msg) {
        new Assertion2(act, msg, assert2.notDeepEqual, true).to.not.eql(exp);
      };
      assert2.isAbove = function(val, abv, msg) {
        new Assertion2(val, msg, assert2.isAbove, true).to.be.above(abv);
      };
      assert2.isAtLeast = function(val, atlst, msg) {
        new Assertion2(val, msg, assert2.isAtLeast, true).to.be.least(atlst);
      };
      assert2.isBelow = function(val, blw, msg) {
        new Assertion2(val, msg, assert2.isBelow, true).to.be.below(blw);
      };
      assert2.isAtMost = function(val, atmst, msg) {
        new Assertion2(val, msg, assert2.isAtMost, true).to.be.most(atmst);
      };
      assert2.isTrue = function(val, msg) {
        new Assertion2(val, msg, assert2.isTrue, true).is["true"];
      };
      assert2.isNotTrue = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotTrue, true).to.not.equal(true);
      };
      assert2.isFalse = function(val, msg) {
        new Assertion2(val, msg, assert2.isFalse, true).is["false"];
      };
      assert2.isNotFalse = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotFalse, true).to.not.equal(false);
      };
      assert2.isNull = function(val, msg) {
        new Assertion2(val, msg, assert2.isNull, true).to.equal(null);
      };
      assert2.isNotNull = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotNull, true).to.not.equal(null);
      };
      assert2.isNaN = function(val, msg) {
        new Assertion2(val, msg, assert2.isNaN, true).to.be.NaN;
      };
      assert2.isNotNaN = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotNaN, true).not.to.be.NaN;
      };
      assert2.exists = function(val, msg) {
        new Assertion2(val, msg, assert2.exists, true).to.exist;
      };
      assert2.notExists = function(val, msg) {
        new Assertion2(val, msg, assert2.notExists, true).to.not.exist;
      };
      assert2.isUndefined = function(val, msg) {
        new Assertion2(val, msg, assert2.isUndefined, true).to.equal(void 0);
      };
      assert2.isDefined = function(val, msg) {
        new Assertion2(val, msg, assert2.isDefined, true).to.not.equal(void 0);
      };
      assert2.isFunction = function(val, msg) {
        new Assertion2(val, msg, assert2.isFunction, true).to.be.a("function");
      };
      assert2.isNotFunction = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotFunction, true).to.not.be.a("function");
      };
      assert2.isObject = function(val, msg) {
        new Assertion2(val, msg, assert2.isObject, true).to.be.a("object");
      };
      assert2.isNotObject = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotObject, true).to.not.be.a("object");
      };
      assert2.isArray = function(val, msg) {
        new Assertion2(val, msg, assert2.isArray, true).to.be.an("array");
      };
      assert2.isNotArray = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotArray, true).to.not.be.an("array");
      };
      assert2.isString = function(val, msg) {
        new Assertion2(val, msg, assert2.isString, true).to.be.a("string");
      };
      assert2.isNotString = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotString, true).to.not.be.a("string");
      };
      assert2.isNumber = function(val, msg) {
        new Assertion2(val, msg, assert2.isNumber, true).to.be.a("number");
      };
      assert2.isNotNumber = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotNumber, true).to.not.be.a("number");
      };
      assert2.isFinite = function(val, msg) {
        new Assertion2(val, msg, assert2.isFinite, true).to.be.finite;
      };
      assert2.isBoolean = function(val, msg) {
        new Assertion2(val, msg, assert2.isBoolean, true).to.be.a("boolean");
      };
      assert2.isNotBoolean = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotBoolean, true).to.not.be.a("boolean");
      };
      assert2.typeOf = function(val, type, msg) {
        new Assertion2(val, msg, assert2.typeOf, true).to.be.a(type);
      };
      assert2.notTypeOf = function(val, type, msg) {
        new Assertion2(val, msg, assert2.notTypeOf, true).to.not.be.a(type);
      };
      assert2.instanceOf = function(val, type, msg) {
        new Assertion2(val, msg, assert2.instanceOf, true).to.be.instanceOf(type);
      };
      assert2.notInstanceOf = function(val, type, msg) {
        new Assertion2(val, msg, assert2.notInstanceOf, true).to.not.be.instanceOf(type);
      };
      assert2.include = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.include, true).include(inc);
      };
      assert2.notInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.notInclude, true).not.include(inc);
      };
      assert2.deepInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.deepInclude, true).deep.include(inc);
      };
      assert2.notDeepInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.notDeepInclude, true).not.deep.include(inc);
      };
      assert2.nestedInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.nestedInclude, true).nested.include(inc);
      };
      assert2.notNestedInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.notNestedInclude, true).not.nested.include(inc);
      };
      assert2.deepNestedInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.deepNestedInclude, true).deep.nested.include(inc);
      };
      assert2.notDeepNestedInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.notDeepNestedInclude, true).not.deep.nested.include(inc);
      };
      assert2.ownInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.ownInclude, true).own.include(inc);
      };
      assert2.notOwnInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.notOwnInclude, true).not.own.include(inc);
      };
      assert2.deepOwnInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.deepOwnInclude, true).deep.own.include(inc);
      };
      assert2.notDeepOwnInclude = function(exp, inc, msg) {
        new Assertion2(exp, msg, assert2.notDeepOwnInclude, true).not.deep.own.include(inc);
      };
      assert2.match = function(exp, re, msg) {
        new Assertion2(exp, msg, assert2.match, true).to.match(re);
      };
      assert2.notMatch = function(exp, re, msg) {
        new Assertion2(exp, msg, assert2.notMatch, true).to.not.match(re);
      };
      assert2.property = function(obj, prop, msg) {
        new Assertion2(obj, msg, assert2.property, true).to.have.property(prop);
      };
      assert2.notProperty = function(obj, prop, msg) {
        new Assertion2(obj, msg, assert2.notProperty, true).to.not.have.property(prop);
      };
      assert2.propertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.propertyVal, true).to.have.property(prop, val);
      };
      assert2.notPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.notPropertyVal, true).to.not.have.property(prop, val);
      };
      assert2.deepPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.deepPropertyVal, true).to.have.deep.property(prop, val);
      };
      assert2.notDeepPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
      };
      assert2.ownProperty = function(obj, prop, msg) {
        new Assertion2(obj, msg, assert2.ownProperty, true).to.have.own.property(prop);
      };
      assert2.notOwnProperty = function(obj, prop, msg) {
        new Assertion2(obj, msg, assert2.notOwnProperty, true).to.not.have.own.property(prop);
      };
      assert2.ownPropertyVal = function(obj, prop, value, msg) {
        new Assertion2(obj, msg, assert2.ownPropertyVal, true).to.have.own.property(prop, value);
      };
      assert2.notOwnPropertyVal = function(obj, prop, value, msg) {
        new Assertion2(obj, msg, assert2.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
      };
      assert2.deepOwnPropertyVal = function(obj, prop, value, msg) {
        new Assertion2(obj, msg, assert2.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
      };
      assert2.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
        new Assertion2(obj, msg, assert2.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
      };
      assert2.nestedProperty = function(obj, prop, msg) {
        new Assertion2(obj, msg, assert2.nestedProperty, true).to.have.nested.property(prop);
      };
      assert2.notNestedProperty = function(obj, prop, msg) {
        new Assertion2(obj, msg, assert2.notNestedProperty, true).to.not.have.nested.property(prop);
      };
      assert2.nestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.nestedPropertyVal, true).to.have.nested.property(prop, val);
      };
      assert2.notNestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
      };
      assert2.deepNestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
      };
      assert2.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion2(obj, msg, assert2.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
      };
      assert2.lengthOf = function(exp, len, msg) {
        new Assertion2(exp, msg, assert2.lengthOf, true).to.have.lengthOf(len);
      };
      assert2.hasAnyKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.hasAnyKeys, true).to.have.any.keys(keys);
      };
      assert2.hasAllKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.hasAllKeys, true).to.have.all.keys(keys);
      };
      assert2.containsAllKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.containsAllKeys, true).to.contain.all.keys(keys);
      };
      assert2.doesNotHaveAnyKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
      };
      assert2.doesNotHaveAllKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
      };
      assert2.hasAnyDeepKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
      };
      assert2.hasAllDeepKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
      };
      assert2.containsAllDeepKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
      };
      assert2.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
      };
      assert2.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
        new Assertion2(obj, msg, assert2.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
      };
      assert2.throws = function(fn, errorLike, errMsgMatcher, msg) {
        if (typeof errorLike === "string" || errorLike instanceof RegExp) {
          errMsgMatcher = errorLike;
          errorLike = null;
        }
        var assertErr = new Assertion2(fn, msg, assert2.throws, true).to.throw(errorLike, errMsgMatcher);
        return flag(assertErr, "object");
      };
      assert2.doesNotThrow = function(fn, errorLike, errMsgMatcher, msg) {
        if (typeof errorLike === "string" || errorLike instanceof RegExp) {
          errMsgMatcher = errorLike;
          errorLike = null;
        }
        new Assertion2(fn, msg, assert2.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
      };
      assert2.operator = function(val, operator, val2, msg) {
        var ok;
        switch (operator) {
          case "==":
            ok = val == val2;
            break;
          case "===":
            ok = val === val2;
            break;
          case ">":
            ok = val > val2;
            break;
          case ">=":
            ok = val >= val2;
            break;
          case "<":
            ok = val < val2;
            break;
          case "<=":
            ok = val <= val2;
            break;
          case "!=":
            ok = val != val2;
            break;
          case "!==":
            ok = val !== val2;
            break;
          default:
            msg = msg ? msg + ": " : msg;
            throw new chai2.AssertionError(msg + 'Invalid operator "' + operator + '"', void 0, assert2.operator);
        }
        var test = new Assertion2(ok, msg, assert2.operator, true);
        test.assert(flag(test, "object") === true, "expected " + util2.inspect(val) + " to be " + operator + " " + util2.inspect(val2), "expected " + util2.inspect(val) + " to not be " + operator + " " + util2.inspect(val2));
      };
      assert2.closeTo = function(act, exp, delta, msg) {
        new Assertion2(act, msg, assert2.closeTo, true).to.be.closeTo(exp, delta);
      };
      assert2.approximately = function(act, exp, delta, msg) {
        new Assertion2(act, msg, assert2.approximately, true).to.be.approximately(exp, delta);
      };
      assert2.sameMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.sameMembers, true).to.have.same.members(set2);
      };
      assert2.notSameMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.notSameMembers, true).to.not.have.same.members(set2);
      };
      assert2.sameDeepMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.sameDeepMembers, true).to.have.same.deep.members(set2);
      };
      assert2.notSameDeepMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
      };
      assert2.sameOrderedMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.sameOrderedMembers, true).to.have.same.ordered.members(set2);
      };
      assert2.notSameOrderedMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
      };
      assert2.sameDeepOrderedMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
      };
      assert2.notSameDeepOrderedMembers = function(set1, set2, msg) {
        new Assertion2(set1, msg, assert2.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
      };
      assert2.includeMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.includeMembers, true).to.include.members(subset);
      };
      assert2.notIncludeMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.notIncludeMembers, true).to.not.include.members(subset);
      };
      assert2.includeDeepMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.includeDeepMembers, true).to.include.deep.members(subset);
      };
      assert2.notIncludeDeepMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
      };
      assert2.includeOrderedMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.includeOrderedMembers, true).to.include.ordered.members(subset);
      };
      assert2.notIncludeOrderedMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
      };
      assert2.includeDeepOrderedMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
      };
      assert2.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
        new Assertion2(superset, msg, assert2.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
      };
      assert2.oneOf = function(inList, list, msg) {
        new Assertion2(inList, msg, assert2.oneOf, true).to.be.oneOf(list);
      };
      assert2.changes = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.changes, true).to.change(obj, prop);
      };
      assert2.changesBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.changesBy, true).to.change(obj, prop).by(delta);
      };
      assert2.doesNotChange = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion2(fn, msg, assert2.doesNotChange, true).to.not.change(obj, prop);
      };
      assert2.changesButNotBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
      };
      assert2.increases = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion2(fn, msg, assert2.increases, true).to.increase(obj, prop);
      };
      assert2.increasesBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.increasesBy, true).to.increase(obj, prop).by(delta);
      };
      assert2.doesNotIncrease = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion2(fn, msg, assert2.doesNotIncrease, true).to.not.increase(obj, prop);
      };
      assert2.increasesButNotBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
      };
      assert2.decreases = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion2(fn, msg, assert2.decreases, true).to.decrease(obj, prop);
      };
      assert2.decreasesBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.decreasesBy, true).to.decrease(obj, prop).by(delta);
      };
      assert2.doesNotDecrease = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion2(fn, msg, assert2.doesNotDecrease, true).to.not.decrease(obj, prop);
      };
      assert2.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        return new Assertion2(fn, msg, assert2.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
      };
      assert2.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion2(fn, msg, assert2.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
      };
      assert2.ifError = function(val) {
        if (val) {
          throw val;
        }
      };
      assert2.isExtensible = function(obj, msg) {
        new Assertion2(obj, msg, assert2.isExtensible, true).to.be.extensible;
      };
      assert2.isNotExtensible = function(obj, msg) {
        new Assertion2(obj, msg, assert2.isNotExtensible, true).to.not.be.extensible;
      };
      assert2.isSealed = function(obj, msg) {
        new Assertion2(obj, msg, assert2.isSealed, true).to.be.sealed;
      };
      assert2.isNotSealed = function(obj, msg) {
        new Assertion2(obj, msg, assert2.isNotSealed, true).to.not.be.sealed;
      };
      assert2.isFrozen = function(obj, msg) {
        new Assertion2(obj, msg, assert2.isFrozen, true).to.be.frozen;
      };
      assert2.isNotFrozen = function(obj, msg) {
        new Assertion2(obj, msg, assert2.isNotFrozen, true).to.not.be.frozen;
      };
      assert2.isEmpty = function(val, msg) {
        new Assertion2(val, msg, assert2.isEmpty, true).to.be.empty;
      };
      assert2.isNotEmpty = function(val, msg) {
        new Assertion2(val, msg, assert2.isNotEmpty, true).to.not.be.empty;
      };
      (function alias(name, as) {
        assert2[as] = assert2[name];
        return alias;
      })("isOk", "ok")("isNotOk", "notOk")("throws", "throw")("throws", "Throw")("isExtensible", "extensible")("isNotExtensible", "notExtensible")("isSealed", "sealed")("isNotSealed", "notSealed")("isFrozen", "frozen")("isNotFrozen", "notFrozen")("isEmpty", "empty")("isNotEmpty", "notEmpty");
    };
  }
});

// test/node_modules/chai/lib/chai.js
var require_chai = __commonJS({
  "test/node_modules/chai/lib/chai.js"(exports) {
    var used = [];
    exports.version = "4.3.3";
    exports.AssertionError = require_assertion_error();
    var util2 = require_utils();
    exports.use = function(fn) {
      if (!~used.indexOf(fn)) {
        fn(exports, util2);
        used.push(fn);
      }
      return exports;
    };
    exports.util = util2;
    var config2 = require_config();
    exports.config = config2;
    var assertion = require_assertion();
    exports.use(assertion);
    var core2 = require_assertions();
    exports.use(core2);
    var expect2 = require_expect();
    exports.use(expect2);
    var should2 = require_should();
    exports.use(should2);
    var assert2 = require_assert();
    exports.use(assert2);
  }
});

// test/node_modules/chai/index.js
var require_chai2 = __commonJS({
  "test/node_modules/chai/index.js"(exports, module) {
    module.exports = require_chai();
  }
});

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
      if (config2("noDeprecation")) {
        return fn;
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (config2("throwDeprecation")) {
            throw new Error(msg);
          } else if (config2("traceDeprecation")) {
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
    function config2(name) {
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
              var split = bytes.split("=");
              var name = split.shift().replace(/\+/g, " ");
              var value = split.join("=").replace(/\+/g, " ");
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
        function fetch(input, init) {
          return new Promise(function(resolve, reject) {
            var request = new Request(input, init);
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
    var util2 = require_util();
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
      return expression instanceof Expr || util2.checkInstanceHasProperty(expression, "_isFaunaExpr");
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
    var util2 = require_util();
    function FaunaError(name, message, description) {
      Error.call(this);
      this.name = name;
      this.message = message;
      this.description = description;
    }
    util2.inherits(FaunaError, Error);
    function InvalidValue(message) {
      FaunaError.call(this, "InvalidValue", message);
    }
    util2.inherits(InvalidValue, FaunaError);
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
    util2.inherits(InvalidArity, FaunaError);
    function FaunaHTTPError(name, requestResult) {
      var response = requestResult.responseContent;
      var errors = response.errors;
      var message = errors.length === 0 ? '(empty "errors")' : errors[0].code;
      var description = errors.length === 0 ? '(empty "errors")' : errors[0].description;
      FaunaError.call(this, name, message, description);
      this.requestResult = requestResult;
    }
    util2.inherits(FaunaHTTPError, FaunaError);
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
    util2.inherits(BadRequest, FaunaHTTPError);
    function Unauthorized(requestResult) {
      FaunaHTTPError.call(this, "Unauthorized", requestResult);
    }
    util2.inherits(Unauthorized, FaunaHTTPError);
    function PermissionDenied(requestResult) {
      FaunaHTTPError.call(this, "PermissionDenied", requestResult);
    }
    util2.inherits(PermissionDenied, FaunaHTTPError);
    function NotFound(requestResult) {
      FaunaHTTPError.call(this, "NotFound", requestResult);
    }
    util2.inherits(NotFound, FaunaHTTPError);
    function MethodNotAllowed(requestResult) {
      FaunaHTTPError.call(this, "MethodNotAllowed", requestResult);
    }
    util2.inherits(MethodNotAllowed, FaunaHTTPError);
    function TooManyRequests(requestResult) {
      FaunaHTTPError.call(this, "TooManyRequests", requestResult);
    }
    util2.inherits(TooManyRequests, FaunaHTTPError);
    function InternalError(requestResult) {
      FaunaHTTPError.call(this, "InternalError", requestResult);
    }
    util2.inherits(InternalError, FaunaHTTPError);
    function UnavailableError(requestResult) {
      FaunaHTTPError.call(this, "UnavailableError", requestResult);
    }
    util2.inherits(UnavailableError, FaunaHTTPError);
    function StreamError(name, message, description) {
      FaunaError.call(this, name, message, description);
    }
    util2.inherits(StreamError, FaunaError);
    function StreamsNotSupported(description) {
      FaunaError.call(this, "StreamsNotSupported", "streams not supported", description);
    }
    util2.inherits(StreamsNotSupported, StreamError);
    function StreamErrorEvent(event) {
      var error = event.data || {};
      FaunaError.call(this, "StreamErrorEvent", error.code, error.description);
      this.event = event;
    }
    util2.inherits(StreamErrorEvent, StreamError);
    function ClientClosed(message, description) {
      FaunaError.call(this, "ClientClosed", message, description);
    }
    util2.inherits(ClientClosed, FaunaError);
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
    var util2 = require_util();
    var nodeUtil = util2.isNodeEnv() ? require_util2() : null;
    var customInspect = nodeUtil && nodeUtil.inspect.custom;
    var stringify = nodeUtil ? nodeUtil.inspect : JSON.stringify;
    function Value() {
    }
    Value.prototype._isFaunaValue = true;
    util2.inherits(Value, Expr);
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
    util2.inherits(Ref, Value);
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
      return (other instanceof Ref || util2.checkInstanceHasProperty(other, "_isFaunaRef")) && this.id === other.id && (this.collection === void 0 && other.collection === void 0 || this.collection.equals(other.collection)) && (this.database === void 0 && other.database === void 0 || this.database.equals(other.database));
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
    util2.inherits(SetRef, Value);
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
    util2.inherits(FaunaTime, Value);
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
    util2.inherits(FaunaDate, Value);
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
    util2.inherits(Bytes, Value);
    wrapToString(Bytes, function() {
      return 'Bytes("' + base64.fromByteArray(this.value) + '")';
    });
    Bytes.prototype.toJSON = function() {
      return { "@bytes": base64.fromByteArray(this.value) };
    };
    function Query(value) {
      this.value = value;
    }
    util2.inherits(Query, Value);
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
    var util2 = require_util();
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
          } else if (value instanceof Expr || util2.checkInstanceHasProperty(value, "_isFaunaExpr")) {
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
      ts = util2.defaults(ts, null);
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
      opts = util2.defaults(opts, {});
      return new Expr(objectAssign({ paginate: wrap(set) }, wrapValues(opts)));
    }
    function Exists(ref, ts) {
      arity.between(1, 2, arguments, Exists.name);
      ts = util2.defaults(ts, null);
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
      separator = util2.defaults(separator, null);
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
      start = util2.defaults(start, null);
      return new Expr(params({ findstr: wrap(value), find: wrap(find) }, { start: wrap(start) }));
    }
    function FindStrRegex(value, pattern, start, numResults) {
      arity.between(2, 4, arguments, FindStrRegex.name);
      start = util2.defaults(start, null);
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
      min = util2.defaults(min, null);
      max = util2.defaults(max, null);
      return new Expr(params({ ngram: wrap(terms) }, { min: wrap(min), max: wrap(max) }));
    }
    function Repeat(value, number) {
      arity.between(1, 2, arguments, Repeat.name);
      number = util2.defaults(number, null);
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
      first = util2.defaults(first, null);
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
      start = util2.defaults(start, null);
      length = util2.defaults(length, null);
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
      scope = util2.defaults(scope, null);
      return new Expr(params({ role: wrap(name) }, { scope: wrap(scope) }));
    }
    function AccessProviders(scope) {
      arity.max(1, arguments, AccessProviders.name);
      scope = util2.defaults(scope, null);
      return new Expr({ access_providers: wrap(scope) });
    }
    function Classes(scope) {
      arity.max(1, arguments, Classes.name);
      scope = util2.defaults(scope, null);
      return new Expr({ classes: wrap(scope) });
    }
    function Collections(scope) {
      arity.max(1, arguments, Collections.name);
      scope = util2.defaults(scope, null);
      return new Expr({ collections: wrap(scope) });
    }
    function Databases(scope) {
      arity.max(1, arguments, Databases.name);
      scope = util2.defaults(scope, null);
      return new Expr({ databases: wrap(scope) });
    }
    function Indexes(scope) {
      arity.max(1, arguments, Indexes.name);
      scope = util2.defaults(scope, null);
      return new Expr({ indexes: wrap(scope) });
    }
    function Functions(scope) {
      arity.max(1, arguments, Functions.name);
      scope = util2.defaults(scope, null);
      return new Expr({ functions: wrap(scope) });
    }
    function Roles(scope) {
      arity.max(1, arguments, Roles.name);
      scope = util2.defaults(scope, null);
      return new Expr({ roles: wrap(scope) });
    }
    function Keys(scope) {
      arity.max(1, arguments, Keys.name);
      scope = util2.defaults(scope, null);
      return new Expr({ keys: wrap(scope) });
    }
    function Tokens(scope) {
      arity.max(1, arguments, Tokens.name);
      scope = util2.defaults(scope, null);
      return new Expr({ tokens: wrap(scope) });
    }
    function Credentials(scope) {
      arity.max(1, arguments, Credentials.name);
      scope = util2.defaults(scope, null);
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
      precision = util2.defaults(precision, null);
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
      precision = util2.defaults(precision, null);
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
      side = util2.defaults(side, null);
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
      exponent = util2.defaults(exponent, null);
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
      } else if (obj instanceof Expr || util2.checkInstanceHasProperty(obj, "_isFaunaExpr")) {
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
      rv._faunaFunctions.push(function(q) {
        return query.Map(q, lambda);
      });
      return rv;
    };
    PageHelper.prototype.filter = function(lambda) {
      var rv = this._clone();
      rv._faunaFunctions.push(function(q) {
        return query.Filter(q, lambda);
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
      var q = query.Paginate(this.set, opts);
      if (this._faunaFunctions.length > 0) {
        this._faunaFunctions.forEach(function(lambda) {
          q = lambda(q);
        });
      }
      return this.client.query(q, this.options);
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
    var util2 = require_util();
    function TimeoutError(message) {
      Error.call(this);
      this.message = message || "Request aborted due to timeout";
      this.isTimeoutError = true;
    }
    util2.inherits(TimeoutError, Error);
    function AbortError(message) {
      Error.call(this);
      this.message = message || "Request aborted";
      this.isAbortError = true;
    }
    util2.inherits(AbortError, Error);
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
    var util2 = require_util();
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
          var pathname = (options.path[0] === "/" ? options.path : "/" + options.path) + util2.querystringify(options.query, "?");
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
    var util2 = require_util();
    var faunaErrors = require_errors();
    var errors = require_errors2();
    function FetchAdapter(options) {
      options = options || {};
      this.type = "fetch";
      this._closed = false;
      this._fetch = util2.resolveFetch(options.fetch);
      this._pendingRequests = /* @__PURE__ */ new Map();
      if (util2.isNodeEnv() && options.keepAlive) {
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
      return this._fetch(util2.formatUrl(options.origin, options.path, options.query), {
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
      if (util2.isNodeEnv()) {
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
    var util2 = require_util();
    var errors = require_errors2();
    function HttpClient(options) {
      var isHttps = options.scheme === "https";
      if (!options.port) {
        options.port = isHttps ? 443 : 80;
      }
      var useHttp2Adapter = !options.fetch && util2.isNodeEnv() && isHttp2Supported();
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
        headers: util2.removeNullAndUndefinedValues(headers),
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
        if (util2.isNodeEnv()) {
          driverEnv.runtime = ["nodejs", process.version].join("-");
          driverEnv.env = util2.getNodeRuntimeEnv();
          var os = require_os();
          driverEnv.os = [os.platform(), os.release()].join("-");
        } else if (isServiceWorker) {
          driverEnv.runtime = "Service Worker";
        } else {
          driverEnv.runtime = util2.getBrowserDetails();
          driverEnv.env = "browser";
          driverEnv.os = getBrowserOsDetails();
        }
      } catch (_) {
      }
      var headers = {
        "X-FaunaDB-API-Version": packageJson.apiVersion
      };
      if (util2.isNodeEnv()) {
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
    var q = require_query();
    var util2 = require_util();
    var DefaultEvents = ["start", "error", "version", "history_rewrite"];
    var DocumentStreamEvents = DefaultEvents.concat(["snapshot"]);
    function StreamClient(client, expression, options, onEvent) {
      options = util2.applyDefaults(options, {
        fields: null
      });
      this._client = client;
      this._onEvent = onEvent;
      this._query = q.wrap(expression);
      this._urlParams = options.fields ? { fields: options.fields.join(",") } : null;
      this._abort = new AbortController();
      this._state = "idle";
    }
    StreamClient.prototype.snapshot = function() {
      var self2 = this;
      self2._client.query(q.Get(self2._query)).then(function(doc) {
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
    var util2 = require_util();
    var values = require_values();
    var notifyAboutNewVersion = util2.notifyAboutNewVersion();
    function Client(options) {
      var http2SessionIdleTime = getHttp2SessionIdleTime();
      options = util2.applyDefaults(options, {
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
      params = util2.defaults(params, {});
      options = util2.defaults(options, {});
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
      query2 = util2.defaults(query2, null);
      if (path instanceof values.Ref || util2.checkInstanceHasProperty(path, "_isFaunaRef")) {
        path = path.value;
      }
      if (query2 !== null) {
        query2 = util2.removeUndefinedValues(query2);
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
      var fromEnv = util2.getEnvVariable("FAUNADB_HTTP2_SESSION_IDLE_TIME");
      var parsed = fromEnv === "Infinity" ? Infinity : parseInt(fromEnv, 10);
      var useEnvVar = !isNaN(parsed);
      return {
        shouldOverride: useEnvVar,
        value: useEnvVar ? parsed : 500
      };
    }
    module.exports = Client;
    module.exports.resetNotifyAboutNewVersion = function() {
      notifyAboutNewVersion = util2.notifyAboutNewVersion();
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
    var util2 = require_util();
    var parseJSON = require_json().parseJSON;
    module.exports = util2.mergeObjects({
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

// test/node_modules/chai/index.mjs
var import_index = __toModule(require_chai2());
var expect = import_index.default.expect;
var version = import_index.default.version;
var Assertion = import_index.default.Assertion;
var AssertionError = import_index.default.AssertionError;
var util = import_index.default.util;
var config = import_index.default.config;
var use = import_index.default.use;
var should = import_index.default.should;
var assert = import_index.default.assert;
var core = import_index.default.core;

// app/globals.ts
var import_faunadb = __toModule(require_faunadb());

// app/fun/globalState.ts
var globalState;
function forceGlobalState() {
  return globalState = globalState || JSON.parse(localStorage.getItem("__GLOBAL_STATE__") || "{}");
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
      FAUNADB_DOMAIN: "db.us.fauna.com",
      MAPTILERKEY: localStorage.getItem("MAPTILER_SERVER_SECRET")
    });
    this.MAPTILERKEY = __privateGet(this, _accessKeys).MAPTILERKEY;
    this.CURRENT_USER = localStorage.getItem("user");
    this.TAXRATE = 0.01 * (getGlobalState("TAX_RATE") || 6);
    this.BATCH_SIZE = getGlobalState("BATCH_SIZE") || 1e3;
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
var isDebug = location.href.includes("localhost") || location.search.includes("debug");
function isNetlifyBuildContext() {
  return 0 <= location.href.indexOf("netlify");
}
var CONTEXT = isNetlifyBuildContext() ? "NETLIFY" : "dev";

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

// app/fun/dom.ts
function moveChildren(items, report) {
  while (items.firstChild)
    report.appendChild(items.firstChild);
}
function moveChildrenBefore(items, report) {
  while (items.firstChild)
    report.before(items.firstChild);
}
function moveChildrenAfter(items, report) {
  let head = report;
  while (items.firstChild) {
    const firstChild = items.firstChild;
    head.after(firstChild);
    head = firstChild;
  }
}

// app/fun/behavior/input.ts
function selectOnFocus(element) {
  on(element, "focus", () => element.select());
}
function formatAsCurrency(input) {
  const doit = () => {
    const textValue = input.value;
    const numericValue = input.valueAsNumber?.toFixed(2);
    if (textValue != numericValue) {
      input.value = numericValue;
    }
  };
  input.step = "0.01";
  input.addEventListener("change", doit);
  doit();
}
function formatUppercase(input) {
  addFormatter(() => {
    const textValue = (input.value || "").toUpperCase();
    if (textValue != input.value) {
      input.value = textValue;
    }
  }, input);
}
function addFormatter(change, input) {
  change();
  input.addEventListener("change", change);
}
function formatTrim(input) {
  addFormatter(() => {
    const textValue = (input.value || "").trim();
    if (textValue != input.value) {
      input.value = textValue;
    }
  }, input);
}
function getValueAsNumber(input) {
  if (!input.value)
    return 0;
  return input.valueAsNumber;
}

// app/fun/behavior/form.ts
function extendTextInputBehaviors(form) {
  const textInput = Array.from(form.querySelectorAll("input[type=text]"));
  textInput.forEach(selectOnFocus);
  textInput.filter((i) => i.classList.contains("trim")).forEach(formatTrim);
  textInput.filter((i) => i.classList.contains("uppercase")).forEach(formatUppercase);
}

// test/browser/tests.spec.ts
function sleep(ms) {
  return new Promise((good, bad) => {
    setTimeout(() => good(), ms);
  });
}
describe("tests fun/behavior/form", () => {
  it("tests extendTextInputBehaviors", async () => {
    const element = dom("form");
    const input = dom("input", {
      type: "text",
      class: "trim uppercase"
    });
    document.body.appendChild(element);
    element.appendChild(input);
    input.value = " input value ";
    extendTextInputBehaviors(element);
    assert.equal(input.value, "INPUT VALUE");
    await sleep(100);
    input.focus();
    assert.equal(input.selectionStart, 0, "start");
    assert.equal(input.selectionEnd, 11, "end");
    element.remove();
  });
});
describe("tests on/trigger", () => {
  it("tests on/trigger", () => {
    const element = dom("div");
    let counter = 0;
    on(element, "topic-1", () => counter++);
    trigger(element, "topic-1");
    assert.equal(counter, 1);
  });
});
describe("tests moveChildren", () => {
  it("tests moveChildren", () => {
    const source = dom("div");
    const target = dom("div");
    const child = dom("div");
    source.appendChild(child);
    moveChildren(source, target);
    assert.equal(child.parentElement, target);
  });
  it("tests moveChildrenAfter", () => {
    const source = dom("div");
    const target = dom("div");
    const child = dom("div");
    source.appendChild(child);
    const placeholder = dom("div");
    target.appendChild(placeholder);
    moveChildrenAfter(source, placeholder);
    assert.equal(child.parentElement, target);
    assert.equal(placeholder.nextElementSibling, child);
  });
  it("tests moveChildrenBefore", () => {
    const source = dom("div");
    const target = dom("div");
    const child = dom("div");
    source.appendChild(child);
    const placeholder = dom("div");
    target.appendChild(placeholder);
    moveChildrenBefore(source, placeholder);
    assert.equal(child.parentElement, target);
    assert.equal(placeholder.previousElementSibling, child);
  });
});
describe("tests fun/behavior/input", () => {
  it("tests formatAsCurrency", () => {
    const input = dom("input", {
      type: "number"
    });
    input.value = "1";
    formatAsCurrency(input);
    assert.equal(input.value, "1.00");
    input.valueAsNumber = 1.234;
    trigger(input, "change");
    assert.equal(input.value, "1.23");
  });
  it("tests formatTrim", () => {
    const input = dom("input", {
      type: "text"
    });
    input.value = " one ";
    formatTrim(input);
    assert.equal(input.value, "one");
  });
  it("tests formatUppercase", () => {
    const input = dom("input", {
      type: "text"
    });
    input.value = "one";
    formatUppercase(input);
    assert.equal(input.value, "ONE");
  });
  it("tests getValueAsNumber", () => {
    const input = dom("input", {
      type: "number"
    });
    input.value = "1.25";
    const value = getValueAsNumber(input);
    assert.equal(value, 1.25);
  });
  it("tests selectOnFocus", async () => {
    const input = dom("input", {
      type: "text"
    });
    document.body.appendChild(input);
    input.value = "X";
    selectOnFocus(input);
    input.focus();
    await sleep(10);
    assert.equal(input.selectionEnd, 1);
    input.remove();
  });
});
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/*!
 * ### ._obj
 *
 * Quick reference to stored `actual` value for plugin developers.
 *
 * @api private
 */
/*!
 * ### .ifError(object)
 *
 * Asserts if value is not a false value, and throws if it is a true value.
 * This is added to allow for chai to be a drop-in replacement for Node's
 * assert class.
 *
 *     var err = new Error('I am a custom error');
 *     assert.ifError(err); // Rethrows err!
 *
 * @name ifError
 * @param {Object} object
 * @namespace Assert
 * @api public
 */
/*!
 * Add a chainable method
 */
/*!
 * Aliases.
 */
/*!
 * Assert interface
 */
/*!
 * Assertion Constructor
 *
 * Creates object for chaining.
 *
 * `Assertion` objects contain metadata in the form of flags. Three flags can
 * be assigned during instantiation by passing arguments to this constructor:
 *
 * - `object`: This flag contains the target of the assertion. For example, in
 *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
 *   contain `numKittens` so that the `equal` assertion can reference it when
 *   needed.
 *
 * - `message`: This flag contains an optional custom error message to be
 *   prepended to the error message that's generated by the assertion when it
 *   fails.
 *
 * - `ssfi`: This flag stands for "start stack function indicator". It
 *   contains a function reference that serves as the starting point for
 *   removing frames from the stack trace of the error that's created by the
 *   assertion when it fails. The goal is to provide a cleaner stack trace to
 *   end users by removing Chai's internal functions. Note that it only works
 *   in environments that support `Error.captureStackTrace`, and only when
 *   `Chai.config.includeStack` hasn't been set to `false`.
 *
 * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
 *   should retain its current value, even as assertions are chained off of
 *   this object. This is usually set to `true` when creating a new assertion
 *   from within another assertion. It's also temporarily set to `true` before
 *   an overwritten assertion gets called by the overwriting assertion.
 *
 * @param {Mixed} obj target of the assertion
 * @param {String} msg (optional) custom error message
 * @param {Function} ssfi (optional) starting point for removing stack frames
 * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
 * @api private
 */
/*!
 * Assertion Error
 */
/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addLengthGuard utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - compareByInspect utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getOwnEnumerableProperties utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getOwnEnumerablePropertySymbols utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - isNaN utility
 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
 * MIT Licensed
 */
/*!
 * Chai - isProxyEnabled helper
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - proxify utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai dependencies.
 */
/*!
 * Chai version
 */
/*!
 * Check if a property exists
 */
/*!
 * Check to see if the MemoizeMap has recorded a result of the two operands
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {MemoizeMap} memoizeMap
 * @returns {Boolean|null} result
*/
/*!
 * Checks error against a given set of criteria
 */
/*!
 * Compare by inspect method
 */
/*!
 * Compare two Regular Expressions for equality.
 *
 * @param {RegExp} leftHandOperand
 * @param {RegExp} rightHandOperand
 * @return {Boolean} result
 */
/*!
 * Compare two Sets/Maps for equality. Faster than other equality functions.
 *
 * @param {Set} leftHandOperand
 * @param {Set} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
/*!
 * Configuration
 */
/*!
 * Core Assertions
 */
/*!
 * Deep equal utility
 */
/*!
 * Deep path info
 */
/*!
 * Dependencies that are used for multiple exports are required here only once
 */
/*!
 * Determine if the given object has an @@iterator function.
 *
 * @param {Object} target
 * @return {Boolean} `true` if the object has an @@iterator function.
 */
/*!
 * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
 * each key. If any value of the given key is not equal, the function will return false (early).
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
/*!
 * Ensure correct constructor
 */
/*!
 * Expect interface
 */
/*!
 * Flag transferring utility
 */
/*!
 * Flag utility
 */
/*!
 * Function name
 */
/*!
 * Get own enumerable properties method
 */
/*!
 * Get own enumerable property symbols method
 */
/*!
 * Gets all entries from a Generator. This will consume the generator - which could have side effects.
 *
 * @param {Generator} target
 * @returns {Array} an array of entries from the Generator.
 */
/*!
 * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
 * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
 *
 * @param {Object} target
 * @returns {Array} an array of entries from the @@iterator function
 */
/*!
 * Gets all own and inherited enumerable keys from a target.
 *
 * @param {Object} target
 * @returns {Array} an array of own and inherited enumerable keys from the target.
 */
/*!
 * Inherit from Error.prototype
 */
/*!
 * Inspect util
 */
/*!
 * Module dependencies
 */
/*!
 * Module dependencies.
 */
/*!
 * Module export.
 */
/*!
 * Module variables
 */
/*!
 * Object Display util
 */
/*!
 * Overwrite chainable method
 */
/*!
 * Primary Export
 */
/*!
 * Primary Exports
 */
/*!
 * Primary `Assertion` prototype
 */
/*!
 * Proxify util
 */
/*!
 * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
 * for each enumerable key in the object.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */
/*!
 * Returns true if the argument is a primitive.
 *
 * This intentionally returns true for all objects that can be compared by reference,
 * including functions and symbols.
 *
 * @param {Mixed} value
 * @return {Boolean} result
 */
/*!
 * Set the result of the equality into the MemoizeMap
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {MemoizeMap} memoizeMap
 * @param {Boolean} result
*/
/*!
 * Should interface
 */
/*!
 * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
/*!
 * Simple equality for generator objects such as those returned by generator functions.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
/*!
 * Statically set name
 */
/*!
 * The main logic of the `deepEqual` function.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (optional) Additional options
 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
    references to blow the stack.
 * @return {Boolean} equal match
*/
/*!
 * Utility Functions
 */
/*!
 * Utils for plugins (not exported)
 */
/*!
 * actual utility
 */
/*!
 * add Method
 */
/*!
 * add Property
 */
/*!
 * addLengthGuard util
 */
/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * expectTypes utility
 */
/*!
 * getOperator method
 */
/*!
 * isNaN method
 */
/*!
 * isProxyEnabled helper
 */
/*!
 * message utility
 */
/*!
 * overwrite Method
 */
/*!
 * overwrite Property
 */
/*!
 * test utility
 */
/*!
 * type utility
 */
//# sourceMappingURL=browser.js.map
