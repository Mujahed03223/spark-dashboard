<template>
  <div class="wrapper">
    <template>
      <Breadcrumb :items="items" />
      <the-filter :inputs="inputs" />

      <div class="row">
        <div class="">
          <main>
            <!-- statistics -->
            <div class="row g-4 mb-5">
              <div
                v-for="(card, index) in statistics"
                :key="index"
                class="col-md-4 col-lg-3"
              >
                <simple-card classes="w-100">
                  <statistics-card :item="card" :color="getRandomColor()" />
                </simple-card>
              </div>
            </div>

            <!-- Replace table with cards grid -->
            <h3 class="table-title title mb-4">
              {{ $t("breadcrumb.financialAnalyses.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span>{{ $t("breadcrumb.financialAnalyses.all") }}</span>
              </v-tooltip>
            </h3>

            <template v-if="rows?.length > 0">
              <div class="row g-4">
                <div
                  v-for="(item, index) in rows"
                  :key="index"
                  class="col-md-4 col-lg-3"
                >
                  <v-card class="h-100 rounded-lg">
                    <v-card-text>
                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">#</div>
                        <div class="card-title">
                          {{
                            (paginations.current_page - 1) *
                              paginations.items_per_page +
                            index +
                            1
                          }}
                        </div>
                      </div>

                      <!-- Card content -->
                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">{{ $t("labels.price") }}</div>
                        <div class="card-title">
                          <span v-if="item.price">{{ item.price }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.auction_start_price") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.start_price">{{
                            item.start_price
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.application_fees") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.application_fees">{{
                            item.application_fees
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.delivery_charge") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.delivery_charge">{{
                            item.delivery_charge
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.ownership_transfer_fees") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.ownership_transfer_fees">{{
                            item.ownership_transfer_fees
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.price_percentage") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.price_percentage_value">{{
                            item.price_percentage_value
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">{{ $t("labels.tax_fees") }}</div>
                        <div class="card-title">
                          <span v-if="item.tax_fees_value">{{
                            item.tax_fees_value
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.tracking_fees") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.tracking_fees">{{
                            item.tracking_fees
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.auction_price") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.auction_price">{{
                            item.auction_price
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">{{ $t("labels.total_vat") }}</div>
                        <div class="card-title">
                          <span v-if="item.total_vat">{{
                            item.total_vat
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">{{ $t("labels.total_price") }}</div>
                        <div class="card-title">
                          <span v-if="item.total_price">{{
                            item.total_price
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.auction_start_date") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.start_date">{{
                            item.start_date
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div class="label">
                          {{ $t("labels.auction_finish_date") }}
                        </div>
                        <div class="card-title">
                          <span v-if="item.finish_date">{{
                            item.finish_date
                          }}</span>
                          <span v-else class="redColor fontBold">0</span>
                        </div>
                      </div>

                      <div
                        class="d-flex align-items-center justify-content-between"
                      >
                        <div class="label">{{ $t("labels.ads_status") }}</div>
                        <div class="card-title">
                          <span
                            v-if="item.ads_status"
                            class="statuses"
                            :class="item.ads_status"
                          >
                            {{ $t(`status.${item.ads_status}`) }}
                          </span>
                          <span v-else class="redColor fontBold">{{
                            $t("notFound")
                          }}</span>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </template>
            <template v-else>
              <h3 class="table-title title text-center redColor">
                {{ $t("labels.no_data") }}
              </h3>
            </template>

            <!-- Pagination -->
            <div
              class="pagination_container text-center mb-5 d-flex justify-content-end mt-4"
            >
              <v-pagination
                color="primary"
                v-model="paginations.current_page"
                :length="paginations.last_page"
                :total-visible="5"
                @input="fetchData($event)"
              ></v-pagination>
            </div>
          </main>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // ========== Breadcrumbs
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/"
        },
        {
          text: this.$t("breadcrumb.financialAnalyses.title"),
          disabled: false,
          href: "/financial_analyses/show-all"
        },
        {
          text: this.$t("breadcrumb.financialAnalyses.all"),
          disabled: true,
          href: ""
        }
      ],

      statistics: [],

      total: 0,
      rows: [],
      search: null,
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },

        {
          text: this.$t("labels.price"),
          value: "price",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.auction_start_price"),
          value: "start_price",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.application_fees"),
          value: "application_fees",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.delivery_charge"),
          value: "delivery_charge",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.ownership_transfer_fees"),
          value: "ownership_transfer_fees",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.price_percentage"),
          value: "price_percentage_value",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.tax_fees"),
          value: "tax_fees_value",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.tracking_fees"),
          value: "tracking_fees",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.auction_price"),
          value: "auction_price",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.total_vat"),
          value: "total_vat",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.total_price"),
          value: "total_price",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.auction_start_date"),
          value: "start_date",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.auction_finish_date"),
          value: "finish_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.ads_status"),
          value: "ads_status",
          align: "center",
          sortable: false
        }
      ],

      // ========== Filter
      inputs: [
        // {
        //   keyName: "keyword",
        // },
        {
          keyName: "from_date"
        },
        {
          keyName: "to_date"
        }
      ]
    };
  },
  watch: {
    [`$route`]() {
      if (this.$route.query.page) {
        this.paginations.current_page = +this.$route.query.page;
        this.setRows();
      } else {
        this.paginations.current_page = 1;
        this.setRows();
      }
    }
  },

  methods: {
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `financial_analyses`,
        params: {
          page: this.paginations.current_page,
          per_page: this.$route.query.per_page,
          //   keyword: this.$route.query.keyword,
          date_from: this.$route.query.from_date,
          date_to: this.$route.query.to_date
        }
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data?.data;
          this.loading = false;

          this.loading = false;
          this.statistics = [];
          for (const [key, value] of Object.entries(res.data?.calculations)) {
            console.log(key, "test");
            this.statistics.push({
              title: this.$t(key),
              count: value
            });
          }
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message
          });
          this.loading = false;
        });
    },

    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: e })
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      this.setRows();
    }

    // ==================== End CRUD ====================
  },

  created() {
    this.canShowAll = this.$permission.allowed("financial_analyses/show-all");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    // Set Rows
    if (!this.canShowAll) {
      this.setRows();
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  }
};
</script>

<style scoped>
.label {
  color: #666;
  font-size: 0.9rem;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
}

.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
