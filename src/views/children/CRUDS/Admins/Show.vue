<template>
  <Loader v-if="loading"></Loader>
  <div class="" v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="wrapper show-user" v-else>
      <div class="row">
        <div class="col-md-6 col-xl-4 col-xxl-3">
          <BaseCard>
            <Profile :profileData="profileData" name="rider" />
          </BaseCard>
        </div>
        <div class="col-md-6 col-xl-8 col-xxl-9">
          <div>
            <BaseCard>
              <div class="row">
                <div class="col-md-6 col-xl-4">
                  <StateCard :name="$t('wallet')" :text="$t('appCurrency')" :value="profileData.wallet.toFixed(2)"
                    icon="fal fa-plus" @action="openChargePopup" />
                </div>
                <div class="col-md-6 col-xl-4">
                  <StateCard :name="$t('labels.unReadNotifictaions')" :text="$t('labels.notification')"
                    :value="profileData.unread_notifications" />
                </div>
                <div class="col-md-6 col-xl-4">
                  <StateCard :name="$t('labels.allowedNotifications')" :text="profileData.allow_notifications ? $t('yes') : $t('no')
                    " />
                </div>
                <div class="col-md-6 col-xl-4">
                  <StateCard :name="$t('labels.twoFactorAuthentication')" :text="profileData.two_step_verification ? $t('yes') : $t('no')
                    " />
                </div>
              </div>
            </BaseCard>
            <BaseCard>
              <div class="d-flex flex-wrap">
                <SimpleCard>
                  <p>
                    <span class="">{{ $t("labels.gender") }}</span>: <span>{{ $t(profileData.gender) }}</span>
                  </p>
                </SimpleCard>

                <SimpleCard>
                  <p>
                    <span class="">{{ $t("labels.preferred_language") }}</span>:
                    <span v-if="profileData.preferred_language">{{
                      $t(profileData.preferred_language)
                    }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </p>
                </SimpleCard>
                <SimpleCard>
                  <p>
                    <span class="">{{
                      $t("labels.preferred_payment_method")
                    }}</span>:
                    <span v-if="profileData.preferred_payment_method">{{
                      $t(profileData.preferred_payment_method)
                    }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </p>
                </SimpleCard>
                <SimpleCard v-if="profileData.referral_code">
                  <p>
                    <span class="">{{ $t("labels.referral_code") }}</span>: <span>{{ profileData.referral_code }}</span>
                  </p>
                </SimpleCard>

                <SimpleCard v-if="profileData.front_side_id">
                  <p>
                    <span class="">{{ $t("labels.front_side_id") }}</span>:
                    <span>
                      <v-icon @click="show_model_1(profileData.front_side_id)">fa-eye</v-icon>
                    </span>
                  </p>
                </SimpleCard>
              </div>
            </BaseCard>
            <BaseCard>
              <!-- <h2 class="section_title">{{ $t("frequents") }}</h2> -->
              <v-tabs fixed-tabs dark>
                <v-tab @click="getFrequtentContent('frequent_trips')">
                  رحلات متكررة
                </v-tab>
                <v-tab @click="getFrequtentContent('frequent_pickup')">
                  نقاط التقاء متكررة
                </v-tab>
                <v-tab @click="getFrequtentContent('frequent_destination')">
                  وجهات متكررة
                </v-tab>
              </v-tabs>
              <div class="frequents" v-if="frequentContent.length">
                <img src="@/assets/media/images/Icons/loader.png" v-if="contentLoading" alt="" class="img-fluid" />

                <div class="trips_list" v-else>
                  <carousel :per-page="1" :mouse-drag="true" dir="ltr" :perPageCustom="[[1199, 2]]">
                    <slide v-for="frequent in frequentContent" :key="frequent.id">
                      <!-- <open-street-map :item="frequent" /> -->
                      <frequents-card :item="frequent" />
                    </slide>
                  </carousel>
                </div>
              </div>
              <div v-else class="text-center my-4">
                <span class="redColor fontBold">لا يوجد</span>
              </div>
            </BaseCard>
            <BaseCard>
              <h2 class="section_title">
                {{ $t("trips") }} ({{ orderCount }})
              </h2>
              <main>
                <!-- :search="search" -->
                <v-data-table class="thumb strip trips" :headers="OrdersHeaders" :items="orders"
                  :loading="lastTripLoading" :items-per-page="5" :loading-text="$t('table.loadingData')" item-key="id"
                  :footer-props="{
                    itemsPerPageAllText: $t('all'),
                    pageText: ' ',
                    itemsPerPageText: ' ',
                    showFirstLastPage: false,
                    page: 1,
                    itemsPerPage: 5,
                    itemsLength: orders.length,
                  }">
                  <!-- hide-default-footer -->
                  <!-- Select no data State -->
                  <template v-slot:no-data>
                    {{ $t("table.noData") }}
                  </template>
                  <!-- <template v-slot:footer>
                    {{ $t("table.noData") }}
                  </template> -->
                  <template v-slot:[`item.price`]="{ item }">
                    <span v-if="item.price">{{ item.price }} {{ $t("appCurrency") }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </template>
                  <template v-slot:[`item.actual_time`]="{ item }">
                    <span v-if="item.actual_time">{{ item.actual_time }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </template>
                  <template v-slot:[`item.review`]="{ item }">
                    <span v-if="item.review">{{ item.review }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </template>
                  <template v-slot:[`item.partner`]="{ item }">
                    <span v-if="item.partner">{{
                      item.partner.full_name
                    }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </template>
                </v-data-table>
              </main>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
    <base-model :show="model_1.show" @close="model_1.show = false">
      <div class="notificationPopup">
        <img class="img-fluid" :src="model_1.src" alt="" />
      </div>
    </base-model>
    <base-model :show="chargePopup" @close="chargePopup = false">
      <div class="chargePopup customCard p-3">
        <h3>{{ $t("labels.chargeWallet") }}</h3>

        <div class="row">
          <ValidationObserver ref="formCharge" @submit.prevent="submit">
            <div class="row">
              <ValidationProvider v-slot="{ errors }" :name="$t('labels.monyAmount')" class="col-12"
                rules="required|min:1|min_value:1">
                <base-input :name="$t('labels.monyAmount')" type="number" @keypress="preventMinus"
                  :placeholder="$t('labels.monyAmount')" v-model="data.amount" />

                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" :name="$t('labels.charge_type')" class="col-12" rules="required">
                <base-select-input :class="errors[0] ? 'error' : ''" v-model="data.charge_type" :static="true"
                  :staticItems="chargeTypes" :placeholder="$t('labels.charge_type')"
                  :name="$t('labels.charge_type')"></base-select-input>

                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <div class="button_wrapper center">
                <v-btn @click="chargeSubmited" :disabled="btnLoading" :loading="btnLoading">
                  {{ data.charge_type?.name ?? $t("select_type") }}
                </v-btn>
              </div>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </base-model>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import Profile from "@/components/Pages/Profile/Profile.vue";
import FrequentsCard from "@/components/UI/FrequentsCard.vue";
import OpenStreetMap from "@/components/Maps/OpenStreetMap.vue";

export default {
  props: ["id"],
  components: { Profile, FrequentsCard, Carousel, Slide, OpenStreetMap },
  data() {
    return {
      noData: false,
      breakpoints: {
        1024: {
          perPage: 2,
          snapAlign: "center",
        },
        // 1024 and up
      },
      // ========== Breadcrumbs
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.riders.title"),
          disabled: false,
          href: "/riders/show-all",
        },
        {
          text: this.$t("breadcrumb.riders.show"),
          disabled: true,
          href: "",
        },
      ],
      profileData: null,
      frequentContent: [],
      frequents: {
        frequent_trips: null,
        frequent_pickup: null,
        frequent_destination: null,
      },

      // orders
      orders: [],
      orderCount: [],
      lastTripLoading: false,
      //

      // Charge Popup Model
      chargePopup: false,
      data: {
        amount: null,
        charge_type: null,
      },
      // Show Transactions Table
      showTransactions: true,
      model_1: {
        src: null,
        show: null,
      },
      //Loading
      loading: false,
      btnLoading: false,
      contentLoading: false,

      chargeTypes: [
        {
          id: "add",
          name: this.$t("charge"),
        },
        {
          id: "minus",
          name: this.$t("discharge"),
        },
      ],
      OrdersHeaders: [
        {
          text: this.$t("labels.startPoint"),
          value: "start_location.location",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.to"),
          align: "center",
          value: "end_locations[0].location",
          sortable: false,
        },
        {
          text: this.$t("labels.time"),
          value: "actual_time",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.cost"),
          value: "price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.rate"),
          value: "review",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.partner"),
          value: "partner",
          align: "center",
          sortable: false,
        },
      ],
    };
  },

  methods: {
    // ============ Get Profile Data
    getProfile() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `admins/${this.id}`,
      })
        .then((res) => {
          this.noData = false;
          this.profileData = res.data.data;
          // this.getOrders();
          // this.getFrequents();
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
          this.noData = true;
          this.loading = false;
        });
    },
    getFrequents() {
      this.contentLoading = true;
      this.axios({
        method: "GET",
        url: `rider/${this.id}/frequents`,
      })
        .then((res) => {
          this.frequents = res.data.data;
          this.contentLoading = false;
          this.frequentContent = this.frequents.frequent_trips;
        })
        .catch((err) => {
          this.contentLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
    getOrders() {
      this.lastTripLoading = true;
      this.axios({
        method: "GET",
        url: `rider/${this.id}/orders`,
      })
        .then((res) => {
          this.lastTripLoading = false;
          this.orderCount = res.data.count_trips;
          this.orders = res.data.data;
        })
        .catch((err) => {
          this.lastTripLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
    openChargePopup() {
      this.chargePopup = true;
    },
    chargeSubmited() {
      this.$refs.formCharge.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("amount", this.data.amount);

          data.append("type", this.data.charge_type.id);

          data.append("_method", "PUT");

          let message = this.$t("submitSuccess");
          this.axios({
            method: "POST",
            url: `rider/${this.id}/update-wallet`,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.getProfile();
              this.chargePopup = false;
              this.data.charge_type = null;
              this.data.amount = false;
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
    getFrequtentContent(el) {
      this.frequentContent = [];
      if (el == "frequent_trips") {
        this.frequentContent = this.frequents[el];
      } else {
        this.frequentContent = this.frequents[el].map((el) => {
          return {
            start_location: el,
          };
        });
      }
    },
    show_model_1(e) {
      this.model_1.src = e;
      this.model_1.show = true;
    },
    // chargeSubmited() {
    //   this.getProfile();
    //   this.showTransactions = false;
    //   setTimeout(() => {
    //     this.showTransactions = true;
    //   }, 500);
    // },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getProfile();
  },
};
</script>

<style lang="scss">
.personal_information {
  margin-top: 30px;

  .avatar {
    h3.name {
      margin: 15px 0 0;
      text-align: center;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;

      text-transform: capitalize;

      color: #000000;
    }

    .rate {
      text-align: center;

      button {
        padding: 3px;
      }
    }

    .actions {
      display: flex;
      justify-content: center;

      .action {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 15px;
        background: #ffffff;
        border-radius: 5px;

        &:nth-child(2) {
          margin-inline: 5px;
        }

        font-size: 18px;
        color: var(--main);
      }
    }

    padding-bottom: 20px;
    border-bottom: 1px solid rgba(142, 142, 169, 0.2);
  }

  .user_info {
    margin-top: 10px;

    h5.title {
      font-style: normal;
      font-weight: 400;
      font-size: 16px !important;
      line-height: 22px;
      text-transform: capitalize;
      margin: 0;
      color: var(--mainText);
    }

    p {
      margin: 5px 0 0;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-transform: lowercase;
      color: #000000;
    }

    &:last-child {
      margin-bottom: 15px;
    }
  }

  .user_status {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-transform: capitalize;

    .v-input--selection-controls__input {
      margin: 0;
    }

    .v-input__slot {
      padding: 0;
    }

    margin-top: 15px;
  }
}

.show-user {
  .v-item-group {
    background: linear-gradient(97.46deg, #322176 -1.53%, #2d70ab 132.35%);
    box-shadow: 0px 5px 14px rgb(0 0 0 / 5%);
    border-radius: 10px;

    .v-tabs .v-tab {
      letter-spacing: normal !important;
    }
  }
}

.trips_list {
  .VueCarousel {
    width: 100%;
  }

  .VueCarousel-inner {
    justify-content: flex-end;
  }

  display: flex;
  align-items: center;

  // overflow-x: scroll;
  // padding-bottom: 20px;
  .trip {
    // width: 370px;
    flex-shrink: 0;
    margin-inline-end: 15px;
  }
}
</style>
