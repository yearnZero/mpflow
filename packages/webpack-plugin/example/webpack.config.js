const path = require('path')
const MpPlugin = require('../lib/cjs')

module.exports = {
  mode: 'development',

  context: __dirname,

  entry: {
    app: `${MpPlugin.appLoader}!./app`,
  },

  devtool: 'none',

  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.json$/, type: 'javascript/auto', use: 'json-loader'
      },
      {
        test: /\.wxml$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/_templates/[name].[contenthash:8].[ext]'
            }
          },
          {
            loader: 'extract-loader',
          },
          '@weflow/wxml-loader'
        ]
      },
      {
        test: /\.wxss$/, use: '@weflow/wxss-loader'
      }
    ]
  },

  target: MpPlugin.target,

  plugins: [
    new MpPlugin({}),
  ],
}
