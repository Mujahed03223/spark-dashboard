<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="wrapper" v-else @click="notification_menu = false">
      <div class="row">
        <!-- <div class="col-md-6 col-xl-4">
          <Profile :profileData="profileData" name="company" />
        </div> -->
        <div class="col-md-12 col-xl-12">
          <div>
            <BaseCard>
              <div class="row">
                <div class="col-md-6 col-xl-4" v-if="profileData.full_name">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.fullname") }}</h4>
                      <span>{{ profileData.full_name }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div
                  class="col-md-6 col-xl-4"
                  v-if="profileData.phone_complete_form"
                >
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.phone") }}</h4>
                      <span>{{ profileData.phone_complete_form }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-4" v-if="profileData.rate_avg">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.rate") }}</h4>
                      <span>{{ profileData.rate_avg }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-4">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.is_admin_active_user") }}</h4>
                      <span
                        :class="
                          profileData.is_admin_active_user
                            ? 'active'
                            : 'inactive'
                        "
                        >{{
                          profileData.is_admin_active_user
                            ? $t("yes")
                            : $t("no")
                        }}</span
                      >
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <!-- <div class="col-md-6 col-xl-4">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.is_ban") }}</h4>
                      <span
                        :class="profileData.is_ban ? 'inactive' : 'active'"
                        >{{ profileData.is_ban ? $t("yes") : $t("no") }}</span
                      >
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div> -->
              </div>
            </BaseCard>
            <BaseCard>
              <div class="row">
                <div class="col-md-6 col-xl-4" v-if="profileData.country">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.country") }}</h4>
                      <span>{{ profileData.country?.name }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-4" v-if="profileData.city">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.city") }}</h4>
                      <span>{{ profileData.city?.name }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div
                  class="col-md-6 col-xl-4"
                  v-if="profileData.commercial_registration_no"
                >
                  <div class="order_card">
                    <div class="exp">
                      <h4>رقم السجل التجاري</h4>
                      <span>{{ profileData.commercial_registration_no }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
            <BaseCard v-if="profileData.services.length">
              <div class="row">
                <div
                  class="col-md-6 col-xl-4"
                  v-for="item in profileData.services"
                  :key="item.id"
                >
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.service") }}</h4>
                      <span>{{ item.title }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div></div
            ></BaseCard>
          </div>
        </div>
      </div>
    </div>
    <base-model :show="model_1.show" @close="model_1.show = false">
      <div class="notificationPopup">
        <img class="img-fluid" :src="model_1.src" alt="" />
      </div>
    </base-model>
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
          href: "/",
        },
        {
          text: this.$t("breadcrumb.companies.title"),
          disabled: false,
          href: "/companies/show-all",
        },
        {
          text: this.$t(`breadcrumb.companies.show`),
          disabled: true,
          href: "",
        },
      ],
      notification_menu: false,
      noData: false,
      profileData: null,

      // Charge Popup Model
      chargePopup: false,
      data: {
        amount: null,
        charge_type: null,
      },
      // Show Transactions Table

      model_1: {
        src: null,
        show: null,
      },
      //Loading
      loading: false,
      btnLoading: false,
      // orders
      orders: [],
      rows: [],
      notifications: [],
      statistics: [],
      transactions: [],
      orderCount: [],
      lastTripLoading: false,
      //
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
          value: "avatar",
          sortable: false,
        },
        {
          text: this.$t("labels.fullname"),
          value: "full_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.email"),
          value: "email",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone_complete_form",
          sortable: false,
        },
        {
          text: this.$t("labels.gender"),
          value: "gender",
          align: "center",
          sortable: true,
        },
        {
          text: this.$t("labels.is_admin_active_user"),
          align: "center",
          value: "is_admin_active_user",
          sortable: true,
        },
        {
          text: this.$t("labels.is_active"),
          align: "center",
          value: "is_active",
          sortable: true,
        },
        {
          text: this.$t("labels.is_locked"),
          align: "center",
          value: "is_locked",
          sortable: true,
        },
        {
          text: this.$t("labels.is_ban"),
          align: "center",
          value: "is_ban",
          sortable: true,
        },
        {
          text: this.$t("labels.created_at"),
          value: "created_at",
          align: "center",
          sortable: true,
        },
        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      // ========== Filter
      inputs: [
        {
          keyName: "keyword",
        },
        {
          keyName: "start_date",
        },
        {
          keyName: "end_date",
        },
      ],
    };
  },

  methods: {
    showItem(item) {
      this.$router.push({ path: `/companies/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/companies/edit/` + item.id });
    },
    showVehicle(item) {
      this.$router.push({ path: `/vehicles/show/` + item.id });
    },
    // ============ Get Profile Data
    getProfile() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `companies/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          this.profileData = res.data.data;
          // this.setRows();
          this.noData = false;
        })
        .catch((err) => {
          this.noData = true;
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },

    show_model_1(e) {
      this.model_1.src = e;
      this.model_1.show = true;
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
    },
  },
  watch: {
    ["$route.query"]() {
      if (this.$route.query.page) {
        this.paginations.current_page = +this.$route.query.page;

        // this.setRows();
      } else {
        this.paginations.current_page = 1;
        // this.setRows();
      }
    },
  },

  created() {
    this.canEdit = this.$permission.allowed("companies/edit/");
    this.canDelete = this.$permission.allowed("companies/delete");
    this.canAdd = this.$permission.allowed("companies/add");
    this.canShow = this.$permission.allowed("companies/show/");

    this.getProfile();
  },
};
</script>

<style lang="scss">
.order_card {
  background: #ffffff;
  border-radius: 10px;
  padding: 13px;
  @include flexSpaceBetweenAlignment;
  align-items: normal;
  .img {
    @include flexEndAlignment;
    flex-direction: column;
    img {
      opacity: 0.7;
      width: 95px;
    }
  }
  .exp {
    @include flexSpaceBetweenAlignment;
    flex-direction: column;
    h4 {
      font-size: 19px;
    }
    span {
      font-size: 16px;
      height: 55px;
      &.tit {
        font-size: 19px;
        color: #000000;
        display: inline-block;
        margin-inline-end: 5px;
        height: auto;
      }
    }
    img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
    }
  }
  &.ver_design {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    .img {
      @include flexEndAlignment;
      flex-direction: column;
      align-items: end;
      width: 100%;
    }
    .exp {
      img {
        width: 70px;
        height: 70px;
      }
      min-height: 200px;
      li {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
