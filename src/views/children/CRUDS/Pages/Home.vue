<template>
  <div class="all_settings">
    <Breadcrumb :items="items" />
    <div class="settings_tabs wrapper">
      <ul class="nav_pills">
        <li class="nav_item">
          <router-link class="nav_link" to="/pages/show/about-us">
            {{ $t("settings.about") }}
          </router-link>
        </li>
        <li class="nav_item">
          <router-link class="nav_link" to="/pages/show/terms">
            {{ $t("settings.terms") }}
          </router-link>
        </li>
        <li class="nav_item">
          <router-link class="nav_link" to="/pages/show/privacy-policy">
            {{ $t("settings.policy") }}
          </router-link>
        </li>
        <!-- <li class="nav_item">
          <router-link class="nav_link" to="/pages/show/most-questions">
            {{ $t("settings.most_questions") }}
          </router-link>
        </li> -->
      </ul>
    </div>

    <div class="setting_tabs_content wrapper">
      <transition name="fadeIn" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/"
        },

        {
          text: this.$t("breadcrumb.pages.title"),
          disabled: true,
          href: ""
        }
      ]
    };
  },

  methods: {},
  created() {
    this.control = this.$permission.setControls(this.$route.path);
  }
};
</script>
