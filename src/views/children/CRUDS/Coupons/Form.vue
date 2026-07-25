<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="couponsForm" @submit.prevent="submit">
        <div class="row">
          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.code')"
            class="col-lg-4"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.code')"
              type="text"
              :placeholder="$t('labels.code')"
              v-model="data.code"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->

          <!-- Start:: discount_type -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.discount_type')"
            class="col-lg-4"
            rules="required"
          >
            <base-select-input
              :name="$t('labels.discount_type')"
              v-model="data.discount_type"
              :static="true"
              :staticItems="discountTypes"
              :placeholder="$t('labels.discount_type')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: discount_type -->

          <!-- Start:: DiscountAmount -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.discount_amount')"
            class="col-lg-4"
            :rules="`required|min_value:1|${
              data.discount_type && data.discount_type.id == 'percentage'
                ? 'max_value:100'
                : ''
            }`"
          >
            <base-input
              :name="$t('labels.discount_amount')"
              type="number"
              @keypress="preventMinus"
              :placeholder="$t('labels.discount_amount')"
              v-model="data.discount_amount"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: DiscountAmount -->

          <!-- Start:: usage_limit -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.usage_times')"
            class="col-lg-4"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.usage_times')"
              type="number"
              :placeholder="$t('labels.usage_times')"
              v-model="data.usage_limit"
              @keypress="preventMinus"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: usage_limit -->

          <!-- Start:: start_date -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.start_date')"
            class="col-lg-4"
            rules="required"
          >
            <base-picker-input
              :acceptToUp="true"
              :allowedDate="new Date()"
              :name="$t('labels.start_date')"
              type="date"
              v-model="data.start_date"
              :placeholder="$t('labels.start_date')"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: start_date -->

          <!-- Start:: expiry_date -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.end_date')"
            class="col-lg-4"
            rules="required"
          >
            <base-picker-input
              :acceptToUp="true"
              :allowedDate="data.start_date ? data.start_date : new Date()"
              :name="$t('labels.end_date')"
              type="date"
              v-model="data.expiry_date"
              :placeholder="$t('labels.end_date')"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: expiry_date -->

          <!-- Start:: status -->
          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <div class="col-lg-12">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.status") }}</h4>
              </h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.is_active')"
            class="col-4"
            rules="required"
          >
            <div>
              <div class="input-title">
                <h4>
                  {{ $t("labels.active", { name: $t("") }) }}
                </h4>
              </div>
              <v-checkbox
                :name="$t('labels.is_active')"
                class="py-0 px-0"
                v-model="data.is_active"
                :label="$t('labels.is_active')"
              ></v-checkbox>
            </div>
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
        <!-- <div class="button_wrapper center d-flex gap-1 justify-content-center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
            class="submit_btn"
          >
            {{ $t("submit") }}
          </v-btn>
          <v-btn type="button" class="back_btn" @click="handleBack">
            {{ $t("back") }}
            <span class="fas fa-arrow-left"></span>
          </v-btn>
        </div> -->
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
          text: this.$t("breadcrumb.coupons.title"),
          disabled: false,
          href: "/discount-coupons/show-all",
        },
        {
          text: this.$t(`breadcrumb.coupons.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],

      discountTypes: [
        {
          id: "amount",
          name: this.$t("labels.amount"),
        },
        {
          id: "percentage",
          name: this.$t("labels.percentage"),
        },
      ],

      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        // code: null,
        discount_amount: null,
        usage_limit: null,
        expiry_date: null,
        start_date: null,
        is_active: false,
        discount_type: null,
      },
      noData: false,
    };
  },

  methods: {
    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `show_coupon/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          // this.data.code = result.code;

          this.data.discount_type = result.type;
          this.data.discount_amount = result.discount_amount;
          this.data.usage_limit = result.usage_limit;
          this.data.start_date = new Date(
            res.data.data.start_date
          ).toLocaleDateString("en-CA");
          this.data.expiry_date = new Date(
            res.data.data.expiry_date
          ).toLocaleDateString("en-CA");

          this.data.is_active = result.status;
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
      this.$refs.couponsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          // data.append("code", this.data.code);

          data.append(
            "type",
            this.data.discount_type.id || this.data.discount_type
          );

          data.append("value", this.data.discount_amount);
          data.append("usage_limit", this.data.usage_limit);
          data.append("status", +this.data.is_active);

          data.append(
            "start_date",
            `${this.$moment(this.data.start_date).format("YYYY-MM-DD")}`
          );

          data.append(
            "expiry_date",
            `${this.$moment(this.data.expiry_date).format("YYYY-MM-DD")}`
          );

          // if (this.id) {
          //   data.append("_method", "PUT");
          // }
          let url = "";
          if (this.id) {
            url = `update_coupon/${this.id}`;
          } else {
            url = "add_coupon";
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
              this.$router.push("/discount-coupons/show-all");
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

  async mounted() {
    this.canEdit = this.$permission.allowed("update-coupon");
    this.canDelete = this.$permission.allowed("delete-coupon");
    this.canAdd = this.$permission.allowed("create-coupon");
    this.canShow = this.$permission.allowed("show-coupon");
    this.canShowAll = this.$permission.allowed("index-coupon");

    if (this.id) {
      if (!this.canEdit) {
        if (!this.canShow) {
          this.getEditData();
        }
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    } else if (this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>

<style lang="scss" scoped></style>
