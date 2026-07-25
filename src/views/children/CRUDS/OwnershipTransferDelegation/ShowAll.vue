<template>
  <div class="buy_process_all">
    <template>
      <!-- @filterFired="filterFired" -->
      <Breadcrumb :items="items" />

      <the-filter :inputs="inputs" />
      <!-- :custom-filter="helper_filterSearch" -->

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

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>

          <template v-slot:[`item.ownership_buyer_transfer`]="{ item, index }">
            <img
              class="image"
              :src="item.ownership_buyer_transfer"
              @error="ownership_buyer_transferError(index)"
              @click="show_model_1(item.ownership_buyer_transfer)"
              v-if="item.ownership_buyer_transfer"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.owner_buyer_status`]="{ item }">
            <div class="action my-2" v-if="item.owner_buyer_status">
              <div>
                <span class="statuses" :class="item.owner_buyer_status">
                  {{ $t(`status.${item.owner_buyer_status}`) }}
                </span>
              </div>

              <template
                v-if="item.owner_buyer_status === 'ownership_transfer_buyer'"
              >
                <div class="_actions">
                  <v-icon
                    @click="acceptBuyerItem('accept_buyer_ownership', item.id)"
                    class="accept"
                    v-if="!canShowAll"
                    small
                  >
                    fas fa-check
                  </v-icon>

                  <v-icon
                    @click="rejectBuyerItem('reject_buyer_ownership', item.id)"
                    class="delete"
                    v-if="!canShowAll"
                    small
                  >
                    fas fa-times
                  </v-icon>
                </div>
              </template>
            </div>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.ownership_seller_transfer`]="{ item, index }">
            <img
              class="image"
              :src="item.ownership_seller_transfer"
              @error="ownership_seller_transferError(index)"
              @click="show_model_1(item.ownership_seller_transfer)"
              v-if="item.ownership_seller_transfer"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.owner_seller_status`]="{ item }">
            <div class="action my-2" v-if="item.owner_seller_status">
              <div>
                <span class="statuses" :class="item.owner_seller_status">
                  {{ $t(`status.${item.owner_seller_status}`) }}
                </span>
              </div>

              <template
                v-if="item.owner_seller_status === 'ownership_transfer_seller'"
              >
                <div class="_actions">
                  <v-icon
                    @click="
                      acceptSellerItem('accept_seller_ownership', item.id)
                    "
                    class="accept"
                    v-if="!canShowAll"
                    small
                  >
                    fas fa-check
                  </v-icon>

                  <v-icon
                    @click="
                      rejectSellerItem('reject_seller_ownership', item.id)
                    "
                    class="delete"
                    v-if="!canShowAll"
                    small
                  >
                    fas fa-times
                  </v-icon>
                </div>
              </template>
            </div>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.adv_desc`]="{ item }">
            <div
              class="_actions"
              v-if="item.advertisement && item.advertisement.desc"
            >
              <v-icon
                class="show"
                small
                @click="
                  show_description(
                    item.advertisement && item.advertisement.desc
                  )
                "
              >
                fas fa-eye
              </v-icon>
            </div>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <div class="action my-2" v-if="item.status">
              <div>
                <span class="statuses" :class="item.status">
                  <!-- {{ $t(`status.${item.status}`) }} -->
                  {{ item.status_trans }}
                </span>
              </div>
            </div>

            <span class="redColor fontBold" v-else>
              {{ $t("notFound") }}
            </span>
          </template>

          <template v-slot:[`item.show_ad`]="{ item }">
            <div
              class="_actions"
              v-if="item.advertisement && item.advertisement.id"
            >
              <router-link
                v-if="!canShowAd"
                :to="`/advertisements/show/${
                  item.advertisement && item.advertisement.id
                }`"
              >
                <v-icon class="show" small> fal fa-eye </v-icon>
              </router-link>
            </div>
            <template v-else> <div>---</div></template>
          </template>

          <!-- Select actions-->
          <template v-slot:[`item.actions`]="{ item }">
            <template v-if="item.status === 'buyer_transfer'">
              <div class="_actions">
                <v-icon
                  @click="acceptItem('accept_bank_transfer', item.id)"
                  class="accept"
                  v-if="!canShowAll"
                  small
                >
                  fas fa-check
                </v-icon>

                <v-icon
                  @click="rejectItem('reject_bank_transfer', item.id)"
                  class="delete"
                  v-if="!canShowAll"
                  small
                >
                  fas fa-times
                </v-icon>
              </div>
            </template>
            <template v-else>
              <div>---</div>
            </template>
          </template>

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.ownershipDelegation.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.ownershipDelegation.all") }}</span>
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
          text: this.$t("breadcrumb.ownershipDelegation.title"),
          disabled: false,
          href: "/ownership-transfer-delegation/show-all"
        },
        {
          text: this.$t("breadcrumb.ownershipDelegation.all"),
          disabled: true,
          href: ""
        }
      ],
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },

        {
          text: this.$t("labels.ownership_buyer_transfer"),
          align: "center",
          value: "ownership_buyer_transfer",
          sortable: false
        },

        {
          text: this.$t("labels.owner_buyer_status"),
          align: "center",
          value: "owner_buyer_status",
          sortable: false
        },

        {
          text: this.$t("labels.ownership_seller_transfer"),
          align: "center",
          value: "ownership_seller_transfer",
          sortable: false
        },

        {
          text: this.$t("labels.owner_seller_status"),
          align: "center",
          value: "owner_seller_status",
          sortable: false
        },

        {
          text: this.$t("labels.status"),
          align: "center",
          value: "status",
          sortable: false
        },

        {
          text: this.$t("labels.advertisement"),
          align: "center",
          value: "show_ad",
          sortable: false
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false
        }
      ],

      total: 0,
      rows: [],
      search: null,

      showDescription: false,
      descriptionData: "",

      inputs: [
        {
          keyName: "keyword"
        }
      ]
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
    acceptBuyerItem(status, id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("accept")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAcceptRejectBuyer(status, id);
        }
      });
      // End:: Sweet Alert  Modal
    },

    rejectBuyerItem(status, id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("reject")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAcceptRejectBuyer(status, id);
        }
      });
      // End:: Sweet Alert  Modal
    },
    acceptSellerItem(status, id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("accept")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAcceptRejectSeller(status, id);
        }
      });
      // End:: Sweet Alert  Modal
    },

    rejectSellerItem(status, id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("reject")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAcceptRejectSeller(status, id);
        }
      });
      // End:: Sweet Alert  Modal
    },
    acceptItem(status, id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("accept")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAcceptReject(status, id);
        }
      });
      // End:: Sweet Alert  Modal
    },

    rejectItem(status, id) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("reject")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAcceptReject(status, id);
        }
      });
      // End:: Sweet Alert  Modal
    },

    // ===== Handle accept or reject
    handleAcceptReject(status, id) {
      const data = new FormData();
      // data.append("status", status);

      this.axios({
        method: "POST",
        url: `${status}/${id}`,
        data: data
      })
        .then(() => {
          this.setRows();
          this.$swal({
            title:
              status === "accept_bank_transfer"
                ? this.$t("acceptedSuccessfully")
                : this.$t("rejectedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
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

    // ===== Handle accept or reject buyer
    handleAcceptRejectBuyer(status, id) {
      const data = new FormData();
      // data.append("status", status);

      this.axios({
        method: "POST",
        url: `${status}/${id}`,
        data: data
      })
        .then(() => {
          this.setRows();
          this.$swal({
            title:
              status === "accept_buyer_ownership"
                ? this.$t("acceptedSuccessfully")
                : this.$t("rejectedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
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

    // ===== Handle accept or reject seller
    handleAcceptRejectSeller(status, id) {
      const data = new FormData();
      // data.append("status", status);

      this.axios({
        method: "POST",
        url: `${status}/${id}`,
        data: data
      })
        .then(() => {
          this.setRows();
          this.$swal({
            title:
              status === "accept_seller_ownership"
                ? this.$t("acceptedSuccessfully")
                : this.$t("rejectedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
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

    // ===== showDescription
    show_description(item) {
      this.showDescription = true;
      this.descriptionData = item;
    },

    closeDescModal() {
      this.showDescription = !this.showDescription;
    },

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `owner_ships`,
        params: {
          page: this.paginations.current_page,
          per_page: this.$route.query.per_page,
          keyword: this.$route.query.keyword,
          ad_id: this.$route.query.ad_id
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

    ownership_buyer_transferError(index) {
      this.rows[
        index
      ].ownership_buyer_transfer = require("@/assets/media/images/logo/logo.png");
    },

    ownership_seller_transferError(index) {
      this.rows[
        index
      ].ownership_seller_transfer = require("@/assets/media/images/logo/logo.png");
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

  created() {
    this.canEdit = this.$permission.allowed(
      "ownership-transfer-delegation/edit"
    );
    this.canDelete = this.$permission.allowed(
      "ownership-transfer-delegation/delete"
    );
    this.canAdd = this.$permission.allowed("ownership-transfer-delegation/add");
    this.canShow = this.$permission.allowed(
      "ownership-transfer-delegation/show"
    );
    this.canShowAll = this.$permission.allowed(
      "ownership-transfer-delegation/show-all"
    );
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
