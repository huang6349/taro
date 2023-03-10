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

import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform
} from 'react-native'
import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { Popup } from '../Popup'
import V from '../variable'

const styles = StyleSheet.create({
  iosActionsheet: {
    backgroundColor: V.weuiBgColorDefault
  },
  androidActionsheetWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  androidActionsheet: {
    width: 274,
    backgroundColor: V.weuiBgColorDefault,
    borderRadius: V.weuiActionSheetAndroidBorderRadius
  },
  actionsheetMenu: {
    backgroundColor: '#fff'
  },
  actionsheetAction: {
    marginTop: 6,
    backgroundColor: '#fff'
  },
  actionsheetCell: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: V.weuiCellBorderColor,
    borderStyle: 'solid'
  },
  iosActionsheetCell: {
    paddingTop: 10,
    paddingBottom: 10
  },
  androidActionsheetCell: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 24,
    paddingRight: 24
  },
  firstActionsheetCell: {
    borderTopWidth: 0
  },
  iosActionsheetCellText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: ((18 * V.baseLineHeight) - 18) / 2,
    marginBottom: ((18 * V.baseLineHeight) - 18) / 2
  },
  androidActionsheetCellText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: ((16 * 1.4) - 16) / 2,
    marginBottom: ((16 * 1.4) - 16) / 2
  },
  defaultActionsheetCellText: {
    color: '#000'
  },
  primaryActionsheetCellText: {
    color: '#0BB20C'
  },
  warnActionsheetCellText: {
    color: V.weuiColorWarn
  },
  Modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  }
})

const underlayColor = V.weuiBgColorActive

const Index: React.FC<any> = ({
  visible,
  style,
  maskStyle,
  onShow,
  onClose,
  menus = [],
  actions = [],
  autoDectect = true,
  type = 'ios'
}) => {
  let _type = type
  if (autoDectect) _type = Platform.OS

  const _renderMenuItems = () =>
    menus.map(({ type: btnType, label, style: btnStyle, textStyle, ...others }: any, idx) =>
      <TouchableHighlight
        key={idx}
        underlayColor={underlayColor}
        style={[
          styles.actionsheetCell,
          styles[`${_type}ActionsheetCell`],
          idx === 0 ? styles.firstActionsheetCell : {},
          btnStyle
        ]}
        {...others}
      >
        <Text
          style={[
            styles[`${_type}ActionsheetCellText`],
            styles[`${btnType}ActionsheetCellText`],
            textStyle
          ]}
        >{label}</Text>
      </TouchableHighlight>
    )

  const _renderActions = () =>
    actions.map(({ type: btnType, label, style: btnStyle, textStyle, ...others }: any, idx) =>
      <TouchableHighlight
        key={idx}
        underlayColor={underlayColor}
        style={[
          styles.actionsheetCell,
          styles[`${_type}ActionsheetCell`],
          idx === 0 ? styles.firstActionsheetCell : {},
          btnStyle
        ]}
        {...others}
      >
        <Text
          style={[
            styles[`${_type}ActionsheetCellText`],
            styles[`${btnType}ActionsheetCellText`],
            textStyle
          ]}
        >{label}</Text>
      </TouchableHighlight>
    )

  return <Popup
      visible={visible}
      style={[styles.iosActionsheet, style]}
      maskStyle={maskStyle}
      onShow={onShow}
      onClose={onClose}
    >
      {menus.length
        ? <View style={[styles.actionsheetMenu]}>
          {_renderMenuItems()}
        </View>
        : false}
      {actions.length
        ? <View style={[styles.actionsheetAction]}>
          {_renderActions()}
        </View>
        : false}
      <View style={{paddingBottom: Math.max(initialWindowMetrics?.insets.bottom || 0, 16), backgroundColor: '#fff'}}></View>
    </Popup>
}

Index.propTypes = {
  autoDectect: PropTypes.bool,
  type: PropTypes.oneOf(['ios', 'android']),
  menus: PropTypes.any,
  actions: PropTypes.any,
  visible: PropTypes.bool,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  style: ViewPropTypes.style,
  maskStyle: ViewPropTypes.style
}

export default Index
