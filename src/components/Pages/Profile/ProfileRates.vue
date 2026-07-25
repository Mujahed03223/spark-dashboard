<template>
  <div class="customCard rates">
    <header>
      <h2 class="h_2" v-if="userType == 'contributors'">
        تقييمات الشركة
        <span class="countTitle" v-if="rates.length > 0">
          {{ rates.length }}
        </span>
      </h2>
      <h2 class="h_2" v-if="userType == 'drivers'">
        تقييمات السائق
        <span class="countTitle" v-if="rates.length > 0">
          {{ rates.length }}
        </span>
      </h2>
      <h2 class="h_2" v-if="userType == 'clients'">
        تقييمات العميل
        <span class="countTitle" v-if="rates.length > 0">
          {{ rates.length }}
        </span>
      </h2>
      <span class="rate" v-if="rate_avg > 0"
        ><i class="fas fa-star"></i> {{ rate_avg }}</span
      >
    </header>

    <NoFound v-if="rates.length == 0" text="لا يوجد تقيمات"></NoFound>
    <template v-else>
      <user-rate
        v-for="rate in rates"
        :key="rate.id"
        :image="rate.added_by.avatar"
        :name="rate.added_by.first_name + ' ' + rate.added_by.last_name"
        :desc="rate.added_by.review"
        :rateNum="rate.rate"
        :review="rate.review"
        :date="rate.created_at"
      ></user-rate>
    </template>
  </div>
</template>

<script>
export default {
  props: ["rates", "rate_avg"],
  data() {
    return {
      userType: "",
    };
  },
  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.$route.path.includes("contributors")) {
      this.userType = "contributors";
    }
    if (this.$route.path.includes("drivers")) {
      this.userType = "drivers";
    }
    if (this.$route.path.includes("clients")) {
      this.userType = "clients";
    }
  },
};
</script>

<style lang="scss" scoped>
.rates {
  height: 400px;
  overflow: scroll;
  header {
    display: flex;
    align-items: center;
    margin-top: 10px;

    h2 {
      margin-inline-end: 4px;
      color: #000;
      font-size: 20px;
      font-weight: bold;
    }

    .rate {
      margin-inline: 10px;
      font-size: 13px;

      i {
        color: gold;
      }
    }
  }
  // .rate {
  //   margin-bottom: 40px;
  //   font-size: 30px;
  //   display: block;
  //   i {
  //     color: #fbac17;
  //   }
  // }
}
</style>
