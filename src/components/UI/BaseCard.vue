<template>
  <div class="base_card" :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["classes"],
};
</script>

<style lang="scss">
.base_card {
  padding: 15px;
  background: #f5f5fa;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
