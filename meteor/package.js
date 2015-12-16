// package metadata file for Meteor.js
'use strict';

var packageName = 'las:vegas';  // http://atmospherejs.com/summernote:summernote
var where = 'client';  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  version: packageJson.version,
  summary: 'Vegas - Fullscreen Backgrounds and Slideshows.',
  git: 'https://github.com/jaysalvat/vegas',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('jquery', where);
  api.imply('jquery', where);
  api.addFiles([
    'dist/vegas.js',
    'dist/vegas.css'
  ], where);
  api.addAssets([
    'dist/overlays/01.png',
    'dist/overlays/02.png',
    'dist/overlays/03.png',
    'dist/overlays/04.png',
    'dist/overlays/05.png',
    'dist/overlays/06.png',
    'dist/overlays/07.png',
    'dist/overlays/08.png',
    'dist/overlays/09.png'
  ], where);
});

Package.onTest(function(api) {
  api.use('ecmascript', where);
  api.use('tinytest', where);
  api.use(packageName, where);
  api.addFiles('meteor/test.js', where);
});
