'use strict';
const webpack = require('webpack');
const path = require('path');

module.exports = [
	{
		entry: [
			'./src/index.js'
		],
		output: {
			path: path.resolve('./dist'),
			filename: 'index.js'
		},
		module: {
			loaders: [
				{
					test: /\.js?$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					query: {
						presets: ['react', 'es2015', 'stage-2']
					}
				}
			]
		}
	}
];
