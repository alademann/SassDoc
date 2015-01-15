"use strict";

module.exports = notify;
var chalk = require("chalk");

/**
 * Sometimes check for update and notify the user.
 *
 * @param {Object} pkg Package definition.
 * @param {Logger} logger
 */
function notify(pkg, logger) {
  var notifier = require("update-notifier")({
    packageName: pkg.name,
    packageVersion: pkg.version });

  if (!notifier.update) {
    return;
  }

  var latest = chalk.yellow(notifier.update.latest);
  var current = chalk.grey("(current: " + notifier.update.current + ")");
  var command = chalk.blue("npm update -g " + pkg.name);

  logger.log("Update available: " + latest + " " + current);
  logger.log("Run " + command + " to update.");
}