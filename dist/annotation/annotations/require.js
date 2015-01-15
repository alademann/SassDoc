"use strict";

var utils = require("../../utils");
var uniq = require("lodash.uniq");

var reqRegEx = /^\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:\[([^\]]*)\])?\s*(?:-?\s*([^<$]*))?\s*(?:<?\s*(.*)\s*>)?$/;

module.exports = function (env) {
  return {
    name: "require",

    parse: function parse(text) {
      var match = reqRegEx.exec(text.trim());

      var obj = {
        type: match[1] || "function",
        name: match[2] };

      obj.external = utils.splitNamespace(obj.name).length > 1;

      if (obj.name.indexOf("$") === 0) {
        obj.type = "variable";
        obj.name = obj.name.slice(1);
      }

      if (obj.name.indexOf("%") === 0) {
        obj.type = "placeholder";
        obj.name = obj.name.slice(1);
      }

      if (match[4]) {
        obj.description = match[4].trim();
      }

      if (match[5]) {
        obj.url = match[5];
      }

      return obj;
    },

    autofill: function autofill(item) {
      var type = item.context.type;

      if (type === "mixin" || type === "placeholder" || type === "function") {
        var _ret = (function () {
          var handWritten = undefined;

          if (item.require) {
            handWritten = {};

            item.require.forEach(function (reqObj) {
              handWritten[reqObj.type + "-" + reqObj.name] = true;
            });
          }

          // Searching for mixins and functions.
          var mixins = [];
          var functions = [];
          var mixinFunctionRegex = /\s*([\w\d_-]*)\(/g;
          var match = undefined;

          while (match = mixinFunctionRegex.exec(item.context.code)) {
            // Try if this is a mixin or functio.n
            if (compareBefore(item.context.code, "@include", match.index)) {
              if (!isAnnotatedByHand(handWritten, "mixin", match[1])) {
                mixins.push(match[1]);
              }
            } else {
              if (!isAnnotatedByHand(handWritten, "function", match[1])) {
                functions.push(match[1]);
              }
            }
          }

          var placeholders = searchForMatches(item.context.code, /@extend\s+%([^;\s]+)/ig, isAnnotatedByHand.bind(null, handWritten, "mixin"));

          var variables = searchForMatches(item.context.code, /\$([a-z0-9_-]+)/ig, isAnnotatedByHand.bind(null, handWritten, "variable"));

          // Create object for each required item.
          mixins = mixins.map(typeNameObject("mixin"));
          functions = functions.map(typeNameObject("function"));
          placeholders = placeholders.map(typeNameObject("placeholder"));
          variables = variables.map(typeNameObject("variable"));

          // Merge all arrays.
          var all = [].concat(mixins, functions, placeholders, variables);

          // Merge in user supplyed requires if there are any.
          if (item.require && item.require.length > 0) {
            all = all.concat(item.require);
          }

          // Filter empty values.
          all = all.filter(function (x) {
            return x !== undefined;
          });

          if (all.length > 0) {
            all = uniq(all, "name");

            // Filter the item itself.
            all = all.filter(function (x) {
              return !(x.name === item.context.name && x.type === item.context.type);
            });

            return {
              v: all
            };
          }
        })();

        if (typeof _ret === "object") return _ret.v;
      }
    },

    resolve: function resolve(data) {
      data.forEach(function (item) {
        if (item.require === undefined) {
          return;
        }

        item.require = item.require.map(function (req) {
          if (req.external === true) {
            return req;
          }

          var reqItem = data.find(function (x) {
            return x.context.name === req.name;
          });

          if (reqItem === undefined) {
            if (!req.autofill) {
              env.logger.log("Item \"" + item.context.name + "\" requires \"" + req.name + "\" from type \"" + req.type + "\" but this item doesn't exist.");
            }

            return;
          }

          if (!Array.isArray(reqItem.usedBy)) {
            reqItem.usedBy = [];

            reqItem.usedBy.toJSON = function () {
              return reqItem.usedBy.map(function (item) {
                return {
                  description: item.description,
                  context: item.context };
              });
            };
          }

          reqItem.usedBy.push(item);
          req.item = reqItem;

          return req;
        }).filter(function (x) {
          return x !== undefined;
        });

        if (item.require.length > 0) {
          item.require.toJSON = function () {
            return item.require.map(function (item) {
              var obj = {
                type: item.type,
                name: item.name,
                external: item.external };

              if (item.external) {
                obj.url = item.url;
              } else {
                obj.description = item.description;
                obj.context = item.context;
              }

              return obj;
            });
          };
        }
      });
    },

    alias: ["requires"] };
};

function isAnnotatedByHand(handWritten, type, name) {
  if (type && name && handWritten) {
    return handWritten[type + "-" + name];
  }

  return false;
}

function searchForMatches(code, regex, isAnnotatedByHand) {
  var match = undefined;
  var matches = [];

  while (match = regex.exec(code)) {
    if (!isAnnotatedByHand(match[1])) {
      matches.push(match[1]);
    }
  }

  return matches;
}

function typeNameObject(type) {
  return function (name) {
    if (name.length > 0) {
      return {
        type: type,
        name: name,
        autofill: true };
    }
  };
}

function compareBefore(code, str, index) {
  for (var i = index - str.length,
      b = 0; i < index; i++) {
    if (code[i] !== str[b]) {
      return false;
    }

    b++;
  }

  return true;
}