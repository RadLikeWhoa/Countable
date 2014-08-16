# gulp-intermediate [![status](https://api.travis-ci.org/robwierzbowski/gulp-intermediate.svg)](https://travis-ci.org/robwierzbowski/gulp-intermediate)&nbsp;[![dependencies](https://david-dm.org/robwierzbowski/gulp-intermediate.svg)](https://david-dm.org/robwierzbowski/gulp-intermediate)

> A gulp helper for tools that need files on disk.

Some tools require access to files on disk instead of working with `stdin` and `stdout` (e.g., [Jekyll](http://jekyllrb.com/), [Ruby Sass](http://sass-lang.com/)). `gulp-intermediate` is a convenience plugin that writes the current stream to a temporary directory, lets you run commands on the file system, and pushes the results back into the pipe.

**NOTE:** Writing intermediate files to disk is counter to the gulp philosophy. If possible, use a tool that works with streams. Use gulp-intermediate only if other (better) options aren't available.

## Install

```sh
$ npm install --save-dev gulp-intermediate
```

## Usage

```js
var gulp = require('gulp');
var spawn = require('child-process').spawn;
var intermediate = require('gulp-intermediate');

gulp.task('default', function () {
  return gulp.src('app/**/*.jade')
    .pipe(intermediate({ output: '_site' }, function (tempDir, cb) {
      // Run a command on the files in tempDir and write the results to
      // the specified output directory.
      var command = spawn('a_command', ['--dest', '_site'], {cwd: tempDir});
      command.on('close', cb);
    }))
    .pipe(gulp.dest('dist'));
});
```

For more examples see [recipes.md](https://github.com/robwierzbowski/gulp-intermediate/blob/master/recipes.md).

## API

### intermediate(options, process)

#### options

##### output

Type: `string`  
Default: `'.'`

The directory read back into the stream when processing is finished. Relative to `tempDir`.

##### container

Type: `string`  
Default: random uuid

The directory that files are written to, relative to the operating system's temporary directry. Defaults to a unique random directory on every run.

The container is emptied before every run. 

#### process(tempDir, cb, [fileProps])

Type: `function`  
Required  

Run your commands inside the `process` callback. `process` comes with three arguments:

- `tempDir`: The absolute path to the directory containing your temporary files. If using `spawn` you may want to set the `cwd` option to `tempDir`.
- `cb`: A callback function to call when the processing is finished. It pushes the output files back into the gulp stream.
- `fileProps`: An object with some information about the files that have been written to the temp directory.
    - `fileProps.cwd`: The original vinyl CWD.

#### Notes

The files are written to `tempDir` using the vinyl file object's relative path, just like `gulp.dest()` writes to the output directory. Make sure you understand how globbing works to avoid unexpected errors: for example, the files in `gulp.src(['files/*.json', config.yml])` will all be output at the root of `tempDir`. 

Consider passing the [`{ base: '.' }` option to `glob.src`](https://github.com/wearefractal/glob-stream#options) if you need to output a src glob as it exists on disk. When in doubt, log `tempDir` to the console and open it to see what's going on.

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) © [Rob Wierzbowski](http://robwierzbowski.com)
