<template>
  <div class="wrraper">
    <!-- Start Breadcrumb -->
    <Breadcrumb
      :canAddNew="!canAdd"
      :items="items"
      search_route="/roles/add"
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
        <template v-slot:[`item.icon`]="{ item }">
          <span v-if="item.icon">{{ item.icon }}</span>
          <span class="redColor fontBold" v-else>لا يوجد ايقونة</span>
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
          text: this.$t("breadcrumb.roles.title"),
          disabled: false,
          href: "/roles/show-all",
        },
        {
          text: this.$t("breadcrumb.roles.all"),
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

      // ========== Your Data
      rows: [], // injected in created

      // ========== Loding
      loading: false,
      headers: [
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

    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: "/roles/add" });
    },
    showItem(item) {
      this.$router.push({ path: "/roles/show/" + item.id });
    },
    editItem(item) {
      this.$router.push({ path: "/roles/edit/" + item.id });
    },
    // ===== Delete

    // ==================== End CRUD ====================

    // Set Rows
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: "role",
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
    this.canEdit = this.$permission.allowed("roles/edit/");
    this.canDelete = this.$permission.allowed("roles/delete");
    this.canAdd = this.$permission.allowed("roles/add");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    // Set Rows
    this.setRows();
  },
};
</script>

<style lang="scss"></style>
