<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Prices ============= -->
          <!-- ***** recommended_price_by_app -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.recommended_price_by_app')"
            v-model="data.recommended_price_by_app"
          />

          <!-- ***** application_tax -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.application_tax')"
            v-model="data.application_tax"
          />

          <!-- ***** VAT -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.VAT')"
            v-model="data.VAT"
          />

          <!-- ============= End:: Prices ============= -->
        </div>
        <!-- End Map -->
        <base-button :loading="loading" class="center">
          {{ $t("submit") }}
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
        recommended_price_by_app: null,
        application_tax: null,
        VAT: null,
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
          // console.log(result)

          result.map((el) => {
            if (el.value) {
              const found = this.data.hasOwnProperty(el.key);
              if (found) {
                if (el.key == "use_sms_service") {
                  this.data[el.key] = this.smsServices.find(
                    (item) => item.id == el.value
                  );
                } else if (el.key == "lat") {
                  this.data[el.key] = +el.value;
                  this.coordinates_to_edit.lat = +el.value;
                } else if (el.key == "lng") {
                  this.data[el.key] = +el.value;
                  this.coordinates_to_edit.lng = +el.value;
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
        if (value || value == 0) {
          if (typeof value == "object") {
            data.append(key, value.id);
          } else {
            data.append(key, value);
          }
        }
      }

      this.axios({
        method: "POST",
        url: "/create-setting",
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
    this.canAdd = this.$permission.allowed("create-settings");
    this.canShowAll = this.$permission.allowed("show-settings");

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
