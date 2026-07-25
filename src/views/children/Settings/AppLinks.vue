<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Socials ============= -->
          <!-- ***** android_link -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.android_app_link')"
            v-model="data.android_link"
          />

          <!-- ***** ios_link -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.ios_app_link')"
            v-model="data.ios_link"
          />

          <!-- ============= End:: Socials ============= -->
        </div>
        <!-- End Map -->
        <base-button :loading="loading" class="center">
          {{ $t("save") }}
        </base-button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],

  data() {
    return {
      // Loading
      loading: false,

      data: {
        android_link: null,
        ios_link: null,
      },
    };
  },

  methods: {
    getEditData() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `settings`,
      })
        .then((res) => {
          const result = res.data.data;
          // console.log(result)

          result.map((el) => {
            if (el.value) {
              const found = this.data.hasOwnProperty(el.key);
              if (found) {
                this.data[el.key] = el.value;
              }
            }
          });

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      for (const [key, value] of Object.entries(this.data)) {
        if (value) {
          if (typeof value == "object") {
            data.append(key, value.id);
          } else {
            data.append(key, value);
          }
        }
      }

      if (this.editMode) {
        data.append("_method", "PUT");
      }

      this.axios({
        method: "POST",
        url: "/settings",
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          });
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });
    },
  },

  computed: {},

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getEditData();
  },
};
</script>
