const path = require('path')
const webpack = require('webpack')
const HTMLWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { index: './src/standalone.tsx' },
  devtool: 'source-map',
  stats: 'detailed',
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new HTMLWebPackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.USE_JUPYTER_LAB': JSON.stringify(false)
    })
  ]
}
