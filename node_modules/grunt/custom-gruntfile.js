module.exports = function(grunt) {

  // Project configuration.
  var path = require('path');
  var test = {};
  grunt.file.expand('*.json').forEach(function(filepath) {
    test[path.basename(filepath, '.json')] = grunt.file.readJSON(filepath);
  });

  grunt.initConfig({
    test: test
  });

  grunt.registerMultiTask('test', function() {
    this.files.forEach(function(f) {
      console.log('%s -> %s', f.src.join(' '), f.dest);
    });
  });

};
