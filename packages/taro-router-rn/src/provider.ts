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

import { camelCase } from 'lodash'
import * as React from 'react'

import { navigationRef } from './rootNavigation'
import { getTabBarPages, getTabVisible } from './utils/index'

interface PageProps {
  navigation: any
  currentPath: string
  pageConfig: any
  children: React.ReactNode
}

const globalAny: any = global

export class PageProvider extends React.Component<any> {
  constructor (props: PageProps) {
    super(props)
    // setOptions  在导航navigationRef 并没有暴露出来
    if (navigationRef && navigationRef?.current) {
      navigationRef.current.setOptions = this.props.navigation.setOptions
    }
    this.handleConfig()
  }

  componentDidMount (): void {
    const { navigation } = this.props
    this.unSubscribleFocus = this.props.navigation.addListener('focus', () => {
      if (navigationRef && navigationRef?.current) {
        navigationRef.current.setOptions = navigation.setOptions
      }
      // 若是tabBar页面，确保tabbar内容最新
      if (this.isTabBarPage()) {
        const tabBarVisible = getTabVisible()
        navigation.setOptions({
          tabBarVisible: tabBarVisible
        })
      }
    })
  }

  componentWillUnmount (): void {
    if (this.unSubscribleFocus) { this.unSubscribleFocus() }
  }

  handleConfig () {
    const { navigation, pageConfig } = this.props
    if (navigation && navigation.setOptions) {
      const config = globalAny.__taroAppConfig?.appConfig || {}
      const winOptions = config.window || {}
      const winRnOptions = config.rn || {} // 全局的rn config
      // 多个config的优先级问题，页面rnConfig> 页面config > app.config中rnConfig > app.config.window
      const winScreenOptions = this.isTabBarPage() ? {} : (winRnOptions?.screenOptions || {})
      const { title = '', headerTintColor = '', headerStyle = {}, headerShown = true } = winScreenOptions

      const winRnTitle = this.isTabBarPage() ? winRnOptions?.options?.title || '' : title

      const headerTitle = pageConfig.navigationBarTitleText || winRnTitle || winOptions?.navigationBarTitleText || ''
      const color = pageConfig.navigationBarTextStyle || headerTintColor || winOptions?.navigationBarTextStyle || 'white'
      const bgColor = pageConfig.navigationBarBackgroundColor || headerStyle?.backgroundColor || winOptions?.navigationBarBackgroundColor || '#000000'
      let showHeader = headerShown
      if (winOptions.navigationStyle) {
        showHeader = winOptions.navigationStyle !== 'custom'
      }
      if (pageConfig.navigationStyle) {
        showHeader = pageConfig.navigationStyle !== 'custom'
      }

      const rnConfig = pageConfig?.rn || {}
      const screenOptions = rnConfig.screenOptions || {}
      const screenHeaderStyle = screenOptions?.headerStyle || {}

      screenOptions.headerStyle = Object.assign({}, {
        backgroundColor: bgColor,
        shadowOffset: { width: 0, height: 0 },
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 1,
        borderBottomWidth: 0
      }, screenHeaderStyle)
      const navBarParams = Object.assign({ ...winScreenOptions }, {
        title: headerTitle,
        headerShown: showHeader,
        headerTintColor: color
      }, screenOptions)
      // 页面的config
      if (pageConfig) {
        navigation.setOptions(navBarParams)
      }
    }
  }

  isTabBarPage (): boolean {
    const { currentPath = '' } = this.props
    const tabPages = getTabBarPages()
    return !!((tabPages.length > 0 && tabPages.indexOf(camelCase(currentPath)) !== -1))
  }

  private unSubscribleFocus

  render () {
    return this.props.children
  }
}
