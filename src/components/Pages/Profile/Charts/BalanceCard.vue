<template>
  <div>
    <div class="balance_card_content_wrapper">
      <div class="card_title">الرصيد الحالي</div>

      <h3 class="balance">
        <span> {{ Number(wallet).toLocaleString() }} </span>
        <span> {{ $t("appCurrency") }} </span>
      </h3>
      <!-- <router-link to="/"> Details </router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "BalanceCard",
  props: [
    "wallet",
    "orders_count",
    "cancelled_orders_count",
    "finished_orders_count",
  ],
};
</script>

<style lang="scss" scoped>
.balance_card_content_wrapper {
  margin-top: 15px;
  padding: 15px;
  background-color: var(--main);
  background-image: url("../../../../assets/media/images/Others/blob_shape_1.svg");
  background-size: 100%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 10px;
  color: var(--white);

  .card_title {
    font-family: mediumArFont;
  }

  .balance {
    margin: 0;

    span {
      color: var(--white);
      font-family: semiBoldArFont;
    }
  }

  a {
    font-size: 15px;
    text-decoration: underline;
  }
}
</style>
