import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { Configuration } from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';
import { join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const common: Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(ttf|woff2?|eot)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.vue',
      '.styl',
      '.stylus',
      '.css',
    ],
  },
  externals: [
    webpackNodeExternals(),
  ],
};

const configs: Configuration[] = [
  {
    ...common,
    entry:  './src/main',
    output: {
      filename: 'main.js',
    },
    target: 'electron-main',
  },
  {
    ...common,
    name: 'remote',
    entry:  {
      'remote/detect': './src/remote/detect',
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
  },
  {
    ...common,
    entry: './src/renderer',
    output: {
      filename: 'renderer.js',
    },
    target: 'electron-renderer',
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: 'MUNINN',
        filename: 'index.html',
        template: 'src/renderer/index.html',
      }),
    ],
  },
];
export default configs;

