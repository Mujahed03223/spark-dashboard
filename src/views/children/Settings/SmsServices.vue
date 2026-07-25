<template>
  <Loader v-if="loading"></Loader>
  <div class="wrapper" v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ***** Sms Sender Name -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('labels.sms_sender_name')"
            v-model="data.sms_sender_name"
          />

          <!-- ***** Sms Password -->
          <base-input
            col="6"
            type="password"
            :placeholder="$t('labels.sms_password')"
            v-model="data.sms_password"
          />

          <!-- ***** Sms Username -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('labels.sms_username')"
            v-model="data.sms_username"
          />

          <!-- ***** Sms Provider -->

          <base-select-input
            col="6"
            v-model="data.sms_provider"
            :static="true"
            :staticItems="smsProviders"
            :placeholder="$t('labels.sms_provider')"
          ></base-select-input>

          <!-- ***** Use Sms Service -->
          <base-select-input
            col="6"
            v-model="data.use_sms_service"
            :static="true"
            :staticItems="smsServices"
            :placeholder="$t('labels.use_sms_service')"
          ></base-select-input>
          <div class="col-12"></div>
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('labels.sms_message')"
            v-model="data.sms_message"
          />
        </div>

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
        sms_provider: null,
        sms_username: null,
        sms_password: null,
        sms_sender_name: null,
        use_sms_service: null,
        sms_message: null,
      },

      smsServices: [
        {
          id: "enable",
          name: this.$t("enable"),
        },
        {
          id: "disable",
          name: this.$t("disable"),
        },
      ],

      smsProviders: [
        {
          id: "hisms",
          name: this.$t("hisms"),
        },
        {
          id: "net_powers",
          name: this.$t("net_powers"),
        },
        {
          id: "sms_gateway",
          name: this.$t("sms_gateway"),
        },
        {
          id: "msegat",
          name: this.$t("msegat"),
        },
      ],
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
        if (value) {
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

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getEditData();
  },
};
</script>
