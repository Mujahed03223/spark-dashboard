<template>
  <div class="wrraper">
    <button class="charts_toggeler" @click="toggleAside" v-if="false">
      <i class="fad fa-analytics"></i>
    </button>

    <template>
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/thanking-word/add"
        :search_title="$t('breadcrumb.thankingWord.add')"
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
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <template v-slot:[`item.name`]="{ item }">
                <span v-if="item.name">
                  {{ item.name }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <!-- <template v-slot:[`item.text`]="{ item }">
                <span v-if="item.text">
                  {{ item.text }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template> -->
              <template v-slot:[`item.text`]="{ item }">
                <div class="_actions" v-if="item.text">
                  <v-icon class="show" small @click="show_message(item.text)">
                    fas fa-eye
                  </v-icon>
                </div>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.date`]="{ item }">
                <span v-if="item.date">
                  {{ item.date }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <!-- IsActive -->
              <template v-slot:[`item.is_active`]="{ item }">
                <span
                  class="status pt-2"
                  :class="item.is_active ? 'active' : 'inactive'"
                >
                  {{ item.is_active ? $t("active") : $t("inactive") }}
                </span>
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
                  <deleter
                    v-if="!canDelete"
                    :items="rows"
                    name="home-info"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.thankingWord.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.thankingWord.all") }}</span>
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

      <!-- Start Base_Model -->
      <base-model :show="showMessage" @close="closeMessage">
        <div>
          <p class="with_border" v-html="messageData || $t('notFound')"></p>
        </div>
      </base-model>
      <!-- End Base_Model -->
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
          text: this.$t("breadcrumb.thankingWord.title"),
          disabled: false,
          href: "/thanking-word/show-all",
        },
        {
          text: this.$t("breadcrumb.thankingWord.all"),
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
          text: this.$t("labels.content"),
          value: "text",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.is_active"),
          value: "is_active",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.created_at"),
          value: "date",
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

      expandData: null,
      showMessage: false,
      messageData: "",
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

    // ===== showMessage
    show_message(item) {
      this.showMessage = true;
      this.messageData = item;
    },

    closeMessage() {
      this.showMessage = !this.showMessage;
    },

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `home-infos`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
        },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
        })
        .catch((err) => {
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

    editItem(item) {
      this.$router.push({ path: `/thanking-word/edit/` + item.id });
    },

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("thanking-word/edit");
    this.canDelete = this.$permission.allowed("thanking-word/delete");
    this.canAdd = this.$permission.allowed("thanking-word/add");
    this.canShow = this.$permission.allowed("thanking-word/show");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }

    this.setRows();
  },
};
</script>
