<template>
  <div class="wrraper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>
    <template>
      <Breadcrumb :canAddNew="false" :items="items" />
      <the-filter :inputs="inputs" :status="clientStatus" />

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

              <template v-slot:[`item.image`]="{ item, index }">
                <img
                  class="image"
                  :src="item.image"
                  @error="imageError(index)"
                  @click="show_model_1(item.image)"
                  v-if="item.image"
                />
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.name`]="{ item }">
                <span v-if="item.name">
                  {{ item.name }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.country`]="{ item }">
                <span v-if="item.country">
                  {{ item.country.name }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.email`]="{ item }">
                <span v-if="item.email">
                  {{ item.email }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.phone_code`]="{ item }">
                <span v-if="item.phone_code">
                  {{ item.phone_code }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.phone`]="{ item }">
                <span v-if="item.phone">
                  {{ item.phone }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.gender`]="{ item }">
                <span v-if="item.gender">
                  {{ item.gender === "male" ? $t("male") : $t("female") }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.is_active`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="activate-client"
                  :item="item"
                  value="is_active"
                  type="active"
                />

                <span
                  class="status"
                  :class="item.is_active ? 'active' : 'inactive'"
                >
                  {{ item.is_active ? $t("active") : $t("inactive") }}
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
                    class="edit"
                    v-if="!canEdit"
                    small
                    @click="editItem(item)"
                  >
                    fal fa-edit
                  </v-icon>
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.clients.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.clients.all") }}</span>
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
            v-if="model_1.model_img_src"
            :src="model_1.model_img_src"
            class="img-fluid"
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
          text: this.$t("breadcrumb.clients.title"),
          disabled: false,
          href: "/clients/show-all",
        },
        {
          text: this.$t("breadcrumb.clients.all"),
          disabled: true,
          href: "",
        },
      ],

      total: 0,
      rows: [],
      search: null,

      clientStatus: [
        {
          id: "",
          name: this.$t(`all`),
        },
        {
          id: "active",
          name: this.$t(`status.active`),
        },
        {
          id: "inactive",

          name: this.$t(`status.inactive`),
        },
        {
          id: "most_demanding",

          name: this.$t(`status.most_demanded`),
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
          text: this.$t("labels.image"),
          align: "center",
          value: "image",
          sortable: false,
        },
        {
          text: this.$t("labels.name"),
          value: "name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.country"),
          value: "country",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.email"),
          value: "email",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.phone_code"),
          value: "phone_code",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.phone"),
          value: "phone",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.gender"),
          value: "gender",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.status"),
          value: "is_active",
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
      chartsData: null,
      asideIsActive: false,
      // ========== Filter
      inputs: [
        {
          keyName: "keyword",
        },

        {
          keyName: "status",
        },
      ],
      statistics: [],
      model_1: {
        show_model: false,
        model_img_src: "",
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
    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },

    setRows() {
      this.loading = true;

      this.axios({
        method: "GET",
        url: "clients",
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
          status: this.$route.query.status,
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

    imageError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },

    // ==================== Start CRUD ====================
    editItem(item) {
      this.$router.push({ path: `/clients/edit/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("update-client");
    this.canDelete = this.$permission.allowed("delete-client");
    this.canAdd = this.$permission.allowed("create-client");
    this.canShow = this.$permission.allowed("show-client");
    this.canShowAll = this.$permission.allowed("index-client");

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
