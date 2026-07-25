<template>
  <Loader v-if="loading"></Loader>
  <div class="" v-else>
    <noData v-if="noData" />
    <div class="wrapper show-user" v-else>
      <div class="row">
        <div class="col-12">
          <BaseCard>
            <Profile :profileData="profileData" name="profile" />
          </BaseCard>
        </div>
        <div class="col-md-6 col-xl-8 col-xxl-9" v-if="false">
          <div>
            <BaseCard>
              <div class="d-flex flex-wrap">
                <SimpleCard>
                  <p>
                    <span class="">{{ $t("labels.gender") }}</span
                    >: <span>{{ $t(profileData.gender) }}</span>
                  </p>
                </SimpleCard>

                <SimpleCard>
                  <p>
                    <span class="">{{ $t("labels.preferred_language") }}</span
                    >:
                    <span v-if="profileData.preferred_language">{{
                      $t(profileData.preferred_language)
                    }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </p>
                </SimpleCard>
                <SimpleCard>
                  <p>
                    <span class="">{{
                      $t("labels.preferred_payment_method")
                    }}</span
                    >:
                    <span v-if="profileData.preferred_payment_method">{{
                      $t(profileData.preferred_payment_method)
                    }}</span>
                    <span class="redColor fontBold" v-else>{{
                      $t("notFound")
                    }}</span>
                  </p>
                </SimpleCard>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import Profile from "@/components/Pages/Profile/Profile.vue";
import FrequentsCard from "@/components/UI/FrequentsCard.vue";
import OpenStreetMap from "@/components/Maps/OpenStreetMap.vue";

export default {
  props: ["id"],
  components: { Profile, FrequentsCard, Carousel, Slide, OpenStreetMap },
  data() {
    return {
      noData: false,

      profileData: null,

      //Loading
      loading: false,
      btnLoading: false,
    };
  },

  methods: {
    // ============ Get Profile Data
    getProfile() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `profile`,
      })
        .then((res) => {
          this.noData = false;
          this.profileData = res.data.data;

          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
          this.noData = true;
          this.loading = false;
        });
    },
  },

  created() {
    // this.getProfile();
  },
};
</script>

<style lang="scss">
.personal_information {
  margin-top: 30px;
  .avatar {
    h3.name {
      margin: 15px 0 0;
      text-align: center;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;

      text-transform: capitalize;

      color: #000000;
    }
    .rate {
      text-align: center;
      button {
        padding: 3px;
      }
    }
    .actions {
      display: flex;
      justify-content: center;
      .action {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 15px;
        background: #ffffff;
        border-radius: 5px;
        &:nth-child(2) {
          margin-inline: 5px;
        }
        font-size: 18px;
        color: var(--main);
      }
    }
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(142, 142, 169, 0.2);
  }
  .user_info {
    margin-top: 10px;
    h5.title {
      font-style: normal;
      font-weight: 400;
      font-size: 16px !important;
      line-height: 22px;
      text-transform: capitalize;
      margin: 0;
      color: var(--mainText);
    }
    p {
      margin: 5px 0 0;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-transform: lowercase;
      color: #000000;
    }
    &:last-child {
      margin-bottom: 15px;
    }
  }
  .user_status {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-transform: capitalize;
    .v-input--selection-controls__input {
      margin: 0;
    }
    .v-input__slot {
      padding: 0;
    }

    margin-top: 15px;
  }
}
.show-user {
  .v-item-group {
    background: linear-gradient(97.46deg, #0038ff -1.53%, #2d70ab 132.35%);
    box-shadow: 0px 5px 14px rgb(0 0 0 / 5%);
    border-radius: 10px;
    .v-tabs .v-tab {
      letter-spacing: normal !important;
    }
  }
}
.trips_list {
  .VueCarousel {
    width: 100%;
  }
  .VueCarousel-inner {
    justify-content: flex-end;
  }
  display: flex;
  align-items: center;
  // overflow-x: scroll;
  // padding-bottom: 20px;
  .trip {
    // width: 370px;
    flex-shrink: 0;
    margin-inline-end: 15px;
  }
}
</style>
