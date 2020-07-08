//console.log(process.env.NODE_ENV);
const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin"); //清理dist文件一定要这么写不然会报错

let HTMLPlugins = [new CleanWebpackPlugin(), new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery'
})];
let HTMLDirs = ["index"];
// 通过 html-webpack-plugin 生成的 HTML 集合
// 生成多页面的集合
HTMLDirs.forEach(page => {
  var htmlPlugin;
  htmlPlugin = new HtmlWebPackPlugin({
    filename: `./${page}.html`,
    template: `./src/page/${page}.html`,
    chunks: ["index"],
    favicon: `./src/img/favicon.ico`,
    minify: false
  });


  HTMLPlugins.push(htmlPlugin);
});

module.exports = {
  mode: process.env.NODE_ENV ? 'production' : 'development',
  entry: {
    index: "./src/js/index.js"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "", //cdn
    filename: "js/[name].js"
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/, //exclude代表不需要进行 loader 的目录
        include: path.resolve(__dirname, "../src"), //include代表需要进行 loader 的目录
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader",
          options: {
            minimize: false
          }
        }]
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [{
          loader: "url-loader",
          options: {
            esModule:false,
            limit: 10000,
            name: "[name].[ext]",
            publicPath: "",
            outputPath: "img/"
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].min.[ext]",
            publicPath: "fonts/",
            outputPath: "fonts/"
          }
        }]
      }, {
        test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  plugins: [...HTMLPlugins]



};