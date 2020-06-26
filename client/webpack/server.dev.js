const path = require('path')
const webpack = require('webpack')

module.exports = {
    name: 'server',
    target: 'node',
    devtool: 'source-map',
    entry: path.resolve(__dirname, '../server/render.js'),
    output: {
        libraryTarget: 'commonjs2'
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
                loader: 'css-loader',
                //exclude: /node_modules/,
                options: {
                    onlyLocals: true,
                }
            }
        ]
    },
    plugins: [
        // REQUIRED: To make dynamic css work correctly
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
}
