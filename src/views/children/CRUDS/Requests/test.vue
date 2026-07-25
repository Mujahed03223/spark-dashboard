<template>
  <div class="sell_requests">
    <Breadcrumb :items="items" search_route="/requests/sell/show-all" />

    <the-table
      :headers="headers"
      tableName="requests/sell"
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
          text: this.$t("breadcrumb.sell_requests.title"),
          disabled: false,
          href: "/requests/sell/show-all",
        },
        {
          text: this.$t("breadcrumb.sell_requests.all"),
          disabled: true,
          href: "",
        },
      ],

      // ========== headers
      headers: [
        {
          text: this.$t("labels.name"),
          value: "customer.name",
          align: "center",
        },

        {
          text: this.$t("labels.email"),
          value: "customer.email",
          align: "center",
        },
        {
          text: this.$t("labels.phone"),
          value: "customer.phone",
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
