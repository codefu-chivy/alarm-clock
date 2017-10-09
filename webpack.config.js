var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: path.join(__dirname, "js", "index"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch",
            "Promise": "promise-polyfill"
        })
    ]
}