<template>
  <div dir="rtl">
    <div class="trip" v-if="item">
      <map-with-driver-path :item="item" />
      <div class="main">
        <div class="item" v-if="item.start_location">
          <span class="status small _maron">من</span>
          <h6 :title="item.start_location.location">
            {{ item.start_location.location.slice(0, 100) + "..." }}
          </h6>
        </div>

        <div class="item" v-if="item.end_locations">
          <span class="status small _success">الى</span>
          <h6
            :title="end.location"
            v-for="(end, index) in item.end_locations"
            :key="index"
          >
            {{ end.location.slice(0, 100) + "..." }}
          </h6>
        </div>
        <div class="item" v-if="item.end_location">
          <span class="status small _success">الى</span>
          <h6 :title="item.end_location.location">
            {{ item.end_location.location.slice(0, 100) + "..." }}
          </h6>
          <div class="_progress">
            <span class="ball _success"></span>
            <span class="bordeSpan" v-if="item.end_locations"></span>
            <span class="ball _maron"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapWithDriverPath from "@/components/Maps/MapWithDriverPath.vue";
export default {
  components: { MapWithDriverPath },
  props: ["item"],
};
</script>

<style lang="scss">
.trip {
  overflow: hidden;
  border-radius: 15px;
  padding: 15px 0;
  cursor: pointer;
  position: relative;

  header,
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  footer {
    margin-top: 15px;
    display: block !important;

    .item {
      margin-block: 8px;
      display: flex;
      justify-content: space-between;
    }
  }

  .status_font {
    font-weight: 500 !important;
  }

  .main {
    padding-inline-end: 20px;
    position: relative;
    height: 100px;
    overflow-y: auto;
    margin-block: 10px;
    .item {
      padding-bottom: 8px;
      border-bottom: 2px solid #fff;
      h6 {
        // max-width: 90%;
        font-size: 14px;
        color: #8f8f8f;
        font-weight: 500;

        margin: 0;
      }
    }

    ._progress {
      display: flex;
      align-items: center;
      transform: rotate(270deg);
      width: fit-content;
      position: absolute;
      top: 40px;
      left: -30px;

      .ball {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        &._maron {
          background: #e42879;
        }
        &._success {
          background: #61e458;
        }
      }

      .bordeSpan {
        width: 50px;
        height: 1px;
        border-top: 2px dashed #d8d8d8;
      }
    }

    /* width */
    &::-webkit-scrollbar {
      width: 5px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #fff;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: var(--main);
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }

  .tripInside {
    background: #fff;
    border-radius: 15px;
    cursor: auto;

    .topSection {
      padding: 15px;
      //   background: url("../../../assets/media/images/Others/tripBg.png");
      border-radius: 15px;
    }

    .middleSection {
      display: flex;
      justify-content: space-between;
      padding: 20px 15px;

      .side {
        .image {
          display: flex;

          img {
            margin-inline-end: 10px;
            object-fit: contain;
          }
        }

        .small {
          font-weight: bold;
          color: #000;
          font-size: 15px;
        }

        .keyValue {
          font-size: 15px;
          .key {
            color: #8f8f8f;
          }
        }

        .userCard {
          display: flex;
          align-items: center;
          margin-bottom: 15px;

          .image {
            width: 50px;
            height: 50px;
            margin-inline-end: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
          }

          ._info {
            line-height: 1.1;
            h5 {
              font-size: 13px;
              margin: 0;
            }

            span {
              font-size: 10px;

              i {
                color: #ffde37;
              }
            }
          }
        }
      }
    }

    .bottmSection {
      .keyValue {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;

        &.small {
          h6 {
            font-size: 15px;
            font-weight: normal;
            color: #000;
          }
          span {
            font-size: 15px;
            color: #000;
          }
        }
      }
    }
  }

  // .createTime {
  //   position: absolute;
  //   bottom: 8px;
  //   right: 7px;
  //   color: gray;
  //   font-size: 15px;
  // }
}
</style>
