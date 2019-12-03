const path = require('path')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    app: ['./src/app.ts'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader'
        ],
      }
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new NodemonPlugin()
  ],
}
