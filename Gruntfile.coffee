module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON('package.json')

    clean:
      files: 'dist/'

    jshint:
      options:
        jshintrc: '.jshintrc'
      dist: 'js/*.js'

    concat:
      options:
        separator: ';'
      dist:
        files:
          'dist/js/main.js': [ 'js/vendor/prism.js', 'js/main.js' ]

    uglify:
      options:
        report: 'gzip'
      dist:
        files:
          'dist/js/main.js': 'dist/js/main.js'

    compass:
      dist:
        options:
          sassDir: 'scss'
          cssDir: 'dist/css'
          outputStyle: 'compressed'

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'default', [ 'clean', 'jshint', 'concat', 'uglify', 'compass' ]