"use strict";

module.exports = example;
/**
 * `@example` is a multiline annotation.
 *
 * Check if there is something on the first line and use it as the type information.
 *
 * @example html - description
 * <div></div>
 */

var descRegEx = /(\w+)\s*(?:-?\s*(.*))/;

function example() {
  return {
    name: "example",

    parse: function parse(text) {
      var _example = {
        type: "scss", // Default to `scss`.
        code: text };

      // Get the optional type info.
      var optionalType = text.substr(0, text.indexOf("\n"));

      if (optionalType.trim().length !== 0) {
        var typeDesc = descRegEx.exec(optionalType);
        _example.type = typeDesc[1];
        if (typeDesc[2].length !== 0) {
          _example.description = typeDesc[2];
        }
        _example.code = text.substr(optionalType.length + 1); // Remove the type
      }

      // Remove all leading/trailing line breaks.
      _example.code = _example.code.replace(/^\n|\n$/g, "");

      return _example;
    } };
}