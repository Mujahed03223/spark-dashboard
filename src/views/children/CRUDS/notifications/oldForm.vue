<template>
  <div>
    <Breadcrumb :items="items" />
    <Loader v-if="loading && editMode"></Loader>
    <div v-else>
      <noData v-if="noData" />
      <div class="form countryForm custom_card" v-else>
        <ValidationObserver ref="formNotification" @submit.prevent="submit">
          <div class="row justify-content-center">
            <!-- <div class="col-12">
              <v-checkbox v-model="data.all" label="ارسال الاشعار للكل"></v-checkbox>
            </div> -->
            <!-- Start:: user_type -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.user_type')"
              class="col-lg-6"
              rules="required"
            >
              <base-select-input
                v-model="data.user_type"
                @input="getUserType"
                :static="true"
                :name="$t('labels.user_type')"
                :staticItems="userTypes"
                :placeholder="$t('labels.user_type')"
              ></base-select-input>

              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <div class="col-12"></div>
            <!-- End:: user_type -->

            <!-- Start:: users -->
            <ValidationProvider
              v-if="data.user_type?.id == 'specific'"
              v-slot="{ errors }"
              :name="
                data.user_type ? $t(data.user_type.id) : $t('labels.users')
              "
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <!-- :loading="usersLoading" -->
              <base-select-input
                :name="
                  data.user_type ? $t(data.user_type.id) : $t('labels.users')
                "
                v-model="data.user"
                :static="true"
                :staticItems="users"
                :multiple="true"
                :placeholder="
                  data.user_type
                    ? $t(`labels.${data.user_type.id}s`)
                    : $t('labels.users')
                "
              ></base-select-input>
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <!-- End:: users -->

            <div class="col-12"></div>

            <!-- Start:: title -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.title')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.title')"
                :placeholder="$t('labels.title')"
                type="text"
                v-model="data.title"
              ></base-input>
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <!-- End:: title -->

            <div class="col-12"></div>

            <!-- Start:: message -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.message')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.message')"
                :placeholder="$t('labels.message')"
                type="textarea"
                v-model="data.message"
              ></base-input>
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <!-- End:: message -->
          </div>

          <div class="button_wrapper center">
            <v-btn
              type="submit"
              @click="submit"
              :disabled="loading"
              :loading="loading"
            >
              {{ $t("submit") }}
            </v-btn>
          </div>
          <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
// import MapWrite from "../../../../components/Maps/MapWrite.vue";

export default {
  // components: { MapWrite },
  props: ["id"],

  data() {
    return {
      noData: false,
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.notifications.title"),
          disabled: false,
          href: "/notifications/show-all",
        },
        {
          text: this.$t(`breadcrumb.notifications.send_notification`),
          disabled: true,
          href: "",
        },
      ],
      // Loading

      loading: false,
      usersLoading: false,

      data: {
        all: false,
        user_type: null,
        user: null,
        message: null,
      },
      users: [],
      // userTypes: [],
      discountTypes: [
        {
          id: "amount",
          name: this.$t("monyAmount"),
        },
        {
          id: "percentage",
          name: this.$t("percentage", { name: " " }),
        },
      ],
    };
  },

  methods: {
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `coupon/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          this.data = {
            code: res.data.data.code,
            discount_type: this.discountTypes.find((item) => {
              return item.id == res.data.data.descount_type;
            }),
            user_type: this.userTypes.find((item) => {
              return item.id == res.data.data.user_type;
            }),
            package: res.data.data.package,
            amount: res.data.data.amount,
            max_amount: res.data.data.max_amount,
            usage_count: res.data.data.usage_count,
            user_usage_count: res.data.data.user_usage_count,
            start_at: new Date(res.data.data.start_date).toLocaleDateString(
              "en-CA"
            ),
            end_at: new Date(res.data.data.end_date).toLocaleDateString(
              "en-CA"
            ),
            start_time: new Date(res.data.data.start_date).toLocaleTimeString(
              "en-US",
              { hour12: false }
            ),
            end_time: new Date(res.data.data.end_date).toLocaleTimeString(
              "en-US",
              { hour12: false }
            ),

            // Checks
            is_active: res.data.data.is_active,
            is_city_to_city_active: res.data.data.is_city_to_city_active,
            is_trip_active: res.data.data.is_trip_active,
            is_package_delivering_active:
              res.data.data.is_package_delivering_active,
          };
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
    resetForm() {
      this.data = {
        all: false,
        user_type: null,
        title: null,
        user: null,
        message: null,
      };
    },
    submit() {
      this.$refs.formNotification.validate().then((d) => {
        if (d) {
          this.loading = true;
          const frmData = new FormData();

          frmData.append("type", this.data.user_type.id);
          frmData.append("title", this.data.title);
          frmData.append("body", this.data.message);

          if (this.data.user_type.id == "specific") {
            this.data.user.map((el, index) =>
              frmData.append(`user_ids[${index}]`, el.id)
            );
          }
          this.axios({
            method: "POST",
            url: "notifications",
            data: frmData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: "تم الارسال بنجاح",
              });
              this.loading = false;
              this.resetForm();
              this.$refs.formNotification.reset();
            })
            .catch((err) => {
              this.loading = false;
              this.$iziToast.error({
                title: this.$t("error"),
                message:
                  err.response.data.message ?? err.response.data.messages,
              });
            });
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
    // allowedDate(val) {
    //   console.log(val);
    //   return new Date() - 1;
    // },
    getUserType() {
      console.log(event);
      this.usersLoading = true;
      this.axios
        .get(`clients-without-paginate`)
        .then((res) => {
          this.users = res.data.data.map((el) => ({
            id: el.id,
            name: el.full_name,
          }));
          this.usersLoading = false;
        })
        .catch(() => (this.usersLoading = false));
      // if (event.id != "all_providers" && event.id != "client") {
      //   this.axios
      //     .get(`${event.id}s_not_paginated`)
      //     .then((res) => {
      //       this.users = res.data.data.map((el) => ({
      //         id: el.id,
      //         name: el.full_name,
      //       }));
      //       this.usersLoading = false;
      //     })
      //     .catch(() => (this.usersLoading = false));
      // }
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>
