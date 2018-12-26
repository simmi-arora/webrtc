const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const package = require('./package');
const version = package.version;

module.exports = env => {
  const plugins = [
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
    new webpack.EnvironmentPlugin({
      WEBRTC_ENV: env.WEBRTC_ENV,
    })
  ];
  if (env.development) plugins.push(new webpack.NamedModulesPlugin());
  return {
    mode:  env.development || env.nominify ? 'development' : 'production',
    entry: [
      './client/src/scripts/index.js'
    ],
    devtool: env.development || env.nominify ? 'eval' : false,
    node: {
      console: false,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    // module: {
    //   rules: [{
    //       test: path.resolve(__dirname, './lib/util/plivostats.js'),
    //       use: [ 'script-loader' ]
    //     }, {
    //       test: /\.js$/,
    //       loader: 'string-replace-loader',
    //       options: {
    //         multiple: [
    //           { search: 'require.*debug.*JsSIP', replace: "require('debug')('PlivoSIP", flags: 'g' },
    //           { search: 'jssip_id', replace: 'plivosip_id', flags: 'g' },
    //           { search: '"version.*.3.0.*"', replace: `"version": ${version}"`, flags: 'g' },
    //           { search: 'PLIVO_LIB_VERSION', replace: version, flags: 'g' },
    //           { search: 'this.useColors', replace: 'window._PlivoUseColorLog', flags: 'g' },
    //           { search: 'shimCreateObjectURL: .* {', replace: 'shimCreateObjectURL: function() { \n if(true)return;', flags: 'g' },
    //         ],
    //       },
    //     },
    //   ],
    // },
    output: {
      filename: env.production && !env.nominify ? 'webrtcdev.min.js' : 'webrtc.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'webrtcdev',
    },
    watch: !env.production,
    plugins: plugins,
    devServer: env.development ? {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    } : {},
    optimization: env.production && !env.nominify ? {
      minimize: true,
      minimizer: [new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 5,
        },
      })]
    }: {},
  };
};
