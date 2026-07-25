<template>
  <div class="wrapper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>

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

              <template v-slot:[`item.title`]="{ item }">
                <span v-if="item.title">
                  {{ item.title }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.desc`]="{ item }">
                <div class="_actions" v-if="item.desc">
                  <v-icon class="show" small @click="show_description(item.desc)">
                    fas fa-eye
                  </v-icon>
                </div>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.ordering`]="{ item }">
                <span v-if="item.ordering">
                  {{ item.ordering }}
                </span>
                <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="update-main-category-status"
                  :item="item"
                  value="status"
                  type="active"
                />

                <span class="status pt-2" :class="item.status ? 'active' : 'inactive'">
                  {{ item.status ? $t("active") : $t("inactive") }}
                </span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- Select actions-->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="_actions">
                  <v-icon class="edit" v-if="!canEdit" small @click="editItem(item)">
                    fal fa-edit
                  </v-icon>
                  <deleter
                    v-if="!canDelete"
                    :items="rows"
                    name="main-categories"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.mainCategories.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.mainCategories.all") }}</span>
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

      <!-- Start Desc_Model -->
      <base-model :show="showDescription" @close="closeDescModal">
        <div>
          <p class="with_border" v-html="descriptionData || $t('notFound')"></p>
        </div>
      </base-model>
      <!-- End Desc_Model -->
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
          text: this.$t("breadcrumb.mainCategories.title"),
          disabled: false,
          href: "/main-categories/show-all",
        },
        {
          text: this.$t("breadcrumb.mainCategories.all"),
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
          value: "title",
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
          text: this.$t("labels.desc"),
          value: "desc",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.status"),
          value: "status",
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

      model_1: {
        show_model: false,
        model_img_src: "",
      },

      showDescription: false,
      descriptionData: "",
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
    // ===== showDescription
    show_description(item) {
      this.showDescription = true;
      this.descriptionData = item;
    },

    closeDescModal() {
      this.showDescription = !this.showDescription;
    },

    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `main-categories`,
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

    editItem(item) {
      this.$router.push({ path: `/main-categories/edit/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    // console.log(this.canEdit);

    this.canEdit = this.$permission.allowed("main-categories/edit");
    this.canDelete = this.$permission.allowed("main-categories/delete");
    this.canAdd = this.$permission.allowed("main-categories/add");

    this.canShow = this.$permission.allowed("main-categories/show");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
