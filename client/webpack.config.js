const path = require('path');
const nodeExternals = require('webpack-node-externals');

const common = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        '@babel/preset-react',
                        ['@babel/env', { targets: { browsers: ['last 2 versions'] } }]
                    ]
                }
            },
            {
                test: /\.css$/i,
                use: ['node-style!css'],
                exclude: ['/']

            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
                exclude: ['/']
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
        ],
    },
};

const clientConfig = {
    ...common,

    mode: 'development',

    name: 'client',
    target: 'web',

    entry: {
        client: [
            '@babel/polyfill',
            './src/index.js',
        ],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },

    devtool: 'cheap-module-source-map',

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};

const serverConfig = {
    ...common,

    mode: 'development',

    name: 'server',
    target: 'node',
    externals: [nodeExternals()],

    entry: {
        entry: './server/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js',
    },

    devtool: 'cheap-module-source-map',

    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    },
};

module.exports = [serverConfig];
