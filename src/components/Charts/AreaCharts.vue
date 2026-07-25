<template>
  <div class="chart_card" v-if="areaChartOptions && series">
    <!-- START:: TITLE -->
    <h5 class="chart_title m-0">
      <slot name="chart_title"></slot>
    </h5>
    <!-- END:: TITLE -->

    <!-- START:: CHART  -->
    <apexchart
      type="area"
      :height="ChartHeigh"
      :options="areaChartOptions"
      :series="series"
    ></apexchart>
    <!-- END:: CHART  -->
  </div>
</template>

<script>
export default {
  name: "SparksAreaChart",

  props: [
    "ChartType",
    "ChartColors",
    "ChartTitle",
    "ChartHeigh",
    "ChartName",
    "ChartLabels",
    "ChartData",
  ],

  data() {
    return {
      // START:: SPARKS AREA CHART DATA
      areaChartOptions: null,

      series: null,
      // END:: SPARKS AREA CHART DATA
    };
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.areaChartOptions = {
      chart: {
        type: "area",
        width: "100%",
        // stacked: true,
      },
      toolbar: {
        show: false,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      colors: this.ChartColors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: this.ChartType,
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0,
          opacityTo: 0.8,
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: this.ChartLabels,
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
    };

    this.series = this.ChartData;
  },
};
</script>
