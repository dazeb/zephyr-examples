const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { withZephyr } = require('zephyr-webpack-plugin');

/**
 * @type {import('webpack').Configuration & { devServer?: import('webpack-dev-server').Configuration }}
 */
const config = {
  entry: './src/index',
  mode: 'development',
  cache: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
    },
  },
  devServer: {
    static: { directory: path.resolve(__dirname, 'dist'), serveIndex: true },
    port: 3010,
    hot: true,
    compress: true,
    historyApiFallback: true,
    open: true,
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'airbnb-react-host',
      filename: 'remoteEntry.js',
      dts: false,
      remotes: {
        airbnb_categories: `airbnb_categories@http://localhost:3011/remoteEntry.js`,
        airbnb_home: `airbnb_home@http://localhost:3012/remoteEntry.js`,
        airbnb_favorites: `airbnb_favorites@http://localhost:3013/remoteEntry.js`,
        airbnb_trips: `airbnb_trips@http://localhost:3014/remoteEntry.js`,
        airbnb_properties: `airbnb_properties@http://localhost:3015/remoteEntry.js`,
        airbnb_reservations: `airbnb_reservations@http://localhost:3016/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
        },
        'react-icons': {
          singleton: true,
          requiredVersion: false,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: false,
        },
        'react/jsx-runtime': {
          singleton: true,
          requiredVersion: false,
        },
        swr: {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/assets/favicon.ico',
    }),
  ],
  devtool: 'source-map',
};

module.exports = withZephyr()(config);
