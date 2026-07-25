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
        search_route="/admins/add"
        :search_title="$t('breadcrumb.admins.add')"
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
              <template v-slot:[`item.image`]="{ item, index }">
                <img
                  @click="show_model_1(item.image)"
                  class="image"
                  @error="imageError(index)"
                  :src="item.image"
                  v-if="item.image"
                />
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.username`]="{ item }">
                <span v-if="item.username">
                  {{ item.username }}
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
                  $t("notExist", { name: $t("labels.email") })
                }}</span>
              </template>

              <template v-slot:[`item.phone`]="{ item }">
                <span v-if="item.phone_complete_form">
                  {{ item.phone_complete_form }}
                </span>

                <span class="redColor fontBold" v-else
                  >{{ $t("noPhoneFound") }}
                </span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <template v-slot:[`item.is_admin_active_user`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="adminس"
                  :item="item"
                  value="is_admin_active_user"
                  type="active"
                />

                <span
                  class="status pt-2"
                  :class="item.is_admin_active_user ? 'active' : 'inactive'"
                >
                  {{
                    item.is_admin_active_user ? $t("active") : $t("inactive")
                  }}
                </span>
              </template>

              <!-- Select actions-->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="_actions">
                  <!-- <v-icon class="show" small @click="showItem(item)">
                    fal fa-eye
                  </v-icon> -->
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
                    name="admins"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.admins.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.admins.all") }}</span>
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
          href: "/"
        },
        {
          text: this.$t("breadcrumb.admins.title"),
          disabled: false,
          href: "/admins/show-all"
        },
        {
          text: this.$t("breadcrumb.admins.all"),
          disabled: true,
          href: ""
        }
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
          sortable: false
        },
        {
          text: this.$t("labels.image"),
          align: "center",
          value: "image",
          sortable: false
        },
        {
          text: this.$t("labels.username"),
          value: "username",
          align: "center"
        },

        {
          text: this.$t("labels.email"),
          align: "center",
          value: "email",
          sortable: false
        },
        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone",
          sortable: false
        },
        {
          text: this.$t("labels.is_admin_active_user"),
          align: "center",
          value: "is_admin_active_user",
          sortable: false
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false
        }
      ],
      chartsData: null,
      asideIsActive: false,
      // ========== Filter
      inputs: [
        {
          keyName: "keyword"
        }
      ],
      model_1: {
        show_model: false,
        model_img_src: ""
      },

      expandData: null
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
    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `admins`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page
        }
      })
        .then((res) => {
          this.paginations.last_page =
            res.data && res.data.meta && res.data.meta.last_page;
          this.paginations.items_per_page =
            res.data && res.data.meta && res.data.meta.per_page;
          this.total = res.data && res.data.meta && res.data.meta.total;
          this.rows = res.data.data;

          // ========== Statistics
          this.chartsData = {
            charts: res.data.statistc,
            percentage: Math.ceil(res.data.statistc?.percentage),
            type: this.tableName
          };

          this.loading = false;
        })
        .catch((err) => {
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message
          });
          this.loading = false;
        });
    },
    imageError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },

    // ===== Toggle Aside
    toggleAside() {
      this.asideIsActive = !this.asideIsActive;
    },
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

    showItem(item) {
      this.$router.push({ path: `/admins/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/admins/edit/` + item.id });
    }

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("admins/edit");
    this.canDelete = this.$permission.allowed("admins/delete");
    this.canAdd = this.$permission.allowed("admins/add");
    this.canShow = this.$permission.allowed("admins/show");
    this.canShowAll = this.$permission.allowed("admins/show-all");

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
