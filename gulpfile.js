var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pump = require('pump');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var rename = require("gulp-rename");


var noPoly = [ 'src/js/color-thief/color-thief.min.js', 'src/js/dbox.noPoly.js'];

// var cthief = ['src/js/color-thief/color-thief.min.js','src/js/polyfill/dialog-polyfill.js', 'src/dev/js/dbox.js'];


gulp.task( 'prodJS', function () {
    return gulp.src('src/dev/js/*.js')

        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
            return path;
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task( 'prodcss', function () {
    var plugins = [
        autoprefixer(),
        cssnano({preset: 'advanced'})
    ];
    return gulp.src('./dist/css/dbox.css')
        .pipe(postcss(plugins))
        .pipe(rename('dbox.min.css'))
        .pipe(gulp.dest('./dist/css'));

});

gulp.task('sass', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});



gulp.task( 'dbox', function () {
    return gulp.src(['src/js/color-thief/color-thief.min.js','src/js/polyfill/dialog-polyfill.js', 'src/dev/js/dbox.js'])
        // .pipe(babel())
        .pipe(concat('dbox.js'))
        .pipe(gulp.dest('src/dev/js'))
        .pipe(browserSync.stream());
});


gulp.task('dev', function () {
    return gulp.src('src/js/*.js')
        .pipe(babel())
        // .pipe(concat('dbox.js'))
        .pipe(gulp.dest('src/dev/js'));
});

gulp.task('noPoly', function () {
    return gulp.src(noPoly)
        .pipe(babel())
        .pipe(concat('dbox.noPolyfill.js'))
        .pipe(gulp.dest('src/dev/js'));
});





gulp.task('watch', function() {
    gulp.watch('src/js/**/**/*.js', ['dev', 'noPoly', 'dbox']);
    gulp.watch('src/scss/**/**/*.scss', ['sass']);

});

gulp.task('js-watch', ['dev'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('serve', ['sass', 'dev', 'dbox'], function() {

    browserSync.init({
        server:  {
            baseDir: "./"
        }
    });

    gulp.watch('src/scss/**/**/*.scss', ['sass']);
    gulp.watch('src/js/**/**/*.js', ['dev', 'noPoly', 'dbox']);
    gulp.watch("*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);

