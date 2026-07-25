<template>
  <div class="chart_card d-block">
    <!-- START:: TITLE -->
    <div class="chart_title m-0 justify-content-end">
      <slot name="chart_title"></slot>
    </div>
    <!-- END:: TITLE -->

    <!-- START:: CHART  -->
    <apexchart
      type="area"
      height="125"
      width="100%"
      :options="areaChartOptions"
      :series="areaChartSeries"
    ></apexchart>
    <!-- END:: CHART  -->
  </div>
</template>

<script>
export default {
  name: "SparksAreaChart",

  props: [
    "SectionRoute",
    "ChartColor",
    "ChartTitle",
    "ChartName",
    "ChartLabels",
    "ChartData",
  ],

  data() {
    return {
      // START:: SPARKS AREA CHART DATA
      areaChartOptions: {
        chart: {
          type: "area",

          sparkline: {
            enabled: true,
          },
        },

        stroke: {
          curve: "smooth",
        },

        dataLabels: {
          enabled: false,
        },
        title: {
          text: this.ChartTitle,
          offsetX: 100,
          style: {
            fontFamily: "Cairo-Bold",
            fontSize: "24px",
            color: this.ChartColor,
          },
        },
        colors: [this.ChartColor],
        labels: this.ChartLabels,
      },

      areaChartSeries: [
        {
          name: this.ChartName,
          data: this.ChartData,
        },
      ],
      // END:: SPARKS AREA CHART DATA
    };
  },
};
</script>

<style lang="scss" scoped>
.chart_card {
  padding-inline: 0;
  min-height: 180px;
  max-height: 250px;
  overflow: hidden;
  .chart_title {
    height: auto;
    display: flex;
    text-align: end;
    padding-inline: 10px;
    color: var(--main) !important;
  }
}
</style>
