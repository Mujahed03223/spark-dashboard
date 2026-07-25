<template>
  <div>
    <div class="points_card_content_wrapper" v-if="!$route.path.includes('contributors')">
      <!-- <div class="coming_soon_overlay">
        <h5 class="coming_soon_text"> Coming Soon </h5>
      </div> -->
      <h3 class="h_3">كل الرحلات</h3>
      <h2 class="points">{{ orders_count }}</h2>
      <h5 class="unit">رحله</h5>
    </div>

    <div class="points_card_content_wrapper" v-if="$route.path.includes('clients')">
      <!-- <div class="coming_soon_overlay">
        <h5 class="coming_soon_text"> Coming Soon </h5>
      </div> -->
      <h3 class="h_3">الرحلات المجدولة</h3>
      <h2 class="points">{{ scheduled_orders_count }}</h2>
      <h5 class="unit">رحله</h5>
    </div>

    <div class="points_card_content_wrapper" v-if="!$route.path.includes('contributors')">
      <!-- <div class="coming_soon_overlay">
        <h5 class="coming_soon_text"> Coming Soon </h5>
      </div> -->
      <h3 class="h_3">الرحلات الجاريه الأن</h3>
      <h2 class="points">{{ in_progress_orders_count }}</h2>
      <h5 class="unit">رحله</h5>
    </div>

    <div class="points_card_content_wrapper" v-if="!$route.path.includes('contributors')">
      <!-- <div class="coming_soon_overlay">
        <h5 class="coming_soon_text"> Coming Soon </h5>
      </div> -->
      <h3 class="h_3">الرحلات الملغيه</h3>
      <h2 class="points">{{ cancelled_orders_count }}</h2>
      <h5 class="unit">رحله</h5>
    </div>

    <div class="points_card_content_wrapper" v-if="!$route.path.includes('contributors')">
      <!-- <div class="coming_soon_overlay">
        <h5 class="coming_soon_text"> Coming Soon </h5>
      </div> -->
      <h3 class="h_3">الرحلات المنتهيه</h3>
      <h2 class="points">{{ finished_orders_count }}</h2>
      <h5 class="unit">رحله</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: "BalanceCard",

  props: [
    "wallet",
    "orders_count",
    'scheduled_orders_count',
    'in_progress_orders_count',
    "cancelled_orders_count",
    "finished_orders_count",
  ],
};
</script>

<style lang="scss" scoped>
.points_card_content_wrapper {
  margin-block: 12px;
  padding: 15px;
  background-color: var(--lightBg);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 6px;
  color: var(--mainText);
  position: relative;
  overflow: hidden;

  .coming_soon_overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(21, 50, 82, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .coming_soon_text {
      color: #EDD70C;
    }
  }

  .card_title {
    position: absolute;
    top: 7px;
    left: 7px;
    align-self: flex-end;
    font-family: mediumArFont;
    background-color: var(--main);
    color: var(--white);
    padding: 5px 15px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
  }
  .points {
    margin: 0;
    color: var(--main);
    font-size: 3rem;
    font-family: BoldArFont;
  }
  .unit {
    margin: 0;
    color: var(--main);
    font-family: regularArFont;
  }
}
.chargePopup {
  background: #fff;
  padding: 15px;
  border-radius: 15px;
  text-align: center;

  h3 {
    margin-bottom: 20px;
  }
}
</style>
