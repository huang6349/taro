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

import { isString } from '@tarojs/shared'

interface SpecialMaps {
  mapName: string | SpecialMaps.MapNameFn
  mapNameCondition?: string[]
  mapAttr?: SpecialMaps.MapAttrFn
}

export namespace SpecialMaps {
  export interface MapNameFn {
    (props: Record<string, any>): string
  }
  export interface MapAttrFn {
    (key: string, value: any, props: Record<string, any>): [string, any]
  }
}

function genAttrMapFnFromDir (dir: Record<string, string | [string, Record<string, any>]>): SpecialMaps.MapAttrFn {
  const fn: SpecialMaps.MapAttrFn = function (key, value) {
    const lowerKey = key.toLowerCase()
    if (lowerKey in dir) {
      const res = dir[lowerKey]
      if (isString(res)) {
        key = res
      } else {
        key = res[0]
        value = res[1][value] || value
      }
    }
    return [key, value]
  }
  return fn
}

export const inlineElements = new Set<string>([])
export const blockElements = new Set<string>([])
export const specialElements = new Map<string, string | SpecialMaps>([
  ['slot', 'slot'],
  ['form', 'form'],
  ['iframe', 'web-view'],
  ['img', 'image'],
  ['audio', 'audio'],
  ['video', 'video'],
  ['canvas', 'canvas'],
  ['a', {
    mapName (props) {
      if(props.as && isString(props.as)) return props.as.toLowerCase()
      return !props.href || (/^javascript/.test(props.href)) ? 'view' : 'navigator'
    },
    mapNameCondition: ['href'],
    mapAttr: genAttrMapFnFromDir({
      href: 'url',
      target: ['openType', {
        _blank: 'navigate',
        _self: 'redirect'
      }]
    })
  }],
  ['input', {
    mapName (props) {
      if (props.type === 'checkbox') {
        return 'checkbox'
      } else if (props.type === 'radio') {
        return 'radio'
      }
      return 'input'
    },
    mapNameCondition: ['type'],
    mapAttr (key, value, props) {
      const htmlKey = key.toLowerCase()
      if (htmlKey === 'autofocus') {
        key = 'focus'
      } else if (htmlKey === 'readonly') {
        if (props.disabled === true) {
          value = true
        }
        key = 'disabled'
      } else if (htmlKey === 'type') {
        if (value === 'password') {
          key = 'password'
          value = true
        } else if (value === 'tel') {
          value = 'number'
        }
      } else if (htmlKey === 'maxlength') {
        key = 'maxlength'
      }
      return [key, value]
    }
  }],
  ['label', {
    mapName: 'label',
    mapAttr: genAttrMapFnFromDir({
      htmlfor: 'for'
    })
  }],
  ['textarea', {
    mapName: 'textarea',
    mapAttr: genAttrMapFnFromDir({
      autofocus: 'focus',
      readonly: 'disabled',
      maxlength: 'maxlength'
    })
  }],
  ['progress', {
    mapName: 'progress',
    mapAttr (key, value, props) {
      if (key === 'value') {
        const max = props.max || 1
        key = 'percent'
        value = Math.round(value / max * 100)
      }
      return [key, value]
    }
  }],
  ['button', {
    mapName: 'button',
    mapAttr (key, value) {
      if (key === 'type' && (value === 'submit' || value === 'reset')) {
        key = 'formType'
      }
      return [key, value]
    }
  }]
])
