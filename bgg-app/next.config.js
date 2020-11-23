/* eslint-disable */
const widthCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')

module.exports =  withLess(widthCss({
    lessLoaderOptions: {
      javascriptEnabled: true,
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",

    },
    distDir: 'build',
    webpack: (config, {}) => {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: './static/imgs/[name].[ext]?[hash]' 
        }
      })

      return config
    }
  },))
