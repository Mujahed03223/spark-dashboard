<template>
  <div class="advertisements_all">
    <template>
      <!-- @filterFired="filterFired" -->
      <Breadcrumb :items="items" />

      <the-filter :inputs="inputs" />
      <!-- :custom-filter="helper_filterSearch" -->

      <main>
        <v-data-table
          class="thumb strip adTable"
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

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.image`]="{ item, index }">
            <img
              class="start_image"
              :src="item.image"
              @error="imageError(index)"
              @click="show_img_modal(item.image)"
              v-if="item.image"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.title`]="{ item }">
            <span v-if="item.title">
              {{ item.title }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.user`]="{ item, index }">
            <router-link
              v-if="item?.user?.name"
              :to="`/users/show/${item?.user?.id}`"
            >
              <div v-if="item.user" class="d-flex user-section">
                <img
                  width="55"
                  height="55"
                  :src="item?.user?.image"
                  :alt="item?.user?.name"
                  @error="userImageError(index)"
                />

                <h3 class="title">
                  {{ item?.user?.name }}
                </h3>
              </div>
            </router-link>
            <span class="redColor fontBold" v-else> {{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.rate`]="{ item }">
            <div class="rate">
              <v-rating
                readonly
                background-color="#FFD700"
                color="#FFD700"
                half-increments
                length="5"
                size="20"
                :value="item.rate"
              ></v-rating>
            </div>
            <!-- <span class="redColor fontBold" v-else>
              {{ $t("notFound") }}
            </span> -->
          </template>

          <template v-slot:[`item.desc`]="{ item }">
            <div class="_actions1" v-if="item.desc">
              <v-icon class="show" small @click="show_description(item.desc)">
                fas fa-eye
              </v-icon>
            </div>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.main_category`]="{ item }">
            <span v-if="item.main_category && item.main_category.title">
              {{ item.main_category.title }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.board_ar`]="{ item }">
            <span v-if="item.board_ar">
              {{ item.board_ar }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.board_en`]="{ item }">
            <span v-if="item.board_en">
              {{ item.board_en }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.delivery_buyer`]="{ item }">
            <div class="action my-2" v-if="item.delivery_buyer">
              <div>
                <span class="statuses" :class="item.delivery_buyer">
                  <!-- {{ $t(`status.${item.ads_status}`) }} -->
                  {{ item.delivery_buyer_trans }}
                </span>
              </div>
            </div>

            <span class="redColor fontBold" v-else>
              {{ $t("notFound") }}
            </span>
          </template>

          <template v-slot:[`item.delivery_seller`]="{ item }">
            <div class="action my-2" v-if="item.delivery_seller">
              <div>
                <span class="statuses" :class="item.delivery_seller">
                  <!-- {{ $t(`status.${item.ads_status}`) }} -->
                  {{ item.delivery_seller_trans }}
                </span>
              </div>
            </div>

            <span class="redColor fontBold" v-else>
              {{ $t("notFound") }}
            </span>
          </template>

          <template v-slot:[`item.ads_status`]="{ item }">
            <div class="action my-2" v-if="item.ads_status">
              <div>
                <span class="statuses" :class="item.ads_status">
                  {{ item.status_trans }}
                  <!-- {{ $t(`status.${item.ads_status}`) }} -->
                </span>
              </div>
              <div v-if="!canEdit">
                <div
                  class="mt-3 d-flex align-items-center justify-content-center gap-3"
                >
                  <button
                    v-if="item.ads_status === 'delivery_uploaded'"
                    :disabled="canEdit"
                    @click="finishItem(item.id)"
                    class="d-flex align-items-center justify-content-center gap-2"
                  >
                    <span class="text-success fw-bold">
                      {{ $t("status.finish_sell_ad") }}
                    </span>

                    <i class="fal fa-check-circle text-success"></i>
                  </button>
                </div>
              </div>
            </div>

            <span class="redColor fontBold" v-else>
              {{ $t("notFound") }}
            </span>
          </template>

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="_actions1">
              <v-icon
                class="show"
                v-if="!canShowAd"
                small
                @click="showItem(item)"
              >
                fal fa-eye
              </v-icon>

              <deleter
                v-if="!canDelete"
                :items="rows"
                name="advertisements"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.complete_selling.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.complete_selling.all") }}</span>
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

      <!-- Start Desc_Model -->
      <base-model :show="showDescription" @close="closeDescModal">
        <div>
          <p class="with_border" v-html="descriptionData || $t('notFound')"></p>
        </div>
      </base-model>
      <!-- End Desc_Model -->
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
          href: "/"
        },
        {
          text: this.$t("breadcrumb.complete_selling.title"),
          disabled: false,
          href: "/complete-selling/show-all"
        },
        {
          text: this.$t("breadcrumb.complete_selling.all"),
          disabled: true,
          href: ""
        }
      ],
      // ========== headers
      headers: [
        {
          text: "#",
          align: "start",
          value: "index",
          sortable: false
        },
        {
          text: this.$t("labels.board_image"),
          align: "start",
          value: "image",
          sortable: false
        },
        // {
        //   text: this.$t("labels.title"),
        //   value: "title",
        //   align: "start",
        //   sortable: false,
        // },
        {
          text: this.$t("labels.user"),
          value: "user",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.board_no") + " " + this.$t("inArabic"),
          value: "board_ar",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.board_no") + " " + this.$t("inEnglish"),
          value: "board_en",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.desc"),
          value: "desc",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.main_category"),
          value: "main_category",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.delivery_buyer_status"),
          value: "delivery_buyer",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.delivery_seller_status"),
          value: "delivery_seller",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.status"),
          value: "ads_status",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.rate"),
          value: "rate",
          align: "start",
          sortable: false
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "start",
          sortable: false
        }
      ],

      rows: [],
      search: null,

      model_1: {
        show_model: false,
        model_img_src: ""
      },

      showDescription: false,
      descriptionData: "",

      showForm: false,
      isLoading: false,

      inputs: [
        {
          keyName: "keyword"
        }
      ]
    };
  },

  methods: {
    // ===== showForm
    show_modal(item) {
      this.showForm = true;
      this.itemId = item;
    },

    closeForm() {
      this.showForm = !this.showForm;
    },

    show_img_modal(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },

    // ===== showDescription
    show_description(item) {
      this.showDescription = true;
      this.descriptionData = item;
    },

    closeDescModal() {
      this.showDescription = !this.showDescription;
    },

    finishItem(id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("finish_confirmation"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("accept")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleFinishItem(id);
        }
      });
      // End:: Sweet Alert  Modal
    },

    handleFinishItem(itemId) {
      this.axios
        .get(`finish/${itemId}`)
        .then(() => {
          this.$swal({
            title: this.$t("finishedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
          this.isLoading = false;
          this.setRows();

          let message = "";
          err.response?.data.message
            ? (message = err.response.data.message)
            : (message = err.response.data.messages);
          this.$swal({
            title: message,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: this.$t("cancel")
          });
        });
    },

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `advertisements`,
        params: {
          page: this.paginations.current_page,
          per_page: this.$route.query.per_page,
          keyword: this.$route.query.keyword,
          status: "admin_approved_ownership"
        }
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
            displayMode: 2,
            title: this.$t("validation.error"),
            message: message
          });
          this.loading = false;
        });
    },
    imageError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },
    userImageError(index) {
      this.rows[
        index
      ].user.image = require("@/assets/media/images/logo/logo.png");
    },
    // ==================== Start CRUD ====================

    showItem(item) {
      this.$router.push({ path: `/advertisements/show/` + item.id });
    },

    // ===== Delete

    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: e })
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      this.setRows();
    }

    // ==================== End CRUD ====================
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
  created() {
    this.canEdit = this.$permission.allowed("complete-selling/edit");
    this.canDelete = this.$permission.allowed("advertisements/delete");
    this.canAdd = this.$permission.allowed("complete-selling/add");
    this.canShow = this.$permission.allowed("complete-selling/show");
    this.canShowAll = this.$permission.allowed("complete-selling/show-all");
    this.canShowAd = this.$permission.allowed("advertisements/show");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }

    // Set Rows
    if (!this.canShowAll) {
      this.setRows();
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  }
};
</script>
<style lang="scss">
.adTable {
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr:last-child
    > th {
    text-align: start !important;

    // &:last-child {
    //   text-align: center !important;
    // }
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
    text-align: start !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
    text-align: center !important;
  }
}

.user-section {
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  gap: 5px;

  img {
    max-width: 100%;
    width: 50px;
    min-height: 50px;
    border-radius: 50%;
    margin-inline-end: 10px;
  }

  h3.title {
    color: var(--cardTitle);
    overflow: hidden;
    font-size: 14px !important;
    margin: 0px !important;
    line-height: normal;
  }
}
</style>
