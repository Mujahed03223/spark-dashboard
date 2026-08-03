<template>
  <div class="homePage">
    <Loader v-if="loading" />

    <div v-else>
      <NoData v-if="noData" />

      <div class="" ref="main_wrapper" v-else>
        <div class="row fadeIn">
          <!-- End:: Aside -->
          <div class="col-12 py-0">
            <main>
              <!-- <div class="row">
                <h5>كل الطلبات</h5>
                <div class="col-md-3" v-for="item in orders" :key="item.id">
                  <simple-card classes="w-100">
                    <statistics-card
                      :withRoute="true"
                      :item="item"
                      :color="getRandomColor(colors)"
                    />
                  </simple-card>
                </div>
                <div class="col-sm-12">
                  <hr />
                </div>
              </div> -->
              <div class="row mt-5">
                <div
                  class="col-md-4 col-xxl-4 p-2"
                  v-for="card in cards"
                  :key="card.id"
                >
                  <router-link :to="card.route">
                    <simple-card classes="w-100">
                      <statistics-card
                        :item="card"
                        :color="getRandomColor(colors)"
                      />
                    </simple-card>
                  </router-link>
                </div>
              </div>

              <!-- <div v-show="false" class="row">
                <div class="col-12">
                  <simple-card classes="w-100 m-0">
                    <main>
                      <v-data-table
                        class="thumb strip"
                        :headers="top_rider_headers"
                        :items="top_rider"
                        :loading="loading"
                        :loading-text="$t('table.loadingData')"
                        item-key="id"
                        hide-default-footer
                        disable-pagination
                      >
                        <template v-slot:[`item.index`]="{ index }">
                          {{ index + 1 }}
                        </template>
                        <template v-slot:[`item.avatar`]="{ item, index }">
                          <img
                            @click="show_model_1(item.avatar)"
                            class="image"
                            @error="imageError(index, 'top_rider')"
                            :src="item.avatar"
                            v-if="item.avatar"
                          />
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </template>

                        <template v-slot:[`item.name`]="{ item }">
                          <router-link
                            v-if="item.full_name"
                            :to="`/riders/show/${item?.id}`"
                          >
                            <span>
                              {{ item.full_name }}
                            </span>
                          </router-link>
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

                        <template v-slot:no-data>
                          {{ $t("table.noData") }}
                        </template>

                        <template v-slot:[`item.is_active`]="{ item }">
                          <span
                            class="status"
                            :class="item.is_active ? 'active' : 'inactive'"
                          >
                            {{ helper_boolToText(item.is_active) }}
                          </span>
                        </template>

                        <template
                          v-slot:[`item.phone_complete_form`]="{ item }"
                        >
                          <a
                            :href="`tel:${item.phone_complete_form}`"
                            v-if="item.phone_complete_form"
                            ><bdi> {{ item.phone_complete_form }}</bdi></a
                          >
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </template>

                        <template v-slot:[`item.actions`]="{ item }">
                          <div class="_actions">
                            <router-link :to="`/riders/show/${item.id}`">
                              <v-icon class="show" small> fal fa-eye </v-icon>
                            </router-link>
                          </div>
                        </template>

                        <template v-slot:top>
                          <h3 class="table-title title">
                            {{ $t("labels.topRiders") }}
                          </h3>
                        
                          <v-row>
                            <v-col cols="12" sm="8"></v-col>
                          </v-row>
                        </template>
                      </v-data-table>
                    </main>
                  </simple-card>
                </div>

                <div class="col-12">
                  <simple-card classes="w-100 m-0">
                    <main>
                      <v-data-table
                        class="thumb strip"
                        :headers="top_partners_headers"
                        :items="top_partners"
                        :loading="loading"
                        :loading-text="$t('table.loadingData')"
                        item-key="id"
                        hide-default-footer
                        disable-pagination
                      >
                        <template v-slot:[`item.index`]="{ index }">
                          {{ index + 1 }}
                        </template>
                        <template v-slot:[`item.avatar`]="{ item, index }">
                          <img
                            @click="show_model_1(item.avatar)"
                            class="image"
                            @error="imageError(index, 'top_partners')"
                            :src="item.avatar"
                            v-if="item.avatar"
                          />
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </template>

                        <template v-slot:[`item.full_name`]="{ item }">
                          <router-link
                            v-if="item.full_name"
                            :to="`/partners/show/${item?.id}`"
                          >
                            <span>
                              {{ item.full_name }}
                            </span>
                          </router-link>
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
                        <template
                          v-slot:[`item.phone_complete_form`]="{ item }"
                        >
                          <a
                            :href="`tel:${item.phone_complete_form}`"
                            v-if="item.phone_complete_form"
                            ><bdi> {{ item.phone_complete_form }}</bdi></a
                          >
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </template>

                        <template v-slot:no-data>
                          {{ $t("table.noData") }}
                        </template>

                        <template v-slot:[`item.is_active`]="{ item }">
                          <span
                            class="status"
                            :class="item.is_active ? 'active' : 'inactive'"
                          >
                            {{ helper_boolToText(item.is_active) }}
                          </span>
                        </template>

                        <template v-slot:[`item.actions`]="{ item }">
                          <div class="_actions">
                            <router-link :to="`/partners/show/${item.id}`">
                              <v-icon class="show" small> fal fa-eye </v-icon>
                            </router-link>
                          </div>
                        </template>

                        <template v-slot:top>
                          <h3 class="table-title title">
                            {{ $t("labels.topPartners") }}
                          </h3>
                          
                          <v-row>
                            <v-col cols="12" sm="8"></v-col>
                          </v-row>
                        </template>
                      </v-data-table>
                    </main>
                  </simple-card>
                </div>
              </div> -->
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartsAside from "@/components/Layouts/ChartsAside.vue";
import Loader from "@/components/Loaders/loader.vue";

import AreaCharts from "@/components/Charts/AreaCharts.vue";
import ColumnChart from "@/components/Charts/ColumnChart.vue";

export default {
  name: "HomePage",

  components: {
    ChartsAside,
    AreaCharts,
    ColumnChart,
    Loader
  },

  data() {
    return {
      colors: [
        {
          first: "#62EAE1",
          secound: "rgba(126, 229, 223, 0)"
        },
        {
          first: "#FF6370",
          secound: "rgba(255, 99, 112, 0)"
        },
        {
          first: "#9E62EA",
          secound: " #B199ED"
        },
        {
          first: "#EABC62",
          secound: "#E9BA62"
        }
      ],

      // ========== Charts Aside
      asideIsActive: false,
      // start of main loader
      noData: true,
      loading: false,
      // end of main loader
      // ============ Charts Data
      cards: [],
      notifications_states: [],
      charts: [],
      top_cards: [],
      recently_partner: [],
      recently_rider: [],
      top_vehicle_package: [],
      top_partners: [],
      top_rider: [],
      chartsData: null,

      orders: [
        {
          id: 1,
          title: "كل الطلبات",
          route: "orders/show-all?without_status_canceled=1",
          count: ""
        },
        {
          id: 2,
          title: "الطلبات الملغاة",
          route: "orders/canceled-orders",
          count: ""
        },
        {
          id: 3,
          title: "كشوفات اليوم",
          route: "orders/today-orders",
          count: ""
        },
        {
          id: 4,
          title: "طلبات الصيانة",
          route: "orders/show-all?created_by=agent&is_technical_order=1",
          count: ""
        }
      ],

      top_rider_headers: [
        {
          text: "الصورة",
          align: "center",
          value: "avatar",
          sortable: false
        },
        {
          text: this.$t("labels.name"),
          value: "name",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.email"),
          value: "email",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone_complete_form",
          sortable: false
        },
        {
          text: this.$t("labels.activation"),
          align: "center",
          value: "is_active",
          sortable: false
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false
        }
      ],

      top_partners_headers: [
        {
          text: "الصورة",
          align: "center",
          value: "avatar",
          sortable: false
        },
        {
          text: this.$t("labels.fullname"),
          value: "full_name",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.email"),
          value: "email",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone_complete_form",
          sortable: false
        },
        {
          text: this.$t("labels.is_active"),
          align: "center",
          value: "is_active",
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
  computed: {
    user() {
      return this.$store.getters["auth_module/currentUser"];
    }
  },

  methods: {
    toggleAside() {
      this.asideIsActive = !this.asideIsActive;
    },
    getRouteLink(item) {
      let link;
      if (item.notify_type == "order") {
        link = "orders";
      } else if (item.notify_type == "new_rider") {
        link = "riders";
      } else if (item.notify_type == "unusual_behaviour") {
        link = "trips";
      } else if (item.notify_type == "new_partner") {
        link = "partners";
      } else if (item.notify_type == "finish_trip") {
        link = "trips";
      } else {
        link = "orders";
      }

      return link;
    },
    getHome() {
      // this.canShow = this.$permission.allowed("show-dashboard");
      // if (!this.canShow) {
      this.loading = true;
      this.noData = false;
      this.axios({
        method: "GET",
        url: "statics"
      })
        .then((res) => {
          this.noData = false;
          this.cards = res.data.data.upper_charts;
          this.loading = false;
        })
        .catch((err) => {
          this.noData = true;
          this.loading = false;
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
      // }
    },

    getRandomColor(colors) {
      let random = Math.floor(Math.random() * 4);

      return { colors: colors[random], id: random };
    },

    imageError(index, inp) {
      this[inp][index].avatar = require("@/assets/media/images/logo/logo.png");
    }

    // getPermissions() {
    //   this.axios.get("permissions").then((res) => {
    //     localStorage.setItem(
    //       "spark_dash_permissions",
    //       JSON.stringify(res.data.data)
    //     );
    //     this.getHome();
    //     this.getSideBar();
    //   });
    // },

    // getControls() {
    //   this.axios
    //     .get("get_my_control_permissions")
    //     .then((res) =>
    //       localStorage.setItem(
    //         "spark_dash_controls",
    //         JSON.stringify(res.data.data)
    //       )
    //     );
    // },

    // getSideBar() {
    //   this.axios.get("admin_side_bar").then((res) => {
    //     this.$router.push(`/${res.data[0].categories[0].permissions[0].url}`);
    //   });
    // },
  },

  created() {
    this.getHome();
    if (this.user.usertype == "superadmin") {
      if (localStorage.getItem("spark_dash_permissions")) {
        localStorage.removeItem("spark_dash_permissions");
      }
    }
  }
};
</script>

<style lang="scss">
.stats_chart {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  // justify-content: space-c;
  padding-block: 15px;

  // flex-direction: row-reverse;
  .icon {
    width: 50px;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
    margin-inline-end: 1rem;
  }

  .content {
    display: flex;
    flex-direction: column;

    .value {
      font-style: normal;
      font-weight: 500;
      font-size: 22px;
      line-height: 27px;
      color: #000;
    }

    .name {
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      margin-bottom: 8px;
      color: var(--mainText);
    }

    .values {
      margin-top: 0.5rem;

      span {
        color: var(--main);
        font-weight: 700;
        font-size: 1rem;
      }
    }
  }
}

.notifications_states {
  header {
    border-bottom: 1px solid #efefef !important;

    .title {
      font-style: normal;
      font-weight: 400;
      font-size: 16px !important;
      line-height: 20px;
      color: #000;
    }
  }

  .content {
    min-height: 200px;
    max-height: 250px;
    overflow-y: auto;
    padding-block: 8px;

    .notification_card {
      .state {
        display: flex;
        align-items: center;

        .notification_content {
          margin-inline-start: 8px;

          .title {
            display: block;
            font-style: normal;
            font-weight: 400;
            font-size: 12px !important;
            line-height: 17px;
            color: #000;
            margin: 0;
            margin-bottom: 5px;
          }

          p,
          a {
            font-style: normal;
            font-weight: 400 !important;
            font-size: 10px !important;
            line-height: 15px;
            color: var(--mainText);
            margin: 0;
          }
        }

        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }

      .no-data {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        h4 {
          font-size: 18px !important;
        }
      }
    }
  }

  footer {
    text-align: center;
    border-top: 1px solid #efefef !important;

    a {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: var(--mainText);
    }
  }

  &.client {
    .content {
      min-height: 250px;
      max-height: 250px;
    }
  }
}
</style>
