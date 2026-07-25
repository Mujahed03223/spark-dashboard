<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="wrapper userDetails" v-else>
      <div class="row">
        <div class="col-md-4">
          <Profile :profileData="userData" name="users" />
        </div>
        <div class="col-md-8">
          <BaseCard>
            <v-data-table
              class="thumb strip userTable"
              :headers="headers"
              :items="rows"
              :loading="loadingAds"
              :loading-text="$t('table.loadingData')"
              item-key="id"
              hide-default-footer
            >
              <!-- ================== You Can use any slots you want ================== -->

              <template v-slot:[`item.index`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.ads_board_image`]="{ item, index }">
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

              <template v-slot:[`item.ads_title`]="{ item }">
                <span v-if="item.title">
                  {{ item.title }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.ads_main_category`]="{ item }">
                <span v-if="item.main_category && item.main_category.title">
                  {{ item.main_category.title }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.price`]="{ item }">
                <span v-if="item.price">
                  {{ item.price }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.ads_created_at`]="{ item }">
                <span v-if="item.created_at">
                  {{ moment(item.created_at).format("YYYY-MM-DD") }}
                </span>
                <span class="redColor fontBold" v-else>
                  {{ $t("notFound") }}
                </span>
              </template>

              <template v-slot:[`item.ads_desc`]="{ item }">
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
                  {{ $t("labels.user_ads") }}
                </h3>
                <!-- Delete dialog -->

                <!-- Add & Delete -->
              </template>
              <!-- ======================== End Top Section ======================== -->
            </v-data-table>
          </BaseCard>
          <BaseCard>
            <v-data-table
              class="thumb strip userTable"
              :headers="user_favorites_headers"
              :items="user_favorites_rows"
              :loading="loadingFav"
              :loading-text="$t('table.loadingData')"
              item-key="id"
              hide-default-footer
            >
              <!-- ================== You Can use any slots you want ================== -->

              <template v-slot:[`item.index`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.fav_board_image`]="{ item, index }">
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

              <template v-slot:[`item.fav_title`]="{ item }">
                <span v-if="item.title">
                  {{ item.title }}
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

              <template v-slot:[`item.fav_desc`]="{ item }">
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
                  {{ $t("labels.user_favorites") }}
                </h3>
                <!-- Delete dialog -->

                <!-- Add & Delete -->
              </template>
              <!-- ======================== End Top Section ======================== -->
            </v-data-table>
          </BaseCard>
          <BaseCard>
            <v-data-table
              class="thumb strip userTable"
              :headers="user_spark_headers"
              :items="user_spark_rows"
              :loading="loadingSpark"
              :loading-text="$t('table.loadingData')"
              item-key="id"
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
                </h3>
                <!-- Delete dialog -->

                <!-- Add & Delete -->
              </template>
              <!-- ======================== End Top Section ======================== -->
            </v-data-table>
          </BaseCard>
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
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/"
        },
        {
          text: this.$t("breadcrumb.users.title"),
          disabled: false,
          href: "/users/show-all"
        },
        {
          text: this.$t(`breadcrumb.users.show`),
          disabled: true,
          href: ""
        }
      ],

      noData: false,
      userData: null,

      //Loading
      loading: false,
      isLoading: false,
      loadingAds: false,
      loadingFav: false,
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
          value: "ads_board_image",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.title"),
          value: "ads_title",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.main_category"),
          value: "ads_main_category",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.price"),
          value: "price",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.created_at"),
          value: "ads_created_at",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.desc"),
          value: "ads_desc",
          align: "center",
          sortable: false
        }
      ],
      user_favorites_headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },
        {
          text: this.$t("labels.board_image"),
          value: "fav_board_image",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.title"),
          value: "fav_title",
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
          value: "fav_desc",
          align: "center",
          sortable: false
        }
      ],
      user_spark_headers: [
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

      rows: [],
      user_favorites_rows: [],
      user_spark_rows: []
    };
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

    getUserAds() {
      this.loadingAds = true;
      this.axios({
        methos: "GET",
        url: `user-ads/${this.id}`
      })
        .then((res) => {
          this.loadingAds = false;
          this.rows = res.data.data;
        })
        .catch((err) => {
          this.loadingAds = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
    },

    getUserFavorites() {
      this.loadingFav = true;
      this.axios({
        methos: "GET",
        url: `user-favorites/${this.id}`
      })
        .then((res) => {
          this.loadingFav = false;
          this.user_favorites_rows = res.data.data;
        })
        .catch((err) => {
          this.loadingFav = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
    },

    getUserSpark() {
      this.loadingFav = true;
      this.axios({
        methos: "GET",
        url: `user-sparks/${this.id}`
      })
        .then((res) => {
          this.loadingFav = false;
          this.user_spark_rows = res.data.data;
        })
        .catch((err) => {
          this.loadingFav = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
    },

    // ============ Get Profile Data
    getUserData() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `users/${this.id}`
      })
        .then((res) => {
          this.userData = res.data.data;

          this.loading = false;
          this.noData = false;
        })
        .catch((err) => {
          this.noData = true;
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
    }
  },

  async mounted() {
    this.canShow = this.$permission.allowed("show-user");
    this.canShowUserAds = this.$permission.allowed("user-ads");
    this.canShowUserFavorites = this.$permission.allowed("user-fav");
    this.canShowUserSpark = this.$permission.allowed("user-spark");

    if (this.id) {
      if (!this.canShow) {
        this.getUserData();
        if (!this.canShowUserAds) {
          this.getUserAds();
        }
        if (!this.canShowUserFavorites) {
          this.getUserFavorites();
        }
        if (!this.canShowUserSpark) {
          this.getUserSpark();
        }
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    }
  }
};
</script>
<style lang="scss">
.userDetails {
  .userTable {
    background-color: transparent;
  }
}
</style>
