<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <ValidationObserver ref="formVideo" @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Video ============= -->
          <!-- ***** video -->
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.video')"
            class="col-12"
            :rules="`${data.preview2 ? '' : 'required'}`"
          >
            <v-file-input
              @change="sentVideo($event, 'settings')"
              v-model="data.mainMedia2"
              class="d-none"
              :name="$t('labels.video')"
              accept="video/*"
              label=""
              id="banner-create-image-main2"
            ></v-file-input>

            <label
              for="banner-create-image-main2"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <video
                v-if="data.preview2"
                class="d-flex"
                cover
                :aspect-ratio="3.4"
                autoplay
                controls
              >
                <source :src="data.preview2" />
              </video>
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/placeholder.png"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>

          <!-- ============= End:: Video ============= -->
        </div>
        <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="loading"
            :loading="loading"
          >
            {{ $t("save") }}
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

      data: {
        mainMedia2: null,
        preview2: null,
      },
    };
  },

  methods: {
    sentVideo(event, modal) {
      this.loading = true;
      const data = new FormData();
      data.append("file", event);
      data.append("attachment_type", "video");
      data.append("model", modal);

      this.axios({
        method: "POST",
        url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}`,
        data: data,
      })
        .then((res) => {
          this.data.mainMedia2 = res.data.data;
          this.data.preview2 = URL.createObjectURL(event);
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: err.response.data.message,
          });

          this.loading = false;
        });
    },

    getEditData() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `video`,
      })
        .then((res) => {
          this.loading = false;
          this.data.preview2 = res.data.data.vedio;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
          this.loading = false;
        });
    },

    // submit
    submit() {
      this.loading = true;

      this.$refs.formVideo.validate().then((d) => {
        if (d) {
          const data = new FormData();

          if (this.data.mainMedia2) {
            data.append("vedio", this.data.mainMedia2);
          }

          if (this.data.preview2) {
            data.append("_method", "PUT");
          }

          let url = "video";

          this.axios({
            method: "POST",
            url: url,
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
              this.loading = false;
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
            });
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
  },

  computed: {},

  async mounted() {
    this.canAdd = this.$permission.allowed("create-video");
    this.canShowAll = this.$permission.allowed("show-video");

    if (!this.canAdd) {
      if (!this.canShowAll) {
        this.getEditData();
      }
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
