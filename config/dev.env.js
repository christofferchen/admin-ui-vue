'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  appConfig: JSON.stringify({
    title: "后台管理系统-开发环境",
    apiUrl: 'http://cpapi.trunk.jzhtest.com/'
  })
})
