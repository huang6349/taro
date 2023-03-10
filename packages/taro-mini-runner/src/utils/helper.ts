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

import {
  getInstalledNpmPkgPath,
  promoteRelativePath,
  REG_SCRIPT,
  REG_STYLE,
  removeHeadSlash,
  taroJsQuickAppComponents
} from '@tarojs/helper'
import * as path from 'path'

export function getTaroJsQuickAppComponentsPath (nodeModulesPath: string): string {
  const taroJsQuickAppComponentsPkg = getInstalledNpmPkgPath(taroJsQuickAppComponents, nodeModulesPath)
  if (!taroJsQuickAppComponentsPkg) {
    // printLog(processTypeEnum.ERROR, '包安装', `缺少包 ${taroJsQuickAppComponents}，请安装！`)
    process.exit(0)
  }
  return path.join(path.dirname(taroJsQuickAppComponentsPkg as string), 'src/components')
}

export function getImportTaroSelfComponents (filePath, nodeModulesPath, outputDir, taroSelfComponents) {
  const importTaroSelfComponents = new Set<{ path: string, name: string }>()
  const taroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath(nodeModulesPath)
  taroSelfComponents.forEach(c => {
    const cPath = path.join(taroJsQuickAppComponentsPath, c)
    const cMainPath = path.join(cPath, 'index')
    const cRelativePath = promoteRelativePath(path.relative(filePath, cMainPath.replace(nodeModulesPath, path.join(outputDir, 'npm'))))
    importTaroSelfComponents.add({
      path: cRelativePath,
      name: c
    })
  })
  return importTaroSelfComponents
}

export function generateQuickAppUx ({
  script,
  template,
  style,
  imports
}: {
  script?: string
  template?: string
  style?: string
  imports?: Set<{
    path: string
    name: string
  }>
}) {
  let uxTxt = ''
  if (imports && imports.size) {
    imports.forEach(item => {
      uxTxt += `<import src='${item.path}' name='${item.name}'></import>\n`
    })
  }
  if (style) {
    if (REG_STYLE.test(style)) {
      uxTxt += `<style src="${style}"></style>\n`
    } else {
      uxTxt += `<style>\n${style}\n</style>\n`
    }
  }
  if (template) {
    uxTxt += `<template>\n${template}\n</template>\n`
  }
  if (script) {
    if (REG_SCRIPT.test(script)) {
      uxTxt += `<script src="${script}"></script>\n`
    } else {
      uxTxt += `<script>\n${script}\n</script>\n`
    }
  }
  return uxTxt
}

export function generateQuickAppManifest ({
  appConfig,
  quickappJSON,
  pageConfigs,
  designWidth
}) {
  // 生成 router
  const pages = (appConfig.pages as string[]).concat()
  const routerPages = {}
  const customPageConfig = quickappJSON.customPageConfig || {}

  pages.forEach(element => {
    const customConfig = customPageConfig[element]
    const pageConf: any = {
      component: path.basename(element)
    }
    if (customConfig) {
      const filter = customConfig.filter
      const launchMode = customConfig.launchMode
      if (filter) {
        pageConf.filter = filter
      }
      if (launchMode) {
        pageConf.launchMode = launchMode
      }
    }
    routerPages[removeHeadSlash(path.dirname(element))] = pageConf
  })
  delete quickappJSON.customPageConfig
  const routerEntry = pages.shift()
  const router = {
    entry: removeHeadSlash(path.dirname(routerEntry as string)),
    pages: routerPages
  }
  // 生成 display
  const display = JSON.parse(JSON.stringify(appConfig.window || {}))
  display.pages = {}
  pageConfigs.forEach((item, page) => {
    if (item) {
      display.pages[removeHeadSlash(path.dirname(page))] = item
    }
  })
  quickappJSON.router = router
  quickappJSON.display = display
  quickappJSON.config = Object.assign({}, quickappJSON.config, {
    designWidth: designWidth || 750
  })
  if (appConfig.window && appConfig.window.navigationStyle === 'custom') {
    quickappJSON.display.titleBar = false
    delete quickappJSON.display.navigationStyle
  }
  return quickappJSON
}
