<template>
  <div class="personal_information">
    <BaseCard>
      <div class="avatar mt-5">
        <div class="image text-center">
          <img
            @error="imageError"
            @click="show_model_1(profileData.image)"
            width="120"
            height="120"
            class="rounded-circle"
            :src="profileData.image"
            :alt="profileData.name"
          />
        </div>

        <h3 class="name">
          <span v-if="profileData.name">
            {{ profileData.name }}
          </span>
          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </h3>
      </div>
    </BaseCard>
    <div class="row">
      <div class="col-md-12 col-xl-12">
        <div>
          <BaseCard>
            <div class="row">
              <div class="col-md-6 col-xl-4 my-2" v-if="profileData.email">
                <div class="order_card">
                  <div class="exp">
                    <h4>
                      {{ $t("labels.email") }}
                    </h4>
                    <span>{{ profileData.email }}</span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-xl-4 my-2" v-if="profileData.country">
                <div class="order_card">
                  <div class="exp">
                    <h4>
                      {{ $t("labels.country") }}
                    </h4>
                    <span>
                      {{ profileData.country && profileData.country.name }}
                    </span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-xl-4 my-2" v-if="profileData.phone">
                <div class="order_card">
                  <div class="exp">
                    <h4>{{ $t("labels.phone") }}</h4>
                    <span>
                      {{ profileData.phone }}
                      {{ profileData.phone_code }}
                    </span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-xl-4 my-2" v-if="profileData.language">
                <div class="order_card">
                  <div class="exp">
                    <h4>
                      {{ $t("labels.language") }}
                    </h4>
                    <span>{{
                      profileData.language && profileData.language.name
                    }}</span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-xl-4 my-2" v-if="profileData.gender">
                <div class="order_card">
                  <div class="exp">
                    <h4>
                      {{ $t("labels.gender") }}
                    </h4>
                    <span>{{
                      profileData.gender === "male" ? $t("male") : $t("female")
                    }}</span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div
                class="col-md-6 col-xl-4 my-2"
                v-if="profileData.from_price_umrah"
              >
                <div class="order_card">
                  <div class="exp">
                    <h4>
                      {{ $t("labels.from_price") }}
                    </h4>
                    <span>{{ profileData.from_price_umrah }}</span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div
                class="col-md-6 col-xl-4 my-2"
                v-if="profileData.to_price_umrah"
              >
                <div class="order_card">
                  <div class="exp">
                    <h4>
                      {{ $t("labels.to_price") }}
                    </h4>
                    <span>{{ profileData.to_price_umrah }}</span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-xl-4 my-2">
                <div class="order_card">
                  <div class="exp">
                    <h4>{{ $t("labels.status") }}</h4>
                    <span
                      :class="profileData.is_active ? 'active' : 'inactive'"
                      >{{
                        profileData.is_active ? $t("active") : $t("inactive")
                      }}</span
                    >
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-4 my-2">
                <div class="order_card">
                  <div class="exp">
                    <h4>{{ $t("labels.is_available") }}</h4>
                    <span
                      :class="profileData.is_available ? 'active' : 'inactive'"
                    >
                      {{
                        profileData.is_available
                          ? $t("labels.available")
                          : $t("labels.unavailable")
                      }}
                    </span>
                  </div>
                  <div class="img">
                    <img src="@/assets/media/images/logo/logo.svg" />
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <div class="button_section d-flex gap-1 justify-content-center">
      <v-btn type="button" class="back_btn" @click="handleBack">
        {{ $t("back") }}
        <span
          :class="
            $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
          "
        ></span>
      </v-btn>
    </div>

    <!-- Start Image_Model -->
    <ImageModal
      :modalIsOpen="model_1.show_model"
      :modalImage="model_1.model_img_src"
      @toggleModal="model_1.show_model = false"
    />
    <!-- <base-model @close="model_1.show_model = false" :show="model_1.show_model">
      <div class="image">
        <img
          v-if="model_1.model_img_src"
          :src="model_1.model_img_src"
          class="img-fluid"
          alt="..."
        />
      </div>
    </base-model> -->
    <!-- End Image_Model -->
  </div>
</template>

<script>
import ImageModal from "@/components/Modals/ImageModal.vue";

export default {
  props: ["profileData", "name"],
  components: {
    ImageModal,
  },
  data() {
    return {
      show: false,
      showChat: false,
      notification_data: {
        title: null,
        body: null,
      },
      model_1: {
        show_model: false,
        model_img_src: "",
      },
      loading: false,
    };
  },
  methods: {
    show_model_1(e) {
      this.model_1.model_img_src = e;
      this.model_1.show_model = true;
    },

    imageError(event) {
      event.target.src = require("@/assets/media/images/logo/logo.png");
    },
  },
};
</script>

<style lang="scss">
.personal_information {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  // margin-top: 30px;
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

    padding-bottom: 20px;
    border-bottom: 1px solid rgba(142, 142, 169, 0.2);
  }
  .order_card {
    background: #ffffff;
    border-radius: 10px;
    padding: 13px;
    @include flexSpaceBetweenAlignment;
    align-items: normal;
    .img {
      @include flexEndAlignment;
      flex-direction: column;
      img {
        opacity: 0.7;
        width: 95px;
      }
    }
    .exp {
      // @include flexSpaceBetweenAlignment;
      flex-direction: column;
      h4 {
        font-size: 19px;
      }
      span {
        font-size: 16px;
        height: 55px;
        &.tit {
          font-size: 19px;
          color: #000000;
          display: inline-block;
          margin-inline-end: 5px;
          height: auto;
        }
      }
      img {
        width: 55px;
        height: 55px;
        border-radius: 50%;
      }
    }
    &.ver_design {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      .img {
        @include flexEndAlignment;
        flex-direction: column;
        align-items: end;
        width: 100%;
      }
      .exp {
        img {
          width: 70px;
          height: 70px;
        }
        min-height: 200px;
        li {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
