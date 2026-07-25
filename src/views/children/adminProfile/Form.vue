<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <noData v-if="noData" />
    <div class="form profileForm custom_card fadeIn" v-else>
      <ValidationObserver ref="profileForm" @submit.prevent="submit">
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
              @change="uploadImage($event, 'users', 'avatar')"
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

          <!-- Start:: Name -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.fullname')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.fullname')"
              type="text"
              :placeholder="$t('labels.fullname')"
              v-model="data.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: Name -->

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

          <!-- Start countries -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.country')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              v-model="data.country"
              :getUrl="`countries_without_pagination`"
              :placeholder="$t('labels.country')"
              @input="getCities(data.country)"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End countries -->

          <!-- Start cities -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.city')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              :loading="loadingCity"
              :disabled="!data.country"
              :name="$t('labels.city')"
              v-model="data.city"
              :static="true"
              :staticItems="cities"
              :placeholder="$t('labels.city')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End cities -->

          <!-- Start Phone -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.phone')"
            class="col-lg-6"
            :rules="`required|${
              data.phone.limit
                ? `min:${data.phone.limit}` + '|' + `max:${data.phone.limit}`
                : ''
            }`"
          >
            <base-country-flag-phone-input
              @changeKey="phoneKeyChanged"
              :name="$t('labels.phone')"
              :placeholder="$t('labels.phone')"
              :preSelectedPhoneCode="data.phone.key"
              v-model="data.phone.number"
            ></base-country-flag-phone-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Phone -->
        </div>

        <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
        <!-- <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn type="button" class="back_btn" @click="handleBack">
            {{ $t("back") }}
            <span
              :class="
                $i18n.locale === 'ar'
                  ? 'fas fa-arrow-left'
                  : 'fas fa-arrow-right'
              "
            ></span>
          </v-btn>
        </div> -->
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseCountryFlagPhoneInput from "@/components/Forms/BaseCountryFlagPhoneInput.vue";

export default {
  components: { BaseCountryFlagPhoneInput },

  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },

        {
          text: this.$t(`breadcrumb.profile.edit`),
          disabled: true,
          href: "",
        },
      ],

      // Btn Loading
      loading: false,
      btnLoading: false,

      loadingCity: false,
      cities: [],

      data: {
        avatar: {
          preview: null,
          image: null,
        },
        name: null,
        phone: {
          number: null,
          key: null,
          limit: null,
        },
        email: null,

        country: null,
        city: null,
      },
      noData: false,
    };
  },

  methods: {
    getCities(e) {
      this.loadingCity = true;
      this.axios({
        method: "GET",
        url: `countries/${e.id}/cities`,
      })
        .then((res) => {
          this.loadingCity = true;
          const result = res.data.data;

          this.cities = result.map((el) => ({
            id: el.id,
            name: el.name,
          }));
        })
        .catch((err) => {
          this.loadingCity = false;

          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        })
        .finally(() => {
          this.loadingCity = false;
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
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}`,
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

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `profile`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;
          this.data.phone = {
            number: result.phone,
            key: result.phone_code,
          };
          this.data.email = result.email;
          this.data.name = result.username;

          this.data.country = result.country;

          if (result.country) {
            this.getCities(result.country);
          }
          if (result.city) {
            this.data.city = result.city;
          }

          this.data.avatar.preview = result.image;
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
      this.$refs.profileForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const formData = new FormData();

          if (this.data.avatar.image) {
            formData.append("image", this.data.avatar.image);
          }
          formData.append("username", this.data.name);
          formData.append("phone_code", this.data.phone.key);
          formData.append("phone", this.data.phone.number);
          formData.append("email", this.data.email);

          formData.append("country_id", this.data.country.id);
          formData.append("city_id", this.data.city.id);

          let message = this.$t("editSuccess");
          this.axios({
            method: "POST",
            url: "profile",
            data: formData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
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
    this.getEditData();
  },
};
</script>

<style lang="scss" scoped></style>
