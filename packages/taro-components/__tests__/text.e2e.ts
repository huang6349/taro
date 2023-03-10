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

import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Text e2e', () => {
  let page: E2EPage

  beforeEach(async () => {
    page = await newE2EPage({
      html: `<taro-text-core></taro-text-core>`,
    })
  })

  it('props', async () => {
    await page.waitForChanges()
    const el = await page.find('taro-text-core')
    let style = await el.getComputedStyle()
    expect(style.userSelect).toEqual('none')

    el.toggleAttribute('selectable', true)
    el.classList.add('foo')

    await page.waitForChanges()
    style = await el.getComputedStyle()
    expect(style.userSelect).toEqual('text')
    expect(el?.classList.contains('taro-text__selectable')).toEqual(true)
    expect(el?.classList.contains('foo')).toEqual(true)
    expect(el?.classList.contains('hydrated')).toEqual(true)
  })

  it('screenshot', async () => {
    await page.waitForChanges()
    await page.compareScreenshot()
  })
})
