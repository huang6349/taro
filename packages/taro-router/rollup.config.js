/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import * as path from 'path'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: [
    {
      file: path.join(cwd, 'dist/index.cjs.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    externals({
      devDeps: false
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    ts({
      declaration: false,
      sourceMap: true
    }),
    commonjs()
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output[0], {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/index.esm.js')
  })
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return baseConfig
  } else if (target === 'esm') {
    return esmConfig
  } else {
    return [baseConfig, esmConfig]
  }
}
module.exports = rollup()
