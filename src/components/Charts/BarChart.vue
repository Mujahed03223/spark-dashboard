<template>
  <div class="chart_card" v-if="item">
    <!-- START:: TITLE -->
    <h4 class="chart_title m-0">
      <slot name="chart_title"></slot>
    </h4>

    <apexchart
      type="bar"
      height="450px"
      width="100%"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <!-- END:: CHART -->
  </div>
</template>

<script>
export default {
  name: "BarCart",

  props: ["item", "horiz", "seriesTitle", "labelTitle"],

  data() {
    return {
      series: [
        {
          name: this.$t("labels.ticket"),
          data: this.item.series,
        },
      ],
      chartOptions: {
        yaxis: {
          title: {
            text: this.labelTitle,
          },
          style: {
            colors: "#78909c",
          },
        },

        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            columnWidth: "10%",
            barHeight: "10%",

            borderRadius: 1,
            horizontal: this.horiz ? true : false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        // labels: this.item.values.labels,
        xaxis: {
          categories: this.item.label,
          labels: {
            rotate: this.$i18n.locale == "en" ? -45 : 45,
          },
          title: {
            text: this.seriesTitle,
          },
        },

        tooltip: {
          y: {
            formatter: (val) => this.$t("labels.ticket") + ": " + val,
          },
          x: {
            formatter: (val) => this.$t("labels.Hour") + ": " + val,
          },
        },
      },

      // END:: BAR CHART DATA
    };
  },
};
</script>
