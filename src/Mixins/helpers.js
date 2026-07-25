import i18n from "../i18n";
export default {
  data() {
    return {
      control: false,
      canEdit: true,
      canDelete: true,
      canShow: true,
      canAdd: true,
      total: [],

      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 20,
      },

      model_1: {
        show_model: false,
        model_img_src: "",
      },
      continents: [
        {
          id: "africa",
          name: i18n.t("africa"),
        },
        {
          id: "asia",
          name: i18n.t("asia"),
        },
        {
          id: "europe",
          name: i18n.t("europe"),
        },
        {
          id: "south_america",
          name: i18n.t("south_america"),
        },
        {
          id: "north_america",
          name: i18n.t("north_america"),
        },
        {
          id: "australia",
          name: i18n.t("australia"),
        },
      ],
      preferredLanguages: [
        {
          id: "ar",
          name: i18n.t("ar"),
        },
        {
          id: "en",
          name: i18n.t("en"),
        },
      ],
      genders: [
        {
          id: "male",
          name: i18n.t("male"),
        },
        {
          id: "female",
          name: i18n.t("female"),
        },
      ],
      locales: [
        {
          id: "ar",
          name: i18n.t("ar"),
        },
        {
          id: "en",
          name: i18n.t("en"),
        },
      ],
      userTypes: [
        {
          id: "all",
          name: i18n.t("all"),
        },
        {
          id: "user",
          name: i18n.t("user"),
        },
      ],
    };
  },
  methods: {
    helper_validEmail(email) {
      let re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    getRandomColor() {
      let colors = [
        {
          first: "#62EAE1",
          secound: "rgba(126, 229, 223, 0)",
        },
        {
          first: "#FF6370",
          secound: "rgba(255, 99, 112, 0)",
        },
        {
          first: "#9E62EA",
          secound: " #B199ED",
        },
        {
          first: "#EABC62",
          secound: "#E9BA62",
        },
      ];
      let random = Math.floor(Math.random() * 4);

      return { colors: colors[random], id: random };
    },

    helper_boolToText(val) {
      if (this.$store.getters["lang_module/lang"] == "en") {
        if (val) return "Yes";
        else return "No";
      } else {
        if (val) return "نعم";
        else return "لا";
      }
    },

    transStatus(status) {
      if (this.$store.getters["lang_module/lang"] == "ar") {
        if (status == "driver_finished") {
          return "تم الانتهاء ";
        }
        if (status == "client_canceled") {
          return "تم الالغاء من قبل العميل";
        }
        if (status == "driver_arrived_location") {
          return "وصل السائق";
        }
        if (status == "client_receive_offers") {
          return "استقبل العميل العروض";
        }
        if (status == "driver_start_order") {
          return "تم بدأ الرحلة";
        }
        if (status == "driver_in_the_way") {
          return "السائق في الطريق";
        }
        if (status == "driver_picked_up_package") {
          return "السائق استلم الطلب";
        }
        if (status == "driver_transferred") {
          return "تم توصيل الطلب";
        }
      } else {
        if (status == "driver_finished") {
          return "Finished ";
        }
        if (status == "client_canceled") {
          return "Cancelled By Client";
        }
        if (status == "driver_arrived_location") {
          return "Driver Arrived";
        }
        if (status == "client_receive_offers") {
          return "Client Have Orders";
        }
        if (status == "driver_start_order") {
          return "Trip Started";
        }
        if (status == "driver_in_the_way") {
          return "Driver In Way";
        }
        if (status == "driver_picked_up_package") {
          return "Driver Have Request";
        }
        if (status == "driver_transferred") {
          return "Order Have Deliverd";
        }
      }
    },

    genderText(gender) {
      if (this.$store.getters["lang_module/lang"] == "ar") {
        if (gender == "male") return "ذكر";
        if (gender == "female") return "انثي";
        else return "لا يوجد";
      } else {
        if (gender == "male") return "Male";
        if (gender == "female") return "Female";
        else return "Not Found";
      }
    },
    companyType(type) {
      if (this.$store.getters["lang_module/lang"] == "ar") {
        if (type == "individual") return "شخصي";
        if (type == "company") return "شركه";
        else return "لا يوجد";
      } else {
        if (type == "individual") return "Individual";
        if (type == "company") return "Company";
        else return "Not Found";
      }
    },
    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },

    handleBack(backUrl) {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push(backUrl);
      }
    },

    //English
    isEnglish(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[\u0621-\u064A]+$/.test(char)) {
        e.preventDefault();
        this.$iziToast.error({
          timeout: 2000,
          displayMode: 2,
          message: this.$t("validation.appLangEn"),
          position: "bottomRight",
        });
      }
    },
    isArabic(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z]+$/.test(char)) {
        e.preventDefault();
        this.$iziToast.error({
          timeout: 2000,
          displayMode: 2,
          message: this.$t("validation.appLangAr"),
          position: "bottomRight",
        });
      }
    },
    isEmailValid(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[\u0621-\u064A]+$/.test(char)) {
        e.preventDefault();
        this.$iziToast.error({
          timeout: 2000,
          displayMode: 2,
          message: this.$t("validation.appLangEn"),
          position: "bottomRight",
        });
      } else {
        return true;
      }
    },
    preventMinus(e) {
      let inputElement = e.target;
      if (!inputElement.checkValidity()) {
        inputElement.value = "";
      }
    },
  },
};
