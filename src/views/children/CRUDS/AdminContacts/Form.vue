<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form contactForm custom_card fadeIn" v-else>
      <ValidationObserver ref="adminContactForm" @submit.prevent="submit">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.phone')"
            class="col-lg-6"
            :rules="`${
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

          <!-- Start:: Email -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.email')"
            class="col-lg-6"
            rules="email"
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

          <!-- Start:: facebook -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.facebook')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.facebook')"
              type="url"
              :placeholder="$t('labels.facebook')"
              v-model="data.facebook"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: facebook -->

          <!-- Start:: twitter -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.twitter')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.twitter')"
              type="url"
              :placeholder="$t('labels.twitter')"
              v-model="data.twitter"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: twitter -->

          <!-- Start:: linkedin -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.linkedin')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.linkedin')"
              type="url"
              :placeholder="$t('labels.linkedin')"
              v-model="data.linkedin"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: linkedin -->

          <!-- Start:: instagram -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.instagram')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.instagram')"
              type="url"
              :placeholder="$t('labels.instagram')"
              v-model="data.instagram"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: instagram -->

          <!-- Start:: behance -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.behance')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.behance')"
              type="url"
              :placeholder="$t('labels.behance')"
              v-model="data.behance"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: behance -->

          <!-- Start:: youtube -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.youtube')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.youtube')"
              type="url"
              :placeholder="$t('labels.youtube')"
              v-model="data.youtube"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: youtube -->

          <!-- Start:: google_play -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.g_play_app')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.g_play_app')"
              type="url"
              :placeholder="$t('labels.g_play_app')"
              v-model="data.google_play"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: google_play -->

          <!-- Start:: app_store -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.app_store_app')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.app_store_app')"
              type="url"
              :placeholder="$t('labels.app_store_app')"
              v-model="data.app_store"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: app_store -->
        </div>

        <div class="button_section d-flex gap-1 justify-content-center mt-10">
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
        </div>
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
          text: this.$t("breadcrumb.adminContacts.title"),
          disabled: false,
          href: "",
        },
      ],

      markers: null,

      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        email: null,
        facebook: null,
        twitter: null,
        linkedin: null,
        instagram: null,
        behance: null,
        youtube: null,
        google_play: null,
        app_store: null,
        phone: {
          number: null,
          key: null,
          limit: null,
        },
      },
      noData: false,
    };
  },

  methods: {
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
        url: `admin-contacts`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.email = result.gmail;
          this.data.facebook = result.facebook;
          this.data.twitter = result.twitter;
          this.data.linkedin = result.linkedin;
          this.data.instagram = result.instagram;
          this.data.behance = result.behance;
          this.data.youtube = result.youtube;
          this.data.google_play = result.google_play;
          this.data.app_store = result.app_store;

          this.data.phone = {
            number: result.phone,
            key: result.phone_code,
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
      this.$refsuperadminContactForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const formData = new FormData();

          formData.append("phone_code", this.data.phone.key);
          formData.append("phone", this.data.phone.number);

          formData.append("gmail", this.data.email);
          formData.append("facebook", this.data.facebook);
          formData.append("twitter", this.data.twitter);
          formData.append("linkedin", this.data.linkedin);
          formData.append("instagram", this.data.instagram);
          formData.append("behance", this.data.behance);
          formData.append("youtube", this.data.youtube);
          formData.append("google_play", this.data.google_play);
          formData.append("app_store", this.data.app_store);

          let message = this.$t("editSuccess");

          this.axios({
            method: "POST",
            url: `update-admin-contact`,
            data: formData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.btnLoading = false;
            })
            .catch((err) => {
              console.log(err, "error");
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

  async mounted() {
    this.canEdit = this.$permission.allowed("update-admin-contacts");
    this.canDelete = this.$permission.allowed("delete-admin-contacts");
    this.canAdd = this.$permission.allowed("create-admin-contacts");
    this.canShow = this.$permission.allowed("show-admin-contacts");
    this.canShowAll = this.$permission.allowed("index-admin-contacts");

    if (!this.canEdit) {
      if (!this.canShow) {
        this.getEditData();
      }
    } else {
      this.$router.push({ path: `/permission-required` });
    }
    if (this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
