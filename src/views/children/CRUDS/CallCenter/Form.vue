<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formcallcenter" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.profileImage')"
            class="d-block my-auto"
            style="width: 100%;"
            :rules="editMode ? '' : 'required'"
          >
            <!-- @change="sentImage($event)" -->
            <v-file-input
              :disabled="btnLoading"
              :loading="btnLoading"
              @change="uploadImage($event, 'users', 'avatar')"
              v-model="data.avatar.mainMedia"
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
                src="@/assets/media/images/placeholder.png"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.fullname')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.fullname')"
              type="text"
              :placeholder="$t('labels.fullname')"
              v-model="data.full_name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start gender -->
          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.gender')"
            class="col-lg-6"
            rules="required|min:2|max:250"
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
          </ValidationProvider> -->
          <!-- Start gender -->

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

          <!-- Start:: Email -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.email')"
            class="col-lg-6"
            rules="required|email"
          >
            <base-input
              :name="$t('labels.email')"
              type="email"
              @keypress="isEmailValid($event)"
              :placeholder="$t('labels.email')"
              v-model="data.email"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: Email -->
          <!-- Start Password -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.password')"
            class="col-lg-6"
            :rules="`${editMode ? '' : 'required'}|min:6|max:250`"
          >
            <base-input
              :name="$t('labels.password')"
              type="password"
              :placeholder="$t('labels.password')"
              v-model="data.password"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!--  <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.passwordConfirm')"
            class="col-lg-6"
            :rules="`${editMode ? '' : 'required'}|confirmed:${$t(
              'labels.password'
            )}`"
          >
            <base-input
              :name="$t('labels.passwordConfirm')"
              type="password"
              :placeholder="$t('labels.passwordConfirm')"
              v-model="data.passwordConfirmation"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->
          <!-- End Password -->
          <!-- Start preferred_language -->
          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.preferred_language')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-select-input
              v-model="data.preferred_language"
              :static="true"
              :name="$t('labels.preferred_language')"
              :staticItems="preferredLanguages"
              :placeholder="$t('labels.preferred_language')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->
          <!-- Start preferred_language -->
          <div class="col-12"></div>
          <!-- <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.front_side_id')"
            class="col-lg-6"
            :rules="editMode ? '' : 'required'"
          >
            <div class="input-title mb-3">
              <h4>{{ $t("labels.front_side_id") }}</h4>
            </div>
            <v-file-input
              :disabled="btnLoading"
              :loading="btnLoading"
              @change="uploadImage($event, 'callcenter', 'front_side_id')"
              v-model="data.front_side_id.mainMedia"
              class="d-none"
              :name="$t('labels.front_side_id')"
              accept="image/*,|size:2048"
              label=""
              id="id-image"
            ></v-file-input>
            <label
              for="id-image"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.front_side_id.preview"
                class="d-flex"
                cover
                :src="data.front_side_id.preview"
                :aspect-ratio="3.4"
              />
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/placeholder.png"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider> -->
          <div class="col-lg-6">
            <div class="row">
              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.is_admin_active_user')"
                class="col-6"
                rules="required"
              >
                <div>
                  <div class="input-title">
                    <h4>
                      {{ $t("labels.is_admin_active_user") }}
                    </h4>
                  </div>
                  <v-checkbox
                    :name="$t('labels.is_admin_active_user')"
                    class="py-0 px-0"
                    v-model="data.is_admin_active_user"
                    :label="$t('labels.is_admin_active_user')"
                  ></v-checkbox>
                </div>
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <!-- <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.is_active')"
                class="col-6"
                rules="required"
              >
                <div>
                  <div class="input-title">
                    <h4>
                      {{ $t("labels.active", { name: $t("labels.rider") }) }}
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
                  <h4>{{ $t("labels.ban", { name: $t("labels.rider") }) }}</h4>
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
          </div>
          <!-- Start :: Checks -->

          <!-- Start :: is_active -->
          <!-- <div class="col-lg-12 py-0">
          <div class="divider">
            <h4>الحالة</h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div> -->

          <!-- End :: Checks -->

          <!-- Start:: Ban Reason -->
          <ValidationProvider
            v-if="data.is_ban"
            v-slot="{ errors }"
            :name="$t('labels.ban_reason')"
            class="col-12"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.ban_reason')"
              type="ckeditor"
              :placeholder="$t('labels.ban_reason')"
              v-model="data.ban_reason"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End :: is_active -->

          <!-- End:: Ban Reason-->
        </div>
        <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
          >
            {{ $t("submit") }}
          </v-btn>
        </div>
        <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
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
          text: this.$t("breadcrumb.callcenter.title"),
          disabled: false,
          href: "/callcenter/show-all",
        },
        {
          text: this.$t(`breadcrumb.callcenter.${this.id ? "edit" : "add"}`),
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
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        front_side_id: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },
        full_name: null,

        password: null,
        passwordConfirmation: null,

        phone: {
          number: null,
          key: null,
          limit: null,
        },

        user_type: null,
        preferred_language: null,

        country: null,
        city: null,

        email: null,

        gender: null,

        is_admin_active_user: false,
        is_active: false,
        is_ban: false,
        ban_reason: null,
      },
      noData: false,
      // Fixed Data
      cityItems: [],
    };
  },

  methods: {
    // Main Image
    mainUploded(link) {
      this.data.avatar.title = link;
    },

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    // Cities
    getCities() {
      this.loadingCity = true;
      this.axios({
        method: "GET",
        url: `countries/${this.data.country.id}/cities_without_pagination`,
      })
        .then((res) => {
          this.cityItems = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          this.loadingCity = false;
          this.items = [
            { id: 1, name: "Item Default 1" },
            { id: 2, name: "Item Default 2" },
          ];
        })
        .finally(() => {
          this.loadingCity = false;
        });
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `callcenter/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.phone = {
            number: result.phone,
            key: result.phone_code,
            limit: 9,
          };
          this.data.email = result.email;
          this.data.full_name = result.full_name;
          // this.data.is_active = result.is_active;
          this.data.is_admin_active_user = result.is_admin_active_user;
          if (result.is_ban) {
            this.data.is_ban = result.is_ban;
            this.data.ban_reason = result.ban_reason;
          }

          this.data.avatar.preview = result.image;
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
      this.$refs.formcallcenter.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("full_name", this.data.full_name);

          data.append("phone_code", this.data.phone.key);
          data.append("phone", this.data.phone.number);
          // data.append("gender", this.data.gender.id);

          if (this.editMode) {
            if (this.data.password) {
              data.append("password", this.data.password);
            }
          } else {
            data.append("password", this.data.password);
          }

          // data.append("email", this.data.email);

          // data.append("preferred_language", this.data.preferred_language.id);

          if (this.data.ban_reason) {
            data.append("ban_reason", this.data.ban_reason);
          }
          // data.append("is_active", +this.data.is_active);
          data.append("is_admin_active_user", +this.data.is_admin_active_user);
          data.append("is_ban", +this.data.is_ban);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `callcenter/${this.id}`;
          } else {
            url = "callcenter";
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
              this.$router.push("/callcenter/show-all");
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
          // for (const value of Object.entries(this.$refs.formRiders.errors)) {
          //   if (value[1].length) {
          //     this.$iziToast.error({
          //       timeout: 2000,
          //       message: value[1],
          //       position: "bottomRight",
          //     });
          //   }
          // }
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
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
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}attachments`,
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
