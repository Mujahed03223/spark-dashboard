<template>
  <div class="wrraper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>
    <template>
      <Breadcrumb :canAddNew="false" :items="items" />
      <the-filter :inputs="inputs" />

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

              <template v-slot:[`item.receiverImage`]="{ item, index }">
                <img
                  @click="show_model_1(item.receiver.image)"
                  class="image"
                  @error="imageError(index)"
                  :src="item.receiver.image"
                  v-if="item.receiver.image"
                />
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.senderImage`]="{ item, index }">
                <img
                  @click="show_model_1(item.sender.image)"
                  class="image"
                  @error="imageError(index)"
                  :src="item.sender.image"
                  v-if="item.sender.image"
                />
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.receiverName`]="{ item }">
                <span v-if="item.receiver.name">
                  {{ item.receiver.name }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.senderName`]="{ item }">
                <span v-if="item.sender.name">
                  {{ item.sender.name }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.receiverEmail`]="{ item }">
                <span v-if="item.receiver.email">
                  {{ item.receiver.email }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.senderEmail`]="{ item }">
                <span v-if="item.sender.email">
                  {{ item.sender.email }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.receiverPhone`]="{ item }">
                <span v-if="item.receiver.phone">
                  {{ item.receiver.phone }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.senderPhone`]="{ item }">
                <span v-if="item.sender.phone">
                  {{ item.sender.phone }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
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
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.usersChats.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.usersChats.all") }}</span>
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
          text: this.$t("breadcrumb.usersChats.title"),
          disabled: false,
          href: "/users-chats/show-all",
        },
        {
          text: this.$t("breadcrumb.usersChats.all"),
          disabled: true,
          href: "",
        },
      ],

      total: 0,
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
          text: this.$t("labels.receiverImage"),
          align: "center",
          value: "receiverImage",
          sortable: false,
        },
        {
          text: this.$t("labels.receiverName"),
          value: "receiverName",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.receiverEmail"),
          value: "receiverEmail",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.receiverPhone"),
          value: "receiverPhone",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.senderImage"),
          align: "center",
          value: "senderImage",
          sortable: false,
        },
        {
          text: this.$t("labels.senderName"),
          value: "senderName",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.senderEmail"),
          value: "senderEmail",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.senderPhone"),
          value: "senderPhone",
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
        url: "users-chats",
        params: {
          page: this.paginations.current_page,
          // keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
          keyword: this.$route.query.status,
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
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
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
      this.$router.push({ path: `/users-chats/show/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    this.canShow = this.$permission.allowed("show-users-chats");
    this.canShowAll = this.$permission.allowed("index-users-chats");

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
