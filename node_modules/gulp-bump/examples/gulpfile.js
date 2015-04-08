var gulp = require('gulp');
var bump = require('../');

gulp.task('bump', function(){
  var options = {
    type: 'minor'
  };
  gulp.src('./package.json')
  .pipe(bump(options))
  .pipe(gulp.dest('./build'));
});

gulp.task('key', function(){
  gulp.src('./key.json')
  .pipe(bump({key: "appversion"}))
  .pipe(gulp.dest('./build'));
});


gulp.task('default', ['bump']);