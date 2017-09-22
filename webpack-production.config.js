const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const entry = path.join(__dirname, '/src/index.js');

const config = {
  entry: [entry],
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: 'index.js', // Name of output file
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        minChunks: ({ context }) => context && context.includes('node_modules'),
    }),
  ],
  resolve: {
      extensions: ['.js', '.jsx'],
      modules: [entry, 'node_modules']
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
