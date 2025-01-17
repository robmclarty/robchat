'use strict'

const gulp = require('gulp')
const argv = require('yargs').argv
const requireDir = require('require-dir')

// Require all tasks.
requireDir('./tasks', { recurse: true })

function setProductionEnv(done) {
  process.env.NODE_ENV = 'production'
  return done()
}

// Build for production (include minification, revs, etc.).
const buildProduction = gulp.series(
  'clean',
  setProductionEnv,
  gulp.parallel(
    'build:vendors:client',
    'build:scripts:client',
    'build:styles:client',
    'build:styles:public',
    'build:assets',
    'build:html:client',
    'build:html:public'
  )
  // 'rev:assets',
  // gulp.parallel('rev:js', 'rev:css'),
  // 'rev:html'
)

// Build for development (include React dev, no revs, no minification, etc.).
const buildDevelopment = gulp.series(
  'clean',
  gulp.parallel(
    'build:vendors:client',
    'build:scripts:client',
    'build:styles:client',
    'build:styles:public',
    'build:assets',
    'build:html:client',
    'build:html:public'
  )
)

// Choose between building for dev or production based on --production flag.
function build(done) {
  if (argv.production) {
    buildProduction()
  } else {
    buildDevelopment()
  }

  return done()
}
build.description = 'Build all the things!'
build.flags = {
  '--production': 'Builds in production mode (minification, revs, etc.).'
}
gulp.task(build)

// Watch for changes in source file and restart/rebuild when there are any.
function watch() {
  gulp.watch('assets/**/*', gulp.series('build:assets'))
  gulp.watch('styles/**/*', gulp.series('build:styles:client', 'build:styles:public'))
  gulp.watch('client/**/*', gulp.series('build:scripts:client', 'build:html:client'))
  gulp.watch('public/**/*', gulp.series('build:html:public'))
  gulp.watch('server/**/*', gulp.series('server'))
}
watch.description = 'Watch variable folders for changes and rebuild if necessary.'
gulp.task(watch)

// Deploy to server.
function deploy(done) {
  if (argv.host) process.env.SERVER_HOST = argv.host;

  gulp.series(
    buildProduction,
    'deploy:assets',
    'deploy:server',
    'deploy:reload'
  )()

  return done()
}
deploy.description = 'Build for production and deploy to server, restarting the server when finished.'
deploy.flags = {
  '--host': 'Sets the host to where the server you want to deploy to is located.'
}
gulp.task(deploy)

gulp.task('default', gulp.series(build, 'server', watch))
