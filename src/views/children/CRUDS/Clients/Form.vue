<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="clientsForm" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto mt-5 mb-3"
            style="width: 100%"
            :rules="`${data.avatar.preview ? '' : 'required'}`"
          >
            <v-file-input
              @change="uploadImage($event, 'avatar')"
              v-model="data.avatar.image"
              class="d-none"
              :name="$t('labels.mainImage')"
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
            :name="$t('labels.name')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.name')"
              type="text"
              :placeholder="$t('labels.name')"
              v-model="data.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start Country -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.country')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              v-model="data.country"
              getUrl="countries_without_pagination"
              :placeholder="$t('labels.country')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Country -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.phone')"
            class="col-lg-6"
            :rules="`${
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
            rules="email"
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

          <!-- Start gender -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.gender')"
            class="col-lg-6"
            rules="required"
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
          <!-- End gender -->

          <!-- Start lat -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.lat')"
            class="col-lg-6"
            rules=""
          >
            <base-input
              :name="$t('labels.lat')"
              type="text"
              :placeholder="$t('labels.lat')"
              v-model="data.lat"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End lat -->

          <!-- Start lng -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.lng')"
            class="col-lg-6"
            rules=""
          >
            <base-input
              :name="$t('labels.lng')"
              type="text"
              :placeholder="$t('labels.lng')"
              v-model="data.lng"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End lng -->

          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <div class="col-lg-12">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.status") }}</h4>
              </h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.is_active')"
            class="col-6"
            rules="required"
          >
            <div>
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
          </ValidationProvider>

          <!-- START:: MAP -->
          <div class="col-12 fadeIn mt-7">
            <div class="input_wrapper my-5">
              <v-text-field
                type="text"
                class="form-control"
                aria-describedby="searchMap"
                :label="$t('selectLocation')"
                id="autocomplete_ar"
                @input="getAddress"
              />
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
          </div>
          <!-- END:: MAP -->
        </div>

        <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn type="button" class="back_btn" @click="handleBack">
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
          text: this.$t("breadcrumb.clients.title"),
          disabled: false,
          href: "/clients/show-all",
        },
        {
          text: this.$t(`breadcrumb.clients.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      center: {
        lat: 0,
        lng: 0,
      },
      markers: null,
      coordinates_to_edit: { lat: 0, lng: 0 },

      // Btn Loading
      loading: false,
      loadingCountry: false,
      btnLoading: false,
      loadingCity: false,
      data: {
        avatar: {
          preview: null,
          image: null,
        },
        name: null,
        email: null,
        // phone: null,
        phone: {
          number: null,
          key: null,
          limit: null,
        },

        country: null,

        gender: null,
        location: null,
        lat: null,
        lng: null,

        is_active: false,
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
          // self.markers[0].position.lat = place.geometry.location.lat();
          // self.markers[0].position.lng = place.geometry.location.lat();
        });
      });
    },
    // END:: G-MAP GET ADDRESS

    // ============== Get User Location
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.coordinates_to_edit.lat = position.coords.latitude;
          this.coordinates_to_edit.lng = position.coords.longitude;
        });
      }
    },

    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `client/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.image;

          this.data.name = result.name;
          this.data.email = result.email;
          // this.data.phone = result.phone;

          this.data.phone = {
            number: result.phone,
            key: result.phone_code,
          };

          this.data.country = result.country;

          this.data.lat = result.latitude;
          this.data.lng = result.longitude;

          this.data.is_active = result.is_active;

          this.data.gender = this.genders.find((el) => el.id == result.gender);

          this.coordinates_to_edit = {
            lat: result.latitude,
            lng: result.longitude,
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

    // Submit
    submit() {
      this.$refs.clientsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const formData = new FormData();

          if (this.data.avatar.image) {
            formData.append("image", this.data.avatar.image);
          }

          formData.append("name", this.data.name);
          // formData.append("phone", this.data.phone);
          formData.append("phone_code", this.data.phone.key);
          formData.append("phone", this.data.phone.number);

          formData.append("email", this.data.email);
          formData.append("country_id", this.data.country.id);

          formData.append("gender", this.data.gender.id);

          formData.append("latitude", this.data.lat);
          formData.append("longitude", this.data.lng);

          formData.append("is_active", +this.data.is_active);

          // let url = "";
          // if (this.id) {
          //   url = `update-client/${this.id}`;
          // } else {
          //   url = "create-client";
          // }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: `update-client/${this.id}`,
            data: formData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/clients/show-all");
              this.btnLoading = false;
            })
            .catch((err) => {
              console.log(err, "error");
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

  async mounted() {
    this.canEdit = this.$permission.allowed("update-client");
    this.canDelete = this.$permission.allowed("delete-client");
    this.canAdd = this.$permission.allowed("create-client");
    this.canShow = this.$permission.allowed("show-client");
    this.canShowAll = this.$permission.allowed("index-client");

    if (this.id) {
      if (!this.canEdit) {
        if (!this.canShow) {
          this.getEditData();
        }
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    } else if (this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>

<style lang="scss" scoped></style>
