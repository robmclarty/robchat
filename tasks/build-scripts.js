'use strict'

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const envify = require('envify/custom')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const vendors = [
  'localforage',
  'moment',
  'node-fetch',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'react-router-redux',
  'react-scroll',
  'redux',
  'socket.io-client'
]

// Vendors don't change during development, so save them to a separate file to
// make rebuilding the app faster.
gulp.task('build:vendors', function buildVendors() {
  const isProduction = process.env.NODE_ENV === 'production'
  const stream = browserify({
    debug: false,
    require: vendors
  })

  return stream.bundle()
    .pipe(source('vendors.js'))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest('./build/javascripts'))
})

// Concatenate all app JS files, parse JSX and ES6 using Babel, write
// sourcemaps, use browserify for CommonJS and output to
// 'public/js/application.js' as ES5.
gulp.task('build:app', function () {
  const isProduction = process.env.NODE_ENV === 'production'
  const browserifyOptions = {
    entries: ['./client'],
    debug: true,
    fullPaths: false
  }
  const babelifyOptions = {
    presets: ['es2015', 'react'],
    plugins: ['babel-plugin-transform-object-rest-spread']
  }
  const stream = browserify(browserifyOptions)
    .transform(envify())
    .transform(babelify.configure(babelifyOptions))

  vendors.forEach(vendor => stream.external(vendor))

  return stream.bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest('./build/javascripts'))
})
