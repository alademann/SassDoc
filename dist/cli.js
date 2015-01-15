"use strict";

module.exports = cli;
var doc = "\nUsage:\n  sassdoc <src>... [options]\n  sassdoc [options]\n\nArguments:\n  <src>  Path to your Sass folder.\n\nOptions:\n  -h, --help            Bring help.\n  --version             Show version.\n  -v, --verbose         Enable verbose mode.\n  -d, --dest=<dir>      Documentation folder [default: sassdoc].\n  -c, --config=<path>   Path to JSON/YAML configuration file.\n  -t, --theme=<name>    Theme to use.\n  -p, --parse           Parse the input and output JSON data to stdout.\n  --no-update-notifier  Disable update notifier check.\n  --strict              Turn warnings into errors.\n  --debug               Output debugging information.\n";

var docopt = require("docopt").docopt;
var source = require("vinyl-source-stream");
var pkg = require("../package.json");
var Environment = require("./environment");
var Logger = require("./logger");
var sassdoc = require("./sassdoc");
var errors = require("./errors");

function cli() {
  var argv = arguments[0] === undefined ? process.argv.slice(2) : arguments[0];
  return (function () {
    var options = docopt(doc, { version: pkg.version, argv: argv });
    var logger = new Logger(options["--verbose"], options["--debug"] || process.env.SASSDOC_DEBUG);
    var env = new Environment(logger, options["--strict"]);

    logger.debug("argv:", function () {
      return JSON.stringify(argv);
    });

    env.on("error", function (error) {
      if (error instanceof errors.Warning) {
        process.exit(2);
      }

      process.exit(1);
    });

    env.load(options["--config"]);

    // Ensure CLI options.
    ensure(env, options, {
      dest: "--dest",
      theme: "--theme",
      noUpdateNotifier: "--no-update-notifier" });

    env.postProcess();

    // Run update notifier if not explicitely disabled.
    if (!env.noUpdateNotifier) {
      require("./notifier")(pkg, logger);
    }

    var handler = undefined,
        cb = undefined;

    // Whether to parse only or to documentize.
    if (!options["--parse"]) {
      handler = sassdoc;
      cb = function () {};
    } else {
      handler = sassdoc.parse;
      cb = function (data) {
        return console.log(JSON.stringify(data, null, 2));
      };
    }

    if (!options["<src>"].length) {
      return process.stdin.pipe(source()).pipe(handler(env)).on("data", cb);
    }

    handler(options["<src>"], env).then(cb);
  })();
}

/**
 * Ensure that CLI options take precedence over configuration values.
 *
 * For each name/option tuple, if the option is set, override configuration
 * value.
 */
function ensure(env, options, names) {
  for (var _iterator = Object.keys(names)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
    var k = _step.value;
    var v = names[k];

    if (options[v]) {
      env[k] = options[v];
    }
  }
}