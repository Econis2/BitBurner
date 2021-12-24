const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'node',
    externals: [
        nodeExternals()
    ],
    entry: {
        controller: path.join(__dirname, `game`, `controller.js`),
        pod: path.join(__dirname, `game`, `pod.js`)
    },
    output: {
        path: path.join(__dirname, `dist`),
        filename: "[name].js"
    },
    optimization: {
        minimize: true
    }
}