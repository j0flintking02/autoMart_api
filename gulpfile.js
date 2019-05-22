const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () => gulp.src('server/app.js')
  .pipe(babel())
  .pipe(gulp.dest('server/build')));
gulp.task('default', () => {
  gulp.watch('server/app.js', ['build']);
});
