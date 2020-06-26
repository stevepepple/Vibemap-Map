module.exports = {
  webpackPlugins: [],
  modifyWebpack: config => ({
    ...config,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ],
              plugins: [
                require("@babel/plugin-proposal-object-rest-spread"),
                ["@babel/plugin-proposal-class-properties"],
              ]
            }
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader"
          ]
        },
        {
          test: /\.svg/,
          use: {
            loader: "svg-url-loader",
            options: {}
          }
        }
      ]
    }
  })
};