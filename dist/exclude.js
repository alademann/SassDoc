"use strict";

module.exports = exclude;
var through = require("through2");
var minimatch = require("minimatch");

/**
 * @param {Array} patterns
 * @return {Object}
 */
function exclude(patterns) {
  return through.obj(function (file, enc, cb) {
    if (patterns.find(function (x) {
      return minimatch(file.relative, x);
    })) {
      return cb();
    }

    cb(null, file);
  });
}