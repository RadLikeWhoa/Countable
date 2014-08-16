var gulp = require('gulp')
var lr

function notifyLivereload (event) {
  var filename = require('path').relative(__dirname, event.path)

  lr.changed({
    body: {
      files: [ filename ]
    }
  })
}

gulp.task('scripts', function () {
  var concat = require('gulp-concat')
  var uglify = require('gulp-uglify')

  gulp.src([ 'bower_components/Countable/Countable.js', 'src/**/*.js' ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
})

gulp.task('styles', function () {
  var sass = require('gulp-ruby-sass')
  var autoprefixer = require('gulp-autoprefixer')
  var cmq = require('gulp-combine-media-queries')
  var csso = require('gulp-csso')

  gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .on('error', function (err) { console.log(err.message) })
    .pipe(autoprefixer('last 2 version', 'ie 7', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
    .pipe(cmq())
    .pipe(csso())
    .pipe(gulp.dest('assets/css'))
})

gulp.task('webserver', function () {
  var express = require('express')
  var app = express()

  app.use(require('connect-livereload')())
  app.use(express.static(__dirname))
  app.listen(8000)

  lr = require('tiny-lr')()
  lr.listen(35729)

  require('opn')('http://localhost:8000')
})

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', [ 'styles' ])
  gulp.watch('src/js/**/*.js', [ 'scripts' ])
  gulp.watch('src/**/*.html', notifyLivereload)
  gulp.watch('assets/css/**/*.css', notifyLivereload)
  gulp.watch('assets/js/**/*.js', notifyLivereload)
})

gulp.task('default', [ 'scripts', 'styles', 'webserver', 'watch' ])