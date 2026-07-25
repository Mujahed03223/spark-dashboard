<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: Socials ============= -->
          <!-- ***** Facebook -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.extra_seats')"
            v-model="data.extra_seats"
            @keypress="preventMinus"
          />
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.busy_area_threshold')"
            v-model="data.busy_area_threshold"
            @keypress="preventMinus"
          />
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.fair_time')"
            v-model="data.fair_time"
            @keypress="preventMinus"
          />
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.fare_time_to_matched')"
            v-model="data.fare_time_to_matched"
            @keypress="preventMinus"
          />
          <base-input
            col="6"
            type="number"
            :placeholder="$t('labels.app_amount')"
            v-model="data.app_amount"
            @keypress="preventMinus"
          />
          <base-input
            col="6"
            type="number"
            :placeholder="
              $t('labels.app_amount_for_auto_accept_request_partner')
            "
            @keypress="preventMinus"
            v-model="data.app_amount_for_auto_accept_request_partner"
          />

          <base-input
            col="6"
            type="number"
            @keypress="preventMinus"
            :placeholder="$t('labels.minimum_wallet_to_receive_order')"
            v-model="data.minimum_wallet_to_receive_order"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('labels.radius')"
            v-model="data.radius"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('labels.trip_time_stop_by_minutes')"
            v-model="data.trip_time_stop_by_minutes"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="
              $t('labels.max_time_to_cancel_schedule_trip_by_minutes')
            "
            v-model="data.max_time_to_cancel_schedule_trip_by_minutes"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('labels.max_schedule_days')"
            v-model="data.max_schedule_days"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('labels.min_time_to_schedule_trip_by_minutes')"
            v-model="data.min_time_to_schedule_trip_by_minutes"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="
              $t('labels.percentage_penalty_for_canceling_scheduled_flight')
            "
            v-model="data.percentage_penalty_for_canceling_scheduled_flight"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="
              $t('labels.reminder_duration_schedule_trip_by_minutes')
            "
            v-model="data.reminder_duration_schedule_trip_by_minutes"
          />

          <!-- ============= End:: Socials ============= -->
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
        busy_area_threshold: null,
        fare_time_to_matched: null,
        app_amount_for_auto_accept_request_partner: null,
        app_amount: null,
        minimum_wallet_to_receive_order: null,
        fair_time: null,
        radius: null,
        extra_seats: null,
        trip_time_stop_by_minutes: null,
        max_time_to_cancel_schedule_trip_by_minutes: null,
        max_schedule_days: null,
        min_time_to_schedule_trip_by_minutes: null,
        percentage_penalty_for_canceling_scheduled_flight: null,
        reminder_duration_schedule_trip_by_minutes: null,
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
                this.data[el.key] = el.value;
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
