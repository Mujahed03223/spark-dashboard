<template>
  <div class="baseMap">
    <GmapMap
      :center="center"
      :zoom="zoom"
      :options="mapStyle"
      map-type-id="terrain"
      :style="{ width: '100%', height: height + 'px' }"
    >
      <!-- ========= Draw Path -->
      <gmap-polyline
        v-if="my_path"
        :path.sync="my_path"
        :options="{ strokeColor: strokeColor, strokeWeight: 5 }"
      ></gmap-polyline>

      <!-- ========= Custom Markers -->
      <template v-if="my_markers">
        <gmap-custom-marker
          v-for="(marker, index) in my_markers"
          :key="index"
          :marker="marker"
          @click.native="showWindow(index)"
          :offsetX="0"
          :offsetY="0"
        >
          <div class="customeMarker" :class="{ middle: marker.middle }">
            <div class="img">
              <img :src="marker.info.img" />
            </div>
            <div :class="{ active: marker.windowActive }" class="markerWindow">
              <div class="close_btn" @click.stop="closeWindow(index)">
                <i class="fas fa-times"></i>
              </div>
              <span>{{ marker.info.title }}</span>
            </div>
          </div>
        </gmap-custom-marker>
      </template>
    </GmapMap>
  </div>
</template>

<script>
import GmapCustomMarker from "vue2-gmap-custom-marker";

import { v4 as uuidv4 } from "uuid";

export default {
  components: { "gmap-custom-marker": GmapCustomMarker },

  props: {
    zoom: {
      type: Number,
      default: 16,
      required: false,
    },
    path: {
      type: Array,
      required: true,
    },
    start_location: {
      type: Object,
      required: true,
    },
    end_location: {
      type: Object,
      required: true,
    },
    order_type: {
      type: String,
      required: true,
    },
    markers: {
      type: Array,
      required: true,
    },
    strokeColor: {
      type: String,
      required: false,
      default: "#043e72",
    },
    height: {
      required: false,
      default: 400,
    },
  },

  data() {
    return {
      my_markers: null,
      my_path: null,

      // Map Style
      mapStyle: {
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [{ saturation: -100 }],
          },
        ],
      },
    };
  },

  computed: {
    center() {
      if (this.path) {
        return this.path[Math.ceil((this.path.length - 1) / 2)];
      } else {
        return { lat: this.markers[0].lat, lng: this.markers[0].lng };
      }
    },
  },

  methods: {
    showWindow(index) {
      this.my_markers.forEach((marker) => {
        marker.windowActive = false;
      });
      this.my_markers[index].windowActive = true;
    },

    closeWindow(index) {
      this.my_markers[index].windowActive = false;
    },
  },

  mounted() {
    console.log("View Zoom", this.zoom);
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    let img_start_point;
    let img_end_point;

    if (this.order_type == "trip") {
      img_start_point = require("@/assets/media/images/trip_start.svg");
      img_end_point = require("@/assets/media/images/trip_end.svg");
    } else if (this.order_type == "transfer_package") {
      img_start_point = require("@/assets/media/images/package_start.svg");
      img_end_point = require("@/assets/media/images/package_end.svg");
    }

    this.my_markers = [
      {
        id: 1,
        lat: this.start_location.lat,
        lng: this.start_location.lng,
        windowActive: false,
        info: {
          title: this.start_location.location,
          img: img_start_point,
        },
      },
      ...this.markers.map((item) => {
        return {
          id: uuidv4(),
          lat: item.lat,
          lng: item.lng,
          windowActive: false,
          middle: true,
          info: {
            title: item.location,
            img: require("@/assets/media/images/oval.png"),
          },
        };
      }),
      {
        id: 1000,
        lat: this.end_location.lat,
        lng: this.end_location.lng,
        windowActive: false,
        info: {
          title: this.end_location.location,
          img: img_end_point,
        },
      },
    ];

    this.my_path = this.path;
  },
};
</script>

<style lang="scss">
.baseMap {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 15px auto;

  .feature.map {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    iframe {
      height: 100%;
      width: 100%;
      border: 0;
      filter: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='grayscale'><feColorMatrix type='matrix' values='0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'/></filter></svg>#grayscale"); /* Firefox 10+ */
      filter: gray; /* IE6-9 */
      -webkit-filter: grayscale(99%); /* Chrome 19+ & Safari 6+ */
      -webkit-backface-visibility: hidden; /* Fix for transition flickering */
    }
  }

  .vue-map-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    .customeMarker {
      position: relative;

      &.middle {
        .img {
          width: 13px;
          height: 13px;
          transform: translate(-1px, 6px);
          background: red;
          border-radius: 50%;

          img {
            display: none;
          }
        }
      }

      .img {
        width: auto;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0;
          object-fit: contain;
        }
      }

      .markerWindow {
        position: absolute;
        top: -45px;
        background: #333;
        width: 200px;
        min-height: fit-content;
        max-height: auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        font-size: 15px;
        color: #fff;
        border-radius: 15px;
        text-align: center;
        padding: 7px;

        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease-in;
        &.active {
          visibility: visible;
          opacity: 1;
        }

        &::before {
          content: "";
          border-width: 12px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
          position: absolute;
          bottom: -24px;
          left: 57%;
          transform: translateX(50%);
        }

        .close_btn {
          svg,
          i {
            color: #ff2f2f;
          }
        }
      }
    }
  }
}

.baseMap {
  height: 100%;
  .vue-map-container {
    height: 100%;
  }
}
</style>
