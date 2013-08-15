var grunt = require('grunt')
  , path = require('path')
  , fs = require('fs')
  , assert = require('assert')
  , testDir = path.join(process.cwd(), 'test')
  , opts = { gruntfile: path.join(testDir, 'Gruntfile.js') }
  , tasks = ['exec:test1', 'exec:test2', 'exec:test3:42:love'];

grunt.tasks(tasks, opts, function() {
  var tests = [
        { name: 'test1', expected: 'bruce willis was dead\n' }
      , { name: 'test2' , expected: 'grunt@' + grunt.version + '\n' }
      , {
          name: 'test3'
        , expected: [
            'the answer to life is 42', 'thoughts on tacos? love', ''
          ].join('\n')
        }
      ]
    , outputPath;

  tests.forEach(function(test) {
    outputPath = path.join(testDir, test.name);
    assert.equal(fs.readFileSync(outputPath, 'utf8'), test.expected);

    // clean up
    fs.unlinkSync(outputPath);

    grunt.log.ok(test.name +' passed');
  });
});
