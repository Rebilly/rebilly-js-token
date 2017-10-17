var webpack = require('webpack');
var path = require('path');

module.exports = (env = {}) => {
    const isProd = env === 'prod';
    return [
        {
            entry: ['./src/index.js'],
            output: {
                path: path.resolve(__dirname, './dist'),
                filename: 'rebilly.js',
                library: 'rebilly-js',
                libraryTarget: 'umd',
                umdNamedDefine: true
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: 'babel-loader'
                    }
                ]
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    beautify: !isProd,
                    mangle: !isProd ? false : {
                        screw_ie8: true,
                        keep_fnames: false
                    },
                    compress: !isProd ? false : {
                        screw_ie8: true
                    },
                    comments: false,
                    sourceMap: isProd
                })
            ],
            devtool: 'source-map'
        }
    ];
};
