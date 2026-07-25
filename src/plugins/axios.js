import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "@/store";
import router from "@/router";
window.apiurl = process.env.VUE_APP_BASE_URL;

const USER_TOKEN = store.getters["auth_module/currentUser"].token;
const CURRENT_LANG = store.getters["lang_module/lang"];

// axios.defaults.headers.common['cache-control'] = 'no-cache'
// axios.defaults.headers.common['Accept'] = 'application/json'
// axios.defaults.headers.common['Accept-language'] = CURRENT_LANG
// axios.defaults.headers.common['lang'] = CURRENT_LANG

// Set Token If Exists
if (USER_TOKEN) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + USER_TOKEN;
}

// ========  End Axios

const request = axios.create({
  baseURL: window.apiurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "Accept-Language": CURRENT_LANG,
    dashboard: "main",
    // lang: CURRENT_LANG,
  },
});

request.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.response.status == "401") {
      store.dispatch("auth_module/logOut");
    }
    if (error.response.status == "403") {
      router.replace("/permission-required");
    }
    // if (error.response.status == '403') {
    //   store.dispatch('auth_module/logOut')
    // }
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status == "401") {
      store.dispatch("auth_module/logOut");
    }
    if (error.response.status == "403") {
      router.replace("/permission-required");
    }
    return Promise.reject(error);
  }
);

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; // Live Baseurl

Vue.use(VueAxios, request);

export default request;
