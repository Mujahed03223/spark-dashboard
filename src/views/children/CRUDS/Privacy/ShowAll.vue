<template>
  <div class="wrraper">
    <template>
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/privacy/add"
        :search_title="$t('breadcrumb.privacy.add')"
        icon="fa-plus"
      />
      <the-filter :inputs="inputs" />
      <!-- @filterFired="filterFired" -->
      <!-- :custom-filter="helper_filterSearch" -->
      <div class="row">
        <div class="">
          <div class="col-12 mb-2 pt-0">
            <div class="row">
              <simple-card v-for="(card, index) in statistics" :key="index">
                <statistics-card :item="card" :color="getRandomColor()" />
              </simple-card>
            </div>
          </div>
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

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- IsActive -->
              <template v-slot:[`item.status`]="{ item }">
                <!-- <switcher :disabled="canEdit" name="privacy" :item="item" value="is_active" type="active" /> -->
                <span
                  class="status pt-2"
                  :class="item.status ? 'active' : 'inactive'"
                >
                  {{ item.status ? $t("active") : $t("inactive") }}
                </span>
              </template>

              <template v-slot:[`item.is_locked`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="privacy"
                  :item="item"
                  value="is_locked"
                />

                <span
                  class="status"
                  :class="item.is_locked ? 'inactive' : 'active'"
                >
                  {{ item.is_locked ? $t("locked") : $t("unlocked") }}
                </span>
              </template>

              <template v-slot:[`item.is_ban`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="privacy"
                  :item="item"
                  value="is_ban"
                />
                <span
                  class="status"
                  :class="item.is_ban ? 'inactive' : 'active'"
                >
                  {{ item.is_ban ? $t("ban") : $t("inban") }}
                </span>
              </template>

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
                    name="policies"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.privacy.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.privacy.all") }}</span>
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
        <div class="col-xl-3" v-if="false">
          <!-- Start:: Small Screens Charts Button -->

          <!-- End:: Small Screens Charts Button -->
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
          text: this.$t("breadcrumb.privacy.title"),
          disabled: false,
          href: "/privacy/show-all",
        },
        {
          text: this.$t("breadcrumb.privacy.all"),
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
          text: this.$t("labels.title"),
          value: `${this.$i18n.locale}.title`,
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.ordering"),
          value: "ordering",
          align: "center",
          sortable: false,
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
      statistics: [],

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
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `policies`,
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

    editItem(item) {
      this.$router.push({ path: `/privacy/edit/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    // console.log(this.canEdit);

    this.canEdit = this.$permission.allowed("privacy/edit/");
    this.canDelete = this.$permission.allowed("privacy/delete");
    this.canAdd = this.$permission.allowed("privacy/add");

    this.canShow = this.$permission.allowed("privacy/show/");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
