"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

exports = module.exports = sassdoc;
exports.parseFilter = parseFilter;
exports.ensureEnvironment = ensureEnvironment;
exports.parse = parse;
var _require = require("./utils");

var denodeify = _require.denodeify;
var is = _require.is;
var g2b = _require.g2b;


var Environment = require("./environment");
var Logger = require("./logger");
var Parser = require("./parser");
var errors = require("./errors");
var sorter = require("./sorter");
var exclude = require("./exclude");
var recurse = require("./recurse");

var fs = require("fs");
var path = require("path"); // jshint ignore:line
var difference = require("lodash.difference"); // jshint ignore:line
var mkdir = denodeify(require("mkdirp"));
var safeWipe = require("safe-wipe");
var vfs = require("vinyl-fs");
var converter = require("sass-convert");
var pipe = require("multipipe"); // jshint ignore:line
var through = require("through2");

/**
 * Expose lower API blocks.
 */
exports.Environment = Environment;
exports.Logger = Logger;
exports.Parser = Parser;
exports.sorter = sorter;
exports.errors = errors;


/**
 * Boostrap Parser and AnnotationsApi, execute parsing phase.
 * @return {Stream}
 * @return {Promise} - as a property of Stream.
 */
function parseFilter() {
  var env = arguments[0] === undefined ? {} : arguments[0];
  env = ensureEnvironment(env);

  var parser = new Parser(env, env.theme && env.theme.annotations);
  var filter = parser.stream();

  filter.promise.then(function (data) {
    return sorter(data);
  });

  return filter;
}

/**
 * Ensure a proper Environment Object and events.
 * @return {Object}
 */
function ensureEnvironment(config) {
  var onError = arguments[1] === undefined ? function (e) {
    throw e;
  } : arguments[1];
  if (config instanceof Environment) {
    config.on("error", onError);
    return config;
  }

  var logger = config.logger || new Logger(config.verbose, process.env.SASSDOC_DEBUG);
  var env = new Environment(logger, config.strict);

  env.on("error", onError);
  env.load(config);
  env.postProcess();

  return env;
}

/**
 * Default public API method.
 * @param {String | Array} src
 * @param {Object} env
 * @return {Promise | Stream}
 * @see srcEnv
 */
function sassdoc() {
  for (var _len = arguments.length,
      args = Array(_len),
      _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return srcEnv(documentize, stream).apply(undefined, _toArray(args)); // jshint ignore:line

  /**
   * Safely wipe and re-create the destination directory.
   * @return {Promise}
   */
  function refresh(env) {
    // jshint ignore:line
    return safeWipe(env.dest, {
      force: true,
      parent: is.string(env.src) || is.array(env.src) ? g2b(env.src) : null,
      silent: true }).then(function () {
      return mkdir(env.dest);
    }).then(function () {
      env.logger.log("Folder \"" + env.dest + "\" successfully refreshed.");
    })["catch"](function (err) {
      // Friendly error for already existing directory.
      throw new errors.SassDocError(err.message);
    });
  }

  /**
   * Render theme with parsed data context.
   * @return {Promise}
   */
  function theme(env) {
    // jshint ignore:line
    var promise = env.theme(env.dest, env);

    if (!is.promise(promise)) {
      var type = Object.prototype.toString.call(promise);
      throw new errors.Error("Theme didn't return a promise, got " + type + ".");
    }

    return promise.then(function () {
      var themeName = env.themeName || "anonymous";
      env.logger.log("Theme \"" + themeName + "\" successfully rendered.");
    });
  }

  /**
   * Execute full SassDoc sequence from a source directory.
   * @return {Promise}
   */
  function documentize(env) {
    var data;
    return regeneratorRuntime.async(function documentize$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return baseDocumentize(env);
        case 2:
          data = context$2$0.sent;
          context$2$0.prev = 3;
          context$2$0.next = 6;
          return refresh(env);
        case 6:
          context$2$0.next = 8;
          return theme(env);
        case 8:
          okay(env);
          context$2$0.next = 15;
          break;
        case 11:
          context$2$0.prev = 11;
          context$2$0.t0 = context$2$0["catch"](3);
          env.emit("error", context$2$0.t0);
          throw context$2$0.t0;
        case 15:
          return context$2$0.abrupt("return", data);
        case 16:
        case "end":
          return context$2$0.stop();
      }
    }, null, this, [[3, 11]]);
  }

  /**
   * Execute full SassDoc sequence from a Vinyl files stream.
   * @return {Stream}
   * @return {Promise} - as a property of Stream.
   */
  function stream(env) {
    var filter = parseFilter(env);

    filter.promise.then(function (data) {
      env.logger.log("SCSS files successfully parsed.");
      env.data = data;
    });

    /* jshint ignore:start */

    /**
     * Returned Promise await the full sequence,
     * instead of just the parsing step.
     */
    filter.promise = new Promise(function (resolve, reject) {
      function documentize() {
        return regeneratorRuntime.async(function documentize$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.prev = 0;
              context$4$0.next = 3;
              return refresh(env);
            case 3:
              context$4$0.next = 5;
              return theme(env);
            case 5:
              okay(env);
              resolve();
              context$4$0.next = 14;
              break;
            case 9:
              context$4$0.prev = 9;
              context$4$0.t1 = context$4$0["catch"](0);
              reject(context$4$0.t1);
              env.emit("error", context$4$0.t1);
              throw context$4$0.t1;
            case 14:
            case "end":
              return context$4$0.stop();
          }
        }, null, this, [[0, 9]]);
      }

      filter.on("end", documentize).on("error", function (err) {
        return env.emit("error", err);
      }).resume(); // Drain.
    });

    /* jshint ignore:end */

    return filter;
  }
}

/**
 * Parse and return data object.
 * @param {String | Array} src
 * @param {Object} env
 * @return {Promise | Stream}
 * @see srcEnv
 */
function parse() {
  for (var _len2 = arguments.length,
      args = Array(_len2),
      _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  // jshint ignore:line
  /* jshint ignore:start */

  return srcEnv(documentize, stream).apply(undefined, _toArray(args));

  /**
   * @return {Promise}
   */
  function documentize(env) {
    var data;
    return regeneratorRuntime.async(function documentize$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return baseDocumentize(env);
        case 2:
          data = context$2$0.sent;
          okay(env);

          return context$2$0.abrupt("return", data);
        case 5:
        case "end":
          return context$2$0.stop();
      }
    }, null, this);
  }

  /* jshint ignore:end */

  /**
   * Don't pass files through, but pass final data at the end.
   * @return {Stream}
   */
  function stream(env) {
    // jshint ignore:line
    var _parse = parseFilter(env);

    var filter = through.obj(function (file, enc, cb) {
      return cb();
    }, function (cb) {
      var _this = this;
      _parse.promise.then(function (data) {
        _this.push(data);
        cb();
      }, cb);
    });

    return pipe(_parse, filter);
  }
}

/**
 * Source directory fetching and parsing.
 */
function baseDocumentize(env) {
  var filter, streams, pipeline;
  return regeneratorRuntime.async(function baseDocumentize$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        filter = parseFilter(env);


        filter.promise.then(function (data) {
          env.logger.log("Folder \"" + env.src + "\" successfully parsed.");
          env.data = data;

          env.logger.debug(function () {
            fs.writeFile("sassdoc-data.json", JSON.stringify(data, null, 2) + "\n");

            return "Dumping data to \"sassdoc-data.json\".";
          });
        });

        streams = [// jshint ignore:line
        vfs.src(env.src), recurse(), exclude(env.exclude || []), converter({ from: "sass", to: "scss" }), filter];
        pipeline = function () {
          return new Promise(function (resolve, reject) {
            pipe.apply(undefined, _toArray(streams).concat([function (err) {
              err ? reject(err) : resolve();
            }])).resume(); // Drain.
          });
        };

        context$1$0.prev = 4;
        context$1$0.next = 7;
        return pipeline();
      case 7:
        context$1$0.next = 13;
        break;
      case 9:
        context$1$0.prev = 9;
        context$1$0.t2 = context$1$0["catch"](4);
        env.emit("error", context$1$0.t2);
        throw context$1$0.t2;
      case 13:
        return context$1$0.abrupt("return", env.data);
      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, null, this, [[4, 9]]);
}

/**
 * Return a function taking optional `src` string or array, and optional
 * `env` object (arguments are found by their type).
 *
 * If `src` is set, proxy to `documentize`, otherwise `stream`.
 *
 * Both functions will be passed the `env` object, which will have a
 * `src` key.
 */
function srcEnv(documentize, stream) {
  return function () {
    for (var _len3 = arguments.length,
        args = Array(_len3),
        _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var src = args.find(function (a) {
      return is.string(a) || is.array(a);
    });
    var env = args.find(is.plainObject);

    env = ensureEnvironment(env || {});

    env.logger.debug("process.argv:", function () {
      return JSON.stringify(process.argv);
    });
    env.logger.debug("sassdoc version:", function () {
      return require("../package.json").version;
    });
    env.logger.debug("node version:", function () {
      return process.version.substr(1);
    });

    env.logger.debug("npm version:", function () {
      var prefix = path.resolve(process.execPath, "../../lib");
      var pkg = path.resolve(prefix, "node_modules/npm/package.json");

      try {
        return require(pkg).version;
      } catch (e) {
        return "unknown";
      }
    });

    env.logger.debug("platform:", function () {
      return process.platform;
    });
    env.logger.debug("cwd:", function () {
      return process.cwd();
    });

    env.src = src;
    env.dest = env.dest || "sassdoc";

    env.logger.debug("env:", function () {
      var clone = {};

      difference(Object.getOwnPropertyNames(env), ["domain", "_events", "_maxListeners", "logger"]).forEach(function (k) {
        return clone[k] = env[k];
      });

      return JSON.stringify(clone, null, 2);
    });

    var task = env.src ? documentize : stream;
    env.logger.debug("task:", function () {
      return task.name;
    });

    return task(env);
  };
}

/**
 * Log final success message.
 */
function okay(env) {
  // jshint ignore:line
  env.logger.log("Process over. Everything okay!");
}
// jshint ignore:line
/* jshint ignore:start */

/* jshint ignore:end */
// jshint ignore:line


/* jshint ignore:start */

/* jshint ignore:end */