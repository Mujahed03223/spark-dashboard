<template>
  <div class="card_data">
    <!-- Start:: Title -->
    <div class="title_wrapper">
      <h5 class="card_data_title">{{title}}</h5>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Card Data Items -->
    <div class="card_data_items">
      <slot></slot>
    </div>
    <!-- End:: Card Data Items -->
  </div>
</template>

<script>
export default {
  name: "DataCard",

  props: {
    title: {
      require: true,
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.card_data {
  width: 100%;
  padding: 20px;
  background: var(--lightBg);
  border-radius: 20px;
  .title_wrapper {
    @include flexCenterAlignment;
    .card_data_title {
      margin-bottom: 20px;
      position: relative;
      text-align: center;
      width: max-content;
      color: var(--);
      &::before {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translate(-50%);
        display: block;
        width: 60%;
        height: 2px;
        border-radius: 15px;
        background-color: var(--mainText);
      }
    }
  }

  .card_data_items {
    .card_data_item {
      @include flexStartAlignment;
      column-gap: 8px;
      &:not(:last-child) {
        margin-bottom: 5px;
      }
      span {
        font-size: 18px;
        color: var(--mainText);
        &.key {
          font-weight: 600;
        }
      }
      button {
        &.key {
          color: var(--mainText);
          font-weight: 600;
        }
      }
    }
  }
}
</style>
