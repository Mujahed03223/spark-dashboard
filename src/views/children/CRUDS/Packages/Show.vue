<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />

    <div class="wrapper packageDetails" v-else>
      <div class="row">
        <div class="col-12">
          <simple-card classes="w-100 h-100">
            <div class="image-container mb-5">
              <img
                class="package_img"
                @error="imageError"
                :src="packageData?.image"
                alt="package_img"
              />
            </div>

            <div class="col-12 my-2">
              <div class="row">
                <div
                  class="package_info col-md-6 col-lg-3"
                  v-for="info in packageInfo"
                  :key="info?.label"
                >
                  <h5 class="title">{{ $t(info?.label) }}</h5>
                  <p>
                    <span v-if="packageData?.[info?.key]">
                      {{ packageData?.[info?.key] }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </simple-card>
        </div>

        <div class="col-12 mt-5">
          <v-data-table
            class="thumb strip auctionUsersTable"
            :headers="headers"
            :items="rows.length > 0 ? rows : []"
            :loading="isLoading"
            :loading-text="$t('table.loadingData')"
            item-key="id"
            hide-default-footer
          >
            <!-- ================== You Can use any slots you want ================== -->

            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.image`]="{ item, index }">
              <img
                class="image"
                :src="item.image"
                @error="imageSubscriberError(index)"
                @click="show_model_1(item.image)"
                v-if="item.image"
              />
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.name`]="{ item }">
              <span v-if="item.name">
                {{ item.name }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.phone`]="{ item }">
              <span v-if="item.phone">
                {{ item?.phone_code + item.phone }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <div class="_actions" v-if="item?.id">
                <router-link
                  v-if="!canShowUser"
                  :to="`/users/show/${item?.id}/cards`"
                >
                  <v-icon class="show" small> fal fa-eye </v-icon>
                </router-link>

                <button
                  @click="cancelPackage(id, item.id)"
                  class="d-flex align-items-center justify-content-center gap-2"
                >
                  <span class="text-danger fw-bold">
                    {{ $t("BUTTONS.cancel_package") }}
                  </span>

                  <i class="fal fa-times-circle text-danger"></i>
                </button>
              </div>
              <template v-else> <div>---</div></template>
            </template>

            <!-- Select no data State -->
            <template v-slot:no-data>
              {{ $t("table.noData") }}
            </template>

            <!-- ======================== Start Top Section ======================== -->
            <template v-slot:top>
              <h3 class="table-title title">
                {{ $t("labels.package_subscribers") }}
              </h3>
              <!-- Delete dialog -->

              <!-- Add & Delete -->
            </template>
            <!-- ======================== End Top Section ======================== -->
          </v-data-table>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script>
export default {
  props: ["id"],

  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/"
        },
        {
          text: this.$t("breadcrumb.package.title"),
          disabled: false,
          href: "/package/show-all"
        },
        {
          text: this.$t(`breadcrumb.package.show`),
          disabled: true,
          href: ""
        }
      ],

      noData: false,
      packageData: null,

      //   loading
      loading: false,
      isLoading: false,

      packageInfo: [
        { label: "labels.title", key: "title" },
        { label: "labels.price", key: "price" },
        { label: "labels.ordering", key: "ordering" },
        { label: "labels.auction_no", key: "auction_no" }
      ],

      rows: [],
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },

        {
          text: this.$t("labels.image"),
          value: "image",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.name"),
          value: "name",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("labels.phone"),
          value: "phone",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false
        }
      ]
    };
  },

  methods: {
    imageError(event) {
      event.target.src = require("@/assets/media/images/Icons/no-data.svg");
    },

    imageSubscriberError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },

    cancelPackage(packageId, userId) {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("confirm")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleCancelPackage(packageId, userId);
        }
      });
      // End:: Sweet Alert  Modal
    },

    handleCancelPackage(packageId, userId) {
      const data = new FormData();
      data.append("package_id", packageId);

      this.axios({
        method: "POST",
        url: `return_package/${userId}`,
        data: data
      })
        .then(() => {
          this.getPackageData();
          this.$swal({
            title: this.$t("canceledSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
          this.isLoading = false;

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

    parseErrorMessage(err, fallbackMessage = this.$t("somethingWentWrong")) {
      let errorMsg =
        err.response?.data?.message ?? err.response?.data?.messages;

      if (Array.isArray(errorMsg)) {
        // if it's an array, join it with commas or line breaks
        errorMsg = errorMsg.join(", ");
      } else if (typeof errorMsg !== "string") {
        // fallback if it's an object or undefined
        errorMsg = fallbackMessage;
      }

      return errorMsg;
    },

    getPackageSubscribers() {
      this.isLoading = true;

      this.axios({
        method: "GET",
        url: `get_subscribers/${this.id}`
      })
        .then((res) => {
          //   this.rows = Array.isArray(res?.data?.data) ? res.data.data : [];
          this.rows = res?.data?.data || [];

          this.isLoading = false;
        })

        .catch((err) => {
          this.isLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: this.parseErrorMessage(err, this.$t("somethingWentWrong"))
            // message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },

    getPackageData() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `package/${this.id}`
      })
        .then((res) => {
          this.packageData = res?.data?.data;

          this.loading = false;
          this.noData = false;
          this.getPackageSubscribers();
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
    this.canShow = this.$permission.allowed("package/show");
    this.canShowUser = this.$permission.allowed("users/show");

    if (this.id) {
      if (!this.canShow) {
        this.getPackageData();
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    }
  }
};
</script>

<style lang="scss">
.packageDetails {
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .package_img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }

  .package_info {
    margin-bottom: 20px;

    h5.title {
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      text-transform: capitalize;
      color: var(--main);
    }

    p {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-transform: lowercase;
      word-break: break-all;
      color: var(--mainText);
    }
  }
}
</style>
