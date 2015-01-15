"use strict";

module.exports = recurse;
var path = require("path");
var through = require("through2");
var vfs = require("vinyl-fs");

/**
 * Return a transform stream recursing through directory to yield
 * Sass/SCSS files instead.
 *
 * @return {Object}
 */
function recurse() {
  return through.obj(function (file, enc, cb) {
    var _this = this;
    if (file.isBuffer()) {
      // Pass-through.
      return cb(null, file);
    }

    if (!file.isDirectory()) {
      // Don't know how to handle this object.
      return cb(new Error("Unsupported stream object."));
    }

    // It's a directory, find inner Sass/SCSS files.
    var pattern = path.resolve(file.path, "**/*.+(sass|scss)");

    vfs.src(pattern).pipe(through.obj(function (file, enc, cb) {
      // Append to "parent" stream.
      _this.push(file);
      cb();
    }, function () {
      // All done.
      cb();
    }));
  });
}