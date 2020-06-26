const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')

module.exports = {
    name: 'client',
    target: 'web',
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.(woff(2)?|ttf|eot|gif|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../src/index.js')
    ],
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, '../buildClient'),
        publicPath: '/'
    },
    plugins: [
        new ExtractCssChunks(),
        /*
        new webpack.optimize.splitChunks({
            names: ['bootstrap'],
            filename: '[name].js',
            minChunks: Infinity
        }),
        */
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
}
