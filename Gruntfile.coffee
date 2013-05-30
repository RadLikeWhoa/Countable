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
        separator: ';\n\n'
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

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-compass'

  grunt.registerTask 'default', [ 'clean', 'jshint', 'concat', 'uglify', 'compass' ]