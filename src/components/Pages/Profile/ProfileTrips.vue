<template>
  <div class="customCard trips">
    <h2 class="h_2" v-if="userType == 'contributors'">آخر الرحلات الشركة</h2>
    <h2 class="h_2" v-if="userType == 'drivers'">آخر الرحلات السائق</h2>
    <h2 class="h_2" v-if="userType == 'clients'">آخر الرحلات العميل</h2>
    <NoFound v-if="trips.length == 0" text="لا يوجد رحلات"></NoFound>
    <div class="trips_list" v-else>
      <router-link :to="`/orders/user_orders/${id}/${type}`" class="allTrips"
        >كل الرحلات</router-link
      >
      <div class="tripLink" v-for="trip in trips" :key="trip.id">
        <router-link :to="`/orders/show/${trip.id}`">
          <trip :trip="trip"></trip
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Trip from "./Trip.vue";
export default {
  components: { Trip },

  props: ["trips", "id", "type"],
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
.trips {
  position: relative;

  .allTrips {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 15px;
    color: var(--main);
    text-decoration: underline;
  }

  .trips_list {
    display: flex;
    align-items: center;
    // overflow-x: scroll;
    padding-bottom: 20px;
    .trip {
      // width: 370px;
      flex-shrink: 0;
      margin-inline-start: 15px;
    }
  }
}
</style>
