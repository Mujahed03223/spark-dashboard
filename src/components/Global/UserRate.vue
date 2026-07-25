<template>
  <div class="userRate">
    <div class="user">
      <img v-if="image" :src="image" alt="rater img" />

      <div class="user_info">
        <h3 v-if="image">{{ name }}</h3>
        <span class="user_title">
          {{ moment(date).format("YYYY-MM-DD") }}
        </span>
        <p class="comment">
          {{ review || $t("notFound") }}
        </p>
      </div>
    </div>

    <div class="rate" dir="ltr">
      <rating-stars :rate="rateNum"></rating-stars>
    </div>
  </div>
</template>

<script>
export default {
  props: ["image", "name", "date", "rateNum", "review"],
};
</script>

<style lang="scss" scoped>
.userRate {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:last-child) {
    margin: 30px 0;
    border-bottom: 1px solid #eeeeeeb0;
  }
  padding: 10px;

  @media (max-width: 500px) {
    flex-direction: column;
  }

  .user {
    display: flex;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-inline-end: 13px;
    }

    .user_info {
      line-height: 1.3;

      h3 {
        font-size: 16px;
        margin-bottom: 0;
      }

      span {
        color: gray;
        font-size: 13px;
      }

      p {
        font-size: 15px;
        margin: 5px 0 0;
        color: #989898;
      }
    }
  }
}
</style>
