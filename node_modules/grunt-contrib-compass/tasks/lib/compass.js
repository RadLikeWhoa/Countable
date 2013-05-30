exports.init = function (grunt) {
  'use strict';
  var fs = require('fs');
  var tmp = require('tmp');

  var exports = {};

  function camelCaseToUnderscore(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();
  }

  // Extracts the options that cannot be used as CLI parameter but only
  // as 'raw' arguments.
  // Returns an object: {raw: str, options: []} with the raw string to be
  // used to generate a config and the list of used options.
  exports.extractRawOptions = function extractRawOptions(options) {
    var raw = options.raw || '';
    var supportedOptions = [
      'http_path',
      'css_path',
      'http_stylesheets_path',
      'sass_path',
      'images_path',
      'http_images_path',
      'generated_images_dir',
      'generated_images_path',
      'http_generated_images_path',
      'javascripts_path',
      'http_javascripts_path',
      'fonts_path',
      'http_fonts_path',
      'http_fonts_dir'
    ];

    var usedOptions = Object.keys(options).filter(function (option) {
      var underscoredOption = camelCaseToUnderscore(option);
      if (supportedOptions.indexOf(underscoredOption) >= 0) {
        // naively escape double-quotes in the value
        var value = options[option].replace(/"/, '\\"');
        raw += underscoredOption + ' = "' + value + '"\n';
        delete options[option];

        return true;
      }
    });

    return {raw: raw, options: usedOptions};
  };

  // Create a config file on the fly if there are arguments not supported as
  // CLI, returns a function that runs within the temprorary context.
  exports.buildConfigContext = function (options) {
    var rawOptions = exports.extractRawOptions(options);
    if (options.raw && options.config) {
      grunt.fail.warn('The options `raw` and `config` are mutually exclusive');
    }

    if (rawOptions.options.length > 0 && options.config) {
      grunt.fail.warn('The option `config` cannot be combined with ' +
                       'these options: ' + rawOptions.options.join(', ') + '.');
    }

    delete options.raw;

    return function configContext(cb) {
      if (rawOptions.raw) {
        tmp.file(function (err, path, fd) {
          if (err) {
            return cb(err);
          }

          // Dynamically create config.rb as a tmp file for the `raw` content
          fs.writeSync(fd, new Buffer(rawOptions.raw), 0, rawOptions.raw.length);
          cb(null, path);
        });
      } else {
        cb(null, null);
      }
    };
  };

  // build the array of arguments to build the compass command
  exports.buildArgsArray = function (options) {
    var helpers = require('grunt-lib-contrib').init(grunt);
    var args = [options.clean ? 'clean' : 'compile'];
    var basePath = options.basePath;
    var path = require('path');

    grunt.verbose.writeflags(options, 'Options');

    if (process.platform === 'win32') {
      args.unshift('compass.bat');
    } else {
      args.unshift('compass');
    }

    if (options.bundleExec) {
      args.unshift('bundle', 'exec');
    }

    if (options.basePath) {
      args.push(options.basePath);
    }

    if (options.specify) {
      var files = grunt.file.expand({
        filter: function (filePath) {
          return path.basename(filePath)[0] !== '_';
        }
      }, options.specify);

      if (files.length > 0) {
        [].push.apply(args, files);
      } else {
        return grunt.log.writeln('`specify` option used, but no files were found.');
      }
    }

    // don't want these as CLI flags
    delete options.clean;
    delete options.bundleExec;
    delete options.basePath;
    delete options.specify;

    // add converted options
    [].push.apply(args, helpers.optsToArgs(options));

    // Compass doesn't have a long flag for this option:
    // https://github.com/chriseppstein/compass/issues/1055
    if (options.importPath) {
      args = args.map(function (el) {
        return el.replace('--import-path', '-I');
      });
    }

    return args;
  };

  return exports;
};
