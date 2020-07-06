const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: "production", //生产模式会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 TerserPlugin. 
    module: {
      rules: [
        
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
                 MiniCssExtractPlugin.loader, //生产模式使用分离代码插件
                'css-loader',
                'sass-loader',
            ],
        }
      ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].min.css', //类似出口文件
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化\最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
        cssProcessor: require('cssnano'), //用于优化\最小化CSS的CSS处理器，默认为cssnano。这应该是一个跟随cssnano.process接口的函数（接收CSS和选项参数并返回一个Promise）。
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
        canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
    }) 
      ],
      optimization:{
        splitChunks:{
            cacheGroups:{ // 单独提取JS文件引入html
              styles: {
                name: 'common',
                //test: /\.css$/,
                minChunks: 2, //表示提取公共部分最少的文件数
                minSize: 0, //表示提取公共部分最小的大小
              }
            }
         }  
      }
  });