<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="settingsForm" @submit.prevent="submit">
        <div class="row">
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

          <!-- Loop through other fields -->
          <template
            v-for="(value, key) in data"
            v-if="key !== 'logo' && key !== 'fav'"
          >
            <ValidationProvider
              :key="key"
              v-slot="{ errors }"
              :name="$t(`labels.${key}`)"
              class="col-lg-6"
              rules="required|min:2"
            >
              <base-input
                :name="$t(`labels.${key}`)"
                :type="
                  key === 'description_ar' ||
                  key === 'description_en' ||
                  key === 'keywords_ar' ||
                  key === 'keywords_en' ||
                  key === 'meta_description_en' ||
                  key === 'meta_description_ar'
                    ? 'textarea'
                    : key === 'phones' || key === 'whatsapp'
                    ? 'number'
                    : key === 'email'
                    ? 'email'
                    : 'text'
                "
                :placeholder="$t(`labels.${key}`)"
                v-model="data[key]"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
          </template>
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

          // Show logo and fav previews
          this.data.logo.preview = result.logo;
          this.data.fav.preview = result.fav;

          // Loop through other fields and show data
          for (const key in this.data) {
            if (key !== "logo" && key !== "fav") {
              this.data[key] = result[key];
            }
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

    // Submit
    submit() {
      this.$refs.settingsForm.validate().then((isValid) => {
        if (isValid) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          // Append logo and fav images
          for (const key in this.data) {
            if (key === "logo" || key === "fav") {
              if (this.data[key].image) {
                data.append(key, this.data[key].image);
              }
            } else {
              data.append(key, this.data[key]);
            }
          }

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
