<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <ValidationObserver ref="formSettings" @submit.prevent="submit">
        <div class="row"></div>

        <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
          >
            {{ $t("submit") }}
          </v-btn>
        </div>
      </ValidationObserver>
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
      btnLoading: false,
      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        avatar_2: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        point_price: null,
        terms_ar: null,
        terms_en: null,
        about_ar: null,
        about_en: null,
        privacy_ar: null,
        privacy_en: null,
        max_point: null,
        valid_months: null,
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
          result.map((el) => {
            if (el.value) {
              const found = this.data.hasOwnProperty(el.key);
              console.log(found);
              if (found) {
                this.data[el.key] = el.value;
              }

              if (el.key == "about_image") {
                this.data.avatar.preview = el.value;
                console.log("about_image", el);
              } else if (el.key == "privacy_image") {
                this.data.avatar_2.preview = el.value;
                console.log("privacy_image", el);
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
            if (key == "avatar") {
              if (this.data.avatar.image) {
                data.append("about_image", this.data.avatar.image);
              }
            } else if (key == "avatar_2") {
              if (this.data.avatar_2.image) {
                data.append("privacy_image", this.data.avatar_2.image);
              }
            }
          } else {
            data.append(key, value);
          }
        }
      }

      // if (this.editMode) {
      //   data.append("_method", "PUT");
      // }

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

    uploadImage(event, modal, varName) {
      if (event) {
        this.btnLoading = true;
        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", modal);

        this.axios({
          method: "POST",
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}attachments`,
          data: data,
        })
          .then((res) => {
            this.data[varName].image = res.data.data;
            this.data[varName].preview = URL.createObjectURL(event);
            this.btnLoading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });

            this.btnLoading = false;
          });
      }
    },
  },

  computed: {},

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getEditData();
  },
};
</script>
