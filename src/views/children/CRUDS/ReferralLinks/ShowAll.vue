<template>
  <div class="wrraper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>
    <!-- Start Breadcrumb -->

    <template>
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/referral-links/add"
        :search_title="$t('breadcrumb.referralLinks.add')"
        icon="fa-plus"
      />

      <the-filter :inputs="inputs" />
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

              <template v-slot:[`item.index`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.marketer`]="{ item }">
                <span v-if="item.marketer">
                  {{ item.marketer }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.city`]="{ item }">
                <span v-if="item.city">
                  {{ item.city.name }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.type`]="{ item }">
                <span v-if="item.type">
                  {{
                    item.type === "percentage"
                      ? $t("labels.percentage")
                      : $t("labels.amount")
                  }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.value`]="{ item }">
                <span v-if="item.value">
                  {{ item.value }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
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

                  <v-icon
                    class="edit"
                    v-if="!canEdit"
                    small
                    @click="editItem(item)"
                  >
                    fal fa-edit
                  </v-icon>
                  <deleter
                    v-if="!canDelete"
                    :items="rows"
                    name="delete-referral-link"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.referralLinks.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.referralLinks.all") }}</span>
                  </v-tooltip>
                </h3>
                <!-- Delete dialog -->

                <!-- Add & Delete -->
                <v-row>
                  <v-col cols="12" sm="8"></v-col>
                </v-row>
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
        <div class="col-xl-3" v-if="false">
          <!-- Start:: Small Screens Charts Button -->

          <!-- End:: Small Screens Charts Button -->

          <ChartsAside
            v-if="chartsData"
            :show="asideIsActive"
            @toggleAside="toggleAside"
            :chartsData="chartsData"
          />

          <!-- End:: Aside -->
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
          text: this.$t("breadcrumb.referralLinks.title"),
          disabled: false,
          href: "/referral-links/show-all",
        },
        {
          text: this.$t("breadcrumb.referralLinks.all"),
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
          text: this.$t("labels.name"),
          value: "marketer",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.city"),
          align: "center",
          value: "city",
          sortable: false,
        },

        {
          text: this.$t("labels.type"),
          align: "center",
          value: "type",
          sortable: false,
        },
        {
          text: this.$t("labels.value"),
          align: "center",
          value: "value",
          sortable: false,
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      chartsData: null,
      asideIsActive: false,
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
        url: `referral-links`,
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

          // ========== Statistics
          this.chartsData = {
            charts: res.data.statistc,
            percentage: Math.ceil(res.data.statistc?.percentage),
            type: this.tableName,
          };

          this.loading = false;
        })
        .catch((err) => {
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },

    // ===== Toggle Aside
    toggleAside() {
      this.asideIsActive = !this.asideIsActive;
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

    editItem(item) {
      this.$router.push({ path: `/referral-links/edit/` + item.id });
    },
    showItem(item) {
      this.$router.push({ path: `/referral-links/show/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("update-referral-links");
    this.canDelete = this.$permission.allowed("delete-referral-links");
    this.canAdd = this.$permission.allowed("create-referral-links");
    this.canShow = this.$permission.allowed("show-referral-links");
    this.canShowAll = this.$permission.allowed("index-referral-links");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }

    // Set Rows
    if (!this.canShowAll) {
      this.setRows();
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
