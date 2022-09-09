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
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      const styleOptions = (options) => {
        const patchedOptions = {
          ...options,
          // This is required rather than setting a custom attribute (which would be preferred) due to limitations of vue-style-loader
          // Potential conflict if Panopto or another extension loaded onto the page uses Vue and has this enabled.
          // All style tags with the SSRID for Vue set are deleted if the extension is disabled
          ssrId: true,
          // attributes: { id: "crowdcaptions-styles" },
        };
        // console.log(patchedOptions);
        return patchedOptions;
      };
      config.module.rule("css").oneOf("vue").use("vue-style-loader").tap(styleOptions);
      config.module.rule("css").oneOf("vue-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("css").oneOf("normal-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("css").oneOf("normal").use("vue-style-loader").tap(styleOptions);
      // PostCSS
      config.module.rule("postcss").oneOf("vue").use("vue-style-loader").tap(styleOptions);
      config.module.rule("postcss").oneOf("vue-modules").use("vue-style-loader").tap(styleOptions);
      config.module
        .rule("postcss")
        .oneOf("normal-modules")
        .use("vue-style-loader")
        .tap(styleOptions);
      config.module.rule("postcss").oneOf("normal").use("vue-style-loader").tap(styleOptions);
      // SCSS
      config.module.rule("scss").oneOf("vue").use("vue-style-loader").tap(styleOptions);
      config.module.rule("scss").oneOf("vue-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("scss").oneOf("normal-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("scss").oneOf("normal").use("vue-style-loader").tap(styleOptions);
      // sass
      config.module.rule("sass").oneOf("vue").use("vue-style-loader").tap(styleOptions);
      config.module.rule("sass").oneOf("vue-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("sass").oneOf("normal-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("sass").oneOf("normal").use("vue-style-loader").tap(styleOptions);
      // less
      config.module.rule("less").oneOf("vue").use("vue-style-loader").tap(styleOptions);
      config.module.rule("less").oneOf("vue-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("less").oneOf("normal-modules").use("vue-style-loader").tap(styleOptions);
      config.module.rule("less").oneOf("normal").use("vue-style-loader").tap(styleOptions);
      // stylus
      config.module.rule("stylus").oneOf("vue").use("vue-style-loader").tap(styleOptions);
      config.module.rule("stylus").oneOf("vue-modules").use("vue-style-loader").tap(styleOptions);
      config.module
        .rule("stylus")
        .oneOf("normal-modules")
        .use("vue-style-loader")
        .tap(styleOptions);
      config.module.rule("stylus").oneOf("normal").use("vue-style-loader").tap(styleOptions);
    }
  },
  css: {
    // extract: false,
  },
  pages: {
    popup: {
      template: "public/browser-extension.html",
      entry: "./src/popup/main.js",
      title: "Popup",
    },
    userPage: {
      template: "public/browser-extension.html",
      entry: "./src/user-page/main.js",
      title: "Crowd Captions",
      filename: "index.html",
    },
    adminPage: {
      template: "public/browser-extension.html",
      entry: "./src/admin-page/main.js",
      title: "Crowd Captions - Admin",
      filename: "admin.html",
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
          // manifest.content_scripts[0].css.pop();
          manifest.host_permissions.push("http://localhost:8000/*");
          manifest.host_permissions.push("ws://localhost:9090/*");
          // // eslint-disable-next-line no-param-reassign
          // manifest.content_security_policy.extension_pages.replace(
          //   "connect-src ws://localhost:9090/",
          //   "; connect-src ws://localhost:9090/ http://localhost:8000/ crowdcaptions.test.raa.amazon.auckland.ac.nz"
          // );
          // eslint-disable-next-line no-param-reassign
          manifest.content_security_policy.extension_pages += `; connect-src ws://localhost:9090/ http://localhost:8000/ https://crowdcaptions.test.raa.amazon.auckland.ac.nz/ ${process.env.VUE_APP_BACKEND_HOST}`;
        } else {
          // eslint-disable-next-line no-param-reassign
          manifest.content_security_policy.extension_pages += `; connect-src ${process.env.VUE_APP_BACKEND_HOST}`;
        }
        console.log(manifest);
        return manifest;
      },
    },
  },

  transpileDependencies: ["vuetify"],
};
