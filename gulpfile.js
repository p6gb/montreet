// https://github.com/jasewarner/gulp-shopify/blob/master/dev/gulpfile.js

'use strict';

/**
 * Modules
 */
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
// const changed = require('gulp-changed');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const scsslint = require('gulp-scss-lint');
const shell = require('gulp-shell');

/**
 * Compiler
 */
sass.compiler = require('node-sass');

/**
 * Paths
 */
const scssPath = './src/scss/**/*.scss';
const srcScss = './src/scss/main.scss';
const jsPath = './src/js/**/*.js';
const srcJS = './src/js/index.js';
const assetsDir = './assets/';

/**
 * JS task
 *
 * Note: use npm to install libraries and add them below, like the babel-polyfill example
 */
const jsFiles = [
    // './node_modules/babel-polyfill/dist/polyfill.js',
    './node_modules/fslightbox/index.js',
    srcJS,
];

gulp.task('js', () => {
    return gulp.src(jsFiles)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('dist.js'))
        .pipe(gulp.dest(assetsDir))
        .pipe(rename('dist.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(assetsDir));
});


/**
 * SCSS lint
 */
gulp.task('scss-lint', () => {
    return gulp.src(scssPath)
        .pipe(scsslint());
});

/**
 * SCSS task
 */
gulp.task('scss', () => {
    return gulp.src(srcScss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(rename('main.css.liquid'))
        .pipe(gulp.dest(assetsDir));
});

/**
 * Deploy Theme Using Shopify ThemeKit
 * Alternatively just run 'theme watch' from command line
 * 'theme open' opens preview in browser
 * @todo maybe there's some init task that runs only once and can do theme watch? 
 * might be more efficient than running deploy all the time
 */
// gulp.task('theme-deploy', shell.task('theme deploy'));

/**
 * Watch Task
 */
gulp.task('watch', function () {
    gulp.watch([scssPath, jsPath], gulp.series('scss'));
});
