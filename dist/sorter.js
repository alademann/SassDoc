"use strict";

module.exports = sort;
/**
 * @param {Array} data An array of SassDoc data objects.
 * @return {Array} The sorted data.
 */
function sort(data) {
  return data.sort(function (a, b) {
    return compare(a.group[0][0].toLowerCase(), b.group[0][0].toLowerCase()) || compare(a.file.path, b.file.path) || compare(a.context.line.start, b.context.line.start);
  });
}

function compare(a, b) {
  switch (true) {
    case a > b:
      return 1;
    case a === b:
      return 0;
    default:
      return -1;
  }
}