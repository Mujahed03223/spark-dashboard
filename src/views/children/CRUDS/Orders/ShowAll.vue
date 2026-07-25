<template>
  <div class="wrraper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>
    <template>
      <Breadcrumb
        :canAddNew="false"
        :items="items"
        search_route="/orders/add"
        :search_title="$t('breadcrumb.orders.add')"
        icon="fa-plus"
      />
      <the-filter :inputs="inputs" :status="orderStatus" />
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
              :expanded.sync="expanded"
              :items-per-page="paginations.items_per_page"
              hide-default-footer
            >
              <!-- ================== You Can use any slots you want ================== -->
              <!-- ====== Select row field ====== -->
              <!-- Expanded -->
              <template v-slot:expanded-item="{ headers }">
                <td :colspan="headers.length" class="expandDate fadeIn">
                  <span class="expandTitle">المزيد من التفاصيل</span>
                  <ul>
                    <li v-for="(value, key) of expandData" :key="key">
                      <span class="key">{{ key }}</span>
                      <span class="value">
                        <template v-if="value != null && value != 'null'">
                          <span v-html="value"></span>
                        </template>
                        <!-- <template
                          v-else-if="
                            value != null && value != 'null' && key == 'الموقع'
                          "
                        >
                          <a :href="value" target="_blank">{{ value }}</a>
                        </template> -->
                        <template v-else-if="value == null || value == 'null'">
                          {{ $t("table.noData") }}
                        </template>
                      </span>
                    </li>
                  </ul>
                </td>
              </template>

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

              <template v-slot:[`item.client`]="{ item }">
                <router-link
                  v-if="item.user && item.user.user_type == 'client'"
                  :to="`/users/show/${item.user?.id}`"
                >
                  <span>
                    {{ item.user.full_name }}
                  </span>
                </router-link>
                <span class="" v-else>{{ item.user_name }}</span>
              </template>
              <template v-slot:[`item.callcenter`]="{ item }">
                <router-link
                  v-if="item.user && item.user.user_type != 'client'"
                  :to="`/callcenter/show/${item.user?.id}`"
                >
                  <span>
                    {{ item.user.full_name }}
                  </span>
                </router-link>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.company`]="{ item }">
                <router-link
                  v-if="item.company"
                  :to="`/companies/show/${item.company?.id}`"
                >
                  <span>
                    {{ item.company.full_name }}
                  </span>
                </router-link>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.provider`]="{ item }">
                <router-link
                  v-if="item.agent"
                  :to="`/providers/show/${item.agent?.id}`"
                >
                  <span>
                    {{ item.agent?.full_name }}
                  </span>
                </router-link>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.is_paid`]="{ item }">
                <span
                  class="status"
                  :class="item.is_paid ? 'active' : 'inactive'"
                >
                  {{ helper_boolToText(item.is_paid) }}
                </span>
              </template>
              <template v-slot:[`item.is_delayed`]="{ item }">
                <span
                  class="status"
                  :class="item.is_delayed ? 'active delayed' : 'inactive'"
                >
                  {{ helper_boolToText(item.is_delayed) }}
                </span>
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <span
                  :class="
                    item.is_delayed && item.status == 'pending'
                      ? 'delayed'
                      : item.status == 'accept'
                      ? 'accept'
                      : item.status == 'finished'
                      ? 'finished'
                      : item.status.includes('cancel')
                      ? 'cancel'
                      : ''
                  "
                  >{{ $t(`status.${item.status}`) }}</span
                >
              </template>

              <template v-slot:[`item.phone_complete_form`]="{ item }">
                <span v-if="item.phone_complete_form"
                  ><bdi>{{ item.phone_complete_form }}</bdi></span
                >
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.desc`]="{ item }">
                <span v-if="item.desc">
                  {{ item.desc.slice(0, 35) }}
                </span>

                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.address`]="{ item }">
                <a
                  :href="item.address_link"
                  target="_blank"
                  v-if="item.address"
                >
                  <span>
                    {{ item.address.slice(0, 35) }}
                  </span>
                </a>

                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.start_date`]="{ item }">
                <span v-if="item.start_date">
                  {{ item.start_date + " " + item.start_time }}
                </span>

                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.extendIcon`]="{ item }">
                <div class="_actions">
                  <v-icon class="show" small @click="clickRow(item)">
                    fas fa-angle-double-down
                  </v-icon>
                </div>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- IsActive -->
              <template v-slot:[`item.is_active`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="orders"
                  :item="item"
                  value="is_active"
                  type="active"
                />
                <span
                  class="status pt-2"
                  :class="item.is_active ? 'active' : 'inactive'"
                >
                  {{ item.is_active ? $t("active") : $t("inactive") }}
                </span>
              </template>

              <template v-slot:[`item.is_locked`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="orders"
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
                  name="orders"
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
                    class="show"
                    v-if="!canShow"
                    small
                    @click="showItem(item)"
                  >
                    fal fa-eye
                  </v-icon>
                  <deleter
                    v-if="!canDelete"
                    :items="rows"
                    name="orders"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.orders.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.orders.all") }}</span>
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
      // ========== Breadcrumbs
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.orders.title"),
          disabled: false,
          href: "/orders/show-all",
        },
        {
          text: this.$t("breadcrumb.orders.all"),
          disabled: true,
          href: "",
        },
      ],

      total: 0,
      upper_charts: null,
      rows: [],
      search: null,
      expandData: [],
      expanded: [],
      noExpand: false,
      orderStatus: [
        {
          id: "",
          name: this.$t(`all`),
        },
        {
          id: "pending",
          name: this.$t(`status.pending`),
        },
        {
          id: "client_cancel",

          name: this.$t(`status.client_cancel`),
        },
        {
          id: "agent_cancel",

          name: this.$t(`status.agent_cancel`),
        },
        {
          id: "accept",

          name: this.$t(`status.accept`),
        },
        {
          id: "admin_reject",

          name: this.$t(`statusuperadmin_reject`),
        },
        {
          id: "in_the_way",

          name: this.$t(`status.in_the_way`),
        },
        {
          id: "start",

          name: this.$t(`status.start`),
        },
        {
          id: "pre_finished",

          name: this.$t(`status.pre_finished`),
        },
        {
          id: "ready_to_pay",

          name: this.$t(`status.ready_to_pay`),
        },
        {
          id: "finished",

          name: this.$t(`status.finished`),
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
          text: this.$t("labels.desc"),
          value: "desc",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.client"),
          align: "center",
          value: "client",
          sortable: false,
        },
        {
          text: this.$t("labels.call_center"),
          align: "center",
          value: "callcenter",
          sortable: false,
        },
        {
          text: this.$t("labels.company"),
          value: "company",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.provider"),
          value: "provider",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.service"),
          value: "extendIcon",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.address"),
          value: "address",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.price"),
          value: "price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.report_price"),
          value: "report_price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.is_paid"),
          value: "is_paid",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.is_delayed"),
          value: "is_delayed",
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
          text: this.$t("labels.start_date"),
          value: "start_date",
          align: "center",
          sortable: true,
        },
        // {
        //   text: this.$t("labels.created_at"),
        //   value: "created_at",
        //   align: "center",
        //   sortable: true,
        // },
        // {
        //   text: this.$t("labels.created_at"),
        //   value: "created_at",
        //   align: "center",
        //   sortable: true,
        // },
        // {
        //   text: this.$t("labels.activation"),
        //   align: "center",
        //   value: "is_active",
        //   sortable: true,
        // },
        // {
        //   text: this.$t("labels.is_locked"),
        //   align: "center",
        //   value: "is_locked",
        //   sortable: true,
        // },
        // {
        //   text: this.$t("labels.is_ban"),
        //   align: "center",
        //   value: "is_ban",
        //   sortable: true,
        // },
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
          keyName: "phone",
        },
        {
          keyName: "status",
        },
        // {
        //   keyName: "user_id",
        //   url: "clients-without-paginate",
        // },
        {
          keyName: "call_center_id",
          url: "callcenter-without-paginate",
        },
        {
          keyName: "agent_id",
          url: "agents-without-paginate",
        },
        {
          keyName: "from_date",
        },
        {
          keyName: "to_date",
        },
        {
          keyName: "from_time",
        },
        {
          keyName: "to_time",
        },
        {
          keyName: "city_id",
          url: "cities-without-paginated",
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
    mapItem(data) {
      this.expandData = {
        [this.$t("labels.title")]: data.service.title,
        [this.$t("labels.desc")]: data.service.desc,
        [this.$t("labels.is_active")]: data.service.is_active
          ? this.$t("active")
          : this.$t("inactive"),
        [this.$t("labels.created_at")]: data.service.created_at,
        [this.$t("labels.location")]: data.address,
        [this.$t("labels.phone")]: data.phone_code + data.phone,
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
    setRows() {
      this.loading = true;
      let url = "";
      if (this.$route.name == "AgentCancel") {
        url = `get-order-to-assign`;
      } else {
        url = "orders";
      }
      this.axios({
        method: "GET",
        url: url,
        params: {
          page: this.paginations.current_page,
          // keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
          create_from:
            this.$route.name == "TodayOrders"
              ? new Date().toISOString().slice(0, 10)
              : this.$route.query.from_date,
          create_to:
            this.$route.name == "TodayOrders"
              ? new Date().toISOString().slice(0, 10)
              : this.$route.query.to_date,
          start_time_from: this.$route.query.from_time,
          start_time_to: this.$route.query.to_time,
          status: this.$route.query.status,
          user_id: this.$route.query.user_id,
          call_center_id: this.$route.query.call_center_id,
          agent_id: this.$route.query.agent_id,
          city_id: this.$route.query.city_id,
          without_status_canceled: this.$route.query.without_status_canceled,
          created_by: this.$route.query.created_by,
          is_technical_order: this.$route.query.is_technical_order,
          client_phone: this.$route.query.phone,
          client_name: this.$route.query.keyword,
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
      this.$router.push({ path: `/orders/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/orders/edit/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    // console.log(this.canEdit);

    this.canEdit = this.$permission.allowed("orders/edit/");
    this.canDelete = this.$permission.allowed("orders/delete");
    this.canAdd = this.$permission.allowed("orders/add");

    this.canShow = this.$permission.allowed("orders/show/");
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
