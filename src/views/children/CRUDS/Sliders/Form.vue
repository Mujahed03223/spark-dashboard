<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="slidersForm" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.profileImage')"
            class="d-block my-auto mt-5 mb-3"
            style="width: 100%"
            :rules="`${data.avatar.preview ? '' : 'required'}`"
          >
            <v-file-input
              :disabled="btnLoading"
              :loading="btnLoading"
              @change="uploadImage($event, 'avatar')"
              v-model="data.avatar.image"
              class="d-none"
              :name="$t('labels.profileImage')"
              accept="image/*,|size:2048"
              label=""
              id="banner-create-image-main"
            ></v-file-input>
            <label
              for="banner-create-image-main"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.avatar.preview"
                class="d-flex"
                cover
                :src="data.avatar.preview"
                :aspect-ratio="3.4"
              />
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/logo/logo.svg"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>

          <!-- Start Name -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.name') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.name') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.name') + $t('inArabic')"
              v-model="data.ar.name"
              @keypress="isArabic"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.name') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.name') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.name') + $t('inEnglish')"
              v-model="data.en.name"
              @keypress="isEnglish"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Name -->

          <!-- Start desc -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.desc') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              @keypress="isArabic"
              :name="$t('labels.desc') + $t('inArabic')"
              type="textarea"
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
              @keypress="isEnglish"
              type="textarea"
              :name="$t('labels.desc') + $t('inEnglish')"
              :placeholder="$t('labels.desc') + $t('inEnglish')"
              v-model="data.en.desc"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End desc -->

          <!-- Start Ordering -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.ordering')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.ordering')"
              type="number"
              @keypress="preventMinus"
              :placeholder="$t('labels.ordering')"
              v-model="data.ordering"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Ordering -->

          <!-- Start link -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.link')"
            class="col-lg-6"
            rules=""
          >
            <base-input
              :name="$t('labels.link')"
              type="url"
              :placeholder="$t('labels.link')"
              v-model="data.link"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End link -->

          <!-- Start slider_type -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.type')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              v-model="data.slider_type"
              :static="true"
              :name="$t('labels.slider_type')"
              :staticItems="sliderTypes"
              :placeholder="$t('labels.slider_type')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End slider_type -->
        </div>
        <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="loading"
            :loading="loading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn
            type="button"
            class="back_btn"
            @click="handleBack('/sliders/show-all')"
          >
            {{ $t("back") }}
            <span
              :class="
                $i18n.locale === 'ar'
                  ? 'fas fa-arrow-left'
                  : 'fas fa-arrow-right'
              "
            ></span>
          </v-btn>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],

  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.sliders.title"),
          disabled: false,
          href: "/sliders/show-all",
        },
        {
          text: this.$t(`breadcrumb.sliders.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        avatar: {
          preview: null,
          image: null,
        },

        ar: {
          name: null,
          desc: null,
        },
        en: {
          name: null,
          desc: null,
        },
        ordering: null,
        link: null,
        slider_type: null,
      },
      sliderTypes: [
        {
          id: "internal",
          name: this.$t("labels.internal"),
        },
        {
          id: "external",
          name: this.$t("labels.external"),
        },
      ],
      noData: false,
    };
  },

  methods: {
    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    // uploadImage(event, modal, varName) {
    //   if (event) {
    //     this.btnLoading = true;
    //     const data = new FormData();
    //     data.append("file", event);
    //     data.append("attachment_type", "image");
    //     data.append("model", modal);

    //     this.axios({
    //       method: "POST",
    //       url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}`,
    //       data: data,
    //     })
    //       .then((res) => {
    //         this.data[varName].image = res.data.data;
    //         this.data[varName].preview = URL.createObjectURL(event);
    //         this.btnLoading = false;
    //       })
    //       .catch((err) => {
    //         this.$iziToast.error({
    //           title: this.$t("validation.error"),
    //           message: err.response.data.message,
    //         });

    //         this.btnLoading = false;
    //       });
    //   }
    // },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `sliders/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.image;

          this.data.ar.name = result.ar.name;
          this.data.en.name = result.en.name;

          this.data.ar.desc = result.ar.desc;
          this.data.en.desc = result.en.desc;

          this.data.ordering = result.ordering;
          this.data.link = result.link;

          this.data.slider_type = {
            id: result.slider_type,
          };
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

    // Submit
    submit() {
      this.$refs.slidersForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("ar[name]", this.data.ar.name);
          data.append("en[name]", this.data.en.name);

          data.append("ar[desc]", this.data.ar.desc);
          data.append("en[desc]", this.data.en.desc);

          data.append("link", this.data.link);
          data.append("ordering", this.data.ordering);
          data.append("slider_type", this.data.slider_type.id);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `sliders/${this.id}`;
          } else {
            url = "sliders";
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
              this.$router.push("/sliders/show-all");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
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
    ...mapGetters({
      lang: "lang_module/lang",
    }),

    editMode() {
      return !!this.id;
    },
  },
  mounted() {
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>

<style lang="scss" scoped></style>
