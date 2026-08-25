<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Ownership Transfer Steps Control ============= -->
          <div class="col-12 mb-4">
            <h4>{{ $i18n.locale === 'ar' ? 'التحكم في خطوات نقل الملكية' : 'Ownership Transfer Steps Control' }}</h4>
            <p class="text-muted">{{ $i18n.locale === 'ar' ? 'تفعيل أو تعطيل خطوات نقل الملكية بشكل مستقل' : 'Enable or disable ownership transfer steps independently' }}</p>
          </div>

          <div class="col-lg-6 mb-3">
            <v-switch
              v-model="data.ownership_require_bank_transfer"
              :label="$i18n.locale === 'ar' ? 'طلب الحوالة البنكية' : 'Require Bank Transfer'"
              color="primary"
              inset
            ></v-switch>
          </div>

          <div class="col-lg-6 mb-3">
            <v-switch
              v-model="data.ownership_require_buyer_transfer"
              :label="$i18n.locale === 'ar' ? 'طلب نقل ملكية المشتري' : 'Require Buyer Ownership Transfer'"
              color="primary"
              inset
            ></v-switch>
          </div>

          <div class="col-lg-6 mb-3">
            <v-switch
              v-model="data.ownership_require_seller_transfer"
              :label="$i18n.locale === 'ar' ? 'طلب نقل ملكية البائع' : 'Require Seller Ownership Transfer'"
              color="primary"
              inset
            ></v-switch>
          </div>

          <div class="col-lg-6 mb-3">
            <v-switch
              v-model="data.ownership_require_delivery"
              :label="$i18n.locale === 'ar' ? 'طلب بيانات التوصيل' : 'Require Delivery Details'"
              color="primary"
              inset
            ></v-switch>
          </div>

          <div class="col-lg-6 mb-3">
            <v-switch
              v-model="data.ownership_require_otp"
              :label="$i18n.locale === 'ar' ? 'طلب رمز التحقق OTP' : 'Require OTP Code'"
              color="primary"
              inset
            ></v-switch>
          </div>

          <div class="col-12 mt-4">
            <h4>{{ $i18n.locale === 'ar' ? 'تعليمات نقل الملكية للمشتري' : 'Buyer Ownership Transfer Instructions' }}</h4>
          </div>

          <!-- ***** instruction_ownership_transfer_buyer -->
          <base-input
            col="12"
            type="ckeditor"
            :placeholder="$i18n.locale === 'ar' ? 'تعليمات نقل الملكية للمشتري' : 'Buyer Ownership Transfer Instructions'"
            v-model="data.instruction_ownership_transfer"
          />

          <div class="col-12 mt-4">
            <h4>{{ $i18n.locale === 'ar' ? 'تعليمات نقل الملكية للبائع' : 'Seller Ownership Transfer Instructions' }}</h4>
          </div>

          <!-- ***** instruction_ownership_transfer_seller -->
          <base-input
            col="12"
            type="ckeditor"
            :placeholder="$i18n.locale === 'ar' ? 'تعليمات نقل الملكية للبائع' : 'Seller Ownership Transfer Instructions'"
            v-model="data.instruction_ownership_transfer_seller"
          />

          <!-- ============= End:: Ownership Transfer Steps Control ============= -->
        </div>
        <!-- End Map -->
        <base-button :loading="loading" class="center">
          {{ $t("save") }}
        </base-button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],

  data() {
    return {
      // Loading
      loading: false,

      data: {
        instruction_ownership_transfer: null,
        instruction_ownership_transfer_seller: null,
        ownership_require_bank_transfer: true,
        ownership_require_buyer_transfer: true,
        ownership_require_seller_transfer: true,
        ownership_require_delivery: true,
        ownership_require_otp: false,
      },
    };
  },

  methods: {
    getEditData() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `settings`,
      })
        .then((res) => {
          const result = res.data.data;

          result.map((el) => {
            if (el.value !== null && el.value !== undefined) {
              const found = this.data.hasOwnProperty(el.key);
              if (found) {
                if (el.key.startsWith('ownership_require_')) {
                  this.data[el.key] = el.value === '1' || el.value === 1 || el.value === true;
                } else {
                  this.data[el.key] = el.value;
                }
              }
            }
          });

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      for (const [key, value] of Object.entries(this.data)) {
        if (value !== null && value !== undefined) {
          if (typeof value === 'boolean') {
            data.append(key, value ? '1' : '0');
          } else if (typeof value === "object") {
            data.append(key, value.id);
          } else {
            data.append(key, value);
          }
        }
      }

      if (this.editMode) {
        data.append("_method", "PUT");
      }

      this.axios({
        method: "POST",
        url: "/settings",
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          });
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });
    },
  },

  computed: {},

  async mounted() {
    this.canAdd = this.$permission.allowed("settings/add");
    this.canShowAll = this.$permission.allowed("settings/show-all");

    if (!this.canAdd) {
      if (!this.canShowAll) {
        this.getEditData();
      }
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
