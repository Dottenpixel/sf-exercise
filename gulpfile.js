var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var less        = require('gulp-less');
var sourcemaps  = require('gulp-sourcemaps');
var rename      = require('gulp-rename');
var plumber     = require('gulp-plumber');


// start server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    startPath: "exercise/",
    port: 3011
  });
});

// process HTML files and return the stream.
gulp.task('html', function () {
  return gulp.src('./**/*html');
});

// process JS files and return the stream.
gulp.task('js', function () {
  return gulp.src('./**/js/*js');
});

// process CSS files and return the stream.
gulp.task('css', function () {
  return gulp.src('./*/*css');
});

gulp.task('less', function () {
  return gulp.src(["./**/css/less/*-main.less"])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', console.error.bind(console))
    .pipe(rename(function(path){
      path.dirname = path.dirname.replace(/\/less$/, "");         
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'))
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync'], function () {
  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch(["./**/css/less/*.less"], ['less']);
  gulp.watch(["./**/*.html","./**/js/*.js","./**/css/*.css"], ['html', 'css', 'js', browserSync.reload]);
});