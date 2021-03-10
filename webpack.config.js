const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.[contenthash].${ext}` : `[name].[contenthash].${ext}`

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-react', {
            'runtime': 'automatic'
          }]
        ],
        // plugins: ['@babel/plugin-proposal-class-properties']
      }
    }
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}

module.exports = {
  context: path.resolve(__dirname, './client'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, './src/public')
  },
  devtool: isDev ? 'eval': false,
  devServer: {
    contentBase: path.join(__dirname, './client/public'),
    port: 3000,
    open: isDev,
    hot: true,
    proxy: {
      '/api': 'http://localhost:5000'
    },
    historyApiFallback: true,
  },
  target: isDev ? 'web' : 'browserslist',
  optimization: optimization(),
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            esModule: true,
          },
        }
      }
    ]
  },
  plugins: [
    // new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      dry: isDev,
    }),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src/client/dist'),
    //       to: path.resolve(__dirname, 'src/public')
    //     },
    //   ]
    // }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
}
