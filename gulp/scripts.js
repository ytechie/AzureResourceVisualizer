'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

//console.log(JSON.stringify($));

  var tsProject = $.typescript.createProject({
    target: 'es5',
    sortOutput: true
  });

  gulp.task('scripts', function () {
    //Not a fan of putting these in the root, but it's to get the ace require to work
    gulp.src(path.join('bower_components', '/ace-builds/src-noconflict/**/*json*.*'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
        
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.ts'),
        path.join('!' + conf.paths.src, '/app/**/*.spec.ts')])
        .pipe($.sourcemaps.init())
        .pipe($.tslint())
        .pipe($.tslint.report('prose', { emitError: false }))
        .pipe($.typescript(tsProject)).on('error', conf.errorHandler('TypeScript'))
        .pipe($.concat('index.module.js'))
        //.pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')))
        .pipe(browserSync.reload({ stream: true }))
        .pipe($.size())
});
