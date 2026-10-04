<template>
  <div class="transactions_all">
    <template>
      <Breadcrumb :items="items" />

      <main>
        <v-data-table
          class="thumb strip"
          :headers="headers"
          :items="rows"
          :loading="loading"
          :loading-text="$t('table.loadingData')"
          item-key="id"
          :items-per-page="paginations.items_per_page"
          hide-default-footer
        >
          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>

          <template v-slot:[`item.user`]="{ item }">
            <span v-if="item.user">{{ item.user.name }}</span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.package`]="{ item }">
            <span v-if="item.package">{{ item.package.title }}</span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.amount`]="{ item }">
            <span>{{ item.amount }} {{ item.currency }}</span>
          </template>

          <template v-slot:[`item.invoice_id`]="{ item }">
            <span v-if="item.invoice_id">{{ item.invoice_id }}</span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <span class="statuses" :class="item.status">
              {{ $t(`status.${item.status}`) }}
            </span>
          </template>

          <template v-slot:[`item.paid_at`]="{ item }">
            <span v-if="item.paid_at">{{ item.paid_at }}</span>
            <span v-else>{{ item.created_at }}</span>
          </template>

          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.transactions.title") }}
              <span class="total">({{ total }})</span>
            </h3>
          </template>
        </v-data-table>

        <template>
          <div class="pagination_container text-center mb-5 d-flex justify-content-end">
            <v-pagination
              color="primary"
              v-model="paginations.current_page"
              :length="paginations.last_page"
              :total-visible="5"
              @input="fetchData($event)"
            ></v-pagination>
          </div>
        </template>
      </main>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { text: this.$t("breadcrumb.mainPage"), disabled: false, href: "/" },
        {
          text: this.$t("breadcrumb.transactions.title"),
          disabled: true,
          href: "",
        },
      ],
      headers: [
        { text: "#", align: "center", value: "index", sortable: false },
        { text: this.$t("labels.user"), align: "center", value: "user", sortable: false },
        { text: this.$t("breadcrumb.package.title"), align: "center", value: "package", sortable: false },
        { text: this.$t("labels.amount"), align: "center", value: "amount", sortable: false },
        { text: this.$t("labels.invoice_id"), align: "center", value: "invoice_id", sortable: false },
        { text: this.$t("labels.status"), align: "center", value: "status", sortable: false },
        { text: this.$t("labels.refund_reference"), align: "center", value: "refund_reference", sortable: false },
        { text: this.$t("labels.date"), align: "center", value: "paid_at", sortable: false },
      ],
      rows: [],
      loading: false,
      total: 0,
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 15,
      },
    };
  },

  methods: {
    fetchData(page = 1) {
      this.loading = true;
      this.axios({
        method: "GET",
        url: "transactions",
        params: {
          page: page,
          keyword: this.$route.query.keyword,
          status: this.$route.query.status,
          per_page: this.$route.query.per_page,
        },
      })
        .then((res) => {
          this.rows = res.data.data;
          this.total = res.data.meta?.total ?? this.rows.length;
          this.paginations.last_page = res.data.meta?.last_page ?? 1;
          this.paginations.items_per_page = res.data.meta?.per_page ?? 15;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          const message = err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("error"),
            message: message,
          });
        });
    },
  },

  mounted() {
    this.fetchData(1);
  },
};
</script>
