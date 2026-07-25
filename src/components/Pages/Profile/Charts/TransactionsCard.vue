<template>
  <div class="transactions_card_content_wrapper">
    <div class="card_title mb-4" @click="show = true">
      <i class="fas fa-caret-down"></i>
    </div>

    <base-model :show="show" @close="show = false">
      <div class="transactionsPopup">
        <h3 class="text-center mb-7">{{ $t("labels.transactions_index") }}</h3>

        <div class="row">
          <v-data-table
            class="thumb strip"
            :headers="headers"
            :items="rows"
            :search="search"
            :loading="loading"
            :loading-text="$t('table.loadingData')"
            item-key="id"
            :items-per-page="paginations.items_per_page"
            hide-default-footer
          >
            <!-- ================== You Can use any slots you want ================== -->
            <!-- ====== Select row field ====== -->

            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.transaction_id`]="{ item }">
              <span v-if="item.transaction_id">
                {{ item.transaction_id }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.title`]="{ item }">
              <span v-if="item.title">
                {{ item.title }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.price`]="{ item }">
              <span v-if="item.price">
                {{ item.price }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.discount`]="{ item }">
              <span v-if="item.discount">
                {{ item.discount }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.vat`]="{ item }">
              <span v-if="item.vat">
                {{ item.vat }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.total`]="{ item }">
              <span v-if="item.total">
                {{ item.total }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <!-- Select no data State -->
            <template v-slot:no-data>
              {{ $t("table.noData") }}
            </template>

            <!-- ======================== Start Top Section ======================== -->
            <template v-slot:top>
              <h3 class="table-title title">
                {{ $t("breadcrumb.transactions.title") }}
                <span class="total">({{ total }})</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on">
                      far fa-info-circle
                    </v-icon>
                  </template>
                  <span> {{ $t("breadcrumb.transactions.all") }}</span>
                </v-tooltip>
              </h3>
            </template>
            <!-- ======================== End Top Section ======================== -->
          </v-data-table>
          <!-- Start Pagination -->
          <template>
            <div
              class="pagination_container text-center mb-5 d-flex justify-content-end"
            >
              <v-pagination
                color="primary"
                v-model="paginations.current_page"
                :length="paginations.last_page"
                :total-visible="5"
                @input="fetchData($event)"
              ></v-pagination>
            </div>
          </template>
          <!-- End Pagination -->
        </div>
      </div>
    </base-model>
  </div>
</template>

<script>
export default {
  name: "TransactionsCard",

  props: ["id"],

  data() {
    return {
      // ===== Loading
      loading: false,

      // ===== Model
      show: false,

      search: null,
      total: 0,
      rows: [],
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },

        {
          text: this.$t("labels.transaction_id"),
          value: "transaction_id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.title"),
          value: "title",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.price"),
          value: "price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.discount"),
          value: "discount",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.VAT"),
          value: "vat",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.total"),
          value: "total",
          align: "center",
          sortable: false,
        },
      ],
    };
  },

  methods: {
    setRows() {
      this.loading = true;

      this.axios({
        method: "GET",
        url: `transaction-by-moatmer/${this.id}`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
        },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
        })
        .catch((err) => {
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
        });

      this.loading = false;
    },
    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { currentPage: e }),
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      this.setRows();
    },
  },

  watch: {
    [`$route`]() {
      if (this.$route.query.currentPage) {
        this.paginations.current_page = +this.$route.query.currentPage;
        this.setRows();
      } else {
        this.paginations.current_page = 1;
        this.setRows();
      }
    },
    show(newVal) {
      if (newVal) {
        this.setRows();
      }
    },
  },

  created() {
    if (this.$route.query.currentPage) {
      this.paginations.current_page = +this.$route.query.currentPage;
    }
  },
};
</script>

<style lang="scss" scoped>
.transactions_card_content_wrapper {
  .card_title {
    // align-self: flex-end;
    font-family: mediumArFont;
    background-color: var(--main);
    color: var(--white);
    padding: 2px 10px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 15px;
  }
}
</style>
