"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var EventEmitter = require("events").EventEmitter;
var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");
var errors = require("./errors");
var utils = require("./utils");
var converter = require("sass-convert");

var Environment = (function (EventEmitter) {
  /**
   * @param {Logger} logger
   * @param {Boolean} strict
   */
  function Environment(logger) {
    var _this = this;
    var strict = arguments[1] === undefined ? false : arguments[1];
    _get(Object.getPrototypeOf(Environment.prototype), "constructor", this).call(this);

    this.logger = logger;
    this.strict = strict;

    this.on("error", function (error) {
      var friendlyErrors = [errors.SassDocError, converter.BinaryError, converter.VersionError];

      if (friendlyErrors.find(function (c) {
        return error instanceof c;
      })) {
        logger.error(error.message);
      } else {
        if (utils.is.error(error) && "stack" in error) {
          logger.error(error.stack);
        } else {
          logger.error(error);
        }
      }
    });

    if (strict) {
      this.on("warning", function (warning) {
        return _this.emit("error", warning);
      });
    } else {
      this.on("warning", function (warning) {
        return logger.warn(warning.message);
      });
    }
  }

  _inherits(Environment, EventEmitter);

  _prototypeProperties(Environment, null, {
    load: {

      /**
       * @param {Object|String} config
       */
      value: function load(config) {
        if (!config) {
          return this.loadDefaultFile();
        }

        if (typeof config === "string") {
          return this.loadFile(config);
        }

        if (typeof config === "object") {
          return this.loadObject(config);
        }

        this.emit("error", new errors.SassDocError("Invalid `config` argument, expected string, object or undefined."));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    loadObject: {

      /**
       * Merge given configuration object, excluding reserved keys.
       *
       * @param {Object} config
       */
      value: function loadObject(config) {
        if (this.file) {
          this.file = path.resolve(this.file);
          this.dir = path.dirname(this.file);
        }

        for (var _iterator = Object.keys(config)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
          var k = _step.value;
          if (k in this) {
            return this.emit("error", new Error("Reserved configuration key \"" + k + "\"."));
          }

          this[k] = config[k];
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    loadFile: {

      /**
       * Get the configuration object from given file.
       *
       * If the file is not found, emit a warning and fallback to default.
       *
       * The `dir` property will be the directory of the given file or the CWD
       * if no file is given. The configuration paths should be relative to
       * it.
       *
       * The given logger will be injected in the configuration object for
       * further usage.
       *
       * @param {String} file
       */
      value: function loadFile(file) {
        this.file = file;

        if (!this.tryLoadCurrentFile()) {
          this.emit("warning", new errors.Warning("Config file \"" + file + "\" not found."));
          this.logger.warn("Falling back to `.sassdocrc`");
          this.loadDefaultFile();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    loadDefaultFile: {

      /**
       * Try to load default `.sassdocrc` configuration file, or fallback
       * to an empty object.
       */
      value: function loadDefaultFile() {
        this.file = ".sassdocrc";
        this.tryLoadCurrentFile();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    postProcess: {

      /**
       * Post process the configuration to ensure `package` and `theme`
       * have uniform values.
       *
       * The `package` key is ensured to be an object. If it's a string, it's
       * required as JSON, relative to the configuration file directory.
       *
       * The `theme` key, if present and not already a function, will be
       * resolved to the actual theme function.
       */
      value: function postProcess() {
        if (!this.dir) {
          this.dir = process.cwd();
        }

        if (!this["package"]) {
          this["package"] = {};
        }

        if (typeof this["package"] !== "object") {
          this.loadPackage();
        }

        if (typeof this.theme !== "function") {
          this.loadTheme();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    loadPackage: {

      /**
       * Process `this.package`.
       */
      value: function loadPackage() {
        var file = this.resolve(this["package"]);
        this["package"] = this.tryParseFile(file);

        if (this["package"]) {
          return;
        }

        this.emit("warning", new errors.Warning("Package file \"" + file + "\" not found."));
        this.logger.warn("Falling back to `package.json`.");

        file = this.resolve("package.json");
        this["package"] = this.tryParseFile(file);

        if (this["package"]) {
          return;
        }

        this.logger.warn("No package information.");
        this["package"] = {};
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    loadTheme: {

      /**
       * Process `this.theme`.
       */
      value: function loadTheme() {
        this.themeName = this.theme || "default";

        if (this.theme === undefined) {
          return this.defaultTheme();
        }

        if (this.theme.indexOf("/") === -1) {
          return this.tryTheme("sassdoc-theme-" + this.theme);
        }

        return this.tryTheme(this.resolve(this.theme));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    tryTheme: {

      /**
       * Try to load given theme module, or fallback to default theme.
       *
       * @param {String} module
       */
      value: function tryTheme(module) {
        try {
          require.resolve(module);
        } catch (err) {
          this.emit("warning", new errors.Warning("Theme \"" + this.theme + "\" not found."));
          this.logger.warn("Falling back to default theme.");
          return this.defaultTheme();
        }

        this.theme = require(module);
        var str = Object.prototype.toString;

        if (typeof this.theme !== "function") {
          this.emit("error", new errors.SassDocError("Given theme is " + str(this.theme) + ", expected " + str(str) + "."));

          return this.defaultTheme();
        }

        if (this.theme.length !== 2) {
          this.logger.warn("Given theme takes " + this.theme.length + " arguments, expected 2.");
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    defaultTheme: {

      /**
       * Load `sassdoc-theme-default`.
       */
      value: function defaultTheme() {
        try {
          require.resolve("sassdoc-theme-default");
        } catch (err) {
          this.emit("error", new errors.SassDocError("Holy shit, the default theme was not found!"));
        }

        this.theme = require("sassdoc-theme-default");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    tryLoadCurrentFile: {

      /**
       * Try to load `this.file`, and if not found, return `false`.
       *
       * @return {Boolean}
       */
      value: function tryLoadCurrentFile() {
        var config = this.tryParseFile(this.file);

        if (!config) {
          return false;
        }

        this.load(config);

        return true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    tryParseFile: {

      /**
       * Try `this.parseFile` and return `false` if an `ENOENT` error
       * is thrown.
       *
       * Other exceptions are passed to the `error` event.
       *
       * @param {String} file
       * @return {*}
       */
      value: function tryParseFile(file) {
        try {
          return this.parseFile(file);
        } catch (e) {
          if (e.code !== "ENOENT") {
            return this.emit("error", e);
          }
        }

        return false;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    parseFile: {

      /**
       * Load YAML or JSON from given file.
       *
       * @param {String} file
       * @return {*}
       */
      value: function parseFile(file) {
        return yaml.safeLoad(fs.readFileSync(file, "utf-8"));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    resolve: {

      /**
       * Resolve given file from `this.dir`.
       *
       * @param {String} file
       * @return {String}
       */
      value: function resolve(file) {
        return path.resolve(this.dir, file);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Environment;
})(EventEmitter);

module.exports = Environment;