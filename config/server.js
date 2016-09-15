'use strict'

module.exports = {
  appName: process.env.APP_NAME || 'rebel-chat',
  issuer: process.env.JWT_ISSUER || 'rebel-chat',
  database: process.env.DATABASE || 'mongodb://localhost:27017/rebel-chat',
  access: {
    privateKeyPath: process.env.ACCESS_PRIVATE_KEY || './config/private-sample.pem',
    publicKeyPath: process.env.ACCESS_PUBLIC_KEY || './config/public-sample.pem',
    expiresIn: process.env.ACCESS_EXPIRES_IN || '24 hours',
    algorithm: process.env.ACCESS_ALG || 'ES384' // ECDSA using P-384 curve and SHA-384 hash algorithm
  },
  refresh: {
    secret: process.env.REFRESH_SECRET || 'my_super_secret_secret',
    expiresIn: process.env.REFERSH_EXPIRES_IN || '7 days',
    algorithm: process.env.REFRESH_ALG || 'HS512' // HMAC using SHA-512 hash algorithm
  }
}
