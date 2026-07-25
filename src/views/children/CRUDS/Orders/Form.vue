<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formOffers" @submit.prevent="submit">
        <div class="row">
          <validation-provider v-slot="{ errors }" :name="$t('labels.profileImage')" class="d-block my-auto"
            style="width: 100%" :rules="editMode ? '' : 'required'">
            <!-- @change="sentImage($event)" -->
            <v-file-input :disabled="btnLoading" :loading="btnLoading" @change="uploadImage($event, 'offers', 'avatar')"
              v-model="data.avatar.mainMedia" class="d-none" :name="$t('labels.profileImage')" accept="image/*,|size:2048"
              label="" id="banner-create-image-main"></v-file-input>
            <label for="banner-create-image-main"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden">
              <v-img v-if="data.avatar.preview" class="d-flex" cover :src="data.avatar.preview" :aspect-ratio="3.4" />
              <img v-else class="d-flex img-fluid mx-auto" src="@/assets/media/images/placeholder.png" />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.title') + $t('inArabic')" class="col-lg-6"
            rules="required|min:2|max:250">
            <base-input :name="$t('labels.title') + $t('inArabic')" type="text"
              :placeholder="$t('labels.title') + $t('inArabic')" v-model="data.ar.title" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.title') + $t('inEnglish')" class="col-lg-6"
            rules="required|min:2|max:250">
            <base-input :name="$t('labels.title') + $t('inEnglish')" type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')" v-model="data.en.title" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.points')" class="col-lg-6"
            rules="required|min:1|max:250">
            <base-input :name="$t('labels.points')" type="number" :placeholder="$t('labels.points')"
              v-model="data.points" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.discount')" class="col-lg-6"
            rules="required|min:1|max:250">
            <base-input :name="$t('labels.discount')" type="text" :placeholder="$t('labels.discount')"
              v-model="data.discount" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- <ValidationProvider v-slot="{ errors }" :name="$t('labels.link')" class="col-lg-6"
            rules="required|min:2|max:250">
            <base-input :name="$t('labels.link')" type="text" :placeholder="$t('labels.link')" v-model="data.link" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->


          <ValidationProvider v-slot="{ errors }" :name="$t('labels.provider')" class="col-lg-6"
            rules="">
            <base-select-input v-model="data.provider" :static="true" :name="$t('labels.provider')"
              :staticItems="providers" :placeholder="$t('labels.provider')"></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.is_active')" class="col-lg-6" rules="required">
            <div>
              <div class="input-title">
                <h4>
                  {{ $t("labels.active", { name: $t("labels.offer") }) }}
                </h4>
              </div>
              <v-checkbox :name="$t('labels.is_active')" class="py-0 px-0" v-model="data.is_active"
                :label="$t('labels.is_active')"></v-checkbox>
            </div>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>


          <div class="col-12"></div>

        </div>
        <div class="button_wrapper center">
          <v-btn type="submit" @click="submit" :disabled="btnLoading" :loading="btnLoading">
            {{ $t("submit") }}
          </v-btn>
        </div>
        <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseCountryFlagPhoneInput from "@/components/Forms/BaseCountryFlagPhoneInput.vue";

export default {
  components: { BaseCountryFlagPhoneInput },
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
          text: this.$t("breadcrumb.offers.title"),
          disabled: false,
          href: "/offers/show-all",
        },
        {
          text: this.$t(`breadcrumb.offers.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingProviders: false,
      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        ar: {
          title: null,
        },
        en: {
          title: null,
        },

        points: null,
        discount: null,

        // link: null,

        is_active: true,
      },
      noData: false,
      // Fixed Data
      cityItems: [],
      providers: [],
    };
  },

  methods: {
    // Main Image
    mainUploded(link) {
      this.data.avatar.title = link;
    },

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    // Providers
    getProviders() {
      this.loadingProviders = true;
      this.axios({
        method: "GET",
        url: `providers_not_paginated`,
      })
        .then((res) => {
          this.providers = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.full_name,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          this.loadingProviders = false;
          this.items = [
            { id: 1, full_name: "Item Default 1" },
            { id: 2, full_name: "Item Default 2" },
          ];
        })
        .finally(() => {
          this.loadinProviders = false;
        });
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `offers/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.image;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;

          this.data.points = result.points;
          this.data.discount = result.discount;

          // this.data.link = result.link;

          this.data.provider = result.provider;

          this.data.is_active = result?.is_active;
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
      this.$refs.formOffers.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);

          data.append("points", this.data.points);
          data.append("discount", this.data.discount);

          data.append("provider_id", this.data.provider.id);

          // data.append("link", this.data.link);

          data.append("is_active", +this.data.is_active);

          // if (this.editMode) {
          //   if (this.data.password) {
          //     data.append("password", this.data.password);
          //   }
          // } else {
          //   data.append("password", this.data.password);
          // }

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `offers/${this.id}`;
          } else {
            url = "offers";
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
              this.$router.push("/offers/show-all");
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
          // for (const value of Object.entries(this.$refs.formRiders.errors)) {
          //   if (value[1].length) {
          //     this.$iziToast.error({
          //       timeout: 2000,
          //       message: value[1],
          //       position: "bottomRight",
          //     });
          //   }
          // }
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
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
    this.getProviders()
  },
};
</script>

<style lang="scss" scoped></style>
