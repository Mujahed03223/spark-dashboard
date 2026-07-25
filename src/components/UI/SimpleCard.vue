<template>
  <div class="simple_card" :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["classes"],
};
</script>

<style lang="scss">
.simple_card {
  width: fit-content;
  // margin-block: 8px;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 15px;
  // margin-inline-end: 10px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 11%);
  p {
    .value {
      font-size: 16px !important;
      font-weight: 700;
    }
    margin: 0;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;

    letter-spacing: 1px;
    text-transform: capitalize;
    color: #000000;
    .v-icon {
      color: var(--main);
      font-size: 18px;
      margin-inline-start: 8px;
      &.trip {
        margin-inline-start: 0px;
        margin-inline-end: 8px;
      }
    }

    span.active {
      color: #26be00;
    }
    span.inactive {
      color: #ff0000;
    }
  }
}
</style>
