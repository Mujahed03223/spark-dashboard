<template>
  <div>
    <Breadcrumb :items="items" />
    <Loader v-if="loading && editMode"></Loader>
    <div v-else>
      <noData v-if="noData" />
      <div class="form countryForm custom_card" v-else>
        <ValidationObserver ref="formAbout" @submit.prevent="submit">
          <div class="row">
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

            <!-- Start:: user_type -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.user_type')"
              class="col-lg-6"
              rules="required"
            >
              <base-select-input
                v-model="data.user_type"
                getUrl="continents"
                :static="true"
                :name="$t('labels.user_type')"
                :staticItems="userTypes"
                :placeholder="$t('labels.user_type')"
              ></base-select-input>

              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

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
          text: this.$t("breadcrumb.useTerms.title"),
          disabled: false,
          href: "/use-terms/show-all",
        },
        {
          text: this.$t(`breadcrumb.useTerms.${this.id ? "edit" : "add"}`),
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
        image_en: {
          mainMedia: null,
          preview: null,

          image: null,
          mainPreviewUrl: null,
        },
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
    // === Images
    imageArUploded(link) {
      this.data.image_ar.title = link;
    },
    imageEnUploded(link) {
      this.data.image_en.title = link;
    },

    getEditData() {
      if (this.editMode) {
        this.noData = false;
        this.loading = true;
        this.axios({
          method: "GET",
          url: `use-term/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            this.data = {
              // image_ar: {
              //   title: null,
              //   src: res.data.data.images.ar,
              // },
              // image_en: {
              //   title: null,
              //   src: res.data.data.images.en,
              // },
              ar: {
                title: res.data.data.ar.title,
                desc: res.data.data.ar.desc,
              },
              en: {
                title: res.data.data.en.title,
                desc: res.data.data.en.desc,
              },
              ordering: res.data.data.ordering,
              user_type: this.userTypes.find(
                (type) => type.id == res.data.data.user_type
              ),
            };
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("error"),
              message:
                err.response?.data.message ?? err.response?.data.messages,
            });
            this.noData = true;
            this.loading = false;
          });
      } else {
        this.showArea = true;
      }
    },

    submit() {
      this.$refs.formAbout.validate().then((d) => {
        if (d) {
          this.loading = true;
          const data = new FormData();
          data.append("ar[title]", this.data.ar.title);
          data.append("ar[desc]", this.data.ar.desc);
          data.append("en[title]", this.data.en.title);
          data.append("en[desc]", this.data.en.desc);
          data.append("ordering", this.data.ordering);
          data.append("user_type", this.data.user_type?.id);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `use-term/${this.id}`;
          } else {
            url = "use-term";
          }

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
              this.$router.push("/use-term/show-all");
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
    sentArImage(event) {
      if (event) {
        this.loading = true;

        this.data.image_ar.preview = URL.createObjectURL(event);

        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", "abouts");

        this.axios({
          method: "POST",
          url: "attachments",
          data: data,
        })
          .then((res) => {
            this.data.image_ar.image = res.data.data;
            // this.$emit('inputChanged', res.data.data)
            this.loading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });
            // this.$emit('inputChanged', 'LinkTEST')
            this.loading = false;
          });
      }
    },
    sentEnImage(event) {
      if (event) {
        this.loading = true;

        this.data.image_en.preview = URL.createObjectURL(event);

        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", "abouts");

        this.axios({
          method: "POST",
          url: "attachments",
          data: data,
        })
          .then((res) => {
            this.data.image_en.image = res.data.data;
            // this.$emit('inputChanged', res.data.data)
            this.loading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });
            // this.$emit('inputChanged', 'LinkTEST')
            this.loading = false;
          });
      }
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>
