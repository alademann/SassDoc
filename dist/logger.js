"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }

  return target;
};

var chalk = require("chalk");
var getDateTime = require("./utils").getDateTime;

// Helpers.
var br = function (str) {
  return "[" + str + "]";
}; // Wrap in brackets.
var prepend = function (arg, arr) {
  return [arg].concat(arr);
}; // Prepend.
var date = function (arr) {
  return prepend(br(getDateTime()), arr);
}; // Prepend date.
var flag = function (name, arr) {
  return prepend(br(name), arr);
}; // Prepend flag.
var log = function (arr) {
  return date(arr).join(" ");
}; // Log.
var flog = function (name, arr) {
  return log(flag(name, arr));
};var Logger = (function () {
  function Logger() {
    var verbose = arguments[0] === undefined ? false : arguments[0];
    var debug = arguments[1] === undefined ? false : arguments[1];
    this.verbose = verbose;
    this.debug_ = debug;
  }

  _prototypeProperties(Logger, null, {
    log: {

      /**
       * Log arguments into stderr if the verbose mode is enabled.
       */
      value: (function (_log) {
        var _logWrapper = function log() {
          return _log.apply(this, arguments);
        };

        _logWrapper.toString = function () {
          return _log.toString();
        };

        return _logWrapper;
      })(function () {
        for (var _len = arguments.length,
            args = Array(_len),
            _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (this.verbose) {
          console.error(log(args));
        }
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    warn: {

      /**
       * Always log arguments as warning into stderr.
       */
      value: function warn() {
        for (var _len2 = arguments.length,
            args = Array(_len2),
            _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        chalkHack(function () {
          return console.error(chalk.yellow(flog("WARNING", args)));
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    error: {

      /**
       * Always log arguments as error into stderr.
       */
      value: function error() {
        for (var _len3 = arguments.length,
            args = Array(_len3),
            _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        chalkHack(function () {
          return console.error(chalk.red(flog("ERROR", args)));
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    debug: {

      /**
       * Log arguments into stderr if debug mode is enabled (will call all
       * argument functions to allow "lazy" arguments).
       */
      value: function debug() {
        for (var _len4 = arguments.length,
            args = Array(_len4),
            _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        if (this.debug_) {
          chalkHack(function () {
            console.error(chalk.grey(flog("DEBUG", args.map(function (f) {
              if (f instanceof Function) {
                return f();
              }

              return f;
            }))));
          });
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Logger;
})();

exports["default"] = Logger;
var empty = exports.empty = {
  log: function () {},
  warn: function () {},
  error: function () {},
  debug: function () {} };

/**
 * Chalk don't allow us to create a new instance with our own `enabled`
 * value (internal functions always reference the global export). Here
 * we want to enable it if stderr is a TTY, but it's not acceptable to
 * modify the global context for this purpose.
 *
 * So this hack will set `chalk.enabled` for the time of the synchronous
 * callback execution, then reset it to whatever was its default value.
 */
function chalkHack(cb) {
  var enabled = chalk.enabled;
  chalk.enabled = process.stderr.isTTY;
  cb();
  chalk.enabled = enabled;
}
// Log with flag.

module.exports = _extends(exports["default"], exports);