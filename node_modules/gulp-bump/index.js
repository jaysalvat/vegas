var gutil = require('gulp-util');
var through = require('through2');
var semver = require('semver');

var setDefaultOptions = function(opts) {
  opts = opts || {};
  opts.key = opts.key || 'version';
  opts.indent = opts.indent || void 0;
  // default type bump is patch
  if (!opts.type || !semver.inc('0.0.1', opts.type)) {
    opts.type = 'patch';
  }
  // if passed specific version - validate it
  if (opts.version && !semver.valid(opts.version, opts.type)) {
    gutil.log('invalid version used as option', gutil.colors.red(opts.version));
    opts.version = null;
  }
  return opts;
};

// Preserver new line at the end of a file
var possibleNewline = function (json) {
  var lastChar = (json.slice(-1) === '\n') ? '\n' : '';
  return lastChar;
};

// Figured out which "space" params to be used for JSON.stringfiy.
var space = function space(json) {
  var match = json.match(/^(?:(\t+)|( +))"/m);
  return match ? (match[1] ? '\t' : match[2].length) : '';
};

module.exports = function(opts) {
  // set task options
  opts = setDefaultOptions(opts);
  var key = opts.key;
  var version = opts.version;
  var indent = opts.indent;
  var type = opts.type;

  var content, json;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-bump', 'Streaming not supported'));
    }

    json = file.contents.toString();
    try {
      content = JSON.parse(json);
    } catch (e) {
      return cb(new gutil.PluginError('gulp-bump', 'Problem parsing JSON file', {fileName: file.path, showStack: true}));
    }

    // just set a version to the key
    if (version) {
      if (!content[key]) {
        // log to user that key didn't exist before
        gutil.log('Creating key', gutil.colors.red(key), 'with version:', gutil.colors.cyan(version));
      }
      content[key] = version;
    }
    else if (semver.valid(content[key])) {
    // increment the key with type
      content[key] = semver.inc(content[key], type);
    }
    else {
      return cb(new gutil.PluginError('gulp-bump', 'Detected invalid semver ' + key, {fileName: file.path, showStack: false}));
    }
    file.contents = new Buffer(JSON.stringify(content, null, indent || space(json)) + possibleNewline(json));

    gutil.log('Bumped ' + gutil.colors.magenta(key) + ' to: ' + gutil.colors.cyan(content[key]));
    cb(null, file);
  });
};
