module.exports = function(grunt) {
  grunt.initConfig({
    exec: {
      remove_logs: {
        command: 'rm -f *.log'
      , stdout: false
      , stderr: false
      }
    , list_files: {
        cmd: 'ls -l **'
      }
    , echo_grunt_version: {
        cmd: function() { return 'echo ' + this.version; }
      }
    , print_name: {
        cmd: function(firstName, lastName) {
          var formattedName = [
                lastName.toUpperCase()
              , firstName.toUpperCase()
              ].join(', ');

          return 'echo ' + formattedName;
        }
      }
    }

  , jshint: {
      options: {
      // enforcing options
        curly: true
      , forin: true
      , newcap: true
      , noarg: true
      , noempty: true
      , nonew: true
      , quotmark: true
      , undef: true
      , unused: true
      , trailing: true
      , maxlen: 80

      // relaxing options
      , boss: true
      , es5: true
      , expr: true
      , laxcomma: true

      // environments
      , node: true
      }
    , tasks: ['tasks/*.js']
    , tests: ['test/*.js']
    , gruntfile: ['Gruntfile.js']
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('lint', 'jshint');
};
