<template>
  <Loader v-if="loading && editMode"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formNotification" @submit.prevent="submit">
        <div class="row">
          <!-- <div class="col-12">
              <v-checkbox v-model="data.all" label="ارسال الاشعار للكل"></v-checkbox>
            </div> -->

          <!-- Start:: user_type -->
          <div class="col-12">
            <div class="row">
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

              <ValidationProvider
                v-if="data.user_type && data.user_type.id === 'user'"
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
            </div>
          </div>
          <!-- End:: user_type -->

          <!-- Start:: Title -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title')"
            class="col-12"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title')"
              type="text"
              :placeholder="$t('labels.title')"
              v-model="data.title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- End:: Title -->

          <!-- Start:: Notification Body -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.message')"
            class="col-12"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.message')"
              type="textarea"
              :placeholder="$t('labels.message')"
              v-model="data.body"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: Notification Body -->

          <!-- Start::  Start At -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.scheduled_date')"
            class="col-md-6"
            rules=""
          >
            <base-picker-input
              :name="$t('labels.scheduled_date')"
              type="date"
              v-model="data.scheduled_date"
              :placeholder="$t('labels.scheduled_date')"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.scheduled_time')"
            class="col-md-6"
            rules=""
          >
            <base-picker-input
              :name="$t('labels.scheduled_time')"
              type="time"
              v-model="data.scheduled_time"
              :placeholder="$t('labels.scheduled_time')"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End::  Start At -->
        </div>

        <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="loading"
            :loading="loading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn
            type="button"
            class="back_btn"
            @click="handleBack('/notifications/show-all')"
          >
            {{ $t("back") }}
            <span
              :class="
                $i18n.locale === 'ar'
                  ? 'fas fa-arrow-left'
                  : 'fas fa-arrow-right'
              "
            ></span>
          </v-btn>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
export default {
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
          text: this.$t("breadcrumb.notifications.sent_notifications"),
          disabled: false,
          href: "/notifications/sent",
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
        title: null,
        body: null,
        scheduled_date: null,
        scheduled_time: null,
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
    resetForm() {
      this.data = {
        all: false,
        user_type: null,
        user: null,
        title: null,
        body: null,
        scheduled_date: null,
        scheduled_time: null,
      };
    },
    submit() {
      this.$refs.formNotification.validate().then((d) => {
        if (d) {
          this.loading = true;
          const formData = new FormData();

          if (this.data.user_type && this.data.user_type.id !== "user") {
            formData.append("type", this.data.user_type.id);
          }

          formData.append("title", this.data.title);
          formData.append("body", this.data.body);
          if (this.data.scheduled_date && this.data.scheduled_time) {
            formData.append(
              "scheduled_datetime",
              `${this.$moment(this.data.scheduled_date).format("YYYY-MM-DD")} ${
                this.data.scheduled_time
              }`
            );
          }

          if (this.data.user_type && this.data.user_type.id === "user") {
            this.data.user &&
              this.data.user.map(
                (el, index) =>
                  formData.append(`users[${index}][user_id]`, el.id)
                // formData.append(`user_ids[${index}]`, el.id)
              );
          }
          this.axios({
            method: "POST",
            url: "send-notification",
            data: formData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: this.$t("sendSuccess"),
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

    getUserType() {
      if (this.data.user_type && this.data.user_type.id === "user") {
        this.usersLoading = true;
        this.axios
          .get(`users_without_pagination`)
          .then((res) => {
            this.users =
              res.data.data &&
              res.data.data.map((el) => ({
                id: el.id,
                name: el.username,
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
      }
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
  },
};
</script>
