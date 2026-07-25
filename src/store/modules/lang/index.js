import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,

  state() {
    return {
      default_lang: "ar",
      lang: localStorage.getItem("spark_dash_Lang") || "ar",
    };
  },
  mutations,
  actions,
  getters,
};
