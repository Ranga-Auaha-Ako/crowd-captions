module.exports = {
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
