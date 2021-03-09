const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[contenthash].${ext}`

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-react', {
            "runtime": "automatic"
          }]
        ],
       // plugins: ['@babel/plugin-proposal-class-properties']
      }
    }
  ]

  // if (isDev) {
  //   loaders.push('eslint-loader')
  // }

  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src/client'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, './src/client/dist')
  },
  devtool: isDev ? 'eval': false,
  devServer: {
    //contentBase: path.join(__dirname, './src/public'),
    port: 3000,
    open: isDev,
    hot: true,
  },
  target: isDev ? 'web' : 'browserslist',
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
                localIdentName: "[name]__[local]___[hash:base64:5]",
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
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/client/dist'),
          to: path.resolve(__dirname, 'src/public')
        },
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
}