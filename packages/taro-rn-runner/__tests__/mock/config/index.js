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
 *  SOFTWARE.
 */

const path = require('path')

const config = {
  projectName: 'taroRnInit',
  date: '2020-9-10',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    __TEST__: '"测试静态常量"'
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils')
  },
  sass: {
    resource: [
      // 'src/component/styles/common.scss',
    ],
    projectDirectory: path.resolve(__dirname, '..')
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  rn: {
    appName: '', // 设置RN bundle中注册应用的名称
    entry: 'app', // entry利用模块查找规则{name}.{platform}.{ext}自动区分平台
    output: {
      android: 'androidbundle/index.bundle',
      ios: 'iosbundle/main.bundle'
    },
    alias: {
      'src': path.resolve(__dirname, '..', 'src/'),
      '@/components': path.resolve(__dirname, '..', 'src/components'),
      '@/utils': path.resolve(__dirname, '..', 'src/utils')
    },
    defineConstants: {
      __TEST__: '"RN测试静态常量"'
    },
    postcss: {
      options: {}, // https://github.com/postcss/postcss#options
      scalable: true, // 默认true,控制是否对 css value 进行 scalePx2dp 转换
      pxtransform: {
        enable: true, // 默认true
        config: {} // https://github.com/NervJS/taro/tree/master/packages/postcss-pxtransform
      }
    },
    sass: {
      options: {}, // https://github.com/sass/node-sass#options
      additionalData: '' // 加入到脚本注入的每个 sass 文件头部，在 config.sass 之前
    },
    less: {
      options: {}, // http://lesscss.org/usage/#less-options
      additionalData: ''
    },
    stylus: {
      options: {}, // https://stylus-lang.com/docs/js.html
      additionalData: ''
    },
    transformer: [
      'metro/transformer'
    ],
    babelPlugin: [
      // 从本地绝对路径引入插件
      '/absulute/path/plugin/filename',
      // 引入 npm 安装的插件
      '@tarojs/plugin-mock',
      ['@tarojs/plugin-mock'],
      ['@tarojs/plugin-mock', {}]
    ]
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
