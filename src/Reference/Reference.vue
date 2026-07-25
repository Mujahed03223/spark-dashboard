<template>
  <div class="loaders_container_wrapper">
    <div class="row">
      <div class="col-12">
        <base-map :path="path"></base-map>
      </div>
      <div class="col-12">
        <base-screen :values="values" url="LOL"></base-screen>
      </div>
      <div class="col-md-9">
        <!-- START:: GENERAL LOADER -->
        <LoaderGeneral />
        <!-- END:: GENERAL LOADER -->
      </div>
      <div class="col-md-3">
        <div class="container_skeletons">
          <!-- START:: SKELETON LOADER -->
          <LoaderSkeletonChart />
          <!-- END:: SKELETON LOADER -->

          <!-- START:: RADIAL SKELETON LOADER -->
          <LoaderSkeletonChartRadial class="mt-3" />
          <!-- END:: RADIAL SKELETON LOADER -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMap from "@/components/Maps/BaseMap.vue";
import BaseScreen from "@/components/StaticScreens/BaseScreen.vue";
import LoaderGeneral from "@/components/Loaders/LoaderGeneral.vue";
import LoaderSkeletonChart from "@/components/Loaders/LoaderSkeletonChart.vue";
import LoaderSkeletonChartRadial from "@/components/Loaders/LoaderSkeletonChartRadial.vue";

export default {
  components: {
    baseMap,
    BaseScreen,
    LoaderGeneral,
    LoaderSkeletonChart,
    LoaderSkeletonChartRadial,
  },

  data() {
    return {
      path: [
        { lat: 55.9352001, lng: -4.7766924 },
        { lat: 55.9358131, lng: -4.7770143 },
        { lat: 55.9361256, lng: -4.7767353 },
        { lat: 55.9366784, lng: -4.7739458 },
      ],
      values: {
        titleValue: "Title Placehoder",
        descValue: "Desc Placehoder",
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
