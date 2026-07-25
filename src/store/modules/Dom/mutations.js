export default {
  onResize(state) {
    state.isSmallScreen = window.innerWidth <= 1350;
  },

  setSidebarWidth(state, payload) {
    state.sidebarWidth = payload;
  },
};
