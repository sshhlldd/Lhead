const webpack = require("webpack");
const merge = require('webpack-merge');
const path = require("path");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development', //开发模式会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。
  devtool: 'inline-source-map', // 不同选项适用于不同环境
  devServer: {
    contentBase: '../dist', //将dist目录下的文件(index.html)作为可访问文件, 如果不写这个参数则默认与webpack.cofig.js的同级目录
    open:true,
    inline:true,
    port: 8080,//端口号设为8080, 默认也是8080
    proxy:{
      '*':{                //多个请求 
          target:'http://ec2.full2house.com/',//api开头的路径就转发
          changeOrigin: true,
          secure: false
      }
    }
   },
    module: {
      rules: [
    
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader', //开发模式不使用插件,
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                      plugins: function () {
                          return [
                              require('autoprefixer')
                          ];
                      }
                  }
              },
                'sass-loader',
            ],
        },
      ]
    },
    plugins: [   
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      ]
  });