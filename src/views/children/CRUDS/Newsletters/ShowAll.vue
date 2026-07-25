<template>
  <div class="newsletters">
    <template>
      <Breadcrumb :items="items" search_route="/newsletters/show-all" />

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

            <template v-slot:[`item.email`]="{ item }">
              <span v-if="item.email">
                {{ item.email }}
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
                <deleter
                  v-if="!canDelete"
                  :items="rows"
                  name="newsletters"
                  :id="item.id"
                  @refresh="rows = $event"
                />
              </div>
            </template>

            <!-- ======================== Start Top Section ======================== -->
            <template v-slot:top>
              <h3 class="table-title title">
                {{ $t("breadcrumb.newsletters.title") }}
                <span class="total">({{ total }})</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on">
                      far fa-info-circle
                    </v-icon>
                  </template>
                  <span> {{ $t("breadcrumb.newsletters.all") }}</span>
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
          text: this.$t("breadcrumb.newsletters.title"),
          disabled: false,
          href: "/newsletters/show-all",
        },
        {
          text: this.$t("breadcrumb.newsletters.all"),
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
          text: this.$t("labels.email"),
          value: "email",
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
        url: `newsletters`,
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

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("newsletters/edit/");
    this.canDelete = this.$permission.allowed("newsletters/delete");
    this.canAdd = this.$permission.allowed("newsletters/add");

    this.canShow = this.$permission.allowed("newsletters/show/");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
