'use strict';

var fs     = require('fs');          // File system
var rimraf = require('rimraf');      // rm -rf
var ncp    = require('ncp');         // cp -r
var swig   = require('swig');        // Templating
var extras = require('swig-extras'); // Moar templating
var Q      = require('q');           // Promises

var parser = require('./parser');
var utils  = require('./utils');
var logger = require('./log');

extras.useFilter(swig, 'markdown');
extras.useFilter(swig, 'nl2br');
ncp.limit = 16;

exports = module.exports = {

  /**
   * Folder API
   */
  folder: {
    /**
     * Read a folder
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_readdir_path_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    read: Q.denodeify(fs.readdir),

    /**
     * Create a folder
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_mkdir_path_mode_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    create: Q.denodeify(fs.mkdir),

    /**
     * Copy a folder
     * @see {@link https://github.com/AvianFlu/ncp}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    copy: Q.denodeify(ncp),

    /**
     * Remove a folder
     * @see {@link https://github.com/isaacs/rimraf}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    remove: Q.denodeify(rimraf),

    /**
     * Remove then create a folder
     * @param  {String} folder
     * @return {Q.Promise}
     */
    refresh: function (folder) {
      return exports.folder.remove(folder).then(function() {
        logger.log('Folder `' + folder + '` successfully removed.');
        return exports.folder.create(folder);
      }, function () {
        return exports.folder.create(folder);
      });
    },

    /**
     * Parse a folder
     * @param  {String} folder
     * @return {Q.Promise}
     */
    parse: function (folder) {
      return exports.folder.read(folder).then(function (files) {
        var path,
            promises = [],
            data = [];

        files.forEach(function (file) {
          path = folder + '/' + file;

          // Folder
          if (exports.isDirectory(path)) {
            promises.push(exports.folder.parse(path).then(function (response) {
              data = data.concat(response);
            }));
          }

          // SCSS file
          else if (utils.getExtension(path) === 'scss') {
            promises.push(exports.file.process(path).then(function (response) {
              data = data.concat(response);
            }));
          }

          // Else
          else {
            logger.log('File `' + path + '` is not a `.scss` file. Omitted.');
          }
        });

        return Q.all(promises).then(function () {
          return data;
        });

      }, function (err) {
        console.error(err);
      });
    }
  },

  /**
   * File API
   */
  file: {
    /**
     * Read a file
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    read: Q.denodeify(fs.readFile),

    /**
     * Create a file
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    create: Q.denodeify(fs.writeFile),

    /**
     * Remove a file
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_unlink_path_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    remove: Q.denodeify(fs.unlink),

    /**
     * Process a file
     * @param  {String} file
     * @return {Q.Promise}
     */
    process: function (file) {
      return exports.file.read(file, 'utf-8').then(function (data) {
        return parser.parse(data);
      });
    }
  },

  /**
   * Test if path is a directory
   * @param  {String}  path
   * @return {Boolean}
   */
  isDirectory: function (path) {
    return fs.lstatSync(path).isDirectory();
  },

  /**
   * Dump CSS
   * @param  {String} destination
   * @return {Q.Promise}
   */
  dumpAssets: function (destination) {
    return exports.folder.copy(__dirname + '/../assets', destination + '/assets');
  },

  /**
   * Generate a document
   * @param {Array}  data
   * @param {String} destination
   * @param {Object} options
   */
  generate: function (data, destination, options) {
    var template = swig.compileFile(__dirname + '/../templates/docs.html.swig');

    options.data = data;

    return exports.file.create(destination, template(options));
  },

  /**
   * Get data
   */
  getData: function (folder) {
    return exports.folder.parse(folder).then(function (response) {
      response = response || [];
      logger.log(response.length + ' item' + (response.length > 1 ? 's' : '') + ' documented.');


      var result = {};
      var index = {};

      response.forEach(function(obj){
        Object.keys(obj).forEach(function(key){
          if ( result[key] === undefined ) { result[key] = []; }
          obj[key].forEach(function(item){
            index[item.context.name] = item;
            result[key].push(item);
          });
        });
      });

      // Resovle alias and requires
      Object.keys(index).forEach(function(key){
        var item = index[key];

        if (utils.isset(item.alias)) { // Alias
          item.alias.forEach(function(alias){
            if (utils.isset(index[alias])) {
              if ( ! Array.isArray(index[alias].aliased) ) { index[alias].aliased = []; }
              index[alias].aliased.push(item.context.name);
            } else {
              logger.log('Item `' + item.context.name + ' is an alias of `' + alias + '` but this item doesn\'t exist.');
            }
          });
        } else if ( utils.isset(item.requires)){
          item.requires = item.requires.map(function(name){
            if (utils.isset(index[name])) {
              var reqItem = index[name];
              if ( ! Array.isArray(reqItem.usedBy) ) { reqItem.usedBy = []; }
              reqItem.usedBy.push({ item : item.context.name, type : item.context.type });
              return reqItem.context;
            }
          }).filter(function(item){return item !== undefined;});
        }
      });

      console.log(JSON.stringify(result));
      return result;
    });
  }
};
