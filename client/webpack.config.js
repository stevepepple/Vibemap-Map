const path = require("path");

const config = {
    entry: {
        vendor: ["@babel/polyfill", "react"], // Third party libraries
        index: ["./src/index.js"]
        /// Every pages entry point should be mentioned here
    },
    output: {
        path: path.resolve(__dirname, "src", "public"), //destination for bundled output is under ./src/public
        filename: "[name].js" // names of the bundled file will be name of the entry files (mentioned above)
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader", // asks bundler to use babel loader to transpile es2015 code
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"] 
                    }
                },
                exclude: [/node_modules/, /public/]
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
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
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
    resolve: {
        //extensions: [".js", ".jsx", "*"]
    } // If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.
};

module.exports = config;