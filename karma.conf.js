// Karma configuration
// Generated on Sun Jul 14 2013 12:29:54 GMT+0200 (CEST)

// base path, that will be used to resolve files and exclude
basePath = ''

// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  'Countable.js',
  'bower_components/chai/chai.js',
  'test/*.js'
]

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['dots']

// web server port
port = 9876

// cli runner port
runnerPort = 9100

// enable / disable colors in the output (reporters and logs)
colors = true

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [ 'PhantomJS' ]

// If browser does not capture in Given timeout [ms], kill it
captureTimeout = 60000

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true

// report which specs are slower than 500ms
// CLI --report-slower-than 500
reportSlowerThan = 500