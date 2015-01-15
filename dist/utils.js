"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

exports.eachItem = eachItem;
exports.getDateTime = getDateTime;
exports.denodeify = denodeify;
exports.defer = defer;
exports.g2b = g2b;
var path = require("path");
var each = require("lodash.foreach");
var glob2base = require("glob2base");
var Glob = require("glob").Glob;

function eachItem(byTypeAndName, cb) {
  each(byTypeAndName, function (typeObj) {
    each(typeObj, function (item) {
      cb(item);
    });
  });
}

// Get file extension.
var ext = exports.ext = function (file) {
  return path.extname(file).substr(1);
};

/**
 * Get current date/time.
 *
 * @param {Date} date
 * @return {String} Stringified date time.
 */
function getDateTime() {
  var date = arguments[0] === undefined ? new Date() : arguments[0];
  return (function () {
    var y = undefined,
        m = undefined,
        d = undefined,
        h = undefined,
        i = undefined,
        s = undefined;

    y = date.getFullYear();
    m = exports.pad(date.getMonth() + 1);
    d = exports.pad(date.getDate());
    h = exports.pad(date.getHours());
    i = exports.pad(date.getMinutes());
    s = exports.pad(date.getSeconds());

    return "" + y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
  })();
}

// Pad a number with a leading 0 if inferior to 10.
var pad = exports.pad = function (value) {
  return (value < 10 ? "0" : "") + value;
};

// Namespace delimiters.
var nsDelimiters = ["::", ":", "\\.", "/"];
var ns = new RegExp(nsDelimiters.join("|"), "g");

// Split a namespace on possible namespace delimiters.
var splitNamespace = exports.splitNamespace = function (value) {
  return value.split(ns);
};

function denodeify(fn) {
  return function () {
    for (var _len = arguments.length,
        args = Array(_len),
        _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      fn.apply(undefined, _toArray(args).concat([function (err) {
        for (var _len2 = arguments.length,
            args = Array(_len2 > 1 ? _len2 - 1 : 0),
            _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        if (err) {
          reject(err);
          return;
        }

        resolve.apply(undefined, _toArray(args));
      }]));
    });
  };
}

function defer() {
  /* jshint ignore:start */
  var resolve = undefined,
      reject = undefined;

  var promise = new Promise(function (resolve_, reject_) {
    resolve = resolve_;
    reject = reject_;
  });

  return {
    promise: promise,
    resolve: resolve,
    reject: reject };
  /* jshint ignore:end */
}

/**
 * Get the base directory of given glob pattern (see `glob2base`).
 *
 * If it's an array, take the first one.
 *
 * @param {Array|String} src Glob pattern or array of glob patterns.
 * @return {String}
 */
function g2b(src) {
  return glob2base(new Glob([].concat(src)[0]));
}

/**
 * Type checking helpers.
 */
var toString = function (arg) {
  return Object.prototype.toString.call(arg);
};

var is = exports.is = {
  undef: function (arg) {
    return arg === void 0;
  },
  string: function (arg) {
    return typeof arg === "string";
  },
  "function": function (arg) {
    return typeof arg === "function";
  },
  object: function (arg) {
    return typeof arg === "object" && arg !== null;
  },
  plainObject: function (arg) {
    return toString(arg) === "[object Object]";
  },
  array: function (arg) {
    return Array.isArray(arg);
  },
  error: function (arg) {
    return is.object(arg) && (toString(arg) === "[object Error]" || arg instanceof Error);
  },
  promise: function (arg) {
    return arg && is["function"](arg.then);
  },
  stream: function (arg) {
    return arg && is["function"](arg.pipe);
  } };