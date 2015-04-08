# gulp-zip [![Build Status](https://travis-ci.org/sindresorhus/gulp-zip.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-zip)

> ZIP compress files


## Install

```
$ npm install --save-dev gulp-zip
```


## Usage

```js
var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function () {
	return gulp.src('src/*')
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest('dist'));
});
```


## API

### zip(filename, options)

#### filename

*Required*  
Type: `string`

#### options

##### compress

Type: `boolean`  
Default: `true`

##### comment

Type: `string`

Text information embedded in the zip file.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
