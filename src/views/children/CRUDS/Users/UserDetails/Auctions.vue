<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <noData v-if="noData" />
    <div class="wrapper userDetails" v-else>
      <div class="row">
        <div class="col-12">
          <v-data-table
            class="thumb strip"
            :headers="headers"
            :items="rows"
            :loading="loadingSpark"
            :loading-text="$t('table.loadingData')"
            item-key="id"
            :items-per-page="paginations.items_per_page"
            hide-default-footer
          >
            <!-- ================== You Can use any slots you want ================== -->

            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.spark_board_image`]="{ item, index }">
              <img
                class="image"
                :src="item.board_image"
                @error="imageError(index)"
                @click="show_model_1(item.board_image)"
                v-if="item.board_image"
              />
              <span class="redColor fontBold" v-else>
                {{ $t("notFound") }}
              </span>
            </template>

            <template v-slot:[`item.spark_title`]="{ item }">
              <span v-if="item.title">
                {{ item.title }}
              </span>
              <span class="redColor fontBold" v-else>
                {{ $t("notFound") }}
              </span>
            </template>

            <template v-slot:[`item.spark_auction_price`]="{ item }">
              <span v-if="item.price">
                {{ item.price }}
              </span>
              <span class="redColor fontBold" v-else>
                {{ $t("notFound") }}
              </span>
            </template>

            <template v-slot:[`item.spark_main_category`]="{ item }">
              <span v-if="item.main_category && item.main_category.title">
                {{ item.main_category.title }}
              </span>
              <span class="redColor fontBold" v-else>
                {{ $t("notFound") }}
              </span>
            </template>

            <template v-slot:[`item.fav_created_at`]="{ item }">
              <span v-if="item.created_at">
                {{ moment(item.created_at).format("YYYY-MM-DD") }}
              </span>
              <span class="redColor fontBold" v-else>
                {{ $t("notFound") }}
              </span>
            </template>

            <template v-slot:[`item.spark_desc`]="{ item }">
              <div class="_actions" v-if="item.desc">
                <v-icon
                  class="show"
                  small
                  @click="show_description_modal(item.desc)"
                >
                  fas fa-eye
                </v-icon>
              </div>
              <span class="redColor fontBold" v-else>
                {{ $t("notFound") }}
              </span>
            </template>

            <!-- Select no data State -->
            <template v-slot:no-data>
              {{ $t("table.noData") }}
            </template>

            <!-- ======================== Start Top Section ======================== -->
            <template v-slot:top>
              <h3 class="table-title title">
                {{ $t("labels.user_auctions") }}
                <span class="total">({{ total }})</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on">
                      far fa-info-circle
                    </v-icon>
                  </template>
                  <span> {{ $t("breadcrumb.users.all") }}</span>
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
        </div>
      </div>

      <div class="button_section d-flex gap-1 justify-content-end">
        <v-btn
          type="button"
          class="back_btn"
          @click="handleBack('/users/show-all')"
        >
          {{ $t("back") }}
          <span
            :class="
              $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
            "
          ></span>
        </v-btn>
      </div>

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

      <!-- Start Desc_Model -->
      <base-model :show="showDescription" @close="closeDescAdsModal">
        <div>
          <p class="with_border" v-html="descriptionData || $t('notFound')"></p>
        </div>
      </base-model>
      <!-- End Desc_Model -->
    </div>
  </div>
</template>

<script>
import Profile from "@/components/Pages/Profile/Profile.vue";
export default {
  props: ["id"],
  components: { Profile },
  data() {
    return {
      noData: false,

      //Loading
      loading: false,
      loadingSpark: false,

      showDescription: false,
      descriptionData: "",

      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },
        {
          text: this.$t("labels.board_image"),
          value: "spark_board_image",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.title"),
          value: "spark_title",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.main_category"),
          value: "spark_main_category",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.auction_price"),
          value: "spark_auction_price",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.created_at"),
          value: "fav_created_at",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.desc"),
          value: "spark_desc",
          align: "center",
          sortable: false
        }
      ],

      total: 0,
      rows: []
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
    // ===== showDescription
    show_description_modal(item) {
      this.showDescription = true;
      this.descriptionData = item;
    },

    closeDescAdsModal() {
      this.showDescription = !this.showDescription;
    },

    imageError(index) {
      this.rows[
        index
      ].board_image = require("@/assets/media/images/Icons/no-data.svg");
    },

    getUserSpark() {
      this.loadingSpark = true;
      this.axios({
        methos: "GET",
        url: `user-mazadats/${this.id}`,
        params: {
          page: this.paginations.current_page,
          per_page: this.$route.query.per_page
        }
      })
        .then((res) => {
          this.loadingSpark = false;
          this.rows = res.data.data;
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
        })
        .catch((err) => {
          this.loadingSpark = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
    }
  },

  async mounted() {
    this.canShow = this.$permission.allowed("users/show");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }

    if (this.id) {
      if (!this.canShow) {
        this.getUserSpark();
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    }
  }
};
</script>
