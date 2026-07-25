<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formUsers" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.profileImage')"
            class="d-block my-auto"
            style="width: 100%"
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
            :rules="`required|min:${data.phone.limit}|max:${data.phone.limit}`"
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

          <!-- Start Country -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.country')"
            class="col-md-6"
            rules="required"
          >
            <base-select-input
              :classes="errors[0] ? 'error' : ''"
              :loading="loadingCountry"
              v-model="data.country"
              :static="true"
              :staticItems="countries"
              @input="getCities(data.country)"
              :placeholder="$t('labels.country')"
              :name="$t('labels.country')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- Start Country -->

          <!-- Start City -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.city')"
            class="col-md-6"
            rules="required"
          >
            <base-select-input
              :classes="errors[0] ? 'error' : ''"
              :loading="loadingCity"
              v-model="data.city"
              :static="true"
              :staticItems="cites"
              :placeholder="$t('labels.city')"
              :name="$t('labels.city')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- Start City -->

          <ValidationProvider
            v-slot="{ errors }"
            name="رقم السجل التجاري"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              name="رقم السجل التجاري"
              type="number"
              placeholder="رقم السجل التجاري"
              v-model="data.commercial_registration_no"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start Country -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.services')"
            class="col-md-6"
            rules="required"
          >
            <base-select-input
              v-model="data.services"
              :static="true"
              :name="$t('labels.service')"
              :staticItems="services"
              multiple
              :placeholder="$t('labels.service')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- Start Country -->

          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.services')"
            class="col-md-6"
            rules="required"
          >
            <base-select-input
              col="12"
              v-model="data.services"
              getUrl="services-without-paginate"
              multiple
              :placeholder="$t('labels.services')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->

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
              @change="uploadImage($event, 'users', 'front_side_id')"
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
          text: this.$t("breadcrumb.companies.title"),
          disabled: false,
          href: "/companies/show-all",
        },
        {
          text: this.$t(`breadcrumb.companies.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCity: false,
      loadingCountry: false,
      loadingService: false,
      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        commercial_registration_no: null,

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

        services: [],

        is_admin_active_user: false,
        is_active: false,
        is_ban: false,
        ban_reason: null,
      },
      noData: false,
      // Fixed Data
      countries: null,
      services: null,
      cites: null,
    };
  },

  methods: {
    // Main Image
    mainUploded(link) {
      this.data.avatar.title = link;
    },

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.limit = data.limit;
      this.data.phone.key = data.key;
    },

    // Countries
    getCountries() {
      this.loadingCountry = true;
      this.axios({
        method: "GET",
        url: `countries-without-paginated`,
      })
        .then((res) => {
          this.countries = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
              key: item.phone_code,
              limit: item.phone_number_limit,
            };
          });
          this.loadingCountry = false;
          if (this.id) {
            this.getEditData();
          }
        })
        .catch((err) => {
          this.loadingCountry = false;

          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        })
        .finally(() => {
          this.loadingCountry = false;
        });
    },

    // services
    getServices() {
      this.loadingService = true;
      this.axios({
        method: "GET",
        url: `services-without-paginate`,
      })
        .then((res) => {
          this.services = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.title,
            };
          });
          this.loadingService = false;
        })
        .catch((err) => {
          this.loadingCountry = false;

          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        })
        .finally(() => {
          this.loadingCountry = false;
        });
    },
    // Cities
    getCities(e) {
      this.loadingCity = true;
      this.axios({
        method: "GET",
        url: `cities-without-paginated`,
        params: { country_id: e.id },
      })
        .then((res) => {
          this.cites = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          this.loadingCity = false;
        })
        .catch((err) => {
          this.loadingCity = false;

          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
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
        url: `companies/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.services = this.services;
          if (result.country) {
            this.data.country = this.countries.find(
              (el) => el.id == result.country.id
            );
          }
          this.getCities(result.country);
          if (result.city) {
            this.data.city = result.city;
          }

          const selectedPhone = this.countries.find(
            (el) => el.key == result.phone_code
          );

          if (selectedPhone) {
            this.data.phone = {
              number: result.phone,
              key: result.phone_code,
              limit: selectedPhone.limit,
            };
          }

          this.data.commercial_registration_no =
            result.commercial_registration_no;
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
      this.$refs.formUsers.validate().then((d) => {
        if (d) {
          this.btnLoading = true;
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("full_name", this.data.full_name);

          data.append("phone_code", this.data.phone.key);
          data.append("phone", this.data.phone.number);
          data.append("country_id", this.data.country?.id);
          data.append("city_id", this.data.city?.id);
          if (this.data.services?.length) {
            this.data.services.forEach((ele, index) => {
              data.append(`services[${index}][service_id]`, ele.id);
            });
          }

          if (this.editMode) {
            if (this.data.password) {
              data.append("password", this.data.password);
            }
          } else {
            data.append("password", this.data.password);
          }

          data.append(
            "commercial_registration_no",
            this.data.commercial_registration_no
          );

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
            url = `companies/${this.id}`;
          } else {
            url = "companies";
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
              this.$router.push("/companies/show-all");
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
  async mounted() {
    await this.getCountries();
    await this.getServices();
  },
};
</script>

<style lang="scss" scoped></style>
