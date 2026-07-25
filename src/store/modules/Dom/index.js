import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      sidebarWidth: 0,
      isSmallScreen: window.innerWidth <= 1264,
    };
  },
  mutations,
  actions,
  getters,
};
