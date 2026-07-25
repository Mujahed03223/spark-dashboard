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
          text: this.$t("breadcrumb.notifications.sent_notifications"),
          disabled: false,
          href: "/notifications/sent",
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
        url: `admin-notifications
`,
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
