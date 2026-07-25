<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver
        ref="formmaintenanceTechnician"
        @submit.prevent="submit"
      >
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

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.country')"
            class="col-md-6"
            rules="required"
          >
            <!-- start:: Country -->
            <base-select-input
              v-model="data.country"
              getUrl="countries-without-paginated"
              :placeholder="$t('labels.country')"
            ></base-select-input>
            <!-- End:: Country -->
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.city')"
            class="col-md-6"
            rules="required"
          >
            <!-- start:: city -->
            <base-select-input
              v-model="data.city"
              getUrl="cities-without-paginated"
              :placeholder="$t('labels.city')"
            ></base-select-input>
            <!-- End:: city -->
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start categories -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.service')"
            class="col-lg-6"
            rules="required|min:2|max:250"
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
          <!-- Start categories -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.company')"
            class="col-md-6"
            rules="required"
          >
            <base-select-input
              v-model="data.company"
              getUrl="companies-without-paginate"
              :placeholder="$t('labels.company')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

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

          <div class="col-md-6"></div>

          <!-- START:: MAP -->
          <!-- <div class="col-12 fadeIn">
            <div class="col-12 my-2">
              <div class="search_input_wrapper">
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="searchMap"
                  :placeholder="$t('selectLocation')"
                  id="autocomplete_ar"
                  @input="getAddress"
                  v-model="data.location"
                />
              </div>
            </div>
            <GmapMap
              style="width: 100%; min-height: 300px; max-height: 100%"
              :center="coordinates_to_edit"
              :zoom="7"
              :draggable="true"
              map-type-id="terrain"
            >
              <GmapMarker
                :position="coordinates_to_edit"
                :clickable="true"
                :draggable="true"
                @dragend="updateMarker($event.latLng)"
              />
            </GmapMap>
          </div> -->
          <!-- END:: MAP -->

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
          <!-- End preferred_language -->
          <div class="col-12"></div>
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
          </div>
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
              <!-- <ValidationProvider v-slot="{ errors }" :name="$t('labels.is_active')" class="col-6" rules="required">
                <div>
                  <div class="input-title">
                    <h4>
                      {{ $t("labels.active", { name: $t("labels.rider") }) }}
                    </h4>
                  </div>
                  <v-checkbox :name="$t('labels.is_active')" class="py-0 px-0" v-model="data.is_active"
                    :label="$t('labels.is_active')"></v-checkbox>
                </div>
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider> -->

              <!-- <ValidationProvider v-slot="{ errors }" :name="$t('labels.is_ban')" class="col-lg-6" rules="required">
                <div class="input-title">
                  <h4>{{ $t("labels.ban", { name: $t("labels.rider") }) }}</h4>
                </div>
                <v-checkbox :name="$t('labels.is_ban')" class="py-0 px-0" v-model="data.is_ban"
                  :label="$t('labels.is_ban')"></v-checkbox>
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider> -->
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
          <!-- <ValidationProvider
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
          </ValidationProvider> -->
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
          text: this.$t("breadcrumb.maintenanceTechnician.title"),
          disabled: false,
          href: "/maintenanceTechnician/show-all",
        },
        {
          text: this.$t(
            `breadcrumb.maintenanceTechnician.${this.id ? "edit" : "add"}`
          ),
          disabled: true,
          href: "",
        },
      ],

      coordinates_to_edit: { lat: 0, lng: 0 },

      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCategory: false,
      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        subscribe_from: null,
        subscribe_to: null,

        full_name: null,
        service: null,
        password: null,
        // passwordConfirmation: null,

        phone: {
          number: null,
          key: null,
          limit: null,
        },

        ar: {
          title: null,
        },
        en: {
          title: null,
        },

        location: null,
        lat: null,
        lng: null,

        user_type: null,

        country: null,
        city: null,

        email: null,
        services: null,

        gender: null,

        is_active: false,
        is_ban: false,
        company: null,
        is_admin_active_user: false,
        // ban_reason: null,
      },
      noData: false,
      // Fixed Data
      cityItems: [],

      services: [],
    };
  },

  methods: {
    // START:: UPDATE LOCATION
    updateMarker(location) {
      this.coordinates_to_edit = {
        lat: location.lat(),
        lng: location.lng(),
      };
      this.data.lat = location.lat();
      this.data.lng = location.lng();
    },
    // END:: UPDATE LOCATION

    // START:: G-MAP GET ADDRESS
    getAddress() {
      var self = this;
      var input = document.getElementById("autocomplete_ar");
      self.data.location = input.value;
      var searchBox = new google.maps.places.SearchBox(input);
      searchBox.addListener("places_changed", function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          bounds.extend(place.geometry.location);
          place.geometry.location.lat();
          place.geometry.location.lng();
          place.formatted_address;
          self.data.location = place.formatted_address;
          self.coordinates_to_edit = {
            lat: Number(place.geometry.location.lat()),
            lng: Number(place.geometry.location.lng()),
          };
          self.data.lat = self.coordinates_to_edit.lat;
          self.data.lng = self.coordinates_to_edit.lng;
        });
      });
    },
    // START:: G-MAP GET ADDRESS

    // Main Image
    mainUploded(link) {
      this.data.avatar.title = link;
    },

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    // Categories
    getCategories() {
      this.loadingCategory = true;
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
        })
        .catch((err) => {
          console.log(err);
          this.loadingCategory = false;
          this.items = [
            { id: 1, name: "Item Default 1" },
            { id: 2, name: "Item Default 2" },
          ];
        })
        .finally(() => {
          this.loadingCategory = false;
        });
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `maintenance_technician/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.phone = {
            number: result.phone,
            key: result.phone_code,
          };
          // this.data.email = result.email;
          this.data.full_name = result.full_name;

          this.data.country = result.country;
          this.data.city = result.city;
          this.data.company = result.company;
          this.data.services = result.services;

          this.data.is_admin_active_user = result.is_admin_active_user;

          // if (result.is_ban) {
          //   this.data.is_ban = result.is_ban;
          //   this.data.ban_reason = result.ban_reason;
          // }

          this.data.avatar.preview = result.image;

          // this.data.location = result.address.location_description;
          // this.data.lat = result.address.lat;
          // this.data.lng = result.address.lng;

          // this.coordinates_to_edit = {
          //   lat: result.address.lat,
          //   lng: result.address.lng,
          // };
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
      this.$refs.formmaintenanceTechnician.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("full_name", this.data.full_name);
          data.append("company_id", this.data.company?.id);

          data.append("phone_code", this.data.phone.key);
          data.append("phone", this.data.phone.number);

          if (this.editMode) {
            if (this.data.password) {
              data.append("password", this.data.password);
            }
          } else {
            data.append("password", this.data.password);
          }

          data.append("country_id", this.data.country?.id);
          data.append("city_id", this.data.city?.id);

          if (this.data.services?.length) {
            this.data.services.forEach((ele, index) => {
              data.append(`services[${index}][service_id]`, ele.id);
            });
          }

          // if (this.data.ban_reason) {
          //   data.append("ban_reason", this.data.ban_reason);
          // }
          data.append("is_admin_active_user", +this.data.is_admin_active_user);
          // data.append("is_ban", +this.data.is_ban);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `maintenance_technician/${this.id}`;
          } else {
            url = "maintenance_technician";
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
              this.$router.push("/maintenanceTechnician/show-all");
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
    this.getCategories();
  },
};
</script>

<style lang="scss" scoped></style>
