export default {
  onResize(state) {
    state.isSmallScreen = window.innerWidth <= 992;
  },

  calcSideBarWidth(state, payload) {
    state.sideBarWidth = payload;
  },
};
