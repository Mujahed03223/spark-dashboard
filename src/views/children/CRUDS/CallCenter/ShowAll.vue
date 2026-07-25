<template>
  <div class="wrraper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>

    <template>
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/callcenter/add"
        :search_title="$t('breadcrumb.callcenter.add')"
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

          <!-- <div v-if="false" class="d-flex justify-content-end align-items-center gap-4 mb-5">
            <a
              class="btn btn-primary py-3 text-white"
              :href="`${baseUrl}export_clients`"
              target="_blank"
            >
              {{ $t("labels.importExl") }}
            </a>

            <label for="exportExl" class="btn btn-primary py-3">
              {{ $t("labels.exportExl") }}
            </label>
            <input
              type="file"
              id="exportExl"
              class="d-none"
              @change="exportExcl($event)"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div> -->

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

              <template v-slot:[`item.name`]="{ item }">
                <router-link
                  v-if="item.full_name"
                  :to="`/callcenter/show/${item?.id}`"
                >
                  <span>
                    {{ item.full_name }}
                  </span>
                </router-link>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.gender`]="{ item }">
                <span v-if="item.gender">{{ $t(item.gender) }}</span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.phone_complete_form`]="{ item }">
                <span v-if="item.phone_complete_form"
                  ><bdi>{{ item.phone_complete_form }}</bdi></span
                >
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

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- IsActive -->
              <template v-slot:[`item.is_admin_active_user`]="{ item }">
                <!-- <switcher
                  :disabled="canEdit"
                  name="callcenter"
                  :item="item"
                  value="is_active"
                  type="active"
                /> -->
                <span
                  class="status pt-2"
                  :class="item.is_admin_active_user ? 'active' : 'inactive'"
                >
                  {{
                    item.is_admin_active_user ? $t("active") : $t("inactive")
                  }}
                </span>
              </template>
              <template v-slot:[`item.is_active`]="{ item }">
                <!-- <switcher
                  :disabled="canEdit"
                  name="callcenter"
                  :item="item"
                  value="is_active"
                  type="active"
                /> -->
                <span
                  class="status pt-2"
                  :class="item.is_verify ? 'active' : 'inactive'"
                >
                  {{ item.is_verify ? $t("active") : $t("inactive") }}
                </span>
              </template>

              <template v-slot:[`item.is_locked`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="callcenter"
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
                <!-- <switcher
                  :disabled="canEdit"
                  name="callcenter"
                  :item="item"
                  value="is_ban"
                /> -->
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
                    name="callcenter"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.callcenter.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.callcenter.all") }}</span>
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
      baseUrl: process.env.VUE_APP_BASE_URL,
      // ========== Breadcrumbs
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.callcenter.title"),
          disabled: false,
          href: "/callcenter/show-all",
        },
        {
          text: this.$t("breadcrumb.callcenter.all"),
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
          text: "الصورة",
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
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone_complete_form",
          sortable: false,
        },
        // {
        //   text: this.$t("labels.email"),
        //   value: "email",
        //   align: "center",
        //   sortable: false,
        // },
        // {
        //   text: this.$t("labels.gender"),
        //   value: "gender",
        //   align: "center",
        //   sortable: true,
        // },
        // {
        //   text: this.$t("labels.created_at"),
        //   value: "created_at",
        //   align: "center",
        //   sortable: true,
        // },
        {
          text: this.$t("labels.is_admin_active_user"),
          align: "center",
          value: "is_admin_active_user",
          sortable: true,
        },
        {
          text: this.$t("labels.activation"),
          align: "center",
          value: "is_active",
          sortable: true,
        },
        // {
        //   text: this.$t("labels.is_locked"),
        //   align: "center",
        //   value: "is_locked",
        //   sortable: true,
        // },
        {
          text: this.$t("labels.is_ban"),
          align: "center",
          value: "is_ban",
          sortable: true,
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
      statistics: [],
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
        url: `callcenter`,
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
    imageError(index) {
      this.rows[index].avatar = require("@/assets/media/images/logo/logo.png");
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

    showItem(item) {
      this.$router.push({ path: `/callcenter/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/callcenter/edit/` + item.id });
    },

    // ==================== End CRUD ====================

    importExcl() {
      this.axios({
        method: "GET",
        url: `export_clients`,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async exportExcl(event) {
      const data = new FormData();
      data.append("clients_file", event.target.files[0]);

      await this.axios({
        method: "POST",
        url: `import`,
        data: data,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },

  created() {
    // console.log(this.canEdit);

    this.canEdit = this.$permission.allowed("callcenter/edit/");
    this.canDelete = this.$permission.allowed("callcenter/delete");
    this.canAdd = this.$permission.allowed("callcenter/add");

    this.canShow = this.$permission.allowed("callcenter/show/");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>

<style lang="scss">
// .tabsss {
//   .v-item-group {
//     background-color: transparent !important;
//     box-shadow: 0px 5px 14px rgb(0 0 0 / 5%);

//     .v-tabs-bar__content {
//       .v-tab {
//         padding-block: 15px;
//         color: var(--main) !important;
//         &.v-tab-active {
//           background: linear-gradient(
//             97.46deg,
//             #322176 -1.53%,
//             #2d70ab 132.35%
//           );
//           color: #fff !important;
//           border-radius: 10px;
//         }
//       }
//     }
//     .v-tabs {
//       .v-tab {
//         letter-spacing: normal !important;
//         // color: var(--main) !important;
//         // &.v-tab {
//         //   color: var(--main) !important;
//         // }
//       }
//       background: linear-gradient(
//         97.46deg,
//         #322176 -1.53%,
//         #2d70ab 132.35%
//       ) !important;
//     }
//     &:not(.v-tab--active) {
//       color: transparent !important;
//     }
//   }
// }
</style>
