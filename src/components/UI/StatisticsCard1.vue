<template>
  <div class="stats_card">
    <div class="d-flex">
      <div class="avatar">
        <i class="far fa-chart-line"></i>
      </div>
      <div class="d-flex flex-column">
        <span class="value">{{ value }}</span>
        <span class="name">{{ $t(name) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsCard",

  props: ["name", "value"],
  data() {
    return {
      colorCache: { id: null },
    };
  },
  methods: {
    randomColor() {
      return Math.floor(Math.random() * 16777215).toString(16);
    },
  },
};
</script>

<style lang="scss">
.stats_card {
}
</style>
