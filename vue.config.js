const webpack = require("webpack");
const fs = require("fs");

const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_VERSION: `"${version}"`,
        },
      }),
    ],
    devtool: "source-map",
  },
  pages: {
    popup: {
      template: "public/browser-extension.html",
      entry: "./src/popup/main.js",
      title: "Popup",
    },
    standalone: {
      template: "public/browser-extension.html",
      entry: "./src/standalone/main.js",
      title: "Standalone",
      filename: "index.html",
    },
  },
  filenameHashing: false,
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: "src/background.js",
        },
        contentScripts: {
          entries: {
            "content-script": ["src/content-scripts/content-script.js"],
          },
        },
      },
      manifestTransformer: (manifest) => {
        if (process.env.NODE_ENV === "development") {
          manifest.content_scripts[0].css.pop();
          manifest.host_permissions.push("http://localhost:8000/*");
          manifest.host_permissions.push("ws://localhost:9090/*");
          // // eslint-disable-next-line no-param-reassign
          // manifest.content_security_policy.extension_pages.replace(
          //   "connect-src ws://localhost:9090/",
          //   "; connect-src ws://localhost:9090/ http://localhost:8000/ crowdcaptions.test.raa.amazon.auckland.ac.nz"
          // );
          // eslint-disable-next-line no-param-reassign
          manifest.content_security_policy.extension_pages +=
            "; connect-src ws://localhost:9090/ http://localhost:8000/ crowdcaptions.test.raa.amazon.auckland.ac.nz";
        } else {
          // eslint-disable-next-line no-param-reassign
          manifest.content_security_policy.extension_pages +=
            "; connect-src https://crowdcaptions.test.raa.amazon.auckland.ac.nz/";
        }
        console.log(manifest);
        return manifest;
      },
    },
  },

  transpileDependencies: ["vuetify"],
};
