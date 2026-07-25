import {
  extend,
  localize,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import en from "vee-validate/dist/locale/en.json";
import ar from "vee-validate/dist/locale/ar.json";
//import en from "vee-validate/dist/locale/en.json";
import * as rules from "vee-validate/dist/rules";
import Vue from "vue";

import i18n from "../i18n";
// Install English and Arabic locales.
localize({
  en,
  ar,
});

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
localize(i18n.locale);
// extend('required', required)
extend("required", {
  validate(value) {
    return {
      required: true,
      valid: ["", null, undefined].indexOf(value) === -1,
    };
  },
  computesRequired: true,
});

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
