<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="weHelpYouForm" @submit.prevent="submit">
        <div class="row">
          <!-- start section one -->
          <div class="col-lg-6">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.image')"
              class="col-lg-6"
              :rules="`${data.logo.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'logo')"
                v-model="data.logo.image"
                class="d-none"
                :name="$t('labels.image')"
                accept="image/*,|size:2048"
                label=""
                id="logo"
              ></v-file-input>
              <label
                for="logo"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.logo.preview"
                  class="d-flex"
                  cover
                  :src="data.logo.preview"
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
            </ValidationProvider>
          </div>
          <div class="col-lg-6">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.image')"
              class="col-lg-6"
              :rules="`${data.fav.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'fav')"
                v-model="data.fav.image"
                class="d-none"
                :name="$t('labels.image')"
                accept="image/*,|size:2048"
                label=""
                id="fav"
              ></v-file-input>
              <label
                for="fav"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.fav.preview"
                  class="d-flex"
                  cover
                  :src="data.fav.preview"
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
            </ValidationProvider>
          </div>

          <!-- Start:: Email -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.email')"
            class="col-lg-6"
            rules="required|email"
          >
            <base-input
              :name="$t('labels.email')"
              type="email"
              @keypress="isEmailValid($event)"
              :placeholder="$t('labels.email')"
              v-model="data.email"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: Email -->

          <!-- Start Phone -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.phone')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.phone')"
              type="number"
              :placeholder="$t('labels.phone')"
              v-model="data.phones"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Phone -->

          <!-- Start Whatsapp -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('settings.contactData.whatsapp')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('settings.contactData.whatsapp')"
              type="number"
              :placeholder="$t('settings.contactData.whatsapp')"
              v-model="data.whatsapp"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Whatsapp -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.title_ar"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
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
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.title_en"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>

        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.desc') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.desc') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.desc') + $t('inArabic')"
              v-model="data.description_ar"
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
              type="textarea"
              :name="$t('labels.desc') + $t('inEnglish')"
              :placeholder="$t('labels.desc') + $t('inEnglish')"
              v-model="data.description_en"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.short_desc') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.short_desc') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.short_desc') + $t('inArabic')"
              v-model="data.short_description_ar"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.short_desc') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="text"
              :name="$t('labels.short_desc') + $t('inEnglish')"
              :placeholder="$t('labels.short_desc') + $t('inEnglish')"
              v-model="data.short_description_en"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.keywords') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.keywords') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.keywords') + $t('inArabic')"
              v-model="data.keywords_ar"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.keywords') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="textarea"
              :name="$t('labels.keywords') + $t('inEnglish')"
              :placeholder="$t('labels.keywords') + $t('inEnglish')"
              v-model="data.keywords_en"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.meta_description') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.meta_description') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.meta_description') + $t('inArabic')"
              v-model="data.meta_description_ar"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.meta_description') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="textarea"
              :name="$t('labels.meta_description') + $t('inEnglish')"
              :placeholder="$t('labels.meta_description') + $t('inEnglish')"
              v-model="data.meta_description_en"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>
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
import { mapGetters } from "vuex";

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
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        logo: {
          preview: null,
          image: null,
        },
        fav: {
          preview: null,
          image: null,
        },
        email: null,
        phones: null,
        whatsapp: null,
        title_ar: null,
        title_en: null,
        description_ar: null,
        description_en: null,
        keywords_ar: null,
        keywords_en: null,
        short_description_en: null,
        short_description_ar: null,
        meta_description_en: null,
        meta_description_ar: null,
      },
      noData: false,
    };
  },

  methods: {
    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    // Main Edit Data
    handleShowData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `settings`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.logo.preview = result.logo;
          this.data.fav.preview = result.fav;

          this.data.email = result.email;
          this.data.phones = result.phone;
          this.data.whatsapp = result.whatsapp;
          this.data.title_ar = result.title_ar;
          this.data.title_en = result.title_en;
          this.data.description_ar = result.description_ar;
          this.data.description_en = result.description_en;
          this.data.keywords_ar = result.keywords_ar;
          this.data.keywords_en = result.keywords_en;
          this.data.short_description_en = result.short_description_en;
          this.data.short_description_ar = result.short_description_ar;
          this.data.meta_description_en = result.meta_description_en;
          this.data.meta_description_ar = result.meta_description_ar;
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
      this.$refs.weHelpYouForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.logo.image) {
            data.append("logo", this.data.logo.image);
          }
          if (this.data.fav.image) {
            data.append("fav", this.data.fav.image);
          }

          data.append("email", this.data.email);
          data.append("phones", this.data.phones);
          data.append("whatsapp", this.data.whatsapp);
          data.append("title_ar", this.data.title_ar);
          data.append("title_en", this.data.title_en);
          data.append("description_ar", this.data.description_ar);
          data.append("description_en", this.data.description_en);
          data.append("keywords_ar", this.data.keywords_ar);
          data.append("keywords_en", this.data.keywords_en);
          data.append("short_description_en", this.data.short_description_en);
          data.append("short_description_ar", this.data.short_description_ar);
          data.append("meta_description_en", this.data.meta_description_en);
          data.append("meta_description_ar", this.data.meta_description_ar);

          let message = this.$t("editSuccess");
          this.axios({
            method: "POST",
            url: "settings",
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.handleShowData();
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
  },
  mounted() {
    this.handleShowData();
  },
};
</script>

<style lang="scss" scoped></style>
