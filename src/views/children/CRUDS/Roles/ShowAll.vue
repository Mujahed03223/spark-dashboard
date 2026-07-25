<template>
  <div class="wrraper">
    <!-- Start Breadcrumb -->
    <Breadcrumb
      :canAddNew="!canAdd"
      :items="items"
      search_route="/role/add"
      :search_title="$t('breadcrumb.roles.add')"
      icon="fa-plus"
    />
    <!-- End Breadcrumb -->

    <!-- Start Main Section -->
    <main>
      <v-data-table
        :headers="headers"
        :items="rows"
        :search="search"
        :loading="loading"
        :expanded.sync="expanded"
        :loading-text="$t('table.loadingData')"
        item-key="id"
        :items-per-page="paginations.items_per_page"
        hide-default-footer
        class="thumb strip"
      >
        <!-- ================== You Can use any slots you want ================== -->
        <!-- Select no data State -->
        <template v-slot:no-data>
          {{ $t("table.noData") }}
        </template>

        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <span v-if="item?.name">
            {{ item?.name }}
          </span>
          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
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
              name="role"
              :id="item.id"
              @refresh="rows = $event"
            />
          </div>
        </template>

        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="expandDate fadeIn">
            <span class="expandTitle">{{ $t("labels.extraDetails") }}</span>
            <ul>
              <li v-for="(value, key) of expandData" :key="key">
                <span class="key">{{ key }}</span>
                <span class="value">
                  <template v-if="value != null && value != 'null'">
                    <div v-for="(per, index) in value" :key="index">
                      <p>
                        {{ per.title }}
                      </p>
                    </div>
                  </template>
                  <template v-else-if="value == null || value == 'null'">
                    {{ $t("table.noData") }}
                  </template>
                </span>
              </li>
            </ul>
          </td>
        </template>
        <template v-slot:[`item.extendIcon`]="{ item }">
          <div class="_actions">
            <v-icon class="show" small @click="clickRow(item)">
              fas fa-angle-double-down
            </v-icon>
          </div>
        </template>

        <!-- ======================== Start Top Section ======================== -->
        <template v-slot:top>
          <h3 class="table-title title">
            {{ $t("breadcrumb.roles.title") }}
            <span class="total">({{ total }})</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" dark v-bind="attrs" v-on="on">
                  far fa-info-circle
                </v-icon>
              </template>
              <span> {{ $t("breadcrumb.roles.all") }}</span>
            </v-tooltip>
          </h3>
        </template>
        <!-- ======================== End Top Section ======================== -->
      </v-data-table>
    </main>
    <!-- End Main Section -->

    <!-- Start Pagination -->
    <template>
      <div
        class="pagination_container text-center mb-5 d-flex justify-content-end"
      >
        <v-pagination
          color="primary"
          v-model="paginations.current_page"
          :length="paginations.last_page"
          :total-visible="7"
          @input="fetchData($event)"
        ></v-pagination>
      </div>
    </template>
    <!-- End Pagination -->
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
          text: this.$t("breadcrumb.roles.title"),
          disabled: false,
          href: "/role/show-all"
        },
        {
          text: this.$t("breadcrumb.roles.all"),
          disabled: true,
          href: ""
        }
      ],

      // ========== Top Section
      search: "",

      // ========== Model
      model_1: {
        show_model: false,
        model_img_src: ""
      },

      // ========== Your Data
      rows: [], // injected in created
      expanded: [],
      expandData: [],
      noExpand: false,

      // ========== Loding
      loading: false,
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },
        {
          text: this.$t("labels.name"),
          align: "center",
          value: "name",
          sortable: false
        },
        {
          text: this.$t("labels.extra"),
          value: "extendIcon",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false
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
    },

    // img Model
    show_model_1(e) {
      this.model_1.model_img_src = e.target.src;
      this.model_1.show_model = true;
    },

    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: "/role/add" });
    },
    showItem(item) {
      this.$router.push({ path: "/role/show/" + item.id });
    },
    editItem(item) {
      this.$router.push({ path: "/role/edit/" + item.id });
    },
    // ===== Delete

    // ==================== End CRUD ====================

    mapItem(data) {
      console.log(data);
      this.expandData = {
        [this.$t("labels.permissions")]: data.permission
      };
    },

    clickRow(rowData) {
      if (this.noExpand) return;
      const indexExpanded = this.expanded.findIndex((i) => i === rowData);
      if (indexExpanded > -1) {
        // Exisit
        this.expanded.splice(indexExpanded, 1);
      } else {
        this.expanded = [];
        this.expanded.push(rowData);
        this.mapItem(rowData);
        // this.expandData = rowData
      }
    },
    // Set Rows
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: "role",
        params: { page: this.paginations.current_page }
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message
          });
        });
    }
  },

  // ======= hooks
  created() {
    // console.log(this.canEdit);

    this.canEdit = this.$permission.allowed("role/edit");
    this.canDelete = this.$permission.allowed("role/delete");
    this.canAdd = this.$permission.allowed("role/add");
    this.canShow = this.$permission.allowed("role/show");
    this.canShowAll = this.$permission.allowed("role/show-all");

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

<style lang="scss">
.v-data-table td.expandDate ul li {
  overflow-y: scroll;
  width: 50%;
  margin: auto;
  height: 200px;
}
</style>
