var jshint = require('../../../src');
var tutil = require('../../util');
var stream = require('../../../src/stream');
var should = require('should');
var EventEmitter = require('events').EventEmitter;

describe('jshint.reporter(fail)', function () {
  it('should emit error on failure', function (done) {
    var fakeFile = new tutil.File({
      path: './test/fixture/file.js',
      contents: new Buffer('doe =')
    });

    var stream = jshint();
    var failStream = jshint.reporter('fail');
    stream.pipe(failStream);

    failStream.on('error', function (err) {
      should.exist(err);
      err.message.indexOf(fakeFile.relative).should.not.equal(-1, 'should say which file');
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  var files = function (fails) {
    return [
      new tutil.File({
        path: './test/fixture/valid1.js',
        contents: new Buffer('var a = 1;')
      }),
      fails && new tutil.File({
        path: './test/fixture/invalid1.js',
        contents: new Buffer('doe =')
      }),
      fails && new tutil.File({
        path: './test/fixture/invalid2.js',
        contents: new Buffer('fum =')
      }),
      new tutil.File({
        path: './test/fixture/valid2.js',
        contents: new Buffer('var b = 1;')
      })
    ].filter(Boolean);
  };

  it('should buffer all files until success is known', function (done) {
    var input = stream();
    var output;
    var reporter;
    var errored = false;

    input
      .pipe(jshint())
      .pipe(reporter = jshint.reporter('fail'))
      .on('error', function (err) {
        err.message.should.match(/invalid1/);
        err.message.should.match(/invalid2/);
        // files will flow through if the error is "handled"
        errored = true;
      })
      .pipe(output = stream(function (file) {
        errored.should.equal(true);
        reporter.unpipe(output);
        done();
      }));


    files(true).forEach(function (file) { input.write(file); });
    input.end();
  });

  it('should pass all files through after success if certain', function (done) {
    var i = 0;
    var input = stream();

    input
      .pipe(jshint())
      .pipe(jshint.reporter('fail'))
      .pipe(stream(function (file) {
        i++;
      }, function () {
        i.should.equal(2);
        done();
      }));


    files().forEach(function (file) { input.write(file); });
    input.end();
  });

  it('should pass only emit error when `buffer: false`', function (done) {
    // really, checking that files are coming through before errors
    // which means that we are not waiting for errors and letting
    // streams handle them naturally

    var i = 0;
    var input = stream();
    var reporter;
    var errored = false;

    input
      .pipe(jshint())
      .pipe(reporter = jshint.reporter('fail', { buffer: false }))
      .pipe(stream(function (file) {
        if (i === 0) {
          errored.should.equal(false);
        }

        i++;
        /* through away files */
      }))
      .on('finish', done);

    reporter.emit = function (name) {
      // check for error without tripping "unhandled error" checks
      // like adding an error listener does
      if (name !== 'error') {
        EventEmitter.prototype.emit.apply(reporter, arguments);
      } else {
        errored = true;
      }
    };


    files(true).forEach(function (file) {
      input.write(file);
    });
    input.end();
  });
});