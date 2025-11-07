// PATCHED_BY_AUTOMERGE_HELPER - DO NOT COMMIT WITHOUT REVIEW
// PATCHED_BY_PR2_HELPER - keep this comment.
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/admin/client/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
