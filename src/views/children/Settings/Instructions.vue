<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Socials ============= -->
          <!-- ***** instruction_ownership_transfer -->
          <base-input
            col="12"
            type="ckeditor"
            :placeholder="$t('settings.instruction_ownership_transfer')"
            v-model="data.instruction_ownership_transfer"
          />

          <!-- ============= End:: Socials ============= -->
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
