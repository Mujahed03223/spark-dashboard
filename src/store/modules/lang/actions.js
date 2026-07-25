import i18n from "@/i18n";

export default {
  handleLang() {
    document.documentElement["lang"] = i18n.locale;

    if (i18n.locale == "ar") {
      document.querySelector("body").classList.add("rtl");
      document.querySelector("body").classList.remove("ltr");
    } else {
      document.querySelector("body").classList.add("ltr");
      document.querySelector("body").classList.remove("rtl");
    }
  },

  switchLang() {
    localStorage.setItem("spark_dash_Lang", i18n.locale == "en" ? "ar" : "en");
    i18n.locale = i18n.locale == "en" ? "ar" : "en";
    window.location.reload();
  },
};
