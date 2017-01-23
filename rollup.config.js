'use strict'

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import jsx from 'rollup-plugin-jsx'

// .babelrc
// {
//   "presets": [
//     ["es2015", { "modules": false }],
//     ["react"]
//   ],
//   "plugins": [
//     "external-helpers",
//     "transform-object-rest-spread"
//   ]
// }

export default {
  moduleName: 'robchat',
  entry: 'client/index.js',
  dest: 'build/javascripts/application.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json'],
      preferBuiltins: true
    }),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    })
    // jsx({
    //   factory: 'React.createElement',
    //   spreadFn: 'Object.assign'
    // })
  ]
}
