import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#0E7052",
        secondary: "#A066CC",
        accent: "#86C7ED",

        error: "#e36968",
        info: "#2196F3",
        success: "#61bca1",
        warning: "#f4be5e",
      },
    },
  },
});
