var concat = require('../');
var should = require('should');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
require('mocha');

describe('gulp-concat', function() {
  describe('concat()', function() {
    var input;

    input = ['wadup'];
    testFiles(concat('test.js'), input, 'wadup');
    testFiles(concat('test.js', {newLine: '\r\n'}), input, 'wadup');
    testFiles(concat('test.js', {newLine: ''}), input, 'wadup');

    input = ['wadup', 'doe'];
    testFiles(concat('test.js'), input, 'wadup\ndoe');
    testFiles(concat('test.js', {newLine: '\r\n'}), input, 'wadup\r\ndoe');
    testFiles(concat('test.js', {newLine: ''}), input, 'wadupdoe');

    input = ['wadup', 'doe', 'hey'];
    testFiles(concat('test.js'), input, 'wadup\ndoe\nhey');
    testFiles(concat('test.js', {newLine: '\r\n'}), input, 'wadup\r\ndoe\r\nhey');
    testFiles(concat('test.js', {newLine: ''}), input, 'wadupdoehey');

    input = [[65, 66], [67, 68], [69, 70]];
    testFiles(concat('test.js'), input, 'AB\nCD\nEF');
    testFiles(concat('test.js', {newLine: '\r\n'}), input, 'AB\r\nCD\r\nEF');
    testFiles(concat('test.js', {newLine: ''}), input, 'ABCDEF');

    function testFiles(stream, contentses, result) {
      it('should concat one or several files', function(done) {
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.path);
          should.exist(newFile.relative);
          should.exist(newFile.contents);

          var newFilePath = path.resolve(newFile.path);
          var expectedFilePath = path.resolve('/home/contra/test/test.js');
          newFilePath.should.equal(expectedFilePath);

          newFile.relative.should.equal('test.js');
          String(newFile.contents).should.equal(result);
          Buffer.isBuffer(newFile.contents).should.equal(true);
          newFile.stat.mode.should.equal(0666);
          done();
        });

        contentses.forEach(function(contents, i) {
          stream.write(new File({
            cwd: '/home/contra/',
            base: '/home/contra/test',
            path: '/home/contra/test/file' + i.toString() + '.js',
            contents: new Buffer(contents),
            stat: {mode: 0666}
          }));
        });

        stream.end();
      });
    }

    it('should not fail if no files were input', function(done) {
      var stream = concat('test.js');
      stream.end();
      done();
    });
  });
});
