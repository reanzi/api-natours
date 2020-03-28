const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

// compile scss into css

function style() {
  // 1. where are my sass files
  return (
    gulp
      .src('./sass/**/*.scss')
      // 2. pass that file through sass compiler
      .pipe(sass().on('error', sass.logError))
      // 3. where do I save the compiled
      .pipe(gulp.dest('./dist/css'))
      //   4. steam changes to all browsers
      .pipe(browserSync.stream())
  );
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./sass/**/*.scss', style);
  gulp.watch('./**/*.pug').on('change', browserSync.reload);
  gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
