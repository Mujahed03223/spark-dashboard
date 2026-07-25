<template>
  <div class="wallets_all">
    <template>
      <Breadcrumb
        :items="items"
        :canAddNew="!canCharge"
        search_route="/wallets/charge"
        :search_title="$t('breadcrumb.wallets.charge')"
        icon="fa-plus"
      />

      <the-filter :inputs="inputs" />

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

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <template v-slot:[`item.userName`]="{ item }">
            <span v-if="item.user">
              {{ item.user.name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.userPhone`]="{ item }">
            <span v-if="item.user">
              {{ item.user.phone }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.userEmail`]="{ item }">
            <span v-if="item.user">
              {{ item.user.email }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.amount`]="{ item }">
            <span v-if="item.amount">
              {{ item.amount }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.pending_amount`]="{ item }">
            <span v-if="item.pending_amount">
              {{ item.pending_amount }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

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
                name="delete_wallet"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.wallets.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.wallets.all") }}</span>
              </v-tooltip>
            </h3>
            <!-- Delete dialog -->

            <!-- Add & Delete -->
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
    </template>
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
          text: this.$t("breadcrumb.wallets.title"),
          disabled: false,
          href: "/wallets/show-all",
        },
        {
          text: this.$t("breadcrumb.wallets.all"),
          disabled: true,
          href: "",
        },
      ],

      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.moatamer"),
          align: "center",
          value: "userName",
          sortable: false,
        },

        {
          text: this.$t("labels.moatamerPhone"),
          align: "center",
          value: "userPhone",
          sortable: false,
        },

        {
          text: this.$t("labels.moatamerEmail"),
          align: "center",
          value: "userEmail",
          sortable: false,
        },

        {
          text: this.$t("labels.monyAmount"),
          align: "center",
          value: "amount",
          sortable: false,
        },
        {
          text: this.$t("labels.pending_amount"),
          align: "center",
          value: "pending_amount",
          sortable: false,
        },

        // {
        //   text: this.$t("labels.control"),
        //   value: "actions",
        //   align: "center",
        //   sortable: false,
        // },
      ],

      rows: [],
      search: null,

      inputs: [
        {
          keyName: "keyword",
        },
      ],
    };
  },

  methods: {
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `wallets`,
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
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },

    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: `/wallets/charge` });
    },
    showItem(item) {
      this.$router.push({ path: `/wallets/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/wallets/edit/` + item.id });
    },

    // ===== Delete

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
  created() {
    this.canEdit = this.$permission.allowed("update-wallet");
    this.canDelete = this.$permission.allowed("delete-wallet");
    this.canAdd = this.$permission.allowed("create-wallet");
    this.canShow = this.$permission.allowed("show-wallet");
    this.canShowAll = this.$permission.allowed("index-wallet");

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
