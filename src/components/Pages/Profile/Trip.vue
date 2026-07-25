<template>
  <div class="trip" @click="show = !show" v-if="trip">
    <header>
      <h6>مقصد الرحلة</h6>
      <div>
        <v-chip
          color="#433453"
          text-color="#fff"
          v-if="trip.order_type == 'trip'"
          class="status _processing status_font ml-2"
          >رحله</v-chip
        >
        <v-chip
          color="#22478f"
          text-color="#fff"
          v-if="trip.order_type == 'transfer_package'"
          class="status _processing status_font ml-2"
          >توصيل طلبات</v-chip
        >
        <v-chip
          color="#999"
          text-color="#fff"
          class="status _processing status_font"
          >{{ trip.order_status_trans }}</v-chip
        >
      </div>
    </header>

    <div class="main">
      <div class="item">
        <span class="status small _maron">من</span>
        <h6>
          {{ trip.start_location.location.slice(0, 100) + "..." }}
        </h6>
      </div>
      <div class="item">
        <span class="status small _success">الى</span>
        <h6>
          {{ trip.end_location.location.slice(0, 100) + "..." }}
        </h6>
      </div>

      <div class="_progress">
        <span class="ball _success"></span>
        <span class="bordeSpan"></span>
        <span class="ball _maron"></span>
      </div>
    </div>

    <footer>
      <div class="item">
        <h6>اجمالي السعر</h6>
        <span class="status _success"
          >{{ trip.total_price.toLocaleString() }} {{ $t("appCurrency") }}</span
        >
      </div>

      <div class="item">
        <h6>تاريخ الرحلة</h6>
        <span class="status">{{
          trip.created_at | moment("Do MMMM YYYY, h:mm a")
        }}</span>
      </div>

      <div class="item" v-if="trip.is_scheduled">
        <h6>تاريخ الجدولة</h6>
        <span class="status">{{
          trip.scheduled_at | moment("Do MMMM YYYY, h:mm a")
        }}</span>
      </div>
    </footer>

    <!-- <base-model :show="show" @close="show = false">
      <div class="tripInside">
        <div class="topSection">
          <header>
            <h6>مقصد الرحلة</h6>
            <span class="status _success">{{ trip.order_status }}</span>
          </header>

          <div class="main">
            <div class="item">
              <span class="status small _maron">من</span>
              <h6>
                {{ trip.start_location.location }}
              </h6>
            </div>
            <div class="item">
              <span class="status small _success">الى</span>
              <h6>
                {{ trip.end_location.location }}
              </h6>
            </div>

            <div class="_progress">
              <span class="ball _success"></span>
              <span class="bordeSpan"></span>
              <span class="ball _maron"></span>
            </div>
          </div>
        </div>

        <div class="middleSection">
          <div class="side">
            <div class="image">
              <img src="@/assets/media/images/Others/carSmall.png" alt="" />
              <h5>{{ trip.order_type }}</h5>
            </div>
            <span class="small">{{ trip.start_time }}</span>
            <div class="keyValue">
              <span class="key">رقم الرحلة: </span
              ><span class="value">{{ trip.id }}</span>
            </div>
          </div>

          <div class="side">
            <div class="userCard">
              <div class="image">
                <img :src="trip.other.avatar" alt="" />
              </div>
              <div class="_info">
                <h5>
                  {{ trip.other.first_name + " " + trip.other.last_name }}
                </h5>
                <span class="rate"
                  ><i class="fas fa-star"></i> {{ trip.other.avg_rate }}</span
                >
              </div>
            </div>
            <div class="userCard">
              <div class="image">
                <img :src="trip.vehicle.vehicle_image" alt="" />
              </div>
              <div class="_info">
                <h5>{{ trip.vehicle.vehicle_brand.name }}</h5>
                <span class="rate"
                  >{{ trip.vehicle.plate_number }}
                  {{ trip.vehicle.plate_letter_left }}
                  {{ trip.vehicle.plate_letter_middle }}
                  {{ trip.vehicle.plate_letter_right }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="bottmSection">
          <div class="keyValue">
            <h6>اجمالي السعر</h6>
            <span class="status _success">{{ trip.total_price }}</span>
          </div>
          <div class="keyValue small">
            <h6>الوقت</h6>
            <span class="status"
              >{{ Math.ceil(trip.actual_order_duration) }} دقيقة</span
            >
          </div>
          <div class="keyValue small">
            <h6>المسافه</h6>
            <span class="status">{{ Math.ceil(trip.actual_distance) }} كم</span>
          </div>
        </div>
      </div>
    </base-model> -->
  </div>
</template>

<script>
export default {
  props: ["trip"],

  data() {
    return {
      show: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.trip {
  overflow: hidden;
  border-radius: 15px;
  height: 370px;
  background: url("../../../assets/media/images/Others/tripBg.png");
  padding: 15px 0;
  cursor: pointer;
  position: relative;
  width: 420px !important;

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
    padding-inline-start: 30px;
    position: relative;
    height: 100px;
    overflow-y: auto;

    .item {
      padding-bottom: 10px;
      border-bottom: 3px solid #fff;

      h6 {
        max-width: 90%;
        font-size: 15px;
        text-align: end;
        color: #8f8f8f;
        font-weight: 500;
      }
    }

    ._progress {
      display: flex;
      align-items: center;
      transform: rotate(270deg) translatey(-50%);
      width: fit-content;
      position: absolute;
      top: 50%;
      left: -25px;

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
  }

  .tripInside {
    background: #fff;
    border-radius: 15px;
    cursor: auto;

    .topSection {
      padding: 15px;
      background: url("../../../assets/media/images/Others/tripBg.png");
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
