<template>
  <div class="">
    <!-- path != null ? {lat: 0, lng: 0}: path[0] -->
    <!-- {{ $route.path.includes('cities') }} -->
    <div class="input_wrapper top_label" v-if="draggable">
      <input
        type="text"
        class="form-control"
        aria-describedby="searchMap"
        placeholder="اختر موقع "
        id="autocomplete_ar"
        @click="getAddress"
      />
    </div>
    <GmapMap
      v-if="mapCenter"
      :options="{
        zoom: 15,
        draggable: false,
        center: mapCenter,
      }"
      ref="map"
      style="
        width: 100%;
        min-width: 250px;
        min-height: 150px;
        max-height: 100%;
      "
    >
      <!-- ========= Draw Path -->

      <GmapMarker
        :position="mapCenter"
        :draggable="draggable"
        @dragend="markerdraged($event)"
      />
      <!-- @drag="markerdraged($event)" -->
    </GmapMap>
  </div>
</template>

<script>
export default {
  props: {
    biggingMarkers: {
      type: Object,
      required: false,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      markers: [],
      formatted_address: null,
      path: [],
      place: null,
      mapCenter: { lat: null, lng: null },
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
          self.formatted_address = place.formatted_address;
          self.mapCenter.lng = place.geometry.location.lng();
          self.mapCenter.lat = place.geometry.location.lat();

          // self.firestStepRegisterUserData.location.address =
          //     place.formatted_address;
        });
        self.$emit("getLocation", {
          center: self.mapCenter,
          location: self.formatted_address,
        });
      });
    },
    // END: GET ADDRESS METHOD
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.mapCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        });
      }
    },

    markerdraged(e) {
      this.mapCenter = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      let geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: this.mapCenter }, (results, status) => {
        if (status == "OK") {
          this.formatted_address = results[0].formatted_address;
          this.$emit("getLocation", {
            center: this.mapCenter,
            location: this.formatted_address,
          });
        }
      });
    },
  },
  created() {
    if (this.biggingMarkers) {
      this.mapCenter.lat = +this.biggingMarkers.lat;
      this.mapCenter.lng = +this.biggingMarkers.lng;

      // this.markers = this.biggingMarkers;
    } else {
      this.getLocation();
    }
    // this.path = this.biggingMarkers;
  },
};
</script>

<style lang="scss">
// .customeMarker {
//   .icon {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     position: relative;
//     i {
//       font-size: 30px;
//       color: #ea4335;
//     }
//     p {
//       position: absolute;
//       display: none;
//       margin-bottom: 5px;
//       left: 50%;
//       text-align: center;
//       transform: translateX(-50%);
//       top: -30px;
//       width: 100%;
//       min-width: 300px;
//       font-size: 18px;
//       color: #000;

//       // max-width: 200px;
//       // -webkit-line-clamp: 1;
//       // -webkit-box-orient: vertical;
//       // overflow: hidden;
//     }
//     &:hover {
//       p {
//         display: -webkit-box;
//       }
//     }
//   }
// }
</style>
