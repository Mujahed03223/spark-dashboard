<template>
  <div class="show_all customCard">
    <h2 class="h_2 mb-0">ملفات السائق</h2>

    <the-table
      v-if="files"
      :headers="headers"
      tableName="driver_files"
      :noExpand="true"
      _static
      :staticRows="_files"
      :showFilter="false"
      :actions="{}"
    >
    </the-table>
  </div>
</template>

<script>
export default {
  props: ["files"],

  data() {
    return {
      // ========== headers
      headers: [
        {
          text: "صورة الملف الجنائي",
          value: "criminal_record_info_image",
          align: "center",
        },
        {
          text: "صورة رخصة القيادة",
          value: "driver_license_image",
          align: "center",
        },
        {
          text: "صورة الهوية الأمامية",
          value: "id_front_image",
          align: "center",
        },
        {
          text: "صورة الهوية الخلفية",
          value: "id_back_image",
          align: "center",
        },
      ],

      expandData: null,
    };
  },

  methods: {
    mapItem(data) {
      this.expandData = {
        [this.$t("labels.balance_before")]: data.balance_before,
        [this.$t("labels.balance_after")]: data.balance_after,
        [this.$t("labels.point_before")]: data.point_before,
        [this.$t("labels.point_after")]: data.point_after,
      };
    },
  },

  computed: {
    _files() {
      return this.files;
    },
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
