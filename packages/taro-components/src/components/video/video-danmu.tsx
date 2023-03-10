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

import { Component, h, ComponentInterface, Prop, State, Host, Method } from '@stencil/core'

export interface Danmu {
  text: string
  color: string
  time: number,
  key: number,
  bottom: string
}

@Component({
  tag: 'taro-video-danmu'
})
export class VideoDanmu implements ComponentInterface {
  private list: Danmu[] = []
  private danmuElList: HTMLParagraphElement[] = []
  private currentTime = 0

  @Prop() enable = false

  @State() danmuList: Danmu[] = []

  ensureProperties (danmu: Partial<Danmu>): Danmu {
    const clonedDanmu = { ...danmu } as Danmu
    if (!('time' in danmu)) {
      clonedDanmu.time = this.currentTime
    }
    clonedDanmu.key = Math.random()
    clonedDanmu.bottom = `${Math.random() * 90 + 5}%`
    return clonedDanmu
  }

  @Method()
  async sendDanmu (danmuList: Partial<Danmu> | Partial<Danmu>[] = []) {
    if (Array.isArray(danmuList)) {
      this.list = [
        ...this.list,
        ...danmuList.map(danmu => this.ensureProperties(danmu))
      ]
    } else {
      const danmu = danmuList
      this.list = [
        ...this.list,
        { ...this.ensureProperties(danmu) }
      ]
    }
  }

  @Method()
  async tick (currentTime: number) {
    this.currentTime = currentTime

    if (!this.enable) return

    const danmuList = this.list

    /**
     * @todo 这个判断对拖拽进度的处理不严谨
     */
    const newDanmuList = danmuList.filter(({ time }) => {
      return currentTime - time < 4 && currentTime > time
    })
    let shouldUpdate = false
    const oldDanmuList = this.danmuList

    if (newDanmuList.length !== oldDanmuList.length) {
      shouldUpdate = true
    } else {
      shouldUpdate = newDanmuList.some(({ key }) => {
        return oldDanmuList.every((danmu) => {
          return key !== danmu.key
        })
      })
    }
    if (shouldUpdate) {
      this.danmuList = newDanmuList
    }
  }

  componentDidUpdate () {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const danmuElList = this.danmuElList.splice(0)
        danmuElList.forEach(danmu => {
          danmu.style.left = '0'
          danmu.style.webkitTransform = 'translateX(-100%)'
          danmu.style.transform = 'translateX(-100%)'
        })
      })
    })
  }

  render () {
    if (!this.enable) return ''

    return (
      <Host class='taro-video-danmu'>
        {this.danmuList.map(({ text, color, bottom, key }) => (
          <p
            class='taro-video-danmu-item'
            key={key}
            style={{
              color,
              bottom
            }}
            ref={ref => {
              if (ref) {
                this.danmuElList.push(ref)
              }
            }}
          >
            {text}
          </p>
        ))}
      </Host>
    )
  }
}
