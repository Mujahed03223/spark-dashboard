<template>
  <div class="countries_all">
    <template>
      <Breadcrumb :items="items" />
      <!-- @filterFired="filterFired" -->
      <the-filter :inputs="inputs" :status="orderStatus" />
      <!-- :custom-filter="helper_filterSearch" -->

      <main>
        <div class="row">
          <div
            v-for="(card, index) in statistics"
            :key="index"
            class="col-lg-4 py-0"
          >
            <simple-card classes="w-100">
              <statistics-card :item="card" :color="getRandomColor()" />
            </simple-card>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // breadcrumb
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.financial_reports.title"),
          disabled: true,
          href: "",
        },
      ],
      button_: {
        id: "",
      },

      // ========== Filter
      inputs: [
        // {
        //   keyName: "driver_id",
        //   url: "drivers_without_pagination",
        // },
        {
          keyName: "status",
        },
        {
          keyName: "month",
        },

        {
          keyName: "start_date",
        },
        {
          keyName: "end_date",
        },
        {
          keyName: "payment",
        },
      ],
      loading: false,
      rows: [],
      statistics: [],
      search: null,
      expandData: null,
      orderStatus: [
        {
          id: "rider_cancel",
          name: "تم الالغاء من العميل",
        },
        {
          id: "partner_cancel_trip",
          name: "تم الالغاء من قبل السائق",
        },
        {
          id: "pending",

          name: "قيد الانتظار",
        },
        {
          id: "partner_finished",

          name: "السائق انهى الرحلة",
        },
      ],
    };
  },

  methods: {
    mapItem(data) {
      this.expandData = {
        [this.$t("labels.created_at")]: data.created_at,
      };
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `reports/financial`,
        params: {
          // page: this.paginations.current_page,
          status: this.$route.query.status,
          month: this.$route.query.month,
          from: this.$route.query.start_date,
          to: this.$route.query.end_date,
          payment_method: this.$route.query.payment_method,
        },
      })
        .then((res) => {
          // this.paginations.last_page = res.data.meta?.last_page;
          // this.paginations.items_per_page = res.data.meta?.per_page;
          // this.total = res.data.meta?.total;
          // this.rows = res.data.data;
          this.loading = false;
          this.statistics = [];
          for (const [key, value] of Object.entries(res.data.data)) {
            this.statistics.push({
              title: this.$t(key),
              count: value,
            });
          }
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
      if (this.rows[index].partner) {
        this.rows[
          index
        ].partner.vehicle.image = require("@/assets/media/images/logo/logo.png");
      }
    },

    showItem(item) {
      this.$router.push({ path: `/trips/show/` + item.id });
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
    this.control = this.$permission.setControls(this.$route.path);
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
