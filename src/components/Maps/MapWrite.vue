<template>
  <div>
    <div class="col-12 my-2">
      <div class="search_input_wrapper">
        <input
          type="text"
          class="form-control"
          aria-describedby="searchMap"
          :placeholder="$t('selectLocation')"
          id="autocomplete_ar"
          @input="getAddress"
        />
      </div>
    </div>

    <GmapMap
      style="width: 100%; min-height: 300px; max-height: 100%;"
      :zoom="mapZoom"
      :center="mapCenter"
      ref="map"
      @click="generate"
    >
      <!-- ========= Draw Path -->
      <gmap-polyline
        :path.sync="markers"
        :options="{ strokeColor: strokeColor, strokeWeight: 5 }"
      ></gmap-polyline>

      <GmapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker"
        :draggable="true"
        @drag="markerdraged(index, $event)"
        @click="removeMarker(index)"
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
    strokeColor: {
      type: String,
      required: false,
      default: "#1A73E8",
    },
    biggingMarkers: {
      type: Array,
      required: false,
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

  methods: {
    // START:: GET ADDRESS METHOD
    getAddress() {
      var self = this;
      var input = document.getElementById("autocomplete_ar");
      var searchBox = new google.maps.places.SearchBox(input);
      searchBox.addListener("places_changed", function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          bounds.extend(place.geometry.location);
          place.geometry.location.lng();
          place.geometry.location.lat();
          place.formatted_address;
          self.mapCenter.lng = place.geometry.location.lng();
          self.mapCenter.lat = place.geometry.location.lat();
          // self.firestStepRegisterUserData.location.address =
          //     place.formatted_address;
        });
      });
    },
    // END: GET ADDRESS METHOD

    generate(e) {
      let marker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.center = {
        ...marker,
      };
      this.markers.push(marker);
      this.$emit("markersChanged", this.markers);
    },

    markerdraged(index, e) {
      let marker = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      this.center = {
        ...marker,
      };

      this.$set(this.markers, index, marker);
      this.$set(this.path, index, marker);

      this.$emit("markersChanged", this.markers);
    },
    removeMarker(index) {
      this.markers.splice(index, 1);
      this.$emit("markersChanged", this.markers);
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.biggingMarkers) {
      this.markers = this.biggingMarkers;
    }
  },
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
