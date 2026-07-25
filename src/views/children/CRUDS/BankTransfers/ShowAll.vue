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

          <template v-slot:[`item.bank_transfer`]="{ item, index }">
            <img
              class="image"
              :src="item.bank_transfer"
              @error="bank_transferError(index)"
              @click="show_model_1(item.bank_transfer)"
              v-if="item.bank_transfer"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.id_image`]="{ item, index }">
            <img
              class="image"
              :src="item.id_image"
              @error="id_imageError(index)"
              @click="show_model_1(item.id_image)"
              v-if="item.id_image"
            />
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
              <!-- <div v-if="!canEdit">
                <div class="mt-3 d-flex align-items-center justify-content-center gap-3">
                  <button
                    v-if="item.status === 'admin_approved_all'"
                    :disabled="canEdit"
                    @click="finishItem(item.advertisement_id)"
                    class="d-flex align-items-center justify-content-center gap-2"
                  >
                    <span class="text-success fw-bold">
                      {{ $t("status.finish_sell_ad") }}
                    </span>

                    <i class="fal fa-check-circle text-success"></i>
                  </button>
                </div>
              </div> -->
            </div>

            <span class="redColor fontBold" v-else>
              {{ $t("notFound") }}
            </span>
          </template>

          <template v-slot:[`item.show_ad`]="{ item }">
            <div class="_actions" v-if="item.advertisement && item.advertisement.id">
              <router-link
                :to="`/advertisements/show/${
                  item.advertisement && item.advertisement.id
                }`"
              >
                <v-icon class="show" v-if="!canShow" small> fal fa-eye </v-icon>
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
              {{ $t("breadcrumb.bankTransfers.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.bankTransfers.all") }}</span>
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
          <div class="pagination_container text-center mb-5 d-flex justify-content-end">
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
      <base-model @close="model_1.show_model = false" :show="model_1.show_model">
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
          text: this.$t("breadcrumb.bankTransfers.title"),
          disabled: false,
          href: "/bank-transfers/show-all",
        },
        {
          text: this.$t("breadcrumb.bankTransfers.all"),
          disabled: true,
          href: "",
        },
      ],
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.bank_transfer"),
          align: "center",
          value: "bank_transfer",
          sortable: false,
        },
        {
          text: this.$t("labels.id_image"),
          align: "center",
          value: "id_image",
          sortable: false,
        },

        {
          text: this.$t("labels.status"),
          align: "center",
          value: "status",
          sortable: false,
        },
        {
          text: this.$t("labels.advertisement"),
          align: "center",
          value: "show_ad",
          sortable: false,
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      total: 0,
      rows: [],
      search: null,

      inputs: [
        {
          keyName: "keyword",
        },
      ],
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
        confirmButtonText: this.$t("accept"),
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
        confirmButtonText: this.$t("reject"),
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
        data: data,
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
            confirmButtonText: this.$t("ok"),
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
            confirmButtonText: this.$t("cancel"),
          });
        });
    },

    // finishItem(id) {
    //   // Start:: Sweet Alert  Modal
    //   this.$swal({
    //     title: this.$t("finish_confirmation"),
    //     text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     cancelButtonText: this.$t("cancel"),
    //     confirmButtonText: this.$t("accept"),
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.handleFinishItem(id);
    //     }
    //   });
    //   // End:: Sweet Alert  Modal
    // },

    // handleFinishItem(itemId) {
    //   this.axios
    //     .get(`finish/${itemId}`)
    //     .then(() => {
    //       this.$swal({
    //         title: this.$t("finishedSuccessfully"),
    //         icon: "success",
    //         confirmButtonColor: "#3085d6",
    //         confirmButtonText: this.$t("ok"),
    //       });
    //     })
    //     .catch((err) => {
    //       this.isLoading = false;
    //       this.setRows();

    //       let message = "";
    //       err.response?.data.message
    //         ? (message = err.response.data.message)
    //         : (message = err.response.data.messages);
    //       this.$swal({
    //         title: message,
    //         icon: "error",
    //         confirmButtonColor: "#d33",
    //         confirmButtonText: this.$t("cancel"),
    //       });
    //     });
    // },

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `buy_process`,
        params: {
          page: this.paginations.current_page,
          per_page: this.$route.query.per_page,
          keyword: this.$route.query.keyword,
          ad_id: this.$route.query.ad_id,
        },
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
          let message = err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },
    bank_transferError(index) {
      this.rows[index].bank_transfer = require("@/assets/media/images/logo/logo.png");
    },

    id_imageError(index) {
      this.rows[index].id_image = require("@/assets/media/images/logo/logo.png");
    },

    // ===== Delete

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

    // ==================== End CRUD ====================
  },

  created() {
    this.canEdit = this.$permission.allowed("bank-transfers/edit");
    this.canDelete = this.$permission.allowed("bank-transfers/delete");
    this.canAdd = this.$permission.allowed("bank-transfers/add");
    this.canShow = this.$permission.allowed("bank-transfers/show");
    this.canShowAll = this.$permission.allowed("bank-transfers/show-all");

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
