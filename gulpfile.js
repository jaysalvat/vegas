/* Utlimate Jay Mega Gulpfile */
/* global require:true, process:true */
/* jshint laxbreak:true */

(function() {
    'use strict';

    var pkg        = require('./package.json'),
        del        = require('del'),
        yargs      = require('yargs'),
        exec       = require('exec'),
        fs         = require('fs'),
        dateFormat = require('date-format'),
        spawn      = require('child_process').spawn,
        gulp       = require('gulp'),
        plugins    = require('gulp-load-plugins')();

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
                datetime: dateFormat.asString('yyyy-MM-dd'),
                year: dateFormat.asString('yyyy')
            }
        }
    };

    const getPackageJson = function() {
        return JSON.parse(fs.readFileSync('./package.json'));
    };

    function clean(cb) {
        return del([ './dist' ], cb);
    }

    exports.clean = clean;

    function tmpClean(cb) {
        return del([ './tmp' ], cb);
    }

    exports.tmpClean = tmpClean;

    function tmpCreate(cb) {
        return exec('mkdir -p ./tmp', cb);
    }

    exports.tmpCreate = tmpCreate;

    function tmpCopy() {
        return gulp.src('./dist/**/*')
            .pipe(gulp.dest('./tmp'));
    }

    exports.tmpCopy = gulp.series(tmpCreate, tmpCopy);    

    function zip() {
        const filename = settings.name + '.zip';

        return gulp.src('./dist/**/*')
            .pipe(plugins.zip(filename))
            .pipe(gulp.dest('./tmp'));
    }

    exports.zip = gulp.series(tmpCreate, zip);   

    function failIfDirty(cb) {
        return exec('git diff-index HEAD --', function(err, output) {
            if (err) {
                return cb(err);
            }
            if (output) {
                return cb('Repository is dirty');
            }
            return cb();
        });
    }

    exports.zip = failIfDirty;

    function failIfNotMaster(cb) {
        exec('git symbolic-ref -q HEAD', function(err, output) {
            if (err) {
                return cb(err);
            }
            if (!/refs\/heads\/master/.test(output)) {
                return cb('Branch is not Master');
            }
            return cb();
        });
    }

    exports.failIfNotMaster = failIfNotMaster;

    function gitTag(cb) {
        const message = 'v' + getPackageJson().version;

        return exec('git tag ' + message, cb);
    }

    exports.gitTag = gitTag;

    function gitAdd(cb) {
        return exec('git add -A', cb);
    }

    exports.gitAdd = gitAdd;

    function gitCommit(cb) {
        const message = 'Build v' + getPackageJson().version;

        return exec('git commit -m "' + message + '"', cb);
    }

    exports.gitCommit = gulp.series(gitAdd, gitCommit);

    function gitPull(cb) {
        return exec('git pull origin master', function(err, output, code) {
            if (code !== 0) {
                return cb(err + output);
            }
            return cb();
        });
    }

    exports.gitPull = gitPull;

    function gitPush(cb) {
        return exec('git push origin master --tags', function(err, output, code) {
            if (code !== 0) {
                return cb(err + output);
            }
            return cb();
        });
    }

    exports.gitCommit = gulp.series(gitAdd, gitCommit, gitPush);

    function npmPublish(cb) {
        exec('npm publish', function(err, output, code) {
            if (code !== 0) {
                return cb(err + output);
            }
            return cb();
        });
    }

    exports.npmPublish = npmPublish;

    function meta(cb) {
        const metadata = {
                date: dateFormat.asString('yyyy-MM-dd HH:MM'),
                version: 'v' + getPackageJson().version
            },
            json = JSON.stringify(metadata, null, 4);

        fs.writeFileSync('tmp/metadata.json', json);
        fs.writeFileSync('tmp/metadata.js', '__metadata(' + json + ');');

        return cb();
    }

    exports.npmPublish = gulp.series(tmpCreate, meta);

    function bump() {
        return gulp.src([ 'package.json', 'bower.json', 'component.json' ])
            .pipe(plugins.bump(
                /^[a-z]+$/.test(bumpVersion)
                    ? { type: bumpVersion }
                    : { version: bumpVersion }
            ))
            .pipe(gulp.dest('.'));
    }

    exports.npmPublish = npmPublish;

    function year() {
        return gulp.src([ './README.md' ])
            .pipe(plugins.replace(/(Copyright )(\d{4})/g, '$1' + dateFormat.asString('yyyy')))
            .pipe(gulp.dest('.'));
    }

    exports.year = year;

    function lint() {
        return gulp.src('./src/**.js')
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('default'));
    }

    exports.lint = lint;

    function copy() {
        return gulp.src([ './src/**/*', '!./src/sass', '!./src/sass/**' ])
            .pipe(gulp.dest('./dist'));
    }

    exports.copy = copy;

    function uglify() {
        return gulp.src('./dist/**/!(*.min.js).js')
            .pipe(plugins.rename({ suffix: '.min' }))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.uglify({
                compress: {

                },
                mangle: true,
                output: {
                    comments: /^!/
                }
            }))
            .on('error', function(err) { console.log(err) })
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest('./dist/'));
    }

    exports.copy = copy;

    function cssmin() {
        return gulp.src('./dist/**/!(*.min.css).css')
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.rename({ suffix: '.min' }))
            .pipe(plugins.cssmin())
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest('./dist/'));
    }

    exports.cssmin = cssmin;

    function sass() {
        return gulp.src("./src/sass/vegas.sass")
            // .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass({
                outputStyle: 'expanded',
                indentWidth: 4
            }).on('error', plugins.sass.logError))
            .pipe(plugins.autoprefixer())
            // .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest("./dist/"));
    }

    exports.sass = sass;

    function header() {
        settings.banner.vars.pkg = getPackageJson();

        return gulp.src('./dist/*.js')
            .pipe(plugins.header(settings.banner.content, settings.banner.vars ))
            .pipe(gulp.dest('./dist/'));
    }

    exports.header = header;

    function ghPages(cb) {
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
            function(err, output, code) {
                if (code !== 0) {
                    return cb(err + output);
                }
                return cb();
            }
        );
    }

    exports.ghPages = ghPages;

    function changelog(cb) {
        var filename  = 'CHANGELOG.md',
            editor    = process.env.EDITOR || 'vim',
            version   = getPackageJson().version,
            date      = dateFormat.asString('yyyy-MM-dd'),
            changelog = fs.readFileSync(filename).toString(),
            lastDate  = /\d{4}-\d{2}-\d{2}/.exec(changelog)[0];

        exec('git log --since="' + lastDate + ' 00:00:00" --oneline --pretty=format:"%s"', function(err, stdout) {
            if (err) {
                return cb(err);
            }

            if (!stdout) {
                return cb();
            }

            const updates = [
                '### Vegas ' + version + ' ' + date,
                '',
                '* ' + stdout.replace(/\n/g, '\n* ')
            ].join('\n');

            changelog = changelog.replace(/(## CHANGE LOG)/, '$1\n\n' + updates);

            fs.writeFileSync(filename, changelog);

            const vim = spawn(editor, [ filename, '-n', '+7' ], {
                stdio: 'inherit'
            });

            vim.on('close', function() {
                return cb();
            });
        });
    }

    exports.changelog = changelog;

    function watch() {
        return gulp.watch("./src/**/*", build);
    }

    exports.watch = watch;
    exports.default = watch;

    const build = gulp.series(
        lint,
        clean,
        copy,
        sass,
        header,
        cssmin,
        uglify,
    );

    exports.build = build;

    const publish = gulp.series(
        failIfNotMaster, 
        failIfDirty,
        tmpCreate,
        tmpCopy,
        meta,
        zip,
        ghPages,
        tmpClean
    );

    exports.publish = publish;

    const release = gulp.series(
        failIfNotMaster, 
        failIfDirty,
        gitPull,
        bump,
        changelog,
        year,
        clean,
        copy,
        sass,
        header,
        uglify,
        cssmin,
        gitAdd,
        gitCommit,
        gitTag,
        gitPush,
        publish,
        npmPublish
    );

    exports.release = release;
})();

/*

NPM Installation
----------------

npm install --save-dev del
npm install --save-dev yargs
npm install --save-dev exec
npm install --save-dev jshint
npm install --save-dev gulp
npm install --save-dev gulp-sass
npm install --save-dev gulp-load-plugins
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
