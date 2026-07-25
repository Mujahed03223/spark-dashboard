<template>
  <div class="buy_requests">
    <Breadcrumb :items="items" search_route="/requests/buy/show-all" />

    <the-table
      :headers="headers"
      tableName="requests/buy"
      @expandFired="mapItem"
      :showFilter="false"
      :actions="{ show: false }"
      :showDelete="false"
    >
    </the-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.buy_requests.title"),
          disabled: false,
          href: "/requests/buy/show-all",
        },
        {
          text: this.$t("breadcrumb.buy_requests.all"),
          disabled: true,
          href: "",
        },
      ],

      // ========== headers
      headers: [
        {
          text: this.$t("labels.name"),
          value: "name",
          align: "center",
        },

        {
          text: this.$t("labels.payment_method"),
          value: "payment_type",
          align: "center",
        },
        {
          text: this.$t("labels.phone"),
          value: "phoneContact",
          align: "center",
        },

        {
          text: this.$t("labels.message"),
          value: "message",
          align: "center",
        },
      ],

      expandData: null,
    };
  },

  methods: {
    mapItem(data) {
      this.expandData = data.data;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
  },
};
</script>
