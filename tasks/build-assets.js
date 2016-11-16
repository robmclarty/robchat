'use strict'

const gulp = require('gulp')

// Copy all static assets to build folder.
gulp.task('build:assets', function () {
  return gulp.src('./assets/**/*')
    .pipe(gulp.dest('./build'))
})

// Copy client html files to build folder.
gulp.task('build:html:client', function () {
  return gulp.src('./client/index.html')
    .pipe(gulp.dest('./build/app'))
})

// Copy public html files to build folder.
gulp.task('build:html:public', function () {
  return gulp.src('./public/index.html')
    .pipe(gulp.dest('./build'))
})
