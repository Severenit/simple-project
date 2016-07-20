'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  compass = require('gulp-compass'),
  jade = require('gulp-jade'),
  webserver = require('gulp-webserver');

var path = {
  app: './app',
  dev: './builds/dev'
}
var libsArray = [
  './bower_components/jquery/dist/jquery.js'
];
gulp.task('libsjs', function () {
  gulp.src(libsArray)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('builds/dev'));
});

gulp.task('js', function () {
  gulp.src([
      path.app + '/js/**/*.js',
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.dev));
});

// gulp.task('css', function(){
//   gulp.src([
//      'bower_components/angular/angular-csp.css',
//     ])
//     .pipe(concat('theme.css'))
//     .pipe(gulp.dest('builds/dev/css'));
// });
gulp.task('html', function () {
  gulp.src(path.app + '/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(path.dev));
});

gulp.task('img', function () {
  gulp.src(path.app + '/img/**/*.*')
    .pipe(gulp.dest(path.dev + '/img/'));
});

gulp.task('fonts', function () {
  gulp.src('bower_components/bootstrap/dist/fonts/**/*.*')
    .pipe(gulp.dest(path.dev + '/assets/fonts/'));
});

gulp.task('scss', function () {
  gulp.src([
      path.app + '/scss/**/*.scss'
    ])
    .pipe(compass({
      sourcemap: true,
      css: path.dev + '/css',
      sass: path.app + '/scss',
      image: path.dev + '/img',
      require: ['compass', 'singularitygs']
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(path.dev + '/css'));
});

gulp.task('watch', function () {
  gulp.watch(path.app + '/**/*.js', ['js']);
  gulp.watch(path.app + '/scss/**/*.scss', ['scss']);
  gulp.watch(path.app + '/img/**/*.*', ['img']);
  gulp.watch(path.app + '/**/*.jade', ['html']);
});

gulp.task('webserver', function () {
  gulp.src(path.dev)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', [
  'js',
  'libsjs',
  'scss',
  'img',
  'html',
  'watch',
  'webserver',
  'fonts'
]);
