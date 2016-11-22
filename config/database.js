'use strict'

module.exports = {
  development: {
    url: 'postgres://localhost:5432/robchat',
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  test: {
    url: process.env.DATABASE || 'postgres://localhost:5432/robchat-test',
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  production: {
    url: process.env.DATABASE || 'postgres://localhost:5432/robchat',
    dialect: 'postgres',
    seederStorage: 'sequelize'
  }
}
