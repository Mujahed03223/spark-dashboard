const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath:
    // process.env.NODE_ENV === "production" ? "/dashboard/spark" : "/",
    process.env.NODE_ENV === "production" ? "/dashboard" : "/",
  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "ar",
      fallbackLocale: "ar",
      localeDir: "locales",
      // enableInSFC: true,
      includeLocales: false,
      // enableBridge: true,
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
        @import "~@/assets/scss/abstracts/_variables.scss"; 
        @import "~@/assets/scss/abstracts/_mixins.scss";`,
      },
    },
  },
});
