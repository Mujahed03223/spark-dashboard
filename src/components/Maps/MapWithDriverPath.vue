<template>
  <div :style="`height: ${height}`">
    <!-- <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete> -->
    <!-- v-if="fullData" -->

    <GmapMap
      :style="`width: 100%; max-height: ${
        height ? height : '300px'
      };min-height: ${minHeight ? minHeight : '200px'};height: ${height} `"
      :zoom="13"
      :center="item.start_location"
      ref="map"
      :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUI: true,
        featureType: 'all',
        elementType: 'all',
        stylers: [{ saturation: -100 }],
      }"
      map-type-id="terrain"
    >
      <!-- <div>
        <GmapMarker
          :icon="image"
          v-for="marker in trackMarkers"
          :key="marker.driver_id"
          :position="marker"
        />
      </div> -->
      <gmap-custom-marker
        v-for="marker in trackMarkers"
        :key="marker.driver_id"
        :marker="marker"
        :offset-x="0"
        :offset-y="0"
      >
        <img
          class="w-100"
          :src="image.url"
          :width="image.size.width"
          :height="image.size.height"
        />
      </gmap-custom-marker>

      <!-- <gmap-custom-marker
        v-for="(marker, index) in item.end_locations"
        :key="index"
        :marker="marker"
        @click.native="showWindow(index)"
        :offsetX="0"
        :offsetY="0"
      >
        <div class="customeMarker" :class="{ middle: marker.middle }">
          <div class="img">
            <img
              class="w-100"
              :src="image.url"
              :width="image.size.width"
              :height="image.size.height"
            />
          </div>
          <div :class="{ active: marker.windowActive }" class="markerWindow">
            <div class="close_btn" @click.stop="closeWindow(index)">
              <i class="fas fa-times"></i>
            </div>
            <span> {{ marker.location }} </span>
          </div>
        </div>
      </gmap-custom-marker> -->
      <gmap-custom-marker
        v-for="(marker, index) in item.end_locations"
        :key="index"
        :marker="marker"
      >
      </gmap-custom-marker>
      <gmap-custom-marker :marker="item.start_location">
        <i class="fas fa-street-view fs-3 main-color"></i>
      </gmap-custom-marker>
      <GmapMarker :position="mark()" :clickable="false" :draggable="false" />
      <gmap-polyline
        v-if="path"
        :path.sync="path"
        v-bind:options="{ strokeColor: '#4C3A86', strokeWeight: 2 }"
      >
      </gmap-polyline>
    </GmapMap>
  </div>
</template>
<script>
import { io } from "socket.io-client";
import GmapCustomMarker from "vue2-gmap-custom-marker";
// import gmapsInit from "@/plugins/gmaps";
export default {
  props: ["item", "zoom", "height", "minHeight", "withTraking"],
  // props: {

  //   // start: {
  //   //   type: Object,
  //   //   required: true,
  //   // },
  //   // end: {
  //   //   type: Array,
  //   //   required: true,
  //   // },
  // },
  components: {
    "gmap-custom-marker": GmapCustomMarker,
  },
  data() {
    return {
      mapStyle: {
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [{ saturation: -100 }],
          },
        ],
      },
      image: {
        url: require("@/assets/media/images/Icons/trip_start.svg"),
        size: { width: 45, height: 45 },
      },

      trackMarkers: [],

      // center: {
      //   lat: 30.97367030102096663313204771839082241058349609375,
      //   lng: 31.167488023638728833475397550500929355621337890625,
      // },
      // start: {
      //   lat: 30.948230241194121248327064677141606807708740234375,
      //   lng: 31.156985593804936485184953198768198490142822265625,
      // },
      // end: {
      //   lat: 30.97367030102096663313204771839082241058349609375,
      //   lng: 31.167488023638728833475397550500929355621337890625,
      // },
      carMarker: { lat: 0, lng: 0 },
      path: null,
      fullData: null,
    };
  },

  methods: {
    mark() {
      let mark;
      if (this.item.end_locations) {
        mark = this.item.end_locations[this.item.end_locations.length - 1];
      } else {
        mark = this.item.end_location;
      }
      return mark;
    },

    mapLogic() {
      const _self = this;
      var socket = io(process.env.VUE_APP_BASE_SOCKET_URL);

      socket.emit("join_update_location", {
        driver_id: _self.item.partner.id,
        dashboard: true,
      });
      console.log(_self.item.partner.id);

      socket.on("update_location_on_map", (data) => {
        if (data) {
          // self.carMarker = data;
          if (!this.trackMarkers[data.driver_id]) {
            this.showLoad = true;
            this.setMarker(data);
          } else if (this.trackMarkers[data.driver_id]) {
            this.showLoad = false;
          }
        }
      });
      socket.on("disconnect_from_map", (data) => {
        this.removeMarker(data.driver_id);
      });
    },
    setMarker(data) {
      this.removeMarker(data.driver_id);
      this.trackMarkers.push({
        lat: data.lat,
        lng: data.lng,

        driver_id: data.driver_id,
      });
      this.image.rotate = data.angle;
      // console.log(this.markers);
    },
    removeMarker(markerId) {
      this.trackMarkers = this.trackMarkers.filter(
        (el) => el.driver_id != markerId
      );
    },
    showWindow(index) {
      this.item.end_locations.map((marker) => {
        marker.windowActive = false;
      });
      this.item.end_locations[index].windowActive = true;
    },

    closeWindow(index) {
      this.item.end_locations[index].windowActive = false;
    },

    // async setPlace() {
    //   const google = await gmapsInit();
    //   if (google) {
    //     const directionsService = await new google.maps.DirectionsService();
    //     //   const directionsDisplay = new google.maps.DirectionsRenderer();
    //     const _self = this;
    //     if (directionsService) {
    //       directionsService?.route(
    //         {
    //           origin: this.start,
    //           destination: this.end[this.end.length - 1],
    //           travelMode: "DRIVING",
    //         },
    //         function (response, status) {
    //           if (status === "OK") {
    //             // console.log(response);
    //             _self.fullData = response;
    //             console.log(_self.fullData);
    //             _self.path = response.routes[0].overview_path.map((el) => {
    //               return {
    //                 lat: el.lat(),
    //                 lng: el.lng(),
    //               };
    //             });
    //           } else {
    //             console.log("Directions request failed due to " + status);
    //           }
    //         }
    //       );
    //     }
    //   }
    // },
  },
  mounted() {
    this.mapLogic();
    if (this.item.expected_route) {
      this.path = this.item.expected_route;
    }
  },
};
</script>
<style lang="scss">
.main-color {
  color: var(--main);
}

// .customeMarker {
//   position: relative;

//   &.middle {
//     .img {
//       width: 13px;
//       height: 13px;
//       transform: translate(-1px, 6px);
//       background: red;
//       border-radius: 50%;

//       img {
//         display: none;
//       }
//     }
//   }

//   .img {
//     width: auto;
//     height: auto;
//     display: flex;
//     justify-content: center;
//     align-items: center;

//     img {
//       width: 100%;
//       height: 100%;
//       border-radius: 0;
//       object-fit: contain;
//     }
//   }

//   .markerWindow {
//     position: absolute;
//     top: -45px;
//     background: #333;
//     width: 200px;
//     min-height: fit-content;
//     max-height: auto;
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
//     flex-direction: column;
//     font-size: 15px;
//     color: #fff;
//     border-radius: 15px;
//     text-align: center;
//     padding: 7px;

//     opacity: 0;
//     visibility: hidden;
//     transition: all 0.2s ease-in;
//     &.active {
//       visibility: visible;
//       opacity: 1;
//     }

//     &::before {
//       content: "";
//       border-width: 12px;
//       border-style: solid;
//       border-color: #333 transparent transparent transparent;
//       position: absolute;
//       bottom: -24px;
//       left: 57%;
//       transform: translateX(50%);
//     }

//     .close_btn {
//       svg,
//       i {
//         color: #ff2f2f;
//       }
//     }
//   }
// }
</style>
