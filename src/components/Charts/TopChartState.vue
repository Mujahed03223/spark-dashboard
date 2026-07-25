<template>
  <div v-if="item">
    <SparksAreaCharts
      dir="ltr"
      :SectionRoute="item.route"
      :ChartColor="color.colors.first"
      ChartTitle=""
      :ChartName="item.title"
      :ChartLabels="[
        item.title,
        item.title,
        item.title,
        item.title,
        item.title,
        item.title,
      ]"
      :ChartData="[
        (100 / 4).toFixed(2),
        (90 / 1.5).toFixed(2),
        (100 / 1.8).toFixed(2),
        (70 / 2).toFixed(2),
        (89 / 1.2).toFixed(2),
        100,
      ]"
    >
      <template #chart_title>
        <div class="content d-flex flex-column">
          <h4 class="title_text mb-0" :style="{ color: color.colors.first }">
            {{ item.title }}
          </h4>
          <p class="chart_val mb-0" :style="{ color: color.colors.second }">
            <bdi> {{ $t(`top_charts.${item.key}`) }} </bdi>
            <bdi> {{ Math.floor(item.count) }} </bdi>
          </p>
        </div>
      </template>
    </SparksAreaCharts>
  </div>
</template>

<script>
export default {
  props: ["item", "color"],
};
</script>

<style></style>
