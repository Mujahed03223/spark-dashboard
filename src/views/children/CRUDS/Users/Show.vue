<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="" v-else>
      <div class="row justify-content-center">
        <router-view :key="$route.path" :userInfo="profileData"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      noData: false,
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.users.title"),
          disabled: false,
          href: "/users/show-all",
        },
        {
          text: this.$t(`breadcrumb.users.show`),
          disabled: true,
          href: "",
        },
      ],
      profileData: null,

      // Show Transactions Table

      //Loading
      loading: false,
    };
  },

  methods: {
    // ============ Get Profile Data
    getProfile() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `users/${this.id}`,
      })
        .then((res) => {
          this.profileData = res.data.data;
          this.loading = false;
          this.noData = false;
        })
        .catch((err) => {
          this.noData = true;
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getProfile();
  },
};
</script>

<style>
.w-fit {
  width: fit-content;
}

.flex-1 {
  flex: 1;
}
</style>
