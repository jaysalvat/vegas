module.exports = function(grunt) {
  grunt.initConfig({
    exec: {
      test1: {
        cmd: 'echo "bruce willis was dead" > test1'
      }
    , test2: {
        cmd: function() { return 'echo "grunt@' + this.version + '" > test2'; }
      }
    , test3: {
        cmd: function(answerToLife, tacoThoughts) {
          var text = [
            'the answer to life is ' + answerToLife
          , 'thoughts on tacos? ' + tacoThoughts
          ].join('\n');

          return 'echo "' + text + '" > test3';
        }
      }
    }
  });

  grunt.loadTasks('../tasks');
};
