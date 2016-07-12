'use strict'

const router = require('express').Router()

// Homepage
router.route('/')
  .get((req, res) => res.json({ message: 'Welcome to Rebel Chat!' }))

// App
router.route('/rebelchat*')
  .get((req, res) => res.sendFile('index.html', { root: './build' }))

module.exports = router
