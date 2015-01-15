"use strict";

module.exports = return_;
var typeRegEx = /^\s*(?:\{(.*)\})?\s*(?:-?\s*([\s\S]*))?/;

function return_() {
  return {
    name: "return",

    parse: function parse(text) {
      var parsed = typeRegEx.exec(text);
      var obj = {};

      if (parsed[1]) {
        obj.type = parsed[1];
      }

      if (parsed[2]) {
        obj.description = parsed[2];
      }

      return obj;
    },

    alias: ["returns"],

    allowedOn: ["function"],

    multiple: false };
}