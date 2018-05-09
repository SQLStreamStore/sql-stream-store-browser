const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const package = require('./package.json');

const index = path.join(__dirname, '/src/index.js');

const config = {
  entry: {
      index
  },
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: '[name].js', // Name of output file
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: path.resolve(__dirname, "node_modules"),
          name: "vendor",
          enforce: true
        }
      }
    }
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  resolve: {
      extensions: ['.js', '.jsx'],
      modules: [index, 'node_modules']
  },
  module: {
    rules: [{
      test: /\.jsx?$/, // All .js files
      use: ['babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react'],
      exclude: [nodeModulesPath],
    }]
  }
};

module.exports = config;
