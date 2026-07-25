<template>
  <Loader v-if="loading"></Loader>
  <div class="profile fadeIn" v-else>
    <div class="row" v-if="profileData">
      <div class="col-lg-9 order-2 order-lg-1">
        <div class="mainContent">
          <profile-personal-info
            :data="profileData"
            :userType="userType"
            @updateData="getProfile"
          />

          <profile-trips
            v-if="userType != 'contributors'"
            :trips="profileData.orders"
            :id="profileData.personal_info.id"
            :type="userType"
          />

          <profile-transactions
            :transactions="profileData.wallet_transactions"
          />

          <profile-rates
            v-if="userType != 'contributors'"
            :rates="profileData.rate"
            :rate_avg="profileData.rate_avg"
          />

          <profile-drivers
            v-if="userType == 'contributors'"
            :drivers="profileData.driver"
            :driversCount="profileData.drivers_count"
          />

          <profile-vehicles
            :vehicles="profileData.vehicle"
            v-if="userType == 'contributors' || userType == 'drivers'"
            :vehiclesCount="profileData.vehicles_count"
          />

          <driver-files
            v-if="userType == 'drivers'"
            :files="[
              {
                criminal_record_info_image:
                  profileData.personal_info.criminal_record_info_image,
                driver_license_image:
                  profileData.personal_info.driver_license_image,
                id_front_image: profileData.personal_info.id_front_image,
                id_back_image: profileData.personal_info.id_back_image,
              },
            ]"
          />

          <profile-reports :vehicles="profileData.reports" />
        </div>
      </div>

      <div class="col-lg-3 order-1 order-lg-2">
        <aside class="charts_aside">
          <BalanceCard
            :wallet="profileData.wallet"
            :orders_count="profileData.orders_count"
            :cancelled_orders_count="profileData.cancelled_orders_count"
            :finished_orders_count="profileData.finished_orders_count"
          />

          <PointsCard
            v-if="userType != 'contributors'"
            :points="profileData.points"
            :id="id"
            @chargeSubmited="chargeSubmited"
          />

          <SavedCards
            class="my-5"
            :id="id"
            @chargeSubmited="chargeSubmited"
            @toggleTransaction="showTransactions = !showTransactions"
          />

          <TripCards
            :wallet="profileData.wallet"
            :orders_count="profileData.orders_count"
            :scheduled_orders_count="profileData.scheduled_orders_count"
            :cancelled_orders_count="profileData.cancelled_orders_count"
            :in_progress_orders_count="profileData.in_progress_orders_count"
            :finished_orders_count="profileData.finished_orders_count"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// Layouts
import ProfilePersonalInfo from "@/components/Pages/Profile/ProfilePersonalInfo.vue";
import ProfileTrips from "@/components/Pages/Profile/ProfileTrips.vue";
import ProfileTransactions from "@/components/Pages/Profile/ProfileTransactions.vue";
import ProfileRates from "@/components/Pages/Profile/ProfileRates.vue";
import ProfileDrivers from "@/components/Pages/Profile/ProfileDrivers.vue";
import ProfileVehicles from "@/components/Pages/Profile/ProfileVehicles.vue";
import ProfileReports from "@/components/Pages/Profile/ProfileReports.vue";
import DriverFiles from "@/components/Pages/Profile/DriverFiles.vue";
// Charsts
import BalanceCard from "@/components/Pages/Profile/Charts/BalanceCard.vue";
import TripCards from "@/components/Pages/Profile/Charts/TripCards.vue";
import PointsCard from "@/components/Pages/Profile/Charts/PointsCard.vue";
import SavedCards from "@/components/Pages/Profile/Charts/SavedCards.vue";

export default {
  components: {
    // Layouts
    ProfilePersonalInfo,
    ProfileTrips,
    ProfileTransactions,
    ProfileRates,
    ProfileDrivers,
    ProfileVehicles,
    ProfileReports,
    DriverFiles,
    // Charts
    BalanceCard,
    TripCards,
    PointsCard,
    SavedCards,
  },
  props: ["id"],

  data() {
    return {
      profileData: null,

      userType: "",

      // Charge Popup Model
      chargePopup: false,

      // Show Transactions Table
      showTransactions: true,

      //Loading
      loading: false,
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    // ============ Get Profile Data
    getProfile() {
      this.loading = true;
      let userType = "";

      if (this.$route.path.includes("contributors")) {
        userType = "contributors";
      }
      if (this.$route.path.includes("partners")) {
        userType = "partner";
      }
      if (this.$route.path.includes("riders")) {
        userType = "rider";
      }

      this.userType = userType;

      this.axios({
        method: "GET",
        url: `${userType}/${this.id}`,
      })
        .then((res) => {
          this.profileData = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    openChargePopup() {
      this.chargePopup = true;
    },

    chargeSubmited() {
      this.getProfile();
      this.showTransactions = false;
      setTimeout(() => {
        this.showTransactions = true;
      }, 500);
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getProfile();

    // BreadCrumb
    let title = "";
    if (this.userType == "rider") {
      title = "الصفحه الشخصيه للعميل";
    }
    if (this.userType == "partner") {
      title = "الصفحه الشخصيه للسائق";
    }
    if (this.userType == "contributors") {
      title = "الصفحه الشخصيه للشركه";
    }

    this.set_breadcrumb({
      title: this.$t("breadcrumb.profile.title"),
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: title,
          disabled: false,
          href: "",
        },
      ],
    });
  },
};
</script>

<style lang="scss" scoped></style>
