var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var node_dir = path.join(__dirname, 'node_modules');
var input_dir = path.join(__dirname, 'sandbox/js');
var output_dir = path.join(__dirname, 'sandbox/dist/src');

function addVendor(config, name, path) {
  config.resolve.alias[name] = path;
  config.module.noParse.push(new RegExp(path));
}

var config = {
  devtool: "source-map",
  entry: {
    page1: './sandbox/js/core/game.js'
  },
  output: {
    path: output_dir,
    filename: 'app.js'
  },
  resolve: {
    alias: {

    }
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(input_dir, 'plugins/gl-matrix.js'), to: path.join(output_dir, 'plugins/gl-matrix.js') }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [node_dir],
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ],
    noParse: [

    ]
  }
};

addVendor(config, 'gl-matrix', path.join(input_dir, 'plugins/gl-matrix.js'));

module.exports = config;
