'use strict'

const router = require('express').Router()

// Homepage
router.route('/')
  .get((req, res) => res.json({ message: 'Welcome to Rebel Chat!' }))

// App
router.route('/app*')
  .get((req, res) => res.sendFile('index.html', { root: './build/app' }))

module.exports = router
