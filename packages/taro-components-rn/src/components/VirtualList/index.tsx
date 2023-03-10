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

import * as React from 'react'
import { FlatList, NativeSyntheticEvent, NativeScrollEvent, ListRenderItemInfo } from 'react-native'
import { noop } from '../../utils'
import { VirtualListProps } from './PropsType'
import { ScrollViewProps } from '../ScrollView/PropsType'

class _VirtualList extends React.Component<VirtualListProps & ScrollViewProps<any>, any> {
  static defaultProps = {
    upperThreshold: 50,
    lowerThreshold: 50,
    enableBackToTop: false,
    layout: 'vertical',
    overscanCount: 1
  }

  scrollViewStartOffsetY = 0 // 用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
  scrollUpdateWasRequested = false

  state = {}

  $ref = React.createRef<any>()

  /**
   * 滑动开始回调事件
   * 注意：当刚刚开始滑动时，event.nativeEvent.contentOffset.y仍然是上次滑动的值，没有变化
   * @param event
   * @private
   */
  _onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { layout } = this.props
    // event.nativeEvent.contentOffset.y表示Y轴滚动的偏移量
    const offsetY = e.nativeEvent.contentOffset[layout === 'vertical' ? 'y' : 'x']
    // 记录ScrollView开始滚动的Y轴偏移量
    this.scrollViewStartOffsetY = offsetY
  }

  _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { onScroll = noop, layout, onScrollNative = noop } = this.props
    onScrollNative(e)
    const offsetY = e.nativeEvent.contentOffset[layout === 'vertical' ? 'y' : 'x']
    onScroll({
      onScroll: this.scrollViewStartOffsetY < offsetY ? 'forward' : 'backward',
      scrollOffset: Math.abs(this.scrollViewStartOffsetY - offsetY),
      scrollUpdateWasRequested: this.scrollUpdateWasRequested
    })
  }

  scrollTo = ({ offset }: { offset: number }): void => {
    const node = this.$ref.current
    if (node) {
      (node as FlatList<any>).scrollToOffset({ offset, animated: !!this.props.scrollWithAnimation })
    }
  }

  scrollToItem = ({ offset }: { offset: number }): void => {
    const node = this.$ref.current
    if (node) {
      (node as FlatList<any>).scrollToOffset({ offset, animated: !!this.props.scrollWithAnimation })
    }
  }

  render(): JSX.Element {
    const { itemData, itemSize, item, layout, overscanCount, children, ...restProps } = this.props
    const itemStyle = layout === 'vertical' ? { height: itemSize } : { width: itemSize }
    // 这边用any是因为any值的是item的类型，取决于用户传入进来的内容，可能是string或jsx.element
    const itemCom = item || children
    const itemRow = ({ item: _item, index, separators }: ListRenderItemInfo<any>) =>
      React.createElement(itemCom, {
        data: itemData,
        key: index,
        index,
        item: _item,
        separators,
        style: {
          ...itemStyle
        }
      })
    return (
      <FlatList
        {...restProps}
        data={itemData}
        windowSize={overscanCount}
        horizontal={layout === 'horizontal'}
        ref={this.$ref}
        onScroll={this._onScroll}
        onScrollBeginDrag={this._onScrollBeginDrag}
        renderItem={itemRow}
        keyExtractor={(_item: Record<string, unknown>, index: number) => index + ''}
      />
    )
  }
}

export default _VirtualList
