'use strict'

const router = require('express').Router()

// Homepage
router.route('/')
  .get((req, res) => res.sendFile('index.html', {
    root: req.app.get('assets-path')
  }))

// App
router.route('/app*')
  .get((req, res) => res.sendFile('index.html', {
    root: `${ req.app.get('assets-path') }/app`
  }))

module.exports = router
