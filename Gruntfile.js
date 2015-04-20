module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-casperjs');

  grunt.initConfig({
    'mocha_casperjs': {
      options: {
        ui: 'bdd',
        reporter: 'list',
        clearRequireCache: true,

        'mocha-path': 'node_modules/mocha',
        timeout: 15000,
        casperTimeout: 14000,

        slow: 2000,
        width: 1680,
        height: 1050
      },
      files: {
        src: ['test/*.js']
      }
    },
    jshint: {
      options: {
        //jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'scrapper.js',
        'test/{,*/}*.js'
      ]
    },
    clean: {}

  });

  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['mocha_casperjs']);

};
