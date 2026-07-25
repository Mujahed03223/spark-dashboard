<template>
  <Loader v-if="loading && editMode"></Loader>
  <div class="form countryForm custom_card fadeIn" v-else>
    <form @submit.prevent="submit">
      <div class="row">
        <!-- Start:: Image -->
        <uplode-image-direct
          postUrl="attachments"
          @inputChanged="inputChanged"
          :data_src="data.image.src"
          model="coupons"
        />
        <!-- End:: Image -->

        <!-- Start:: Name -->
        <base-input
          col="3"
          type="text"
          :placeholder="$t('labels.name') + $t('inArabic')"
          :required="true"
          v-model="data.ar.name"
        />
        <base-input
          col="3"
          type="text"
          :placeholder="$t('labels.name') + $t('inEnglish')"
          :required="true"
          v-model="data.en.name"
        />
        <!-- End:: Name -->

        <!-- Start:: Slug -->
        <base-input
          col="3"
          type="text"
          :placeholder="$t('labels.slug') + $t('inArabic')"
          :required="true"
          v-model="data.ar.slug"
        />
        <base-input
          col="3"
          type="text"
          :placeholder="$t('labels.slug') + $t('inEnglish')"
          :required="true"
          v-model="data.en.slug"
        />
        <!-- End:: Slug -->

        <!-- Start:: Description -->
        <!-- <base-input
          col="6"
          type="ckeditor"
          :placeholder="$t('labels.short_desc') + $t('inArabic')"
          :required="true"
          v-model="data.ar.desc"
        />
        <base-input
          col="6"
          type="ckeditor"
          :placeholder="$t('labels.short_desc') + $t('inEnglish')"
          :required="true"
          v-model="data.en.desc"
        /> -->
        <!-- End:: Description -->

        <!-- Start:: Desc -->
        <base-input
          col="6"
          type="textarea"
          :placeholder="$t('labels.desc') + $t('inArabic')"
          :required="true"
          v-model="data.ar.desc"
        />
        <base-input
          col="6"
          type="textarea"
          :placeholder="$t('labels.desc') + $t('inEnglish')"
          :required="true"
          v-model="data.en.desc"
        />
        <!-- End:: Desc -->

        <!-- Start:: Code -->
        <base-input
          col="4"
          type="text"
          :placeholder="$t('labels.code')"
          :required="true"
          v-model.number="data.code"
        />
        <!-- End:: Code -->

        <!-- Start:: Discount Type -->
        <base-select-input
          col="4"
          v-model="data.discount_type"
          :static="true"
          :staticItems="discountTypes"
          :placeholder="$t('labels.discount_type')"
        ></base-select-input>
        <!-- End:: Discount Type -->

        <!-- Start:: VehiclePackage -->
        <!-- <base-select-input
          col="6"
          v-model="data.package"
          :getUrl="`vehicle_packages_without_pagination`"
          :placeholder="$t('labels.package')"
        ></base-select-input> -->
        <!-- End:: VehiclePackage-->

        <!-- Start:: DiscountAmount -->
        <base-input
          col="4"
          type="number"
          @keypress="preventMinus"
          :placeholder="$t('labels.discount_amount')"
          :required="true"
          v-model.trim="data.amount"
        />
        <!-- End:: DiscountAmount -->

        <!-- Start:: UsageTimes -->
        <base-input
          col="3"
          type="number"
          @keypress="preventMinus"
          :placeholder="$t('labels.usage_times')"
          :required="true"
          v-model.number="data.usage_times"
        />
        <!-- End:: UsageTimes -->

        <!-- Start:: MaxUsageNumber -->
        <base-input
          col="3"
          type="number"
          @keypress="preventMinus"
          :placeholder="$t('labels.max_usage_number')"
          :required="true"
          v-model.number="data.max_usage_number"
        />
        <!-- End:: MaxUsageNumber -->

        <!-- Start At -->
        <base-picker-input
          col="3"
          type="date"
          v-model="data.start_at"
          :placeholder="$t('labels.start_at')"
        />

        <!-- End At -->
        <base-picker-input
          col="3"
          type="date"
          v-model="data.end_at"
          :placeholder="$t('labels.end_at')"
        />

        <!-- Start:: Checks -->
        <div class="col-lg-12 py-0">
          <div class="divider">
            <h4>الحالة</h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <v-checkbox
          v-model="data.is_active"
          :label="$t('labels.is_active')"
        ></v-checkbox>
        <v-checkbox
          v-model="data.is_city_to_city_active"
          :label="$t('labels.is_city_to_city_active')"
        ></v-checkbox>
        <v-checkbox
          v-model="data.is_trip_active"
          :label="$t('labels.is_trip_active')"
        ></v-checkbox>
        <v-checkbox
          v-model="data.is_package_delivering_active"
          :label="$t('labels.is_package_delivering_active')"
        ></v-checkbox>
        <!-- End:: Checks -->
      </div>

      <base-button :loading="loading" class="center">{{
        $t("submit")
      }}</base-button>
    </form>
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
      // Loading
      loading: false,

      data: {
        image: {
          title: null,
          src: null,
        },
        ar: {
          name: null,
          slug: null,
          desc: null,
        },
        en: {
          name: null,
          slug: null,
          desc: null,
        },
        code: null,
        discount_type: null,
        package: null,

        amount: null,
        usage_times: null,
        max_usage_number: null,

        start_at: null,
        end_at: null,

        // Checks
        is_active: false,
        is_city_to_city_active: false,
        is_trip_active: false,
        is_package_delivering_active: false,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    inputChanged(link) {
      this.data.image.title = link;
    },

    getEditData() {
      if (this.editMode) {
        this.loading = true;
        this.axios({
          method: "GET",
          url: `coupons/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            this.data = {
              image: {
                title: null,
                src: res.data.data.image,
              },
              ar: res.data.data.ar,
              en: res.data.data.en,
              code: res.data.data.code,
              discount_type: this.discountTypes.find((item) => {
                return item.value == res.data.data.discount_type;
              }),
              package: res.data.data.package,
              amount: res.data.data.amount,
              usage_times: res.data.data.usage_times,
              max_usage_number: res.data.data.max_usage_number,
              start_at: res.data.data.start_at,
              end_at: res.data.data.end_at,

              // Checks
              is_active: res.data.data.is_active,
              is_city_to_city_active: res.data.data.is_city_to_city_active,
              is_trip_active: res.data.data.is_trip_active,
              is_package_delivering_active:
                res.data.data.is_package_delivering_active,
            };
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.showArea = true;
      }
    },

    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      if (this.data.image.title) {
        data.append("image", this.data.image.title);
      }

      if (this.data.ar.name) {
        data.append("ar[name]", this.data.ar.name);
      }

      if (this.data.ar.desc) {
        data.append("ar[desc]", this.data.ar.desc);
      }

      if (this.data.ar.slug) {
        data.append("ar[slug]", this.data.ar.slug);
      }

      if (this.data.ar.desc) {
        data.append("ar[desc]", this.data.ar.desc);
      }

      if (this.data.en.name) {
        data.append("en[name]", this.data.en.name);
      }

      if (this.data.en.desc) {
        data.append("en[desc]", this.data.en.desc);
      }

      if (this.data.en.slug) {
        data.append("en[slug]", this.data.en.slug);
      }

      if (this.data.en.desc) {
        data.append("en[desc]", this.data.en.desc);
      }

      if (this.data.image.title) {
        data.append("image", this.data.image.title);
      }

      if (this.data.code) {
        data.append("code", this.data.code);
      }

      if (this.data.discount_type) {
        data.append("discount_type", this.data.discount_type?.value);
      }

      if (this.data.package) {
        data.append("vehicle_package_id", this.data.package?.id);
      }

      if (this.data.amount) {
        data.append("amount", this.data.amount);
      }

      if (this.data.usage_times) {
        data.append("usage_times", this.data.usage_times);
      }

      if (this.data.max_usage_number) {
        data.append("max_usage_number", this.data.max_usage_number);
      }

      if (this.data.start_at) {
        data.append("start_at", this.data.start_at);
      }

      if (this.data.end_at) {
        data.append("end_at", this.data.end_at);
      }

      data.append("is_active", +this.data.is_active);
      data.append("is_trip_active", +this.data.is_trip_active);
      data.append("is_city_to_city_active", +this.data.is_city_to_city_active);
      data.append(
        "is_package_delivering_active",
        +this.data.is_package_delivering_active
      );

      if (this.editMode) {
        data.append("_method", "PUT");
      }

      // =============== Start:: Edit ===============
      if (this.editMode) {
        this.axios({
          method: "POST",
          url: `coupons/${this.id}`,
          data: data,
        })
          .then(() => {
            this.$iziToast.success({
              title: this.$t("success"),
              message: this.$t("editSuccess"),
            });
            this.loading = false;
            this.$router.push("/coupons");
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("error"),
              message: err.response.data.message,
            });
            this.loading = false;
          });

        return;
      }
      // =============== End:: Edit ===============

      // =============== Start:: Add ===============
      this.axios({
        method: "POST",
        url: "/coupons",
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            title: this.$t("success"),
            message: this.$t("addSuccess"),
          });
          this.$router.push("/coupons");
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });
      // =============== End:: Add ===============
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },

    discountTypes() {
      if (this.lang == "ar") {
        return [
          {
            id: 1,
            name: "amount",
            value: "amount",
          },
          {
            id: 2,
            name: "percentage",
            value: "percentage",
          },
        ];
      } else {
        return [
          {
            id: 1,
            name: "كمية",
            value: "amount",
          },
          {
            id: 2,
            name: "نسبة مئوية",
            value: "percentage",
          },
        ];
      }
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.set_breadcrumb({
      title: this.$t("breadcrumb.coupons.title"),
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.coupons.title"),
          disabled: false,
          href: "/coupons",
        },
        {
          text: this.$t("breadcrumb.coupons.add"),
          disabled: true,
          href: "",
        },
      ],
    });

    this.getEditData();
  },
};
</script>
