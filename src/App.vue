<template>
  <v-app>
    <transition>
      <router-view></router-view>
    </transition>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {},
  computed: {},
  mounted() {
    // ===> Vuetify Direction 
    if (this.$store.getters["lang_module/lang"] == "ar") {
      document.body.dir = "rtl";
      this.$vuetify.rtl = true;
    } else {
      document.body.dir = "ltr";
      this.$vuetify.rtl = false;
    }

    // ===> Vuetify Theme
    if (this.$store.getters["theme_module/current_theme"] == "light") {
      this.$vuetify.theme.dark = false;
    } else {
      this.$vuetify.theme.dark = true;
    }

    // ===> Scroll To Top Alwayse
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  },
};
</script>
