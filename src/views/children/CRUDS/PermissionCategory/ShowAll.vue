<template>
  <div class="wrraper">
    <!-- Start Breadcrumb -->
    <Breadcrumb
      :canAddNew="!canAdd"
      :items="items"
      search_route="/permission-categories/add"
      :search_title="$t('breadcrumb.permission-categories.add')"
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
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:no-data>
          {{ $t("table.noData") }}
        </template>
        <template v-slot:[`item.icon`]="{ item }">
          <span v-if="item.icon"><i :class="item.icon"></i> </span>
          <span class="redColor fontBold" v-else>{{
            $t("notExist", { name: "labels.icon" })
          }}</span>
        </template>
        <template v-slot:[`item.key`]="{ item }">
          <span v-if="item.key">{{ $t($t(item.key)) }}</span>

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
              name="permission_category"
              :id="item.id"
              @refresh="rows = $event"
            />
          </div>
        </template>

        <!-- ======================== Start Top Section ======================== -->
        <template v-slot:top>
          <h3 class="table-title title">
            {{ $t("breadcrumb.permission-categories.title") }}
            <span class="total">({{ total }})</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" dark v-bind="attrs" v-on="on">
                  far fa-info-circle
                </v-icon>
              </template>
              <span> {{ $t("breadcrumb.permission-categories.all") }}</span>
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
          text: this.$t("breadcrumb.permission-categories.title"),
          disabled: false,
          href: "/permission-categories/show-all",
        },
        {
          text: this.$t("breadcrumb.permission-categories.all"),
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
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.title") + this.$t("inArabic"),
          value: "ar.name",
          align: "center",
        },

        {
          text: this.$t("labels.title") + this.$t("inEnglish"),
          value: "en.name",
          align: "center",
        },
        {
          text: this.$t("labels.permission_label"),
          value: `permission_label[${this.$i18n.locale}].name`,
          align: "center",
        },

        {
          text: this.$t("labels.icon"),
          value: "icon",
          align: "center",
        },
        {
          text: this.$t("labels.in_menu_status"),

          value: "key",
          align: "center",
        },

        {
          text: this.$t("labels.created_at"),

          value: "created_at",
          align: "center",
        },
        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      // ========== Loding
      loading: false,
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

  computed: {},

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
      this.$router.push({ path: "/permission-categories/add" });
    },

    editItem(item) {
      this.$router.push({ path: "/permission-categories/edit/" + item.id });
    },
    // ===== Delete

    // ==================== End CRUD ====================

    // Set Rows
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: "permission_category",
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
    this.canEdit = this.$permission.allowed("permission-categories/edit/");
    this.canDelete = this.$permission.allowed("permission-categories/delete");
    this.canAdd = this.$permission.allowed("permission-categories/add");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    // Set Rows
    this.setRows();
  },
};
</script>

<style lang="scss"></style>
