<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="" v-else @click="notification_menu = false">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <Profile
            :id="id"
            @refresh="getProfile()"
            :profileData="profileData"
            name="orders"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from "@/components/Pages/Profile/OrderDetails.vue";
export default {
  props: ["id"],
  components: { Profile },
  data() {
    return {
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
          text: this.$t(`breadcrumb.orders.show`),
          disabled: true,
          href: "",
        },
      ],
      notification_menu: false,
      noData: false,
      profileData: null,

      // Charge Popup Model
      chargePopup: false,
      data: {
        amount: null,
        charge_type: null,
      },
      // Show Transactions Table

      model_1: {
        src: null,
        show: null,
      },
      //Loading
      loading: false,
      btnLoading: false,
      // orders
      orders: [],
      notifications: [],
      statistics: [],
      transactions: [],
      orderCount: [],
      lastTripLoading: false,
      //
      OrdersHeaders: [
        {
          text: this.$t("labels.start"),
          value: "start_location",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.to"),
          align: "center",
          value: "end_locations",
          sortable: false,
        },
        {
          text: this.$t("labels.created_at"),
          value: "created_at",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.rider"),
          value: "rider",
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
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      inputs: [
        // {
        //   keyName: "driver_id",
        //   url: "drivers_without_pagination",
        // },
        {
          keyName: "status",
        },

        {
          keyName: "start_date",
        },
        {
          keyName: "end_date",
        },
      ],
      orderStatus: [
        {
          id: "current_trip",
          name: this.$t("status.current_trip"),
        },
        {
          id: "pending",
          name: this.$t("status.pending"),
        },
        {
          id: "is_paid",
          name: this.$t("status.is_paid"),
        },
        {
          id: "rider_cancel",
          name: this.$t("status.rider_cancel"),
        },
        {
          id: "partner_accept_trip",
          name: this.$t("status.partner_accept_trip"),
        },
        {
          id: "partner_start_trip",
          name: this.$t("status.partner_start_trip"),
        },
        {
          id: "partner_finished",
          name: this.$t("status.partner_finished"),
        },
        {
          id: "partner_in_pickup_location",
          name: this.$t("status.partner_in_pickup_location"),
        },
        {
          id: "reached_stop_point",
          name: this.$t("status.reached_stop_point"),
        },
      ],
      carHeaders: [
        {
          text: this.$t("labels.image"),
          value: "image",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.model"),
          value: "vehicle_model.name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.package"),
          value: "vehicle_package.title",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.manufacturing_year"),
          value: "manufacturing_year",
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
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      chargeTypes: [
        {
          id: "add",
          name: this.$t("charge"),
        },
        {
          id: "minus",
          name: this.$t("discharge"),
        },
      ],
      transactionLoading: false,
      showTransactions: false,
      transactionsHeader: [
        {
          text: this.$t("labels.type"),
          value: "type",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.transaction_id"),
          value: "transaction_id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.monyAmount"),
          value: "amount",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.balance_before"),
          value: "balance_before",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.balance_after"),
          value: "balance_after",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.created_at"),
          value: "created_at",
          align: "center",
          sortable: false,
        },
      ],
    };
  },

  methods: {
    showItem(item) {
      this.$router.push({ path: `/orders/show/` + item.id });
    },
    showVehicle(item) {
      this.$router.push({ path: `/orders/show/` + item.id });
    },
    // ============ Get Profile Data
    getProfile() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `orders/${this.id}`,
      })
        .then((res) => {
          this.profileData = res.data.data;
          // this.getOrders();
          this.loading = false;
          this.noData = false;
        })
        .catch((err) => {
          this.noData = true;
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
    getOrders() {
      this.lastTripLoading = true;

      this.axios({
        method: "GET",
        url: `partner/${this.id}/orders`,
        params: {
          page: this.paginations.current_page,
          status: this.$route.query.status,
          internal: 1,
          start_at: this.$route.query.start_date,
          end_at: this.$route.query.end_date,
        },
      })
        .then((res) => {
          this.lastTripLoading = false;
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.orderCount = res.data.meta.total;
          this.orders = res.data.data;
          this.statistics = [];
          for (const [key, value] of Object.entries(res.data.statistics)) {
            this.statistics.push({
              title: this.$t(key),
              count: value,
            });
          }
        })
        .catch((err) => {
          this.lastTripLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
    openChargePopup() {
      this.chargePopup = true;
    },
    chargeSubmited() {
      this.$refs.formCharge.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("amount", this.data.amount);

          data.append("type", this.data.charge_type.id);

          data.append("_method", "PUT");

          let message = this.$t("submitSuccess");
          this.axios({
            method: "POST",
            url: `partner/${this.id}/update-wallet`,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.getProfile();
              this.chargePopup = false;
              this.data.charge_type = null;
              this.data.amount = false;
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
    getNotification() {
      this.notification_menu = false;
      this.axios({
        method: "GET",
        params: { internal: 1 },
        url: `users/${this.id}/notifications`,
      })
        .then((res) => {
          this.notification_menu = true;
          if (res.data.data.length) {
            this.notification_menu = true;
          } else {
            setTimeout(() => (this.notification_menu = false), 1000);
          }
          // this.orderCount = res.data.count_trips;
          this.notifications = res.data.data;
        })
        .catch((err) => {
          this.notification_menu = true;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
    readMessage(item) {
      if (!item.read_at) {
        this.axios.get(`notification/${item.id}`).then(() => {
          this.notification_menu = false;
          this.notifications.map((el) => {
            if (el.id == item.id) item.read_at = new Date();
          });
        });
      }
    },
    show_model_1(e) {
      this.model_1.src = e;
      this.model_1.show = true;
    },
    getTransactions() {
      this.showTransactions = true;
      this.transactionLoading = true;
      this.axios({
        method: "GET",
        url: `transactions/${this.id}`,
      })
        .then((res) => {
          this.transactionLoading = false;
          // this.orderCount = res.data.count_trips;
          this.transactions = res.data.data;
        })
        .catch((err) => {
          this.lastTripLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
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
      // this.getOrders();
    },
  },
  watch: {
    ["$route.query"]() {
      if (this.$route.query.page) {
        this.paginations.current_page = +this.$route.query.page;

        // this.getOrders();
      } else {
        this.paginations.current_page = 1;
        // this.getOrders();
      }
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getProfile();
  },
};
</script>

<style>
.w-fit {
  width: fit-content;
}

.flex-1 {
  flex: 1;
}
</style>
