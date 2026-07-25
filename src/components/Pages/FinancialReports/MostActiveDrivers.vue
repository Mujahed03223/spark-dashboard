<template>
  <div class="show_all">
    <the-table
      v-if="tableRows"
      :headers="headers"
      tableName="tableRows"
      @expandFired="mapItem"
      _static
      :staticRows="tableRows"
      :showFilter="false"
      :actions="{}"
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
  props: ["tableRows"],

  data() {
    return {
      // ========== headers
      headers: [
        {
          text: this.$t("labels.mainImage"),
          align: "center",
          value: "avatar",
          sortable: false,
        },
        {
          text: this.$t("labels.first_name"),
          value: "first_name",
          align: "center",
        },
        {
          text: this.$t("labels.last_name"),
          value: "last_name",
          align: "center",
        },
        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone",
          sortable: false,
        },
      ],

      expandData: null,
    };
  },

  methods: {
    mapItem(data) {
      this.expandData = {
        [this.$t("labels.phonecode")]: data.phone_code,
        [this.$t("labels.is_active")]: this.helper_boolToText(data.is_active),
        [this.$t("labels.is_trip_active")]: this.helper_boolToText(
          data.is_trip_active
        ),
      };
    },
  },
};
</script>

<style lang="scss">
.show_all main {
  min-height: auto !important;
}
</style>
