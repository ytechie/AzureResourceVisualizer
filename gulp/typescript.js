/// <reference path="../typings/gulp/gulp.d.ts" />

var gulp = require('gulp');
var ts = require('gulp-typescript');

module.exports = function(options) {
  gulp.task('typescript', function () {
    var tsResult = gulp.src('src/**/*.ts')
      .pipe(ts({
          noImplicitAny: false,
          target: 'ES5'
        }));
    return tsResult.js.pipe(gulp.dest('src'));
  });
}