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
/* eslint-disable no-console */
import { join } from 'path'

import BaseCI from './BaseCi'
import { getNpmPkgSync } from './utils/npm'
import { generateQrcodeImageFile, printQrcode2Terminal, readQrcodeImageContent } from './utils/qrcode'

export default class JdCI extends BaseCI {
  jdCi
  init () {
    if (this.pluginOpts.jd == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "jd" 选项')
    }
    try {
      this.jdCi = getNpmPkgSync('jd-miniprogram-ci', process.cwd())
    } catch (error) {
      throw new Error('请安装依赖：jd-miniprogram-ci')
    }
  }

  async open () {
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.WARNING, '京东小程序不支持 "--open" 参数打开开发者工具')
  }

  async preview () {
    const { privateKey } = this.pluginOpts.jd!
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const previewQrcodePath = join(this.projectPath, 'preview.jpg')

    try {
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      // 返回 图片 base64转换效果
      const result = await this.jdCi.preview({
        desc: this.desc,
        privateKey,
        projectPath: this.projectPath,
        uv: this.version, // 版本号和备注京东小程序暂不支持，后续优化
        qrcodeFormat: 'image'
      })

      const qrcodeContent = await readQrcodeImageContent(result.imgUrl)
      await generateQrcodeImageFile(previewQrcodePath, qrcodeContent)
      await printQrcode2Terminal(qrcodeContent)
      printLog(processTypeEnum.REMIND, `预览二维码已生成，存储在:"${previewQrcodePath}",二维码内容是："${qrcodeContent}"`)

      this.triggerPreviewHooks({
        success: true,
        data: {
          platform: 'jd',
          qrCodeContent: qrcodeContent,
          qrCodeLocalPath: previewQrcodePath
        },
      })
    } catch(error) {
      console.log(chalk.red(`预览失败 ${new Date().toLocaleString()} \n${error.message}`))
      this.triggerPreviewHooks({
        success: false,
        data: {
          platform: 'jd',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }

  async upload () {
    const { privateKey } = this.pluginOpts.jd!
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const uploadQrcodePath = join(this.projectPath, 'upload.jpg')

    try {
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      const result = await this.jdCi.upload({
        desc: this.desc,
        privateKey,
        projectPath: this.projectPath,
        uv: this.version, // 版本号和备注京东小程序暂不支持，后续优化
        qrcodeFormat: 'image',
      })

      const qrcodeContent = await readQrcodeImageContent(result.imgUrl)
      await generateQrcodeImageFile(uploadQrcodePath, qrcodeContent)
      await printQrcode2Terminal(qrcodeContent)
      printLog(processTypeEnum.REMIND, `体验版二维码已生成，存储在:"${uploadQrcodePath}",二维码内容是："${qrcodeContent}"`)

      this.triggerUploadHooks({
        success: true,
        data: {
          platform: 'jd',
          qrCodeContent: qrcodeContent,
          qrCodeLocalPath: uploadQrcodePath
        },
      })
    } catch(error) {
      console.log(chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))
      this.triggerUploadHooks({
        success: false,
        data: {
          platform: 'jd',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }
}
