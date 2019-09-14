// Black Mesa - Webpack Boilerplate[VueJS]
// Webpack 4 Configuration file
// author: Lucas Moreira <hello@lucasmoreira.dev>
// -----------------------------------------
// PRODUCTION ENVIRONMENT
// ----------------------------------------

// Required Imports
const path = require('path')
const webpack = require('webpack')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const HtmlWebpackPlugin = require ('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

// Module Exports
module.exports = {
  // Asset Splitting [ Vendor | Build ]
  entry: {
    build: './src/main.js',
    vendor: [
      'vue',
      'vue-router'
    ]
  },
  // Output Files
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'app/[name][hash].js'
  },
  // Split Vendor | Build Assets into separate chunks
  optimization:{
    runtimeChunk: false,
    splitChunks: {
      chunks: "all", //Taken from https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
      // Cache groups to separate SCSS
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(sa|sc|c)ss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  // Find Node Modules
  resolveLoader: {
    modules: [setPath('/node_modules')]
  },
  // Module Rules & Loaders
  module: {
    rules: [
      // Vue Linting
      {
        enforce: 'pre',
        test: /\.vue$/,
        use: 'eslint-loader',
        exclude: /node_modules/
      },
      // Vue Template Processing
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      // JS Processing & Transpiling
      {
        test: /\.js$/,
        use: [{
          loader: "babel-loader",
          options: {
            include: [
              path.resolve(__dirname, "node_modules"),
              path.resolve(__dirname, "src")
            ]
          }
        }]
      },
      // CSS & SCSS Processing
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              // Load common SCSS [ Vars & Mixins ]
              resources: './src/assets/styles/component-lean-main.scss',
            },
          }
        ],
      },
      // Image Processing
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loaders: [ 'file-loader?context=src/assets/images&name=assets/images/[path][hash].[ext]', {
          loader: 'image-webpack-loader',
          query: {
            // JPEG Processing
            mozjpeg: {
              progressive: true,
              quality: 95
            },
            // GIF Processing
            gifsicle: {
              interlaced: false,
              optimizationLevel: 3
            },
            // PNG Processing
            pngquant: {
              quality: '85-90',
              speed: 2
            },
            // SVG Processing
            svgo: {
              plugins: [
                {
                  removeViewBox: false
                },
                {
                  removeEmptyAttrs: false
                }
              ]
            }
          }
        }]
      },
      // Font Processing
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  },
  // Plugins & Post Processing
  plugins: [
    // Auto Prefix & Linting
    new VueLoaderPlugin(),
    new StyleLintPlugin({
      syntax: 'scss',
      files: ['**/*.vue']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // CSS Output
    new MiniCssExtractPlugin({
      filename: "assets/styles/styles-[hash].css"
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets/js', to: 'js', force: true }
    ]),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  performance: {
    hints: 'warning'
  }
}
