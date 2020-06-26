module.exports = {
  // Tell webpack to run babel on every file it runs through
  module: {
    rules: [
        {
            test: /\.js?$/,
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
  }
};
