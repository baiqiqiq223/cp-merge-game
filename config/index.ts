import { defineConfig } from '@tarojs/cli'

export default defineConfig(async (merge) => {
  const baseConfig = {
    projectName: 'wechat-mini-game',
    date: '2026-05-18',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-framework-react'],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false
      }
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        url: {
          enable: true,
          config: {
            limit: 1024
          }
        },
        cssModules: {
          enable: false
        }
      },
      webpackChain(chain) {
        chain.resolve.alias.set('@', require('path').resolve(__dirname, '..', 'src'))
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      postcss: {
        autoprefixer: {
          enable: true
        },
        cssModules: {
          enable: false
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return merge({}, baseConfig, require('./prod').default)
  }

  return merge({}, baseConfig, require('./dev').default)
})
