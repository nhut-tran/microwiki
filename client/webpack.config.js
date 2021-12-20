const path = require('path')

module.exports ={
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, '../public'),
        filename: 'bundle.js'
    },
     devtool:'source-map',

    performance: {
        hints: false
    }
    ,
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|woff)$/,
                loader: "url-loader",
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                   'sass-loader'
                ]
               
            },
            {
                test: /\.svg$/,
                use: [
                  {
                    loader: "babel-loader"
                  },
                  {
                    loader: "react-svg-loader",
                    options: {
                      jsx: true
                    }
                  }
                ]
              }
        ]
    }
}