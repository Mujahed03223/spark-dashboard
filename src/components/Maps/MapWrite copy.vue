<template>
  <div>
    <GmapMap
      style="width: 100%; height: 85vh;"
      :zoom="mapZoom"
      :center="mapCenter"
      ref="map"
    >
      <GmapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  props: {
    mapZoom: {
      type: Number,
      required: false,
      default: 7,
    },
    markers: {
      type: Array,
    },
  },

  data() {
    return {
      mapCenter: {
        lat:
          this.biggingMarkers?.length > 0
            ? this.biggingMarkers[0].lat
            : 25.81186323287363,
        lng:
          this.biggingMarkers?.length > 0
            ? this.biggingMarkers[0].lng
            : 45.31568515062242,
      },
      markers: [],
      path: [],
      place: null,
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.search_input_wrapper {
  input {
    margin: 0;
    margin-bottom: 5px;
    padding: 10px;
    border: 1px solid var(--main);
    border-radius: 10px;
    outline: none;
    box-shadow: none;
    transition: all 0.4s ease-in-out;
  }
}
</style>
