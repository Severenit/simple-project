'use strict';
const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    webserver = require('gulp-webserver'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps');

const path = {
    app: './app',
    dev: './builds/dev'
}
const libsArray = [
    './node_modules/jquery/dist/jquery.js'
];

gulp.task('libsjs', function () {
    gulp.src(libsArray)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('builds/dev'));
});

gulp.task('js', function () {
    return gulp.src(path.app + '/js/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dev));
});

gulp.task('html', function () {
    gulp.src(path.app + '/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(path.dev));
});

gulp.task('img', function () {
    gulp.src(path.app + '/img/**/*.*')
        .pipe(gulp.dest(path.dev + '/img/'));
});

gulp.task('assets', function () {
    gulp.src(path.app + '/assets/**/*.*')
        .pipe(gulp.dest(path.dev + '/assets/'));
});

gulp.task('scss', function ( done ) {
    gulp.src(path.app + '/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest(path.dev + '/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(path.dev + '/css/'))
        .on('end', done);
});

gulp.task('watch', function () {
    watch(path.app + '/scss/**/*.scss', function () {
        gulp.start('scss')
    });
    watch(path.app + '/**/*.js', function () {
        gulp.start('js')
    });
    watch(path.app + '/**/*.jade', function () {
        gulp.start('html')
    });
    watch(path.app + '/img/**/*.*', function () {
        gulp.start('img')
    });
    watch(path.app + '/assets/**/*.*', function () {
        gulp.start('assets')
    });
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
    'assets'
]);
