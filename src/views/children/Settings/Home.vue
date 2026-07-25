<template>
  <div class="all_settings">
    <Breadcrumb :items="items" />
    <div class="settings_tabs wrapper">
      <ul class="nav_pills">
        <li class="nav_item" v-if="false">
          <!-- :class="
              $route.path == '/settings/about' ? 'router-link-exact-active' : ''
            " -->
          <router-link class="nav_link" to="/settings/show-all">{{
            $t("settings.general")
          }}</router-link>
        </li>

        <li class="nav_item">
          <router-link class="nav_link" to="/settings/show-all/social">
            {{ $t("settings.social") }}
          </router-link>
        </li>
        <li class="nav_item">
          <router-link class="nav_link" to="/settings/show-all/app-links">
            {{ $t("settings.appLinks") }}
          </router-link>
        </li>
        <li class="nav_item">
          <router-link class="nav_link" to="/settings/show-all/fees">
            {{ $t("settings.fees") }}
          </router-link>
        </li>
        <li class="nav_item">
          <router-link class="nav_link" to="/settings/show-all/instructions">
            {{ $t("settings.instruction_ownership_transfer") }}
          </router-link>
        </li>
        <!-- <li class="nav_item">
          <router-link class="nav_link" to="/settings/video">
            {{ $t("settings.video") }}
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
          href: "/",
        },

        {
          text: this.$t("breadcrumb.mainSettings"),
          disabled: true,
          href: "",
        },
      ],
    };
  },

  methods: {},
  created() {
    this.control = this.$permission.setControls(this.$route.path);
  },
};
</script>
