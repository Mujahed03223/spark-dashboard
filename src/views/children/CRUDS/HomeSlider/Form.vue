<template>
  <div>
    <Breadcrumb :items="items" />
    <Loader v-if="loading && editMode"></Loader>
    <div v-else>
      <noData v-if="noData" />
      <div class="form countryForm custom_card" v-else>
        <ValidationObserver ref="formAbout" @submit.prevent="submit">
          <div class="row">
            <validation-provider
              v-slot="{ errors }"
              :name="$t('labels.small_img')"
              class="col-md-4"
            >
              <v-file-input
                @change="sentImage($event)"
                v-model="data.mainMedia"
                class="d-none"
                :name="$t('labels.small_img')"
                accept="image/*,|size:2048"
                label=""
                id="banner-create-image-main"
              ></v-file-input>

              <label
                for="banner-create-image-main"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.preview"
                  class="d-flex"
                  cover
                  :src="data.preview"
                  :aspect-ratio="3.4"
                />
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

            <validation-provider
              v-slot="{ errors }"
              :name="$t('labels.big_img')"
              class="col-md-4"
            >
              <v-file-input
                @change="sentImage1($event)"
                v-model="data.mainMedia1"
                class="d-none"
                :name="$t('labels.big_img')"
                accept="image/*,|size:2048"
                label=""
                id="banner-create-image-main1"
              ></v-file-input>

              <label
                for="banner-create-image-main1"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.preview1"
                  class="d-flex"
                  cover
                  :src="data.preview1"
                  :aspect-ratio="3.4"
                />
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

            <validation-provider
              v-slot="{ errors }"
              :name="$t('labels.video')"
              class="col-md-4"
            >
              <v-file-input
                @change="sentVideo($event)"
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
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.title') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isArabic"
                :name="$t('labels.title') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.title') + $t('inArabic')"
                v-model="data.ar.title"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.title') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isEnglish"
                :name="$t('labels.title') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.title') + $t('inEnglish')"
                v-model="data.en.title"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <template v-if="true">
              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.desc') + $t('inArabic')"
                class="col-lg-6"
                rules="required|min:2"
              >
                <base-input
                  :name="$t('labels.desc') + $t('inArabic')"
                  type="ckeditor"
                  :placeholder="$t('labels.desc') + $t('inArabic')"
                  v-model="data.ar.desc"
                />
                <span class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.desc') + $t('inEnglish')"
                class="col-lg-6"
                rules="required|min:2"
              >
                <base-input
                  type="ckeditor"
                  :name="$t('labels.desc') + $t('inEnglish')"
                  :placeholder="$t('labels.desc') + $t('inEnglish')"
                  v-model="data.en.desc"
                />
                <span class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </template>

            <!-- End:: user_type -->

            <!-- Start:: Ordering -->

            <!-- <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.ordering')"
              class="col-lg-6"
              rules="required|min_value:0"
            >
              <base-input
                :name="$t('labels.ordering')"
                type="number"
                @keypress="preventMinus"
                :placeholder="$t('labels.ordering')"
                v-model="data.ordering"
              />

              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider> -->

            <!-- End:: Ordering -->
          </div>
          <div class="button_wrapper center">
            <v-btn
              type="submit"
              @click="submit"
              :disabled="loading"
              :loading="loading"
            >
              {{ $t("submit") }}
            </v-btn>
          </div>
          <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import MapWrite from "../../../../components/Maps/MapWrite.vue";

export default {
  // components: { MapWrite },
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
          text: this.$t("breadcrumb.home_slider.title"),
          disabled: false,
          href: "/home_slider/show-all",
        },
        {
          text: this.$t(`breadcrumb.home_slider.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Loading

      loading: false,

      showArea: false,

      data: {
        image_ar: {
          mainMedia: null,
          preview: null,

          image: null,
          mainPreviewUrl: null,
        },
        mainMedia: null,
        preview: null,

        avatar: null,
        mainPreviewUrl: null,
        mainMedia1: null,
        preview1: null,

        avatar1: null,
        mainPreviewUrl1: null,
        mainMedia2: null,
        preview2: null,

        avatar2: null,
        mainPreviewUrl2: null,
        ar: {
          title: null,
          desc: null,
        },
        en: {
          title: null,
          desc: null,
        },
        ordering: null,
        user_type: null,
      },
      userTypes: [
        {
          id: "rider",
          name: this.$t("rider"),
        },
        {
          id: "partner",
          name: this.$t("partner"),
        },
      ],
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    // === Images
    imageArUploded(link) {
      this.data.image_ar.title = link;
    },
    imageEnUploded(link) {
      this.data.image_en.title = link;
    },

    sentImage(event) {
      if (event) {
        this.data.preview = URL.createObjectURL(event);
        this.data.avatar = event;
      }
    },
    sentImage1(event) {
      if (event) {
        this.data.preview1 = URL.createObjectURL(event);
        this.data.avatar1 = event;
      }
    },
    sentVideo(event) {
      if (event) {
        this.data.preview2 = URL.createObjectURL(event);
        this.data.avatar2 = event;
      }
    },

    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `home-slider`,
      })
        .then((res) => {
          this.loading = false;
          if (res.data.data?.length) {
            this.data = {
              // image_ar: {
              //   title: null,
              //   src: res.data.data.images.ar,
              // },
              // image_en: {
              //   title: null,
              //   src: res.data.data.images.en,
              // },
              preview: res.data.data[0]?.small_image,
              preview1: res.data.data[0]?.big_image,
              preview2: res.data.data[0]?.video,
              ar: {
                title: res.data.data[0]?.ar.title,
                desc: res.data.data[0]?.ar.desc,
              },
              en: {
                title: res.data.data[0]?.en.title,
                desc: res.data.data[0]?.en.desc,
              },
            };
          }
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
          this.noData = true;
          this.loading = false;
        });
    },

    submit() {
      this.$refs.formAbout.validate().then((d) => {
        if (d) {
          this.loading = true;
          const data = new FormData();
          if (this.data.avatar) {
            data.append("small_image", this.data.avatar);
          }
          if (this.data.avatar1) {
            data.append("big_image", this.data.avatar1);
          }
          if (this.data.avatar2) {
            data.append("video", this.data.avatar2);
          }
          data.append("ar[title]", this.data.ar.title);
          data.append("ar[desc]", this.data.ar.desc);
          data.append("en[title]", this.data.en.title);
          data.append("en[desc]", this.data.en.desc);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "home-slider";

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");

          this.axios({
            method: "POST",
            url: url,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.loading = false;
              this.$router.push("/home_slider/show-all");
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

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getEditData();
  },
};
</script>
