const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        popup: path.join(__dirname, 'src/popup/index.tsx'),
        eventPage: path.join(__dirname, 'src/eventPage.ts'),
        contentScript: path.join(__dirname, 'src/contentScript.tsx')
    },
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                exclude: /node_modules/,
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader' // Creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // Translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader' // Compiles Sass to CSS
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};
