"use strict";

module.exports = alias;
function alias(env) {
  return {
    name: "alias",

    parse: function parse(text) {
      return text.trim();
    },

    resolve: function resolve(data) {
      data.forEach(function (item) {
        if (item.alias === undefined) {
          return;
        }

        var _alias = item.alias;
        var name = item.context.name;

        var aliasedItem = data.find(function (i) {
          return i.context.name === _alias;
        });

        if (aliasedItem === undefined) {
          env.logger.log("Item \"" + name + "\" is an alias of \"" + _alias + "\" but this item doesn't exist.");
          return;
        }

        if (!Array.isArray(aliasedItem.aliased)) {
          aliasedItem.aliased = [];
        }

        aliasedItem.aliased.push(name);
      });
    },

    allowedOn: ["function", "mixin", "variable"],

    multiple: false };
}