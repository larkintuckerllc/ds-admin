var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = {
  entry: [
    './app/index.js'
  ],
  output: {
    path: __dirname,
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      {test: /bower_components\/.*\.js$/, loader: 'legacy'},
      {test: /\.js$/, exclude: /node_modules|bower_components/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'}
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig
  ],
  devServer: {
    inline: true,
    port: 80
  }
};
