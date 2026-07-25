<template>
  <div class="all_settings">
    <Breadcrumb :items="items" />
    <div class="settings_tabs wrapper">
      <ul class="nav_pills">
        <!-- <li class="nav_item">
          <router-link class="nav_link" to="/profile/show">{{
            $t("profile.show")
          }}</router-link>
        </li> -->
        <li class="nav_item">
          <router-link class="nav_link" to="/profile/edit">{{
            $t("profile.edit")
          }}</router-link>
        </li>
        <li class="nav_item">
          <router-link class="nav_link" to="/profile/password">{{
            $t("profile.changePassword")
          }}</router-link>
        </li>
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
          text: this.$t(`breadcrumb.profile.title`),
          disabled: true,
          href: "",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
