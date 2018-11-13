"use strict";

const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */
const config = {
	devtool: "source-map",
	entry: "./src/extension.ts",
	externals: {
		vscode: "commonjs vscode",
		ws: "ws",
	},
	module: {
		rules: [{
			exclude: /node_modules/,
			test: /\.ts$/,
			use: [{
				loader: "ts-loader",
			}],
		}],
	},
	output: {
		devtoolModuleFilenameTemplate: "../[resource-path]",
		filename: "extension.js",
		libraryTarget: "commonjs2",
		path: path.resolve(__dirname, "out/dist"),
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	target: "node",
};

module.exports = config;
