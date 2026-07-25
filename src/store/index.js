import Vue from 'vue'
import Vuex from 'vuex'

import lang from './modules/lang/index.js'
import chats from './modules/chats/index.js'
import notifications from './modules/notifications/index.js'
// import dom from "./modules/Dom/index.js";
import auth from './modules/Auth/index.js'
import sideNav from './modules/sideNav/index.js'
import theme from './modules/Theme/index.js'
import socket from './modules/SocketGetters/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    lang_module: lang,
    chat_module: chats,
    auth_module: auth,
    notifications_module: notifications,
    theme_module: theme,
    socket_module: socket,
    sideNav_module: sideNav,
  },

  state() {
    return {
      breadcrumb: {},
      offerTypeEdit: '',
      resizeEventExisit: false,
    }
  },
  getters: {
    resizeEventExisit(state) {
      return state.resizeEventExisit
    },
    offerTypeEdit(state) {
      return state.offerTypeEdit
    },
    breadcrumb(state) {
      return state.breadcrumb
    },
  },
  mutations: {
    set_breadcrumb(state, payload) {
      state.breadcrumb = payload
    },
    changeRessizeEvent(state) {
      state.resizeEventExisit = !state.resizeEventExisit
    },
    offerTypeEdit(state, paylod) {
      state.offerTypeEdit = paylod
    },
  },
  actions: {},
})
