<template>
  <div class="userCard">
    <div class="top customCard">
      <div class="userInfo">
        <div class="image">
          <img
            @click="show_model_1(data.avatar)"
            :src="data.avatar"
            v-if="data.avatar"
            alt=""
          />
          <img
            src="@/assets/media/images/Icons/favicon_opacity.svg"
            v-else
            alt=""
          />
        </div>

        <div class="_info">
          <header>
            <h4 class="name">
              {{
                data.first_name && data.last_name
                  ? data.first_name + " " + data.last_name
                  : $t("notFound")
              }}
            </h4>
            <h6 class="rate" v-if="userType != 'contributor'">
              <i class="fas fa-star"></i> {{ data.rate_avg }}
            </h6>
          </header>
          <!-- client type  -->
          <v-chip
            color="#a600ff"
            text-color="#fff"
            class="chip-card"
            v-if="userType == 'driver' && !data.is_belongs_to_contributor"
          >
            شخصي
          </v-chip>
          <v-chip
            color="#24beb9"
            text-color="#fff"
            class="chip-card"
            v-if="userType == 'driver' && data.is_belongs_to_contributor"
          >
            شركه
          </v-chip>
          <!-- end of client type  -->
          <div class="keyValue" v-if="data.is_belongs_to_contributor">
            <span class="key"> اسم الشركه: </span>
            <span class="value">{{
              data.contributor.first_name + " " + data.contributor.last_name
            }}</span>
          </div>

          <div class="keyValue" v-if="userType != 'driver'">
            <span class="key">{{ $t("labels.email") }} </span>
            <span class="value">{{
              data.email ? data.email : $t("notFound")
            }}</span>
          </div>

          <div class="keyValue">
            <span class="key">{{ $t("labels.phone") }}</span>
            <span class="value"
              >{{ data.phone }} - ({{ data.phone_code }})</span
            >
          </div>

          <div class="keyValue">
            <span class="key">{{ $t("labels.createdAt") }} </span>
            <span class="value">{{ data.created_at }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <a class="action" @click="show = true">
          <i class="far fa-bell"></i>
        </a>

        <a class="action" :href="`tel:${data.phone}`">
          <i class="fas fa-phone"></i>
        </a>

        <router-link class="action" :to="`/${data.user_type}s/edit/${data.id}`">
          <i class="fas fa-edit"></i>
        </router-link>

        <a
          class="action"
          title="التفعيل"
          @click="showActive = true"
          v-if="data.user_type != 'client'"
        >
          <span v-if="data.is_admin_active_user"
            ><i class="fa-solid fa-unlock-keyhole"></i
          ></span>
          <span v-else> <i class="fa-solid fa-lock"></i> </span>
        </a>
      </div>
    </div>

    <div class="row mt-5 customCard">
      <div class="col-lg-12">
        <h2 class="h_2 mb-0" v-if="userType == 'partner'">بيانات السائق</h2>
        <h2 class="h_2 mb-0" v-if="userType == 'rider'">بيانات العميل</h2>
        <h2 class="h_2 mb-0" v-if="userType == 'contributor'">بيانات الشركة</h2>
      </div>
      <div class="col-lg-3" v-if="userType != 'contributor'">
        <StateCard name="النوع" :value="genderText(data.gender)" />
        <!-- <StateCard name="النوع" :value="genderText(data.gender)" /> -->
      </div>

      <div class="col-lg-3">
        <StateCard
          name="هل اليوزر محظور"
          :value="helper_boolToText(data.is_ban)"
        />
      </div>

      <div class="col-lg-3">
        <StateCard
          name="هل اليوزر مفعل"
          :value="helper_boolToText(data.is_active)"
        />
      </div>
      <div class="col-lg-3" v-if="userType != 'client'">
        <StateCard
          name="هل اليوزر مقبول من الاداره"
          :value="helper_boolToText(data.is_admin_active_user)"
        />
      </div>
      <div class="col-lg-3">
        <StateCard
          name="هل تم الانتهاء من التسجيل ؟"
          :value="helper_boolToText(data.is_complete_data)"
        />
      </div>

      <div
        class="col-lg-3"
        v-if="
          userType == 'contributor' && data.contributor_type != 'individual'
        "
      >
        <StateCard
          name="رقم السجل التجاري"
          :value="
            data.company
              ? data.company.commercial_register_number
              : $t('table.noData')
          "
        />
      </div>
      <div
        class="col-lg-3"
        v-if="
          userType == 'contributor' && data.contributor_type != 'individual'
        "
      >
        <StateCard
          name="هاتف الشركة"
          :value="data.company ? data.company.phone : $t('table.noData')"
        />
      </div>
      <div
        class="col-lg-3"
        v-if="
          userType == 'contributor' && data.contributor_type != 'individual'
        "
      >
        <StateCard
          name="بريد الشركة"
          :value="data.company ? data.company.email : $t('table.noData')"
        />
      </div>
      <div
        class="col-lg-3"
        v-if="
          userType == 'contributor' && data.contributor_type != 'individual'
        "
      >
        <StateCard
          name="دولة الشركة"
          :value="data.country ? data.country.name : $t('table.noData')"
        />
      </div>
      <div class="col-lg-3" v-if="userType == 'contributor'">
        <StateCard
          name="نوع الشركة"
          :value="companyType(data.contributor_type)"
        />
      </div>
      <!-- <div class="col-lg-3">
        <StateCard
          name="هل اليوزر مفعل من الادارة"
          :value="helper_boolToText(data.is_admin_active_user)"
        />
      </div> -->
      <!-- <div class="col-lg-3">
        <StateCard
          name="هل اليوزر محظور"
          :value="helper_boolToText(data.is_ban)"
        />
      </div> -->
      <div class="col-lg-3" v-if="userType == 'driver'">
        <StateCard
          name="رقم الرخصة"
          :value="
            data.driver_license_number
              ? data.driver_license_number
              : $t('table.noData')
          "
        />
      </div>
      <div class="col-lg-3" v-if="userType == 'driver'">
        <StateCard
          name="الرقم التعريفي"
          :value="
            data.identity_number ? data.identity_number : $t('table.noData')
          "
        />
      </div>
      <div class="col-lg-3" v-if="userType == 'driver'">
        <StateCard
          name="هل توصل الطلبات متاح"
          :value="helper_boolToText(data.is_package_delivering_active)"
        />
      </div>
      <div class="col-lg-3" v-if="userType == 'driver'">
        <StateCard
          name="هل اليوزر متاح"
          :value="helper_boolToText(data.is_available)"
        />
      </div>
      <div class="col-lg-3" v-if="userType == 'driver'">
        <StateCard
          name="رحلة من مدينه لمدينه"
          :value="helper_boolToText(data.is_city_to_city_active)"
        />
      </div>
      <div class="col-lg-3" v-if="userType == 'driver'">
        <StateCard
          name="رحلة مفعلة الآن"
          :value="helper_boolToText(data.is_trip_active)"
        />
      </div>
      <div class="col-lg-12" v-if="data.is_ban">
        <StateCard
          name="سبب الحظر"
          :value="data.ban_reason ? data.ban_reason : 'لا يوجد'"
        />
      </div>
    </div>

    <!-- ********** Start:: Vehicle Image ********** -->
    <DriverFiles v-if="userType == 'driver'" :files="files"></DriverFiles>
    <!-- ********** End:: Vehicle Image ********** -->

    <base-model :show="show" @close="show = false">
      <div class="notificationPopup customCard">
        <h3 class="h_3">إرسال إشعار</h3>

        <div class="row">
          <form @submit.prevent="sendNotifications">
            <!-- Title -->
            <base-input
              col="12"
              type="text"
              :placeholder="$t('labels.title')"
              :required="true"
              v-model="notification_data.title"
            />

            <!-- Body -->
            <base-input
              col="12"
              type="textarea"
              :placeholder="$t('labels.content')"
              :required="true"
              v-model="notification_data.body"
            />

            <base-button :loading="loading" class="center">{{
              $t("submit")
            }}</base-button>
          </form>
        </div>
      </div>
    </base-model>

    <base-model :show="showActive" @close="showActive = false">
      <div class="notificationPopup customCard">
        <h3 class="h_3" v-if="data.is_admin_active_user">
          الغاء تفعيل المستخدم
        </h3>
        <h3 class="h_3" v-else>تفعيل المستخدم</h3>

        <div class="mt-5">
          <v-btn
            v-if="!data.is_admin_active_user"
            @click="toggleActiveUser"
            class="mx-2"
            fab
            dark
            small
            color="green"
          >
            <v-icon dark>fas fa-check</v-icon>
          </v-btn>

          <v-btn
            v-else
            @click="toggleActiveUser"
            class="mx-2"
            fab
            dark
            small
            color="red"
          >
            <v-icon dark>fas fa-times</v-icon>
          </v-btn>
        </div>
      </div>
    </base-model>

    <!-- Start Image_Model -->
    <ImageModal
      :modalIsOpen="model_1.show_model"
      :modalImage="model_1.model_img_src"
      @toggleModal="model_1.show_model = false"
    />
    <!-- End Image_Model -->
  </div>
</template>

<script>
import ImageModal from "@/components/Modals/ImageModal.vue";
import DriverFiles from "@/components/Pages/Profile/DriverFiles.vue";

export default {
  props: ["data", "userType"],
  components: { ImageModal, DriverFiles },

  data() {
    return {
      loading: false,
      show: false,
      showActive: false,

      notification_data: {
        title: null,
        body: null,
      },

      // Start:: Model Data
      model_1: {
        show_model: false,
        model_img_src: "",
      },

      // End:: Model Data
      files: [],
    };
  },

  methods: {
    signInElm() {
      this.axios({
        method: "POST",
        url: `/drivers/${this.data.id}/sign_elm`,
      });
    },

    // Send Notification
    sendNotifications() {
      this.loading = true;

      const data = new FormData();
      data.append("all", +false);
      data.append("title", this.notification_data.title);
      data.append("body", this.notification_data.body);
      data.append(`user_ids[0]`, this.data.id);
      data.append(`user_type`, this.data.user_type);
      // data.append(`user_type`, this.userType.slice(0, this.userType.length));

      this.axios({
        method: "POST",
        url: `/notifications`,
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
          this.dialog_sent_notification = false;
          this.loading = false;
          this.notification_data.title = null;
          this.notification_data.body = null;
        })
        .catch((err) => {
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
          this.notification_data.title = null;
          this.notification_data.body = null;
        })
        .finally(() => {
          this.show = false;
        });
    },

    // Start:: Img Model
    show_model_1(src) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
    },
    // End:: Img Model

    toggleActiveUser() {
      this.axios({
        method: "GET",
        url: `${this.data.user_type}s/${this.data.id}/status`,
      })
        .then((res) => {
          console.log(res.data.data);
          this.$emit("updateData");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.showActive = false;
        });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    // if (this.$route.path.includes("contributors")) {
    //   this.userType = "contributor";
    // }
    // if (this.$route.path.includes("drivers")) {
    //   this.userType = "driver";
    // }
    // if (this.$route.path.includes("clients")) {
    //   this.userType = "client";
    // }
    this.files = [
      {
        id: "1",
        criminal_record_info_image: this.data.criminal_record_info_image,
        driver_license_image: this.data.driver_license_image,
        id_front_image: this.data.id_front_image,
        id_back_image: this.data.id_back_image,
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
.userCard {
  padding: 0px 0px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .userInfo {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;

      .image {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f6fa;
        width: 90px;
        height: 90px;
        margin-inline-end: 15px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      ._info {
        header {
          display: flex;
          align-items: center;
          margin-top: 10px;

          .name {
            margin-inline-end: 4px;
            color: #000;
            font-size: 20px;
            font-weight: bold;
          }

          .rate {
            margin-inline: 10px;
            font-size: 13px;

            i {
              color: gold;
            }
          }
        }

        .keyValue {
          display: flex;
          font-size: 17px;

          .key {
            margin-inline-end: 10px;
            color: #b0bac9;
          }
        }
      }
    }

    .actions {
      display: flex;
      flex-wrap: wrap;

      .action {
        border-radius: 50%;
        display: block;
        width: 40px;
        height: 40px;
        background: var(--main);
        margin: 0 10px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-block: 10px;

        &.elm {
          width: fit-content;
          height: auto;
          border-radius: unset;
          padding: 7px;
          border-radius: 18px;
          font-size: 17px;
        }
      }
    }

    @media (max-width: 992px) {
      flex-direction: column;
      width: fit-content;
      margin-inline: auto;
      width: 100%;

      .userInfo {
        margin-bottom: 20px;

        ._info {
          header {
            justify-content: center;
          }
        }
      }
    }
  }
}

.notificationPopup {
  padding: 15px;
  text-align: center;
  border-radius: 15px;
}

.btn_wrapper {
  width: fit-content;
}

.image_wrapper {
  img {
    height: 190px;
    border-radius: 20px;
  }
}
</style>
