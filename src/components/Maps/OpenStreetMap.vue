<template>
  <div style="height: 500px; width: 100%" id="mapContainer">
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker :icon="icon" :lat-lng="withPopup">
        <l-popup>
          <div @click="innerClick">I am a popup</div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import L from "leaflet";
import { LPopup, LTooltip, LIcon } from "vue2-leaflet";
import "leaflet-routing-machine";
export default {
  components: {
    LPopup,
    LTooltip,
    LIcon,
  },
  data() {
    return {
      zoom: 13,
      center: latLng(47.41322, -1.219482),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      icon: L.icon({
        iconUrl: require("@/assets/media/images/sport-car.png"),
        iconSize: [32, 37],
        iconAnchor: [16, 37],
      }),
      showMap: true,
    };
  },
  mounted() {
    this.getExpectedRouting();
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    getExpectedRouting() {
      let map = L.map("mapContainer");
      let coords = [
        L.latLng(30.97432917323858, 31.174749433994297),
        L.latLng(30.973640691909644, 31.174902319908142),
      ];
      //   let routing = L.Routing.control({
      //     waypoints: [
      //       L.latLng(30.97432917323858, 31.174749433994297),
      //       L.latLng(30.973640691909644, 31.174902319908142),
      //     ],
      //   }).addTo(map);
      let tmpRoutes = [];
      let tmpDistances = [];
      let tmpWayPoints = [];
      let routing = L.Routing.control({
        name: map,
        serviceUrl: "http://router.project-osrm.org/route/v1",
        waypoints: coords,
        plan: L.Routing.plan(coords, {
          createMarker: function () {
            return null;
          },
        }),
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        showAlternatives: true,
      })
        .on("routesfound", function (e) {
          //   console.log(e);
          for (let index = 0; index < e.routes.length; index++) {
            tmpRoutes.push(e);
            tmpDistances.push(e.routes[index].summary.totalDistance);
            tmpWayPoints.push(e.routes[index].waypoints);
          }
          console.log(map);
          //   map.removeControl(e.routes);
        })
        .addTo(map);
      //   let routing = L.Routing;

      console.log(routing);

      // var control = L.Routing.control({
      //         waypoints: [null],
      //         //         waypoints: [           L.latLng(44.91221, 7.671685),           L.latLng(44.907852, 7.673789)         ],
      //         routeWhileDragging: true,
      //         show: true,
      //         language: 'it',
      //         geocoder: L.Control.Geocoder.nominatim(),
      //         autoRoute: true
      //     }).addTo(map);
    },
  },
};
</script>

<style></style>
