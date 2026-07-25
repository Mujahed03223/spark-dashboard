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
        search_route="/discount-coupons/add"
        :search_title="$t('breadcrumb.coupons.add')"
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

              <template v-slot:[`item.code`]="{ item }">
                <span v-if="item.code">
                  {{ item.code }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.start_date`]="{ item }">
                <span v-if="item.start_date">
                  {{ item.start_date }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.expiry_date`]="{ item }">
                <span v-if="item.expiry_date">
                  {{ item.expiry_date }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.usage_limit`]="{ item }">
                <span v-if="item.usage_limit">
                  {{ item.usage_limit }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.discount_type`]="{ item }">
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

              <template v-slot:[`item.discount_amount`]="{ item }">
                <span v-if="item.discount_amount">
                  {{ item.discount_amount }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <span
                  class="status pt-2"
                  :class="item.status ? 'active' : 'inactive'"
                >
                  {{ item.status ? $t("active") : $t("inactive") }}
                </span>
              </template>

              <!-- <template v-slot:[`item.status`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="change_coupon_status"
                  :item="item"
                  value="status"
                  type="active"
                />

                <span
                  class="status pt-2"
                  :class="item.status ? 'active' : 'inactive'"
                >
                  {{ item.status ? $t("active") : $t("inactive") }}
                </span>
              </template> -->

              <!-- Select actions-->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="_actions">
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
                    name="delete_coupon"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.coupons.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.coupons.all") }}</span>
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

      <!-- Start Image_Model -->
      <base-model
        @close="model_1.show_model = false"
        :show="model_1.show_model"
      >
        <div class="image">
          <img
            class="img-fluid"
            v-if="model_1.model_img_src"
            :src="model_1.model_img_src"
            alt="..."
          />
        </div>
      </base-model>
      <!-- End Image_Model -->
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
          text: this.$t("breadcrumb.coupons.title"),
          disabled: false,
          href: "/discount-coupons/show-all",
        },
        {
          text: this.$t("breadcrumb.coupons.all"),
          disabled: true,
          href: "",
        },
      ],
      total: 0,
      upper_charts: null,
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
          text: this.$t("labels.code"),
          value: "code",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.start_date"),
          align: "center",
          value: "start_date",
          sortable: false,
        },

        {
          text: this.$t("labels.end_date"),
          align: "center",
          value: "expiry_date",
          sortable: false,
        },
        {
          text: this.$t("labels.usage_times"),
          align: "center",
          value: "usage_limit",
          sortable: false,
        },
        {
          text: this.$t("labels.discount_type"),
          align: "center",
          value: "discount_type",
          sortable: false,
        },
        {
          text: this.$t("labels.discount_amount"),
          align: "center",
          value: "discount_amount",
          sortable: false,
        },
        {
          text: this.$t("labels.is_active"),
          align: "center",
          value: "status",
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
        // {
        //   keyName: "start_date",
        // },
        // {
        //   keyName: "end_date",
        // },
      ],
      model_1: {
        show_model: false,
        model_img_src: "",
      },

      expandData: null,
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
    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `coupons`,
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
      this.$router.push({ path: `/discount-coupons/edit/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("update-coupon");
    this.canDelete = this.$permission.allowed("delete-coupon");
    this.canAdd = this.$permission.allowed("create-coupon");
    this.canShow = this.$permission.allowed("show-coupon");
    this.canShowAll = this.$permission.allowed("index-coupon");

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
