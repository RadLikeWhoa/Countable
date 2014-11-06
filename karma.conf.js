// Karma configuration

module.exports = function (config) {
  var configuration = {

    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: [ 'mocha', 'chai' ],

    // list of files / patterns to load in the browser
    files: [
      'Countable.js',
      'test/*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: [ 'dots' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [ 'Firefox', 'Chrome' ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // If browser does not capture in Given timeout [ms], kill it
    captureTimeout: 20000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500
  }

  if (process.env.TRAVIS) {
    configuration.browsers = [ 'Chrome_travis_ci' ]
  }

  config.set(configuration)
}