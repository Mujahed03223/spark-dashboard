<template>
  <!-- START:: MAP -->
  <div class="fadeIn">
    <div class="my-2">
      <div class="search_input_wrapper">
        <input
          type="text"
          class="form-control"
          aria-describedby="searchMap"
          :placeholder="$t('selectLocation')"
          :id="id ? `autocomplete_ar-${id}` : 'autocomplete_ar'"
          @input="getAddress"
        />
      </div>
    </div>
    <GmapMap
      style="width: 100%; min-height: 300px; max-height: 100%"
      :center="coordinates_to_edit"
      :zoom="7"
      :draggable="true"
      map-type-id="terrain"
    >
      <GmapMarker
        :position="coordinates_to_edit"
        :clickable="true"
        :draggable="true"
        @dragend="updateMarker($event.latLng)"
      />
    </GmapMap>
  </div>
  <!-- END:: MAP -->
</template>

<script>
export default {
  props: ["biggingMarkers", "id"],
  data() {
    return {
      markers: null,
      coordinates_to_edit: { lat: 0, lng: 0, location: "" },
    };
  },
  methods: {
    // START:: UPDATE LOCATION
    updateMarker(location) {
      this.coordinates_to_edit = {
        lat: location.lat(),
        lng: location.lng(),
        location: "",
      };
      this.$emit("makerChanged", this.coordinates_to_edit);
    },
    // END:: UPDATE LOCATION

    // START:: G-MAP GET ADDRESS
    getAddress() {
      var self = this;
      var input;
      if (this.id) {
        input = document.getElementById(`autocomplete_ar-${this.id}`);
      } else {
        input = document.getElementById("autocomplete_ar");
      }

      // self.data.location = input.value;
      var searchBox = new google.maps.places.SearchBox(input);
      searchBox.addListener("places_changed", function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          bounds.extend(place.geometry.location);
          place.geometry.location.lat();
          place.geometry.location.lng();
          place.formatted_address;
          // self.data.address = place.formatted_address;
          self.coordinates_to_edit = {
            lat: Number(place.geometry.location.lat()),
            lng: Number(place.geometry.location.lng()),
            location: place.formatted_address,
          };
          // self.markers[0].position.lat = place.geometry.location.lat();
          // self.markers[0].position.lng = place.geometry.location.lat();
        });
        self.$emit("makerChanged", self.coordinates_to_edit);
      });
    },
    // START:: G-MAP GET ADDRESS

    // ============== Get User Location
    getLocation() {
      let self = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // this.markers = [
          //   {
          //     position: {
          //       lat: position.coords.latitude,
          //       lng: position.coords.longitude,
          //     },
          //   },
          // ];
          // this.center = this.markers[0].position;

          this.coordinates_to_edit.lat = position.coords.latitude;
          this.coordinates_to_edit.lng = position.coords.longitude;
          self.$emit("makerChanged", self.coordinates_to_edit);
        });
      }
    },
    // markerdraged(e) {
    //   this.mapCenter = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    //   let geocoder = new google.maps.Geocoder();
    //   geocoder.geocode({ location: this.mapCenter }, (results, status) => {
    //     if (status == "OK") {
    //       this.formatted_address = results[0].formatted_address;
    //       this.$emit("getLocation", {
    //         center: this.mapCenter,
    //         location: this.formatted_address,
    //       });
    //     }
    //   });
    // },
  },
  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.biggingMarkers) {
      this.coordinates_to_edit.lat = this.biggingMarkers.lat;
      this.coordinates_to_edit.lng = this.biggingMarkers.lng;
    } else {
      this.getLocation();
    }
  },
};
</script>

<style></style>
