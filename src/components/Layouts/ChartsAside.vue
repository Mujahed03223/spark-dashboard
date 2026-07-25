<template>
  <aside class="charts_aside" :class="{ active_aside: show }" v-if="chartsData">
    <!-- Start:: Small Screens Charts Button -->
    <button class="charts_close_btn" @click="$emit('toggleAside')">
      <i class="fas fa-times"></i>
    </button>
    <!-- End:: Small Screens Charts Button -->
    <!-- Start:: Target Card -->
    <div class="daily_target_card my-3" v-if="chartsData.type == 'drivers'">
      <div class="title_wrapper">
        <span>نسبة السائقين في التطبيق</span>
      </div>

      <RadialChart
        dir="ltr"
        ChartWidth="120px"
        ChartHeight="120px"
        :ChartColors="['#84E9F4']"
        :ChartLabels="['عدد السائقين']"
        :ChartData="[chartsData.percentage]"
        :ChartSize="'55%'"
      ></RadialChart>
    </div>

    <div class="daily_target_card my-3" v-if="chartsData.type == 'clients'">
      <div class="title_wrapper">
        <span>نسبة العملاء في التطبيق</span>
      </div>

      <RadialChart
        dir="ltr"
        ChartWidth="120px"
        ChartHeight="120px"
        :ChartColors="['#84E9F4']"
        :ChartLabels="['عدد العملاء']"
        :ChartData="[chartsData.percentage]"
        :ChartSize="'55%'"
      ></RadialChart>
    </div>

    <div
      class="daily_target_card my-3"
      v-if="chartsData.type == 'contributors'"
    >
      <div class="title_wrapper">
        <span>نسبة الشركات في التطبيق</span>
      </div>

      <RadialChart
        dir="ltr"
        ChartWidth="120px"
        ChartHeight="120px"
        :ChartColors="['#84E9F4']"
        :ChartLabels="['عدد الشركات']"
        :ChartData="[chartsData.percentage]"
        :ChartSize="'55%'"
      ></RadialChart>
    </div>

    <!-- Start:: Shapes -->

    <div class="" v-for="chart in chartsData.charts" :key="chart.id">
      <template v-if="chart.chart_type == 'area'">
        <div class="row">
          <div class="col-lg-12" v-for="item in chart.charts" :key="item.id">
            <AreaCharts
              dir="ltr"
              ChartHeigh="240px"
              :ChartType="'smooth'"
              :ChartColors="['#4CDFE8']"
              :ChartLabels="item.labels"
              :ChartData="item.series"
            >
              <template #chart_title>
                <span class="title_text">
                  {{ item.title }}
                </span>
              </template>
            </AreaCharts>
          </div>
        </div>
      </template>

      <template v-if="chart.chart_type == 'radial'">
        <div class="aside_radial_charts">
          <div class="row">
            <div class="pb-2" v-for="item in chart.charts" :key="item.id">
              <RadialChart
                dir="ltr"
                ChartWidth="250px"
                ChartHeight="250px"
                :ChartColors="['#84E9F4', '#EE79F2']"
                :ChartLabels="item.labels"
                :ChartData="item.values"
                :ChartSize="'65%'"
                :OffsetY="-140"
                :OffsetX="-40"
                :showTrack="true"
              >
                <template #chart_title>
                  <span class="title_text">
                    {{ item.title }}
                  </span>
                </template>
              </RadialChart>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- End:: Shapes -->
  </aside>
</template>

<script>
// Start:: Importing Charts
import AreaCharts from '@/components/Charts/AreaCharts.vue'
import RadialChart from '@/components/Charts/RadialChart.vue'
// import DonutChart from "@/components/Charts/DonutChart.vue";

// End:: Importing Charts

export default {
  name: 'ChartsAside',

  components: {
    AreaCharts,
    RadialChart,
    // DonutChart,
  },

  emits: ['toggleAside'],

  props: {
    show: {
      required: true,
      type: Boolean,
    },
    chartsData: {
      required: true,
      type: Object,
    },
  },
}
</script>
