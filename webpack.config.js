const path = require('path');
const Webpack = require( "webpack" );

module.exports = {
    entry : './src/chat.js',
    output : {
        path : path.join(__dirname, 'public/output'),
        filename : 'bundle.js'
    },
    module: {
        rules: [{
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/
        }, {
          test: /\.s?css$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }]
      },
    devtool : 'cheap-module-eval-source-map',
    node: {
        fs: "empty"
     },
     plugins: [
		new Webpack.EnvironmentPlugin( [
			"NODE_ENV",
		] ),
		new Webpack.IgnorePlugin( /uws/)
	],
}

console.log( path.join(__dirname, 'public/output') );