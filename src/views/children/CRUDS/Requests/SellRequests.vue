<template>
  <div class="sell_requests">
    <template>
      <Breadcrumb :items="items" search_route="/requests/sell/show-all" />

      <the-filter :inputs="inputs" />

      <div class="row">
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
            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.customer.name`]="{ item }">
              <span v-if="item.customer.name">
                {{ item.customer.name }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.customer.phone`]="{ item }">
              <span v-if="item.customer.phone">
                {{ item.customer.phone }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.customer.email`]="{ item }">
              <span v-if="item.customer.email">
                {{ item.customer.email }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.property_title`]="{ item }">
              <span v-if="item.property_title">
                {{ item.property_title }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.start_price`]="{ item }">
              <span v-if="item.start_price">
                {{ item.start_price }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <!-- Select no data State -->
            <template v-slot:no-data>
              {{ $t("table.noData") }}
            </template>

            <!-- Select actions-->
            <template v-slot:[`item.actions`]="{ item }">
              <div class="_actions">
                <v-icon
                  class="show"
                  v-if="!canShow"
                  small
                  @click="showItem(item)"
                >
                  fal fa-eye
                </v-icon>
              </div>
            </template>

            <!-- ======================== Start Top Section ======================== -->
            <template v-slot:top>
              <h3 class="table-title title">
                {{ $t("breadcrumb.sell_requests.title") }}
                <span class="total">({{ total }})</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on">
                      far fa-info-circle
                    </v-icon>
                  </template>
                  <span> {{ $t("breadcrumb.sell_requests.all") }}</span>
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
          text: this.$t("labels.client_name"),
          value: "customer.name",
          align: "center",
        },

        {
          text: this.$t("labels.client_email"),
          value: "customer.email",
          align: "center",
        },
        {
          text: this.$t("labels.client_phone"),
          value: "customer.phone",
          align: "center",
        },
        {
          text: this.$t("labels.property_title"),
          value: "property_title",
          align: "center",
        },
        {
          text: this.$t("labels.start_price"),
          value: "start_price",
          align: "center",
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      // ========== Filter
      inputs: [
        {
          keyName: "keyword",
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
        url: `requests/sell`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
          // from: this.$route.query.start_date,
          // to: this.$route.query.end_date,
          // status: this.$route.query.status,
        },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
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
        query: Object.assign({}, this.$route.query, { page: e }),
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      this.setRows();
    },

    showItem(item) {
      this.$router.push({ path: `/requests/sell/show/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("requests/sell/edit/");
    this.canDelete = this.$permission.allowed("requests/sell/delete");
    this.canAdd = this.$permission.allowed("requests/sell/add");

    this.canShow = this.$permission.allowed("requests/sell/show/");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
