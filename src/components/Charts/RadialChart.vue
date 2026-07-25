<template>
  <div class="chart_card" v-if="radialChartOptions && series">
    <!-- START:: TITLE -->
    <h4 class="chart_title m-0">
      <slot name="chart_title"></slot>
    </h4>
    <!-- END:: TITLE -->

    <!-- START:: CHART -->
    <apexchart
      type="radialBar"
      :width="ChartWidth"
      :height="ChartHeight"
      :options="radialChartOptions"
      :series="series"
    ></apexchart>
    <!-- END:: CHART -->
  </div>
</template>

<script>
export default {
  name: "RadialChart",

  props: [
    "ChartSize",
    "ChartWidth",
    "ChartHeight",
    "ChartColors",
    "ChartLabels",
    "ChartData",
    "OffsetY",
    "OffsetX",
    "showTrack",
  ],

  data() {
    return {
      // START:: RADIAL BAR CHART DATA
      radialChartOptions: null,

      series: null,
      // END:: RADIAL BAR CHART DATA
    };
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.radialChartOptions = {
      plotOptions: {
        radialBar: {
          size: undefined,
          inverseOrder: true,
          hollow: {
            margin: 10,
            size: this.ChartSize,
            background: "transparent",
          },
          track: {
            show: this.showTrack,
          },
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
        },
      },
      stroke: {
        lineCap: "round",
      },
      colors: this.ChartColors,
      labels: this.ChartLabels,
      legend: {
        show: true,
        floating: true,
        position: "bottom",
        offsetY: this.OffsetY,
        offsetX: this.OffsetX,
      },
    };

    this.series = this.ChartData;
  },
};
</script>
