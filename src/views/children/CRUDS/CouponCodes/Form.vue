<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="CouponCodesForm" @submit.prevent="submit">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.sender_name')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.sender_name')"
              type="text"
              :placeholder="$t('labels.sender_name')"
              v-model="data.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

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

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.number_of_recipients')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.number_of_recipients')"
              type="number"
              :placeholder="$t('labels.number_of_recipients')"
              v-model="data.number_of_recipients"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
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
          text: this.$t("breadcrumb.CouponCodes.title"),
          disabled: false,
          href: "/coupon-codes/show-all",
        },
        {
          text: this.$t(`breadcrumb.CouponCodes.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCity: false,
      data: {
        name: null,
        number_of_recipients: null,
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
        url: `coupon-codes/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.name = result.name;
          this.data.number_of_recipients = result.number_of_recipients;

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
      this.$refs.CouponCodesForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("name", this.data.name);
          data.append("phone_code", this.data.phone.key);
          data.append("phone_number", this.data.phone.number);
          data.append("number_of_recipients", this.data.number_of_recipients);

          let message = this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: "generate-coupon-codes",
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/coupon-codes/show-all");
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

  async mounted() {
    this.canEdit = this.$permission.allowed("update-coupon-codes");
    this.canDelete = this.$permission.allowed("delete-coupon-codes");
    this.canAdd = this.$permission.allowed("create-coupon-codes");
    this.canShow = this.$permission.allowed("show-coupon-codes");
    this.canShowAll = this.$permission.allowed("index-coupon-codes");

    if (this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>

<style lang="scss" scoped></style>
