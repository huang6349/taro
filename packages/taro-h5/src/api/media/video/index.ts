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

import Taro from '@tarojs/api'

import { findDOM, shouldBeObject, temporarilyNotSupport } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

// 视频
export const saveVideoToPhotosAlbum = temporarilyNotSupport('saveVideoToPhotosAlbum')
export const openVideoEditor = temporarilyNotSupport('openVideoEditor')
export const getVideoInfo = temporarilyNotSupport('getVideoInfo')

/**
 * 创建 video 上下文 VideoContext 对象。
 */
export const createVideoContext: typeof Taro.createVideoContext = (id, inst) => {
  const el = findDOM(inst) as HTMLVideoElement
  // TODO HTMLVideoElement to VideoContext
  return el?.querySelector(`taro-video-core[id=${id}]`) as unknown as Taro.VideoContext
}

export const compressVideo = temporarilyNotSupport('compressVideo')

/**
 * 拍摄视频或从手机相册中选视频。
 */
export const chooseVideo: typeof Taro.chooseVideo = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `chooseVideo:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.chooseVideo.SuccessCallbackResult>({ name: 'chooseVideo', success, fail, complete })
  const res: Partial<Taro.chooseVideo.SuccessCallbackResult> = {
    tempFilePath: '',
    duration: 0,
    size: 0,
    height: 0,
    width: 0
  }

  const inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'file')
  inputEl.setAttribute('multiple', 'multiple')
  inputEl.setAttribute('accept', 'video/*')
  inputEl.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
  document.body.appendChild(inputEl)

  return new Promise<Taro.chooseVideo.SuccessCallbackResult>((resolve, reject) => {
    const TaroMouseEvents = document.createEvent('MouseEvents')
    TaroMouseEvents.initEvent('click', true, true)
    inputEl.dispatchEvent(TaroMouseEvents)
    inputEl.onchange = function (e) {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      const reader = new FileReader()
      reader.onload = function (event: ProgressEvent<FileReader>) {
        const videoEl = document.createElement('video')
        const url = event.target?.result as string
        videoEl.preload = 'metadata'
        videoEl.src = url
        videoEl.onloadedmetadata = () => {
          res.tempFilePath = url
          res.duration = videoEl.duration
          res.size = event.total
          res.height = videoEl.videoHeight
          res.width = videoEl.videoHeight
          return handle.success(res, { resolve, reject })
        }
      }
      if (file) {
        reader.readAsDataURL(file)
      }
    }
  }).finally(() => {
    document.body.removeChild(inputEl)
  })
}

export const chooseMedia = temporarilyNotSupport('chooseMedia')
