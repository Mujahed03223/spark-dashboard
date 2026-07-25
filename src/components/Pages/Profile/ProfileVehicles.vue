<template>
  <div class="show_all customCard">
    <h2 class="h_2">
      السيارات
      <span class="countTitle" v-if="_vehicles.length > 0 && _vehicles[0]">
        {{ _vehicles.length }}
      </span>
    </h2>

    <template v-if="_vehicles.length > 0 && _vehicles[0]">
      <the-table
        :headers="headers"
        :noExpand="true"
        tableName="vehicles"
        tableNofound="لا يوجد مركبات"
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

    <NoFound v-else text="لا يوجد مركبات"></NoFound>
  </div>
</template>

<script>
export default {
  props: ["vehicles", "vehiclesCount"],

  data() {
    return {
      // ========== headers
      headers: [
        {
          text: this.$t("labels.vehicle_image"),
          align: "center",
          value: "vehicle_image",
          sortable: false,
        },
        {
          text: this.$t("labels.model"),
          value: "vehicle_model.name",
          align: "center",
        },
        {
          text: this.$t("labels.brand"),
          value: "vehicle_brand.name",
          align: "center",
        },
        {
          text: this.$t("labels.manufactruingYear"),
          value: "manufacturing_year",
          align: "center",
        },
        {
          text: "الانضمام",
          value: "created_at",
          align: "center",
        },
        {
          text: this.$t("labels.package"),
          value: "vehicle_package.name",
          align: "center",
        },
        {
          text: this.$t("labels.activation"),
          align: "center",
          value: "activeStatus",
          sortable: false,
        },
        {
          text: "الاداره",
          align: "center",
          value: "is_admin_active_vehicle",
          sortable: false,
        },
        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
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
  },
  created() {
    this.control = this.$permission.setControls(this.$route.path);
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
