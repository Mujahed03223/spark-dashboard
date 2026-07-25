<template>
  <div class="wrraper">
    <!-- Start Breadcrumb -->
    <Breadcrumb
      :items="items"
      search_route="/permissions/add"
      :search_title="$t('breadcrumb.permissions.add')"
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
        :loading-text="$t('table.loadingData')"
        item-key="id"
        :expanded.sync="expanded"
        :items-per-page="paginations.items_per_page"
        hide-default-footer
        class="thumb strip"
      >
        <!-- ================== You Can use any slots you want ================== -->
        <!-- Select no data State -->
        <template v-slot:no-data>
          {{ $t("table.noData") }}
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <span v-if="item.name">
            {{ item.name }}
          </span>
          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </template>
        <!-- Select actions-->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="_actions">
            <v-icon class="edit" v-if="!canEdit" small @click="editItem(item)">
              fal fa-edit
            </v-icon>
            <!-- <deleter
              v-if="!canDelete"
              :items="rows"
              name="permission"
              :id="item.id"
              @refresh="refresh()"
            /> -->
          </div>
        </template>
        <template v-slot:[`item.show_in_side_bar`]="{ item }">
          <span :class="item.show_in_side_bar ? 'active' : 'inactive'">{{
            item.show_in_side_bar
              ? $t("labels.is_side_show")
              : `${$t("labels.not")} ${$t("labels.is_side_show")}`
          }}</span>
        </template>
        <template v-slot:[`item.is_control_permission`]="{ item }">
          <span
            :class="item.is_control_permission ? 'active' : 'inactive'"
            :title="$t('labels.is_control_description')"
            >{{
              item.is_control_permission
                ? $t("labels.is_control_permissions")
                : `${$t("labels.not")} ${$t("labels.is_control_permissions")}`
            }}</span
          >
        </template>
        <template v-slot:[`item.extendIcon`]="{ item }">
          <div class="_actions">
            <a role="button" @click="clickRow(item)">
              <span class="me-2">
                {{ $t("breadcrumb.permissions.all") }}
              </span>
              <i class="show fas fa-angle-double-down" small> </i>
            </a>
          </div>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="expandDate fadeIn">
            <span class="expandTitle">{{ $t("labels.extraDetails") }}</span>
            <v-data-table
              :headers="headers"
              :items="expandData"
              item-key="id"
              hide-default-header
              hide-default-footer
              class="thumb strip"
            >
              <!-- ================== You Can use any slots you want ================== -->
              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>
              <template v-slot:[`item.icon`]="{ item }">
                <span v-if="item.icon"><i :class="item.icon"></i> </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notExist", { name: $t("labels.icon") })
                }}</span>
              </template>
              <template v-slot:[`item.show_in_side_bar`]="{ item }">
                <span :class="item.show_in_side_bar ? 'active' : 'inactive'">{{
                  item.show_in_side_bar
                    ? $t("labels.is_side_show")
                    : `${$t("labels.not")} ${$t("labels.is_side_show")}`
                }}</span>
              </template>
              <template v-slot:[`item.is_control_permission`]="{ item }">
                <span
                  :class="item.is_control_permission ? 'active' : 'inactive'"
                  :title="$t('labels.is_control_description')"
                  >{{
                    item.is_control_permission
                      ? $t("labels.is_control_permissions")
                      : `${$t("labels.not")} ${$t(
                          "labels.is_control_permissions"
                        )}`
                  }}</span
                >
              </template>

              <!-- ======================== Start Top Section ======================== -->

              <!-- ======================== End Top Section ======================== -->
            </v-data-table>
          </td>
        </template>

        <!-- ======================== Start Top Section ======================== -->
        <template v-slot:top>
          <h3 class="table-title title">
            {{ $t("breadcrumb.permissions.title") }}
            <span class="total">({{ rows.length }})</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" dark v-bind="attrs" v-on="on">
                  far fa-info-circle
                </v-icon>
              </template>
              <span> {{ $t("breadcrumb.permissions.all") }}</span>
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
          :total-visible="5"
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
          href: "/",
        },
        {
          text: this.$t("breadcrumb.permissions.title"),
          disabled: false,
          href: "/permissions/show-all",
        },
        {
          text: this.$t("breadcrumb.permissions.all"),
          disabled: true,
          href: "",
        },
      ],

      // ========== Top Section
      search: "",

      // ========== Model
      model_1: {
        show_model: false,
        model_img_src: "",
      },
      noExpand: false,

      // ========== Your Data
      rows: [], // injected in created
      expanded: [],
      expandData: [],
      // ========== Loding
      loading: false,
      headers: [
        {
          text: this.$t("labels.title"),
          align: "center",
          value: "title",
          sortable: false,
        },
        {
          text: this.$t("labels.name"),
          align: "center",
          value: "name",
          sortable: false,
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      mapItem(data) {
        this.expandData = data.permissions;
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

    // img Model
    show_model_1(e) {
      this.model_1.model_img_src = e.target.src;
      this.model_1.show_model = true;
    },
    refresh() {
      this.setRows();
    },
    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: "/permissions/add" });
    },
    showItem(item) {
      this.$router.push({ path: "/permissions/show/" + item.id });
    },
    editItem(item) {
      this.$router.push({ path: "/permissions/edit/" + item.id });
    },
    // ===== Delete

    // ==================== End CRUD ====================

    // Set Rows
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: "permissions",
        params: { page: this.paginations.current_page },
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
            message: message,
          });
        });
    },
  },

  // ======= hooks
  created() {
    this.canEdit = this.$permission.allowed("permission/edit");
    this.canDelete = this.$permission.allowed("permission/delete");
    this.canAdd = this.$permission.allowed("permission/add");
    this.canShow = this.$permission.allowed("permission/show");
    this.canShowAll = this.$permission.allowed("permission/show-all");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    if (!this.canShowAll) {
      this.setRows();
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>

<style lang="scss"></style>

