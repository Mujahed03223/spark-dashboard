<template>
  <div class="package_all">
    <template>
      <!-- @filterFired="filterFired" -->
      <Breadcrumb :items="items" />

      <!-- <the-filter :inputs="inputs" /> -->
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

          <template v-slot:[`item.extendIcon`]="{ item }">
            <div class="_actions">
              <v-icon class="show" small @click="clickRow(item)">
                fas fa-angle-double-down
              </v-icon>
            </div>
          </template>

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>

          <template v-slot:[`item.package`]="{ item }">
            <span v-if="item.package">
              {{ item.package?.title }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.user`]="{ item }">
            <span v-if="item.user">
              {{ item.user?.name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.bank_name`]="{ item }">
            <span v-if="item.bank_name">
              {{ item.bank_name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.account_name`]="{ item }">
            <span v-if="item.account_name">
              {{ item.account_name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.account_number`]="{ item }">
            <span v-if="item.account_number">
              {{ item.account_number }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.iban`]="{ item }">
            <span v-if="item.iban">
              {{ item.iban }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <div v-if="item.status">
              <span class="statuses" :class="item.status">
                {{ $t(`status.${item.status}`) }}
              </span>
            </div>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <!-- Select actions-->
          <template v-slot:[`item.actions`]="{ item }">
            <template v-if="item.status === 'hold'">
              <div class="_actions">
                <v-icon
                  @click="acceptItem('accept_return_packages', item.id)"
                  class="accept"
                  v-if="!canShowAll"
                  small
                >
                  fas fa-check
                </v-icon>

                <v-icon
                  @click="rejectItem('reject_return_packages', item.id)"
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

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.return_packages.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.return_packages.all") }}</span>
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
          text: this.$t("breadcrumb.return_packages.title"),
          disabled: false,
          href: "/return-packages/show-all",
        },
        {
          text: this.$t("breadcrumb.return_packages.all"),
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
          text: this.$t("labels.package"),
          value: "package",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.user"),
          value: "user",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.bank_name"),
          value: "bank_name",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.account_name"),
          value: "account_name",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.account_number"),
          value: "account_number",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.iban"),
          value: "iban",
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

      rows: [],

      search: null,

      inputs: [
        {
          keyName: "keyword",
        },
      ],
    };
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
              status === "accept_return_packages"
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

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `return_packages`,
        params: {
          page: this.paginations.current_page,
          //   keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
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
    imageError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },
    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: `/return-packages/add` });
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
    this.canEdit = this.$permission.allowed("return-package/edit");
    this.canDelete = this.$permission.allowed("return-package/delete");
    this.canAdd = this.$permission.allowed("return-package/add");
    this.canShow = this.$permission.allowed("return-package/show");
    this.canShowAll = this.$permission.allowed("return-package/show-all");

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
