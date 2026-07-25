<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Socials ============= -->
          <!-- ***** phone -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.phone')"
            v-model="data.phone"
          />

          <!-- ***** whatsapp -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.whatsapp_no')"
            v-model="data.whatsapp"
          />

          <!-- ***** Facebook -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.facebook')"
            v-model="data.facebook"
          />

          <!-- ***** Twitter -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.twitter')"
            v-model="data.twitter"
          />

          <!-- ***** Instagram -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.instagram')"
            v-model="data.instagram"
          />

          <!-- ***** youtube -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.youtube')"
            v-model="data.youtube"
          />

          <!-- ***** pinterest -->
          <base-input
            col="6"
            type="url"
            :placeholder="$t('labels.pinterest')"
            v-model="data.pinterest"
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
        phone: null,
        whatsapp: null,
        facebook: null,
        twitter: null,
        instagram: null,
        youtube: null,
        pinterest: null,
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
