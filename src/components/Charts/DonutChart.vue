<template>
  <div class="chart_card">
    <!-- START:: TITLE -->
    <h4 class="chart_title mt-0">
      <slot name="chart_title"></slot>
    </h4>
    <!-- END:: TITLE -->

    <!-- START:: CHART DESCRIPTION -->
    <h4 class="chart_description">
      <slot name="chart_description"></slot>
    </h4>
    <!-- END:: CHART DESCRIPTION -->

    <!-- START:: CHART -->
    <apexchart
      v-if="donutChartSeries"
      type="donut"
      height="250px"
      :options="donutChartOptions"
      :series="donutChartSeries"
    ></apexchart>
    <!-- END:: CHART -->
  </div>
</template>

<script>
export default {
  name: "DonutChart",

  props: ["item"],

  data() {
    return {
      // START:: DONUT CHART DATA
      donutChartOptions: {
        dataLabels: {
          enabled: true,
        },
        plotOptions: {
          pie: {
            customScale: 1,
            donut: {
              size: "80%",
              labels: {
                show: true,
                name: {
                  show: true,
                },
                value: {
                  show: true,
                },
                total: {
                  show: true,
                  label: this.item.title,
                  color: "#313181",
                },
              },
            },
            offsetY: 20,
          },
          stroke: {
            colors: undefined,
          },
        },
        colors: this.item.colors,
        labels: this.item.labels,
        legend: {
          position: "bottom",
          offsetY: 0,
          offsetX: 0,
        },
      },

      donutChartSeries: this.item.series,
      // END:: DONUT CHART DATA
    };
  },

  mounted() {},
};
</script>
