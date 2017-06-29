var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var csso = require('gulp-csso')
var express = require('express')
var app = express()
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
  gulp.src([ 'node_modules/countable/countable.js', 'src/**/*.js' ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
})

gulp.task('styles', function () {
  gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 3 version'))
    .pipe(csso())
    .pipe(gulp.dest('assets/css'))
})

gulp.task('webserver', function () {
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
  gulp.watch('**/*.html', notifyLivereload)
  gulp.watch('assets/css/**/*.css', notifyLivereload)
  gulp.watch('assets/js/**/*.js', notifyLivereload)
})

gulp.task('default', [ 'scripts', 'styles', 'webserver', 'watch' ])
