<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="usersForm" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.profileImage')"
            class="d-block my-auto mt-5 mb-3"
            style="width: 100%"
            :rules="`${data.avatar.preview ? '' : 'required'}`"
          >
            <v-file-input
              :disabled="btnLoading"
              :loading="btnLoading"
              @change="uploadImage($event, 'users', 'avatar')"
              v-model="data.avatar.image"
              class="d-none"
              :name="$t('labels.profileImage')"
              accept="image/*,|size:2048"
              label=""
              id="banner-create-image-main"
            ></v-file-input>
            <label
              for="banner-create-image-main"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.avatar.preview"
                class="d-flex"
                cover
                :src="data.avatar.preview"
                :aspect-ratio="3.4"
              />
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/logo/logo.svg"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>

          <!-- Start username -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.user_name')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.user_name')"
              type="text"
              :placeholder="$t('labels.user_name')"
              v-model="data.username"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End username -->

          <!-- Start gender -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.gender')"
            class="col-lg-6"
            rules=""
          >
            <base-select-input
              v-model="data.gender"
              :static="true"
              :name="$t('labels.gender')"
              :staticItems="genders"
              :placeholder="$t('labels.gender')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- Start gender -->

          <!-- Start::  date_of_birth -->
          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.date_of_birth')"
            class="col-lg-6"
            rules="required"
          >
            <base-picker-input
              :name="$t('labels.date_of_birth')"
              type="date"
              v-model="data.date_of_birth"
              :placeholder="$t('labels.date_of_birth')"
              :acceptToUp="true"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->
          <!-- End::  date_of_birth -->

          <!-- Start ID_number -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.ID_number')"
            class="col-lg-6"
            rules="required|min:9|max:10"
          >
            <base-input
              :name="$t('labels.ID_number')"
              type="number"
              @keypress="preventMinus"
              :placeholder="$t('labels.ID_number')"
              v-model="data.ID_number"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End ID_number -->

          <!-- Start:: city -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.city')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              v-model="data.city"
              getUrl="cities_without_pagination"
              :placeholder="$t('labels.city')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: city -->

          <!-- Start Phone -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.phone')"
            class="col-lg-6"
            :rules="`required|${
              data.phone.limit
                ? `min:${data.phone.limit}` + '|' + `max:${data.phone.limit}`
                : ''
            }`"
          >
            <base-country-flag-phone-input
              @changeKey="phoneKeyChanged"
              :name="$t('labels.phone')"
              :placeholder="$t('labels.phone')"
              :preSelectedPhoneCode="data.phone.key"
              v-model="data.phone.number"
            ></base-country-flag-phone-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Phone -->

          <div class="col-lg-12" v-if="editMode">
            <div class="row">
              <!-- <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.is_active')"
                class="col-6"
                rules="required"
              >
                <div>
                  <div class="input-title">
                    <h4>
                      {{ $t("labels.is_active") }}
                    </h4>
                  </div>
                  <v-checkbox
                    :name="$t('labels.is_active')"
                    class="py-0 px-0"
                    v-model="data.is_active"
                    :label="$t('labels.is_active')"
                  ></v-checkbox>
                </div>
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider> -->

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.is_ban')"
                class="col-lg-6"
                rules="required"
              >
                <div class="input-title">
                  <h4>{{ $t("labels.ban", { name: $t("labels.user") }) }}</h4>
                </div>
                <v-checkbox
                  :name="$t('labels.is_ban')"
                  class="py-0 px-0"
                  v-model="data.is_ban"
                  :label="$t('labels.is_ban')"
                ></v-checkbox>
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </div>
            <!-- Start:: Ban Reason -->
            <ValidationProvider
              v-if="data.is_ban"
              v-slot="{ errors }"
              :name="$t('labels.ban_reason')"
              class="col-12"
              :rules="`${data.is_ban && 'required'}|min:2|max:250`"
            >
              <base-input
                :name="$t('labels.ban_reason')"
                type="textarea"
                :placeholder="$t('labels.ban_reason')"
                v-model="data.ban_reason"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <!-- End:: Ban Reason-->
          </div>
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
            @click="handleBack('/users/show-all')"
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
import { mapGetters } from "vuex";
import BaseCountryFlagPhoneInput from "@/components/Forms/BaseCountryFlagPhoneInput.vue";

export default {
  components: { BaseCountryFlagPhoneInput },
  props: ["id"],

  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.users.title"),
          disabled: false,
          href: "/users/show-all",
        },
        {
          text: this.$t(`breadcrumb.users.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCity: false,

      data: {
        avatar: {
          preview: null,
          image: null,
        },

        phone: {
          number: null,
          key: null,
          limit: null,
        },

        username: null,
        ID_number: null,
        gender: null,
        // date_of_birth: null,
        city: null,
        // is_active: false,
        is_ban: false,
        ban_reason: null,
      },

      noData: false,
    };
  },

  methods: {
    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    uploadImage(event, modal, varName) {
      if (event) {
        this.btnLoading = true;
        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", modal);

        this.axios({
          method: "POST",
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}`,
          data: data,
        })
          .then((res) => {
            this.data[varName].image = res.data.data;
            this.data[varName].preview = URL.createObjectURL(event);
            this.btnLoading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });

            this.btnLoading = false;
          });
      }
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `users/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.image;

          this.data.username = result.username;
          this.data.ID_number = result.ID_number;
          // this.data.date_of_birth = result.date_of_birth;

          this.data.phone.number = result.phone;
          this.data.phone.key = result.phone_code;
          this.data.city = result.city;

          this.data.gender = this.genders.find((el) => el.id == result.gender);

          // this.data.is_active = result.is_active;
          if (result.is_ban) {
            this.data.is_ban = result.is_ban;
            this.data.ban_reason = result.ban_reason;
          }
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

    // Submit
    submit() {
      this.$refs.usersForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("username", this.data.username);

          data.append("phone_code", this.data.phone.key);
          data.append("phone", this.data.phone.number);

          data.append("ID_number", this.data.ID_number);

          if (this.data.gender && this.data.gender.id) {
            data.append("gender", this.data.gender.id);
          }

          data.append("city_id", this.data.city.id);

          // data.append(
          //   "date_of_birth",
          //   `${this.$moment(this.data.date_of_birth).format("YYYY-MM-DD")}`
          // );

          if (this.id) {
            data.append("_method", "PUT");

            if (this.data.ban_reason) {
              data.append("ban_reason", this.data.ban_reason);
            }
            // data.append("is_active", +this.data.is_active);
            data.append("is_ban", +this.data.is_ban);
          }
          let url = "";
          if (this.id) {
            url = `users/${this.id}`;
          } else {
            url = "users";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: url,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/users/show-all");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
  },

  computed: {
    ...mapGetters({
      lang: "lang_module/lang",
    }),

    editMode() {
      return !!this.id;
    },
  },
  mounted() {
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>

<style lang="scss" scoped></style>
