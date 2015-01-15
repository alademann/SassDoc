"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var AnnotationsApi = require("./annotation");
var ScssCommentParser = require("scss-comment-parser");
var through = require("through2");
var concat = require("concat-stream");
var path = require("path");
var utils = require("./utils");
var errors = require("./errors");

var Parser = (function () {
  function Parser(env, additionalAnnotations) {
    this.annotations = new AnnotationsApi(env);
    this.annotations.addAnnotations(additionalAnnotations);
    this.scssParser = new ScssCommentParser(this.annotations.list, env);

    this.scssParser.commentParser.on("warning", function (warning) {
      env.emit("warning", new errors.Warning(warning.message));
    });
  }

  _prototypeProperties(Parser, null, {
    parse: {
      value: function parse(code, id) {
        return this.scssParser.parse(code, id);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    postProcess: {

      /**
       * Invoke the `resolve` function of an annotation if present.
       * Called with all found annotations except with type "unkown".
       */
      value: function postProcess(data) {
        var _this = this;
        Object.keys(this.annotations.list).forEach(function (key) {
          var annotation = _this.annotations.list[key];

          if (annotation.resolve) {
            annotation.resolve(data);
          }
        });

        return data;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    stream: {

      /**
       * Return a transform stream meant to be piped in a stream of SCSS
       * files. Each file will be passed-through as-is, but they are all
       * parsed to generate a SassDoc data array.
       *
       * The returned stream has an additional `promise` property, containing
       * a `Promise` object that will be resolved when the stream is done and
       * the data is fulfiled.
       *
       * @param {Object} parser
       * @return {Object}
       */
      value: function stream() {
        var _this2 = this;
        var deferred = utils.defer();
        var data = [];

        var transform = function (file, enc, cb) {
          // Pass-through.
          cb(null, file);

          var parseFile = function (_ref) {
            var buf = _ref.buf;
            var name = _ref.name;
            var path = _ref.path;
            var fileData = _this2.parse(buf.toString(enc), name);

            fileData.forEach(function (item) {
              item.file = {
                path: path,
                name: name };

              data.push(item);
            });
          };

          if (file.isBuffer()) {
            var args = {
              buf: file.contents,
              name: path.basename(file.relative),
              path: file.relative };

            parseFile(args);
          }

          if (file.isStream()) {
            file.pipe(concat(function (buf) {
              parseFile({ buf: buf });
            }));
          }
        };

        var flush = function (cb) {
          data = data.filter(function (item) {
            return item.context.type !== "unknown";
          });
          data = _this2.postProcess(data);

          deferred.resolve(data);
          cb();
        };

        var filter = through.obj(transform, flush);
        filter.promise = deferred.promise;

        return filter;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Parser;
})();

module.exports = Parser;