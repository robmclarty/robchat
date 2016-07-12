'use strict'

module.exports = {
  appName: 'rebel-chat',
  issuer: 'rebel-chat',
  database: process.env.DATABASE || 'mongodb://localhost:27017/rebel-chat',
  access: {
    privateKeyPath: process.env.PRIVATE_KEY || './config/private.pem',
    publicKeyPath: process.env.PUBLIC_KEY || './config/public.pem',
    expiresIn: process.env.EXPIRES_IN || '24 hours',
    algorithm: 'ES384' // ECDSA using P-384 curve and SHA-384 hash algorithm
  },
  refresh: {
    secret: process.env.REFRESH_SECRET || 'my_super_secret_secret',
    expiresIn: process.env.EXPIRES_IN || '7 days',
    algorithm: 'HS512' // HMAC using SHA-512 hash algorithm
  }
}
