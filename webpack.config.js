'use strict';

const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

const entry = './app/entry';

const output = {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[name].[hash]..js",
    pathinfo: true,
    publicPath: "http://localhost:4399/",
};


const rules = [
    {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "app"),
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "babel-loader",
            }
        ],
    },
    {
        test: /\.css$/,
        include: path.resolve(__dirname, "app"),
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
        }),
    },
    {
        test: /\.html$/,
        include: path.resolve(__dirname, "app"),
        use: [
            {
                loader: "html-loader",
            }
        ]
    }
];

const webpackModule = {
    rules,
};

const resolve = {
    modules: [
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {}
};

const performance = {
    hints: "warning",
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter: assetFilename => (assetFilename.endsWith(".css") || assetFilename.endsWith(".js"))
};

const env = process.env.NODE_ENV || 'development';

const buildPath = (env === 'production') ? path.resolve(__dirname, "dist") : path.resolve(__dirname, "app");

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "vendor-[hash].min.js",
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: false,
        }
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "app/index.html"),
        filename: 'index.html',
    }),
    new ExtractTextPlugin({
        filename: 'styles.css',
        allChunks: true,
    }),
    new webpack.IgnorePlugin(/^\.\/locales$/, /moment$/),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${env}"`,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
    new webpack.NamedModulesPlugin()
];

const devServer = {
    host: 'localhost',
    port: 4399,
    hot: true,
    compress: true,
    open: true,
    stats: {
        assets: true,
        children: false,
        chunks: false,
        modules: false,
        publicPath: false,
        warnings: true,
        version: false,
        timings: true,
        colors: {
            green: '\u001b[32m',
        }
    },
    inline: false,
    lazy: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    },
    historyApiFallback: {
        verbose: true,
        disableDotRule: false
    },
    contentBase: buildPath,
};

const webpackConfig = {
    entry,
    output,
    resolve,
    module: webpackModule,
    performance,
    devtool: "source-map",
    context: __dirname,
    target: "web",
    stats: "errors-only",
    plugins,
    devServer,
};

module.exports = webpackConfig;
