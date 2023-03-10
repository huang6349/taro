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
 */

import { previewDev, previewProd } from '@tarojs/rn-supporter'
import { spawn } from 'child_process'
import { constants, copyFile } from 'fs'
import * as fse from 'fs-extra'
import { dirname, join } from 'path'

import buildComponent from './config/build-component'

// 确认根目录下 metro.config.js index.js 是否存在
const files = ['metro.config.js', 'index.js']
function confirmFiles () {
  files.forEach(file => {
    const filePath = join(process.cwd(), file)
    copyFile(join(__dirname, '..', 'templates', file), filePath, constants.COPYFILE_EXCL, err => {
      if (err) {
        if (err.code !== 'EEXIST') {
          // 不重复生成配置文件
          console.log(err)
        }
      } else {
        console.log(`${file} created`)
      }
    })
  })
}

const isWin = /^win/.test(process.platform)
const npxCmd = isWin ? 'npx.cmd' : 'npx'

export default async function build (_appPath: string, config: any): Promise<any> {
  process.env.TARO_ENV = 'rn'
  const isIos = config.deviceType === 'ios'
  const cliParams:string[] = []
  config.output = config.output || {}
  // cli & config 参数透传
  if (config.resetCache) {
    cliParams.push('--reset-cache')
  }
  if (config.publicPath) {
    process.env.PUBLIC_PATH = config.publicPath
  }
  const onFinish = function (error?) {
    if (typeof config.onBuildFinish === 'function') {
      config.onBuildFinish({
        error,
        isWatch: config.isWatch
      })
    }
    if (error instanceof Error) throw error
  }
  if (config.isBuildNativeComp) {
    return buildComponent(
      _appPath,
      config
    )
  }
  confirmFiles()
  if (config.isWatch) {
    if (config.port) {
      cliParams.push('--port', config.port)
    }
    try {
      spawn(npxCmd, ['react-native', 'start'].concat(cliParams), {
        stdio: 'inherit'
      })
      if(config.qr) {
        previewDev({
          port: parseInt(config.port) || 8081,
        })
      }
      onFinish(null)
    } catch(e) {
      onFinish(e)
    }
  } else {
    const defaultOutputDir = join(process.cwd(), config.outputRoot || 'dist')
    const defaultBundleOutput = join(defaultOutputDir, 'index.bundle')
    const bundleOutput = (config.bundleOutput ? config.bundleOutput : (isIos ? config.output.ios : config.output.android)) || defaultBundleOutput
    fse.ensureDirSync(dirname(bundleOutput))
    cliParams.push('--bundle-output', bundleOutput)

    const sourcemapOutput = config.sourcemapOutput ? config.sourcemapOutput : (isIos ? config.output.iosSourcemapOutput : config.output.androidSourcemapOutput)
    if (sourcemapOutput) {
      cliParams.push('--sourcemap-output', sourcemapOutput)
    }
    const sourceMapUrl = config.sourceMapUrl ? config.sourceMapUrl : (isIos ? config.output.iosSourceMapUrl : config.output.androidSourceMapUrl)
    if (sourceMapUrl) {
      cliParams.push('--sourcemap-use-absolute-path', sourceMapUrl)
    }

    const sourcemapSourcesRoot = config.sourcemapSourcesRoot ? config.sourcemapSourcesRoot : (isIos ? config.output.iosSourcemapSourcesRoot : config.output.androidSourcemapSourcesRoot)
    if (sourcemapSourcesRoot) {
      cliParams.push('--sourcemap-sources-root', sourcemapSourcesRoot)
    }

    const assetsDest = (config.assetsDest ? config.assetsDest : (isIos ? config.output.iosAssetsDest : config.output.androidAssetsDest)) || defaultOutputDir
    cliParams.push('--assets-dest', assetsDest)
    fse.ensureDirSync(assetsDest)

    try {
      spawn(npxCmd, [
        'react-native',
        'bundle',
        '--platform',
        config.deviceType,
        '--dev',
        'false',
        '--entry-file',
        'index.js'
      ].concat(cliParams), {
        stdio: 'inherit'
      })
      if(config.qr) {
        process.on('beforeExit', () => {
          previewProd({
            out: bundleOutput,
            platform: config.deviceType,
            assetsDest: assetsDest,
          })
        })
      }
      onFinish(null)
    } catch(e) {
      onFinish(e)
    }
  }
}
