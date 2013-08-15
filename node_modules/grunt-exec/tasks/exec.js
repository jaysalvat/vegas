// grunt-exec
// ==========
// * GitHub: https://github.com/jharding/grunt-exec
// * Copyright (c) 2012 Jake Harding
// * Licensed under the MIT license.

module.exports = function(grunt) {
  var cp = require('child_process')
    , f = require('util').format
    , util = grunt.util
    , log = grunt.log
    , verbose = grunt.verbose;

  grunt.registerMultiTask('exec', 'Execute shell commands.', function() {
    var data = this.data
      , o = {
          stdout: data.stdout !== undefined ? data.stdout : true
        , stderr: data.stderr !== undefined ? data.stderr : true
        }
      , command
      , childProcess
      , args = [].slice.call(arguments, 0)
      , done = this.async();

    // allow for command to be specified in either
    // 'command' or 'cmd' property
    command = data.command || data.cmd;

    if (!command) {
      log.error('Missing command property.');
      return done(false);
    }

    if (util._.isFunction(command)) {
      command = command.apply(grunt, args);
    }

    if (!util._.isString(command)) {
      log.error('Command property must be a string.');
      return done(false);
    }

    verbose.subhead(command);
    childProcess = cp.exec(command);

    o.stdout && childProcess.stdout.on('data', function (d) { log.write(d); });
    o.stderr && childProcess.stderr.on('data', function (d) { log.error(d); });

    childProcess.on('exit', function(code) {
      if (code > 0) {
        log.error(f('Exited with code: %d.', code));
        return done(false);
      }

      verbose.ok(f('Exited with code: %d.', code));
      done();
    });
  });
};
