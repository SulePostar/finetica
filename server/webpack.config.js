const path = require('path');
const webpack = require('webpack');
// Use webpack-node-externals to keep node_modules out of the bundle (they'll be required at runtime)
const nodeExternals = require('webpack-node-externals');

const config = {
  name: 'server',
  target: 'node',
  devtool: 'eval-source-map',
  entry: './index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js',
    // ensure chunk loader uses Node's require instead of JSONP
    chunkFilename: '[id].main.js',
    publicPath: '/dist/',
    chunkLoading: 'require'
  },
  // keep node_modules external (don't bundle them) so native require works
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        // include the whole project so server entry and models are transpiled
        include: path.join(__dirname),
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  optimization: {
    // avoid code-splitting which results in runtime chunk loads
    splitChunks: false,
    runtimeChunk: false
  }
};

module.exports = config;