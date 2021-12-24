const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'node',
    externals: [
        nodeExternals()
    ],
    entry: {
        controller: "./build/controller.js",
        pod: "./build/pod.js"
    },
    output: {
        path: path.join(__dirname, `dist`),
        filename: "[name].js"
    },
    optimization: {
        minimize: true
    }
}