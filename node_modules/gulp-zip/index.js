'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var chalk = require('chalk');
var JSZip = require('jszip');

module.exports = function (filename, opts) {
	if (!filename) {
		throw new gutil.PluginError('gulp-zip', chalk.blue('filename') + ' required');
	}

	opts = opts || {};
	opts.compress = typeof opts.compress === 'boolean' ? opts.compress : true;

	var firstFile;
	var zip = new JSZip();

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb();
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-zip', 'Streaming not supported'));
			return;
		}

		if (!firstFile) {
			firstFile = file;
		}

		// because Windows...
		var pathname = file.relative.replace(/\\/g, '/');

		zip.file(pathname, file.contents, {
			date: file.stat ? file.stat.mtime : new Date(),
			createFolders: true
		});

		cb();
	}, function (cb) {
		if (!firstFile) {
			cb();
			return;
		}

		this.push(new gutil.File({
			cwd: firstFile.cwd,
			base: firstFile.base,
			path: path.join(firstFile.base, filename),
			contents: zip.generate({
				type: 'nodebuffer',
				compression: opts.compress ? 'DEFLATE' : 'STORE',
				comment: opts.comment
			})
		}));

		cb();
	});
};
