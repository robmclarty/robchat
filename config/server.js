'use strict'

module.exports = {
  appName: process.env.APP_NAME || 'rob-chat',
  issuer: process.env.JWT_ISSUER || 'cred-auth-manager',
  database: process.env.DATABASE || 'mongodb://localhost:27017/robchat',
  origin: process.env.ORIGIN || '*',
  assetsPath: process.env.ASSETS_PATH || './build',
  publicKeyPath: process.env.ACCESS_PUBLIC_KEY || './config/public-key.pem.sample',
  algorithm: process.env.ACCESS_ALG || 'ES384' // ECDSA using P-384 curve and SHA-384 hash algorithm
}
