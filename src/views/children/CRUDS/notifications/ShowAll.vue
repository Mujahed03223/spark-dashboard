<template>
  <div class="countries_all">
    <template>
      <!-- <the-filter :inputs="inputs" /> -->
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/notifications/add"
        :search_title="$t('breadcrumb.notifications.send_notification')"
        icon="fa-plus"
      />
      <!-- :custom-filter="helper_filterSearch" -->

      <main>
        <v-data-table
          class="thumb strip"
          :headers="headers"
          :items="rows"
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

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <template v-slot:[`item.notification`]="{ item }">
            <div class="item_notify">
              <span class="icon">
                <i class="far fa-bell"></i>
              </span>
              <div class="text" :class="item.is_readed ? 'read' : ''">
                <h4>{{ item.title }}</h4>
                <p :title="item.body">
                  {{ item.body }}
                </p>
              </div>
            </div>
          </template>

          <template v-slot:[`item.is_readed`]="{ item }">
            <span v-if="item.is_readed">
              {{
                moment(item.read_at).format("YYYY-MM-DD hh:mm A") || $t("yes")
              }}
            </span>
            <span class="redColor" v-else>{{ $t("labels.not_read_yet") }}</span>
          </template>

          <template v-slot:[`item.created_at`]="{ item }">
            <span v-if="item.created_at">
              {{ item.created_at }}
              <!-- {{ moment(item.created_at).format("YYYY-MM-DD") }} -->
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="_actions">
              <div @click="handleReadNotification(item)">
                <!-- <v-icon
                  v-if="
                    !canAccept && item.notifiable_type === 'BankTransferToAdmin'
                  "
                  @click="acceptItem(item.notifiable_id)"
                  class="accept"
                  small
                >
                  fas fa-check
                </v-icon> -->

                <v-icon
                  class="show"
                  v-if="!canShow"
                  small
                  @click="routeTo(item)"
                >
                  fas fa-share
                </v-icon>
              </div>
              <!-- <router-link
                v-if="!canShow"
                :to="`/notifications/show/${item.id}`"
              >
                <i class="fas fa-share"></i>
              </router-link> -->
              <!-- :to="`/${getRouteLink(item)}/show/${item.id}`" -->
              <deleter
                v-if="!canDelete"
                :items="rows"
                name="delete-notification"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("labels.notifications") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span>Tooltip</span>
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
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.notifications.title"),
          disabled: false,
          href: "/notifications/show-all",
        },
        {
          text: this.$t("breadcrumb.notifications.all"),
          disabled: true,
          href: "",
        },
      ],
      // ========== headers
      headers: [
        {
          text: "#",
          value: "index",
          align: "center",
          width: 80,
        },
        {
          text: this.$t("labels.notification"),
          value: "notification",
          align: "start",
        },
        {
          text: this.$t("labels.readable"),
          value: "is_readed",
          align: "start",
        },
        {
          text: this.$t("labels.created_at"),
          value: "created_at",
          align: "start",
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          width: 120,
          sortable: false,
        },
      ],
      rows: [],
      unreadNotificationCount: 0,
    };
  },

  methods: {
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `notifications`,
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
          // console.log(err.response.data.messages);
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },
    imageError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.svg");
    },
    // ==================== Start CRUD ====================

    clickRow(rowData) {
      console.log(rowData);
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

    getUnreadNotificationsCount() {
      this.axios.get("notifications/unread_notifications_count").then((res) => {
        this.unreadNotificationCount = res.data.data.count;
      });
    },

    handleReadNotification(item) {
      this.axios.get(`notifications/${item.id}`).then(() => {
        // this.getUnreadNotificationsCount();
        this.setRows();
        this.$store.commit("notifications_module/decreaseCounter");
      });
    },

    // acceptItem(id) {
    //   // Start:: Sweet Alert  Modal
    //   this.$swal({
    //     title: this.$t("delegate_confirmation"),
    //     text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     cancelButtonText: this.$t("cancel"),
    //     confirmButtonText: this.$t("accept"),
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.handleOwnershipNotification(id);
    //     }
    //   });
    //   // End:: Sweet Alert  Modal
    // },

    handleOwnershipNotification(notify_id) {
      this.axios
        .get(`ownership_notification/${notify_id}`)
        .then(() => {
          this.$iziToast.success({
            title: this.$t("delegateSuccessfully"),
            message: message,
          });
          // this.$swal({
          //   title: this.$t("sendSuccessfully"),
          //   icon: "success",
          //   confirmButtonColor: "#3085d6",
          //   confirmButtonText: this.$t("ok"),
          // });
        })
        .catch((err) => {
          this.isLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });

          // let message = "";
          // err.response?.data.message
          //   ? (message = err.response.data.message)
          //   : (message = err.response.data.messages);
          // this.$swal({
          //   title: message,
          //   icon: "error",
          //   confirmButtonColor: "#d33",
          //   confirmButtonText: this.$t("cancel"),
          // });
        });
    },

    routeTo(item) {
      if (item.notifiable_type === "orders") {
        this.$router
          .push({ path: `/orders/show/` + item.notifiable_id })
          .catch(() => {});
      } else if (
        item.notifiable_type === "NewAd" ||
        item.notifiable_type === "DeliveryNotification" ||
        item.notifiable_type === "AuctionRequestRejected"
      ) {
        this.$router
          .push({ path: `/advertisements/show/${item.notifiable_id}` })
          .catch(() => {});
      } else if (item.notifiable_type === "BankTransferToAdmin") {
        if (!item.is_readed) {
          this.handleOwnershipNotification(item.notifiable_id);
        }
        this.$router
          .push({ path: `/buy_process/show-all?ad_id=${item.notifiable_id}` })
          .catch(() => {});
        // this.$router.push({ path: `/advertisements/show-all` }).catch(() => {});
      } else if (item.notifiable_type === "OwnerShipToAdmin") {
        this.$router
          .push({ path: `/buy_process/show-all?ad_id=${item.notifiable_id}` })
          .catch(() => {});
      } else if (item.notifiable_type === "contact") {
        this.$router
          .push({
            path: `/contact_messages/show-all`,
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: `/notifications/show-all` }).catch(() => {});
      }
    },
    // readMessage(item) {
    //   console.log(item);
    //   if (!item.read_at) {
    //     // this.axios.get(`notifications/${item.id}`).then(() => {
    //     //   // this.notifications.map((el) => {
    //     //   //   if (el.id == item.id) item.read_at = new Date();
    //     //   // });
    //     // });
    //     this.$store.commit("notifications_module/decreaseCounter");
    //   }
    //   this.$router
    //     .push(`/${this.getRouteLink(item)}/show/${item.notify_id}`)
    //     .catch(() => {});

    //   // :to="`/${getRouteLink(item)}/show/${item.data_id}`"
    // },
    // getRouteLink(item) {
    //   let link;
    //   if (item.notifiable_type == "order") {
    //     link = "orders";
    //   } else if (item.notifiable_type == "new_rider") {
    //     link = "riders";
    //   } else if (item.notifiable_type == "unusual_behaviour") {
    //     link = "trips";
    //   } else if (item.notifiable_type == "new_partner") {
    //     link = "partners";
    //   } else if (item.notifiable_type == "finish_trip") {
    //     link = "trips";
    //   } else {
    //     link = "orders";
    //   }

    //   return link;
    // },
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
  created() {
    this.canAccept = this.$permission.allowed("notifications/accept");
    this.canAdd = this.$permission.allowed("notifications/add");
    this.canShow = this.$permission.allowed("notifications/show/");
    this.canDelete = this.$permission.allowed("notifications/delete");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
    // this.getUnreadNotificationsCount();
  },
};
</script>
<style lang="scss">
.item_notify {
  display: flex;
  align-items: center;

  .icon {
    font-size: 24px;
    margin-inline-end: 10px;
  }

  .text {
    h4 {
      color: var(--main);
      text-align: start;
      font-size: 18px !important;
    }

    p {
      color: var(--main);
      margin: 0;
    }

    &.read {
      h4 {
        color: var(--mainText);
      }

      p {
        color: var(--mainText);
      }
    }
  }
}
</style>
