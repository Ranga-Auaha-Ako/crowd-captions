const webpack = require('webpack');
const fs = require('fs')

const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0
module.exports = {
  configureWebpack: {
      plugins: [
          new webpack.DefinePlugin({
              'process.env': {
                  PACKAGE_VERSION: `"${  version  }"`
              }
          })
      ]
  },
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },
  },
  filenameHashing: false,
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js',
            ],
          },
        },
      },
      manifestTransformer: (manifest) => {
        if (process.env.NODE_ENV === "development") {
          manifest.content_scripts[0].css.pop();
        }
        return manifest;
      }      
    },
  },

  transpileDependencies: [
    'vuetify'
  ]
};
