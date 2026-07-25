<template>
  <div class="show_all customCard">
    <h2 class="h_2">
      سائقين الشركة
      <span class="countTitle"> {{ driversCount }} </span>
    </h2>

    <the-table
      v-if="drivers"
      :headers="headers"
      :noExpand="true"
      tableName="drivers"
      tableNofound="لا يوجد سائقين"
      @expandFired="mapItem"
      _static
      :staticRows="_drivers"
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
  </div>
</template>

<script>
export default {
  props: ["drivers", "driversCount"],

  data() {
    return {
      // ========== headers
      headers: [
        {
          text: "الصورة",
          align: "center",
          value: "avatar",
          sortable: false,
        },
        {
          text: this.$t("labels.name"),
          value: "name",
          align: "center",
        },
        {
          text: "نوع السائق",
          value: "driver_type",
          align: "center",
        },
        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone",
          sortable: false,
        },
        {
          text: "الانضمام",
          value: "created_at",
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
          value: "is_admin_active_user",
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
    _drivers() {
      return this.drivers;
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
