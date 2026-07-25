<template>
  <div class="show_all customCard">
    <h2 class="h_2" v-if="userType == 'contributors'">
      تحويلات الشركة
      <span class="countTitle" v-if="transactions.length > 0">
        {{ transactions.length }}
      </span>
    </h2>
    <h2 class="h_2" v-if="userType == 'drivers'">
      تحويلات السائق
      <span class="countTitle" v-if="transactions.length > 0">
        {{ transactions.length }}
      </span>
    </h2>
    <h2 class="h_2" v-if="userType == 'clients'">
      تحويلات العميل
      <span class="countTitle" v-if="transactions.length > 0">
        {{ transactions.length }}
      </span>
    </h2>

    <the-table
      v-if="transactions.length > 0"
      :headers="headers"
      :noExpand="true"
      tableName="wallet_transactions"
      tableNofound="لا يوجد تحويلات"
      @expandFired="mapItem"
      :items="transactions"
      _static
      :staticRows="_transactions"
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
    <div v-else>
      <NoFound text="لا يوجد تحويلات"></NoFound>
    </div>
  </div>
</template>

<script>
export default {
  props: ["transactions"],

  data() {
    return {
      // ========== headers
      headers: [
        {
          text: this.$t("labels.amount"),
          value: "amount",
          align: "center",
        },
        {
          text: this.$t("labels.type"),
          value: "type",
          align: "center",
        },
        {
          text: "نوع التحويل",
          value: "transaction_type",
          align: "center",
        },
        {
          text: "قبل",
          value: "balance_before",
          align: "center",
        },
        {
          text: "بعد",
          value: "balance_after",
          align: "center",
        },
        {
          text: this.$t("labels.created_at"),
          value: "created_at",
          align: "center",
        },
      ],

      expandData: null,
      userType: "",
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
    _transactions() {
      return this.transactions;
    },
  },
  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.$route.path.includes("contributors")) {
      this.userType = "contributors";
    }
    if (this.$route.path.includes("drivers")) {
      this.userType = "drivers";
    }
    if (this.$route.path.includes("clients")) {
      this.userType = "clients";
    }
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
