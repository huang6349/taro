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

import Taro from '../../index'

declare module '../../index' {
  namespace hideKeyboard {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getSelectedTextRange {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 输入框光标结束位置 */
      end: number
      /** 输入框光标起始位置 */
      start: number
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace onKeyboardHeightChange {
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 键盘高度 */
      height: number
    }
  }

  interface TaroStatic {
    /** 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
     * @supported weapp, rn, tt
     * @example
     * ```tsx
     * Taro.hideKeyboard({
     *   complete: res => {
     *     console.log('hideKeyboard res', res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.hideKeyboard.html
     */
    hideKeyboard(option?: hideKeyboard.Option): Promise<TaroGeneral.CallbackResult>

    /** 在input、textarea等focus之后，获取输入框的光标位置。注意：只有在focus的时候调用此接口才有效。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getSelectedTextRange({
     *   complete: res => {
     *     console.log('getSelectedTextRange res', res.start, res.end)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.getSelectedTextRange.html
     */
    getSelectedTextRange(option?: getSelectedTextRange.Option): Promise<getSelectedTextRange.SuccessCallbackResult>

    /** 监听键盘高度变化
     * @supported weapp, rn
     * @example
     * ```tsx
     * Taro.onKeyboardHeightChange(res => {
     *   console.log(res.height)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.onKeyboardHeightChange.html
     */
    onKeyboardHeightChange(callback: onKeyboardHeightChange.Callback): void

    /**
     * 取消监听键盘高度变化事件。
     * @supported weapp, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/keyboard/wx.offKeyboardHeightChange.html
     */
    offKeyboardHeightChange(
      /** 键盘高度变化事件的回调函数 */
      callback?: (...args: any[]) => any,
    ): void
  }
}
