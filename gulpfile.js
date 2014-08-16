var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sass = require('gulp-ruby-sass')
var autoprefixer = require('gulp-autoprefixer')
var csso = require('gulp-csso')
var cmq = require('gulp-combine-media-queries')
var express = require('express')
var opn = require('opn')

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
  gulp.src(['bower_components/Countable/Countable.js', 'src/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

gulp.task('styles', function () {
  gulp.src('./src/scss/**/*.scss')
    .pipe(sass({ style: 'compressed' }))
    .on('error', function (err) { console.log(err.message) })
    .pipe(autoprefixer('last 2 version', 'ie 7', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
    .pipe(cmq())
    .pipe(csso())
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('webserver', function () {
  var app = express()

  app.use(require('connect-livereload')())
  app.use(express.static(__dirname))
  app.listen(8000)

  lr = require('tiny-lr')()
  lr.listen(35729)

  opn('http://localhost:8000')
})

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', ['styles'])
  gulp.watch('src/js/**/*.js', ['jshint', 'scripts'])
  gulp.watch('dist/css/**/*.css', notifyLivereload)
  gulp.watch('dist/js/**/*.js', notifyLivereload)
})

gulp.task('default', ['jshint', 'scripts', 'styles', 'webserver', 'watch'])