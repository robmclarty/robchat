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
  'base64-js',
  'localforage',
  'moment',
  'node-fetch',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'socket.io-client',
  'woobie'
]

// Vendors don't change during development, so save them to a separate file to
// make rebuilding the app faster.
gulp.task('build:vendors:client', function buildVendors() {
  const isProduction = process.env.NODE_ENV === 'production'
  const browserifyOpts = {
    require: vendors,
    debug: true
  }
  const stream = browserify(browserifyOpts)

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
gulp.task('build:scripts:client', function () {
  const isProduction = process.env.NODE_ENV === 'production'
  const browserifyOpts = {
    entries: ['./client'],
    debug: true,
    fullPaths: false
  }
  const babelOpts = {
    presets: ['es2015', 'react'],
    plugins: ['babel-plugin-transform-object-rest-spread']
  }
  const stream = browserify(browserifyOpts)
    .transform(envify())
    .transform(babelify.configure(babelOpts))

  vendors.forEach(vendor => stream.external(vendor))

  return stream.bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest('./build/javascripts'))
})
