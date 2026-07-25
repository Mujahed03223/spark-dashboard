<template>
  <div class="show_all customCard">
    <h2 class="h_2" v-if="userType == 'clients'">
      بلاغات العميل
      <span class="countTitle" v-if="_vehicles.length > 0 && _vehicles[0]">
        {{ _vehicles.length }}
      </span>
    </h2>
    <h2 class="h_2" v-if="userType == 'drivers'">
      بلاغات السائق
      <span class="countTitle" v-if="_vehicles.length > 0 && _vehicles[0]">
        {{ _vehicles.length }}
      </span>
    </h2>
    <h2 class="h_2" v-if="userType == 'contributors'">
      بلاغات السائق
      <span class="countTitle" v-if="_vehicles.length > 0 && _vehicles[0]">
        {{ _vehicles.length }}
      </span>
    </h2>

    <template v-if="_vehicles.length > 0 && _vehicles[0]">
      <the-table
        :headers="headers"
        :noExpand="true"
        tableName="vehicles"
        tableNofound="لا يوجد بلاغات "
        @expandFired="mapItem"
        _static
        :staticRows="_vehicles"
        :showFilter="false"
        :actions="{ show: true }"
      >
        <template v-slot:expand>
          <ul>
            <li v-for="(value, key) of expandData" :key="key">
              <span class="key">{{ key }}</span>
              <span class="value">{{ value }}</span>
            </li>
          </ul>
        </template>
      </the-table>
    </template>

    <NoFound v-else text="لا يوجد بلاغات"></NoFound>
  </div>
</template>

<script>
export default {
  props: ["vehicles"],

  data() {
    return {
      // ========== headers

      headers: [
        {
          text: "نوع البلاغ",
          align: "center",
          value: "cancel_reason_data",
          sortable: false,
        },
        {
          text: "تفاصيل الرحله",
          align: "center",
          value: "order_id",
          sortable: false,
        },
        {
          text: "التفاصيل",
          value: "descReport",
          align: "center",
        },
        {
          text: "التاريخ",
          value: "created_at_report",
          align: "center",
        },
      ],

      expandData: null,
      userType: "contributors",
    };
  },

  methods: {
    mapItem(data) {
      this.expandData = {
        [this.$t("labels.phonecode")]: data.phone_code,
        [this.$t("labels.rate_avg")]: data.rate_avg,
        [this.$t("labels.country")]: data.country?.name,
        [this.$t("labels.city")]: data.city?.name,
        [this.$t("labels.is_active")]: this.helper_boolToText(data.is_active),
        [this.$t("labels.is_trip_active")]: this.helper_boolToText(
          data.is_trip_active
        ),
        [this.$t("labels.created_at")]: data.created_at,
      };
    },
  },

  computed: {
    _vehicles() {
      return this.vehicles;
    },
    // getProfile() {
    //   if (this.$route.path.includes("contributors")) {
    //     this.userType = "contributors";
    //   }
    //   if (this.$route.path.includes("drivers")) {
    //     this.userType = "drivers";
    //   }
    //   if (this.$route.path.includes("clients")) {
    //     this.userType = "clients";
    //   }
    // }
  },
  created() {
    this.control = this.$permission.setControls(this.$route.path);
    // this.getProfile();
  },
};
</script>

<style lang="scss">
.show_all main {
  min-height: auto !important;
  max-height: 450px !important;
  overflow-y: scroll;
}
</style>
