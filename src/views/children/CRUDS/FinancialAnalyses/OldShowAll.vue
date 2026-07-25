<template>
  <div class="wrapper">
    <template>
      <Breadcrumb :items="items" />
      <the-filter :inputs="inputs" />

      <!-- @filterFired="filterFired" -->
      <!-- :custom-filter="helper_filterSearch" -->

      <div class="row">
        <div class="">
          <main>
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

              <template v-slot:[`item.application_fees`]="{ item }">
                <span v-if="item.application_fees">
                  {{ item.application_fees }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.start_price`]="{ item }">
                <span v-if="item.start_price">
                  {{ item.start_price }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.auction_price`]="{ item }">
                <span v-if="item.auction_price">
                  {{ item.auction_price }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.delivery_charge`]="{ item }">
                <span v-if="item.delivery_charge">
                  {{ item.delivery_charge }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.ownership_transfer_fees`]="{ item }">
                <span v-if="item.ownership_transfer_fees">
                  {{ item.ownership_transfer_fees }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.price`]="{ item }">
                <span v-if="item.price">
                  {{ item.price }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.price_percentage_value`]="{ item }">
                <span v-if="item.price_percentage_value">
                  {{ item.price_percentage_value }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.tax_fees_value`]="{ item }">
                <span v-if="item.tax_fees_value">
                  {{ item.tax_fees_value }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.total_price`]="{ item }">
                <span v-if="item.total_price">
                  {{ item.total_price }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.total_vat`]="{ item }">
                <span v-if="item.total_vat">
                  {{ item.total_vat }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.tracking_fees`]="{ item }">
                <span v-if="item.tracking_fees">
                  {{ item.tracking_fees }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.start_date`]="{ item }">
                <span v-if="item.start_date">
                  {{ item?.start_date }}
                  <!-- {{ moment(item?.start_date).format("YYYY-MM-DD HH:mm") }} -->
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.finish_date`]="{ item }">
                <span v-if="item.finish_date">
                  {{ item?.finish_date }}
                  <!-- {{ moment(item?.finish_date).format("YYYY-MM-DD HH:mm") }} -->
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.ads_status`]="{ item }">
                <div v-if="item.ads_status">
                  <span class="statuses" :class="item.ads_status">
                    {{ $t(`status.${item.ads_status}`) }}
                  </span>
                </div>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.financialAnalyses.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.financialAnalyses.all") }}</span>
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
          href: "/",
        },
        {
          text: this.$t("breadcrumb.financialAnalyses.title"),
          disabled: false,
          href: "/financial_analyses/show-all",
        },
        {
          text: this.$t("breadcrumb.financialAnalyses.all"),
          disabled: true,
          href: "",
        },
      ],

      total: 0,
      rows: [],
      search: null,
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },

        {
          text: this.$t("labels.price"),
          value: "price",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.auction_start_price"),
          value: "start_price",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.application_fees"),
          value: "application_fees",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.delivery_charge"),
          value: "delivery_charge",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.ownership_transfer_fees"),
          value: "ownership_transfer_fees",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.price_percentage"),
          value: "price_percentage_value",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.tax_fees"),
          value: "tax_fees_value",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.tracking_fees"),
          value: "tracking_fees",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.auction_price"),
          value: "auction_price",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.total_vat"),
          value: "total_vat",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.total_price"),
          value: "total_price",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.auction_start_date"),
          value: "start_date",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.auction_finish_date"),
          value: "finish_date",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.ads_status"),
          value: "ads_status",
          align: "center",
          sortable: false,
        },
      ],

      // ========== Filter
      inputs: [
        // {
        //   keyName: "keyword",
        // },
        {
          keyName: "from_date",
        },
        {
          keyName: "to_date",
        },
      ],
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
    },
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
          date_to: this.$route.query.to_date,
        },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
          let message = err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },

    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: e }),
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      this.setRows();
    },

    // ==================== End CRUD ====================
  },

  created() {
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
