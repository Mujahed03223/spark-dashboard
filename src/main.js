import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/plugins";
import vuetify from "@/plugins/vuetify";
import iziToast from "izitoast";
import VueLodash from "vue-lodash";
import lodash from "lodash";
import AOS from "aos";
import VueSweetalert2 from "vue-sweetalert2";
import i18n from "./i18n";

import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import "aos/dist/aos.css";
import "material-icons/iconfont/material-icons.css";
import "@material-design-icons/font";
import "izitoast/dist/css/iziToast.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./assets/scss/main.scss";
import * as VueGoogleMaps from "vue2-google-maps";
store.dispatch("lang_module/handleLang"); // ==> Store (Vuex) <==
store.dispatch("theme_module/handleTheme"); // ==> Store (Vuex) <==
import Permission from "@/helpers/permission";
Vue.prototype.$permission = new Permission();

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);
// ======== Bootstrap
import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {
  maxHeight: "300px",
}); // config is optional. more below
import "vue-wysiwyg/dist/vueWysiwyg.css";
// ======== iziToast
import excel from "vue-excel-export";

Vue.use(excel);
AOS.init();

import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
// ============> Ckeditor
import BaseCard from "@/components/UI/BaseCard.vue";
import CKEditor from "ckeditor4-vue";
import TheTable from "./components/Global/TheTable.vue";
import Breadcrumb from "./components/Global/Breadcrumb.vue";
import CustomDataTable from "./components/Global/CustomDataTable.vue";
import TheFilter from "./components/Global/TheFilter.vue";
import UplodeImage from "./components/Uploads/UplodeImage.vue";
import UplodeImageDirect from "./components/Uploads/UplodeImageDirect.vue";
import UplodeMultiple from "./components/Uploads/UplodeMultiple.vue";
import UplodeVideo from "./components/Uploads/UplodeVideo.vue";
import StateCard from "@/components/UI/StateCard.vue";
import SimpleCard from "@/components/UI/SimpleCard.vue";
import helpers from "./Mixins/helpers";
import BaseInput from "./components/Forms/BaseInput.vue";
import BaseSelectInput from "./components/Forms/BaseSelectInput.vue";
import AutoComplete from "./components/Forms/AutoComplete.vue";
import BasePickerInput from "./components/Forms/BasePickerInput.vue";
import NamePreviewUpload from "./components/Uploads/NamePreviewUpload.vue";
import BaseCountryFlagPhoneInput from "./components/Forms/BaseCountryFlagPhoneInput.vue";
import BaseOtpInput from "./components/Forms/BaseOtpInput.vue";
import BaseColorPicker from "./components/Forms/BaseColorPicker.vue";
import BaseTextEditor from "./components/Forms/BaseTextEditor.vue";
import BaseTextArea from "./components/Forms/BaseTextArea.vue";
import UserRate from "./components/Global/UserRate.vue";
import RatingStars from "./components/UI/RatingStars.vue";
import BaseButton from "./components/UI/BaseButton.vue";
import ImageModal from "./components/Modals/ImageModal.vue";
import BaseModel from "./components/Modals/BaseModel.vue";
import ChatComp from "./components/Global/ChatComp.vue";

import VueEllipseProgress from "vue-ellipse-progress";
import Loader from "./components/Loaders/loader";
import NoFound from "./components/Global/NotFound.vue";
import NoData from "./components/Global/NoData.vue";
import MapWrite from "@/components/Maps/MapWrite.vue";
import StatisticsCard from "./components/UI/StatisticsCard.vue";
import TopChartState from "./components/Charts/TopChartState.vue";
import ChartsAside from "@/components/Layouts/ChartsAside.vue";
import SparksAreaCharts from "@/components/Charts/SparksAreaCharts.vue";
import BaseMap from "@/components/Maps/BaseMap.vue";
import SelectMap from "@/components/Maps/SelectMap.vue";
import Deleter from "@/components/Modals/Deleter.vue";
import Switcher from "@/components/Modals/Switcher.vue";
import DataCard from "./components/UI/DataCard.vue";
import ProfileCard from "./components/Global/ProfileCard.vue";

Vue.component("profile-card", ProfileCard);
Vue.component("data-card", DataCard);
Vue.component("map-write", MapWrite);
Vue.component("base-map", BaseMap);
Vue.component("select-map", SelectMap);
Vue.component("deleter", Deleter);
Vue.component("switcher", Switcher);
Vue.component("statistics-card", StatisticsCard);
Vue.component("top-chart-state", TopChartState);
Vue.component("StateCard", StateCard);
Vue.component("SimpleCard", SimpleCard);
Vue.component("ChartsAside", ChartsAside);
Vue.component("SparksAreaCharts", SparksAreaCharts);
Vue.component("the-table", TheTable);
Vue.component("CustomDataTable", CustomDataTable);
Vue.component("image-modal", ImageModal);
Vue.component("base-model", BaseModel);
Vue.component("chat-comp", ChatComp);

Vue.component("user-rate", UserRate);
Vue.component("rating-stars", RatingStars);
Vue.component("uplode-image", UplodeImage);
Vue.component("uplode-image-direct", UplodeImageDirect);
Vue.component("uplode-multiple", UplodeMultiple);
Vue.component("uplode-video", UplodeVideo);
Vue.component("base-input", BaseInput);
Vue.component("Breadcrumb", Breadcrumb);
Vue.component("base-select-input", BaseSelectInput);
Vue.component("auto-complete", AutoComplete);
Vue.component("base-picker-input", BasePickerInput);
Vue.component("name-preview-upload", NamePreviewUpload);
Vue.component("base-country-flag-phone-input", BaseCountryFlagPhoneInput);
Vue.component("base-otp-input", BaseOtpInput);
Vue.component("base-color-picker", BaseColorPicker);
Vue.component("base-text-editor", BaseTextEditor);
Vue.component("base-text-area", BaseTextArea);
Vue.component("TheFilter", TheFilter);
Vue.component("base-button", BaseButton);
Vue.component("Loader", Loader);
Vue.component("NoFound", NoFound);
Vue.component("NoData", NoData);

Vue.component("vue-slick", VueSlickCarousel);
Vue.component("multiselect", Multiselect);
Vue.component("BaseCard", BaseCard);

Vue.use(VueLodash, { name: "custom", lodash: lodash });
Vue.prototype.$iziToast = iziToast; // Glopal variable
Vue.use(iziToast, {
  displayMode: 2,
});

// socket io
import BaseMap1 from "@/components/Maps/BaseMap1.vue";
Vue.component("base-map1", BaseMap1);
// ======== AudioRecorder
import AudioRecorder from "vue-audio-recorder";
Vue.use(AudioRecorder);

// ======== ReadMore
import ReadMore from "vue-read-more";
Vue.use(ReadMore);

// =============> VueChatScroll
import VueChatScroll from "vue-chat-scroll";
Vue.use(VueChatScroll);

// =========== End Import && Register Global Components ===========
import moment from "moment";
moment.locale("en");
Vue.prototype.moment = moment;
import VueMoment from "vue-moment";

// Load Locales ('en' comes loaded by default)
// require('moment/locale/en')

import VueCarousel from "vue-carousel";

Vue.use(VueCarousel);
// Choose Locale

Vue.use(VueMoment, { moment });
Vue.use(VueSweetalert2);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyA8qi0TK3EDod0LlTXbQFf_DyEptiGgPFU",
    libraries: "places",
    region: "EG",
    language: "ar",
  },
});
Vue.mixin(helpers);
Vue.use(CKEditor);
Vue.use(VueEllipseProgress);
// ======== Attatch and Mount
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
