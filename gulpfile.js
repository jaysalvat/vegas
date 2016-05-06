/* Utlimate Jay Mega Gulpfile */
/* global require:true, process:true */
/* jshint laxbreak:true */

(function () {
    'use strict';
 
    var pkg       = require('./package.json'),
        del       = require('del'),
        yargs     = require('yargs'),
        exec      = require('exec'),
        fs        = require('fs'),
        spawn     = require('child_process').spawn,
        gulp      = require('gulp'),
        bump      = require('gulp-bump'),
        header    = require('gulp-header'),
        cssmin    = require('gulp-cssmin'),
        prefixer  = require('gulp-autoprefixer'),
        uglify    = require('gulp-uglify'),
        sourcemap = require('gulp-sourcemaps'),
        jshint    = require('gulp-jshint'),
        gutil     = require('gulp-util'),
        zip       = require('gulp-zip'),
        rename    = require('gulp-rename'),
        replace   = require('gulp-replace'),
        gsync     = require('gulp-sync'),
        sync      = gsync(gulp).sync;

    var bumpVersion = yargs.argv.type || 'patch';

    var settings = {
        name: 'vegas',
        banner: {
            content: [
                '/*!-----------------------------------------------------------------------------',
                ' * <%= pkg.description %>',
                ' * v<%= pkg.version %> - built <%= datetime %>',
                ' * Licensed under the MIT License.',
                ' * http://vegas.jaysalvat.com/',
                ' * ----------------------------------------------------------------------------',
                ' * Copyright (C) 2010-<%= year %> Jay Salvat',
                ' * http://jaysalvat.com/',
                ' * --------------------------------------------------------------------------*/',
                ''
            ].join('\n'),
            vars: {
                pkg: pkg,
                datetime: gutil.date('yyyy-mm-dd'),
                year: gutil.date('yyyy')
            }
        }
    };

    var getPackageJson = function () {
        return JSON.parse(fs.readFileSync('./package.json'));
    };

    gulp.task('clean', function (cb) {
        return del([ './dist' ], cb);
    });

    gulp.task('tmp-clean', function (cb) {
        return del([ './tmp' ], cb);
    });

    gulp.task('tmp-create', function (cb) {
        return exec('mkdir -p ./tmp', cb);
    });

    gulp.task('tmp-copy', [ 'tmp-create' ], function () {
        return gulp.src('./dist/**/*')
            .pipe(gulp.dest('./tmp'));
    });

    gulp.task('zip', [ 'tmp-create' ], function () {
        var filename = settings.name + '.zip';

        return gulp.src('./dist/**/*')
            .pipe(zip(filename))
            .pipe(gulp.dest('./tmp'));
    });

    gulp.task('fail-if-dirty', function (cb) {
        return exec('git diff-index HEAD --', function (err, output) { // err, output, code
            if (err) {
                return cb(err);
            }
            if (output) {
                return cb('Repository is dirty');
            }
            return cb();
        });
    });

    gulp.task('fail-if-not-master', function (cb) {
        exec('git symbolic-ref -q HEAD', function (err, output) { // err, output, code
            if (err) {
                return cb(err);
            }
            if (!/refs\/heads\/master/.test(output)) {
                return cb('Branch is not Master');
            }
            return cb();
        });
    });

    gulp.task('git-tag', function (cb) {
        var message = 'v' + getPackageJson().version;

        return exec('git tag ' + message, cb);
    });

    gulp.task('git-add', function (cb) {
        return exec('git add -A', cb);
    });

    gulp.task('git-commit', [ 'git-add' ], function (cb) {
        var message = 'Build v' + getPackageJson().version;

        return exec('git commit -m "' + message + '"', cb);
    });

    gulp.task('git-pull', function (cb) {
        return exec('git pull origin master', function (err, output, code) {
            if (code !== 0) {
                return cb(err + output);
            }
            return cb();
        });
    });

    gulp.task('git-push', [ 'git-commit' ], function (cb) {
        return exec('git push origin master --tags', function (err, output, code) {
            if (code !== 0) {
                return cb(err + output);
            }
            return cb();
        });
    });

    gulp.task("npm-publish", function (cb) {
        exec('npm publish', function (err, output, code) {
                if (code !== 0) {
                    return cb(err + output);
                }
                return cb();
            }
        );
    });

    gulp.task('meteor-init', function (cb) {
      exec('cp meteor/package.js .', function (err, output, code) {
          if (code !== 0) {
              return cb(err + output);
          }
          return cb();
      });
    });

    gulp.task('meteor-test', ['meteor-init'], function (cb) {
      exec('node_modules/.bin/spacejam --mongo-url mongodb:// test-packages ./', function (err, output, code) {
          if (code !== 0) {
              return cb(err + output);
          }
          return cb();
      });
    });

    gulp.task('meteor-publish', ['meteor-init'], function (cb) {
      exec('meteor publish', function (err, output, code) {
          if (code !== 0) {
              console.log('argh');
              return cb(err + output);
          }
          return cb();
      });
    });

    gulp.task('meteor-cleanup', function () {
      exec('rm -rf .build.* versions.json package.js', function (err, output, code) {
          if (code !== 0) {
              return cb(err + output);
          }
          return cb();
      });
    });

    gulp.task('meta', [ 'tmp-create' ], function (cb) {
        var  metadata = {
                date: gutil.date('yyyy-mm-dd HH:MM'),
                version: 'v' + getPackageJson().version
            },
            json = JSON.stringify(metadata, null, 4);

        fs.writeFileSync('tmp/metadata.json', json);
        fs.writeFileSync('tmp/metadata.js', '__metadata(' + json + ');');

        return cb();
    });

    gulp.task('bump', function () {
        return gulp.src([ 'package.json', 'bower.json', 'component.json' ])
            .pipe(bump(
                /^[a-z]+$/.test(bumpVersion) 
                    ? { type: bumpVersion } 
                    : { version: bumpVersion }
            ))
            .pipe(gulp.dest('.'));
    });

    gulp.task('year', function () {
        return gulp.src([ './LICENSE.md', './README.md' ])
            .pipe(replace(/(Copyright )(\d{4})/g, '$1' + gutil.date('yyyy')))
            .pipe(gulp.dest('.'));
    });

    gulp.task('lint', function() {
        return gulp.src('./src/**.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    gulp.task('copy', function () {
        return gulp.src('./src/**/*')
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('autoprefixer', function () {
        return gulp.src('./dist/**/*.css')
            .pipe(prefixer())
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('uglify', function () {
        return gulp.src('./dist/**/!(*.min.js).js')
            .pipe(rename({ suffix: '.min' }))
            .pipe(sourcemap.init())
            .pipe(uglify({
                compress: {
                    warnings: false
                },
                mangle: true,
                outSourceMap: true
            }))
            .pipe(sourcemap.write('.'))
            .pipe(gulp.dest('./dist/'));
    });

    gulp.task('cssmin', function () {
        return gulp.src('./dist/**/!(*.min.css).css')
            .pipe(prefixer())
            .pipe(rename({ suffix: '.min' }))
            .pipe(cssmin())
            .pipe(gulp.dest('./dist/'));
    });

    gulp.task('header', function () {
        settings.banner.vars.pkg = getPackageJson();

        return gulp.src('./dist/*.js')
            .pipe(header(settings.banner.content, settings.banner.vars ))
            .pipe(gulp.dest('./dist/'));
    });

    gulp.task('gh-pages', function (cb) {
        var version = getPackageJson().version;

        exec([  'git checkout gh-pages',
                'rm -rf releases/' + version,
                'mkdir -p releases/' + version,
                'cp -r tmp/* releases/' + version,
                'git add -A releases/' + version,
                'rm -rf releases/latest',
                'mkdir -p releases/latest',
                'cp -r tmp/* releases/latest',
                'git add -A releases/latest',
                'git commit -m "Publish release v' + version + '."',
                'git push origin gh-pages',
                'git checkout -'
            ].join(' && '),
            function (err, output, code) {
                if (code !== 0) {
                    return cb(err + output);
                }
                return cb();
            }
        );
    });

    gulp.task('changelog', function (cb) {
        var filename  = 'CHANGELOG.md',
            editor    = process.env.EDITOR || 'vim',
            version   = getPackageJson().version,
            date      = gutil.date('yyyy-mm-dd'),
            changelog = fs.readFileSync(filename).toString(),
            lastDate  = /\d{4}-\d{2}-\d{2}/.exec(changelog)[0];

        exec('git log --since="' + lastDate + '" --oneline --pretty=format:"%s"', function (err, stdout) {
            if (err) {
                return cb(err);
            }

            if (!stdout) {
                return cb();
            }

            var updates = [
                '### Vegas ' + version + ' ' + date,
                '',
                '* ' + stdout.replace(/\n/g, '\n* ')
            ].join('\n');

            changelog = changelog.replace(/(## CHANGE LOG)/, '$1\n\n' + updates);

            fs.writeFileSync(filename, changelog);

            var vim = spawn(editor, [ filename, '-n', '+7' ], {
                stdio: 'inherit'
            });

            vim.on('close', function () {
                return cb();
            });
        });
    });

    gulp.task('watch', function() {
        gulp.watch("./src/**/*", [ 'build' ]);
    });

    gulp.task('build', sync([
        'lint',
        'clean', 
        'copy', 
        'autoprefixer',
        'uglify',
        'cssmin',
        'header'
    ], 
    'building'));

    gulp.task('release', sync([
      [ 'fail-if-not-master', 'fail-if-dirty' ],
        'git-pull',
        'bump',
        'changelog',
        'year',
        'clean',
        'copy',
        'autoprefixer',
        'uglify',
        'cssmin',
        'header',
        'git-add',
        'git-commit',
        'git-tag',
        'git-push',
        'publish',
        'npm-publish',
        'meteor'
    ], 
    'releasing'));

    gulp.task('publish', sync([
      [ 'fail-if-not-master', 'fail-if-dirty' ],
        'tmp-create',
        'tmp-copy',
        'meta',
        'zip',
        'gh-pages',
        'tmp-clean'
    ], 
    'publising'));

    gulp.task('meteor', sync([
        'meteor-test',
        'meteor-publish',
        'meteor-cleanup'
    ],
    'Meteor test/publish'));
})();

/*

NPM Installation
----------------

npm install --save-dev del
npm install --save-dev yargs
npm install --save-dev exec
npm install --save-dev fs
npm install --save-dev gulp
npm install --save-dev gulp-bump
npm install --save-dev gulp-header
npm install --save-dev gulp-cssmin
npm install --save-dev gulp-autoprefixer
npm install --save-dev gulp-uglify
npm install --save-dev gulp-sourcemaps
npm install --save-dev gulp-jshint
npm install --save-dev gulp-util
npm install --save-dev gulp-zip
npm install --save-dev gulp-rename
npm install --save-dev gulp-replace
npm install --save-dev gulp-sync

Gh-pages creation
-----------------

git checkout --orphan gh-pages
git rm -rf .
rm -fr
echo 'Welcome' > index.html
git add index.html
git commit -a -m 'First commit'
git push origin gh-pages
git checkout -

*/
