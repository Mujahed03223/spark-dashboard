import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

export default {
  namespaced: true,
  state() {
    return {
      sideBarWidth: 0,
      isSmallScreen: window.innerWidth <= 992,
    }
  },
  mutations,
  actions,
  getters,
}
