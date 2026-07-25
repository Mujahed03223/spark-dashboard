<template>
  <div class="form custom_card">
    <form ref="formCountries" @submit.prevent="submit">
      <div class="row">
        <!-- Start :: image -->
        <div class="col-lg-12">
          <v-file-input
            :required="data.avatar.preview ? false : true"
            @change="uploadImage($event, 'avatar')"
            v-model="data.avatar.image"
            class="d-none"
            :name="$t('labels.image')"
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
          </label>
        </div>
        <!-- End :: image -->

        <!-- Start:: Name -->
        <base-input
          col="6"
          type="text"
          :placeholder="$t('labels.name') + $t('inArabic')"
          :required="true"
          v-model="data.ar.name"
        />
        <base-input
          col="6"
          type="text"
          :placeholder="$t('labels.name') + $t('inEnglish')"
          :required="true"
          v-model="data.en.name"
        />
        <!-- End:: Name -->

        <!-- Start:: Slug -->
        <!-- <base-input
          col="6"
          type="text"
          :placeholder="$t('labels.slug') + $t('inArabic')"
          :required="true"
          v-model="data.ar.slug"
        />
        <base-input
          col="6"
          type="text"
          :placeholder="$t('labels.slug') + $t('inEnglish')"
          :required="true"
          v-model="data.en.slug"
        /> -->
        <!-- End:: Slug -->

        <!-- Start:: PostalCode -->
        <base-input
          col="4"
          type="number"
          @keypress="preventMinus"
          :placeholder="$t('labels.postalcode')"
          :required="true"
          v-model.number="data.postal_code"
        />
        <!-- End:: PostalCode -->

        <!-- Start:: ShortCut -->
        <base-input
          col="4"
          type="text"
          :placeholder="$t('labels.shortcut')"
          :required="true"
          v-model="data.short_cut"
        />
        <!-- End:: ShortCut -->

        <!-- start:: Country -->
        <base-select-input
          col="4"
          v-model="data.country"
          getUrl="countries/select"
          :placeholder="$t('labels.country')"
        ></base-select-input>
        <!-- End:: Country -->

        <!-- End:: Map -->
        <select-map
          :biggingMarkers="data.center"
          @makerChanged="makerChanged"
        />
        <!-- End:: Map -->

        <!-- Start :: is_available_for_orders -->
        <!-- <div class="col-lg-12 py-0">
          <div class="divider">
            <h4>الحالة</h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <v-checkbox
          v-model="data.is_available_for_orders"
          :label="$t('labels.is_available_for_orders')"
        ></v-checkbox> -->
        <!-- End :: is_available_for_orders -->
      </div>

      <base-button :loading="loading" class="center">{{
        $t("submit")
      }}</base-button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import MapWrite from "../../../../components/Maps/MapWrite.vue";

export default {
  components: { MapWrite },
  props: ["id"],

  data() {
    return {
      // Loading
      loading: false,

      showArea: false,

      data: {
        avatar: {
          preview: null,
          image: null,
        },
        ar: {
          name: localStorage.getItem("city_name_ar")
            ? localStorage.getItem("city_name_ar")
            : null,
          slug: localStorage.getItem("city_slug_ar")
            ? localStorage.getItem("city_slug_ar")
            : null,
        },
        en: {
          name: localStorage.getItem("city_name_en")
            ? localStorage.getItem("city_name_en")
            : null,
          slug: localStorage.getItem("city_slug_en")
            ? localStorage.getItem("city_slug_en")
            : null,
        },
        country: JSON.parse(localStorage.getItem("city_country"))
          ? JSON.parse(localStorage.getItem("city_country"))
          : null,
        postal_code: localStorage.getItem("city_postal_code")
          ? localStorage.getItem("city_postal_code")
          : null,
        short_cut: localStorage.getItem("city_short_cut")
          ? localStorage.getItem("city_short_cut")
          : null,
        center: null,
        location: null,
        lat: null,
        lng: null,
        // area: JSON.parse(localStorage.getItem("city_map_area"))
        //   ? JSON.parse(localStorage.getItem("city_map_area"))
        //   : [],
        // is_available_for_orders:
        //   localStorage.getItem("city_is_available_for_orders") &&
        //   localStorage.getItem("city_is_available_for_orders") === "true"
        //     ? true
        //     : false,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),
    makerChanged(e) {
      this.data.lat = e.lat;
      this.data.lng = e.lng;
      this.data.location = e.location;
    },

    getEditData() {
      if (this.editMode) {
        this.axios({
          method: "GET",
          url: `cities/${this.id}`,
        })
          .then((res) => {
            this.data = {
              avatar: {
                image: null,
                preview: res.data.data.image,
              },
              ar: res.data.data.ar,
              en: res.data.data.en,
              country: res.data.data.country,
              postal_code: res.data.data.postal_code,
              short_cut: res.data.data.short_name,
              location: res.data.data.location,
              lat: res.data.data.lat,
              lng: res.data.data.lng,
              // is_available_for_orders: res.data.data.is_available_for_orders,
            };
            this.showArea = true;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.showArea = true;
      }
    },

    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    submit() {
      this.loading = true;

      // =============== Start:: Cache Form Data At LocalStorage =============== //
      localStorage.setItem("city_name_ar", this.data.ar.name);
      // localStorage.setItem("city_slug_ar", this.data.ar.slug);
      localStorage.setItem("city_name_en", this.data.en.name);
      // localStorage.setItem("city_slug_en", this.data.en.slug);
      localStorage.setItem("city_country", JSON.stringify(this.data.country));
      localStorage.setItem("city_postal_code", this.data.postal_code);
      localStorage.setItem("short_name", this.data.short_cut);
      // localStorage.setItem(
      //   "city_is_available_for_orders",
      //   this.data.is_available_for_orders
      // );
      // localStorage.setItem("city_map_area", JSON.stringify(this.data.area));
      // =============== End:: Cache Form Data At LocalStorage =============== //

      // Create FormData
      const data = new FormData();

      if (this.data.avatar.image) {
        data.append("image", this.data.avatar.image);
      }

      data.append("ar[name]", this.data.ar.name);
      // data.append("ar[slug]", this.data.ar.slug);

      data.append("en[name]", this.data.en.name);
      // data.append("en[slug]", this.data.en.slug);

      data.append("country_id", this.data.country.id);
      if (this.data.postal_code.toString().length < 5) {
        this.loading = false;
        this.$iziToast.error({
          displayMode: 2,
          title: this.$t("validation.error"),
          message: "الرقم البريدي لايمكن ان يكون اقل من 5 خانات",
        });
        return;
      } else {
        data.append("postal_code", this.data.postal_code);
      }
      data.append("short_name", this.data.short_cut);
      data.append("location", this.data.location);
      data.append("lat", this.data.lat);
      data.append("lng", this.data.lng);
      // data.append(
      //   "is_available_for_orders",
      //   +this.data.is_available_for_orders
      // );
      if (this.editMode) {
        data.append("_method", "PUT");
      }

      // =============== Start:: Edit ===============
      if (this.editMode) {
        this.axios({
          method: "POST",
          url: `cities/${this.id}`,
          data: data,
        })
          .then(() => {
            this.$iziToast.success({
              displayMode: 2,
              title: this.$t("success"),
              message: this.$t("editSuccess"),
            });
            this.loading = false;
            this.$router.push("/cities/show-all");
          })
          .catch((err) => {
            this.$iziToast.error({
              displayMode: 2,
              title: this.$t("error"),
              message: err.response.data.message,
            });
            this.loading = false;
          });

        return;
      }
      // =============== End:: Edit ===============

      // =============== Start:: Add ===============
      this.axios({
        method: "POST",
        url: "/cities",
        data: data,
      })
        .then(() => {
          // =============== Start:: Remove Form Data From LocalStorage =============== //
          localStorage.removeItem("city_name_ar");
          localStorage.removeItem("city_slug_ar");
          localStorage.removeItem("city_name_en");
          localStorage.removeItem("city_slug_en");
          localStorage.removeItem("city_country");
          localStorage.removeItem("city_postal_code");
          localStorage.removeItem("city_short_cut");
          localStorage.removeItem("city_is_available_for_orders");
          localStorage.removeItem("city_map_area");
          // =============== End:: Remove Form Data From LocalStorage =============== //
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("addSuccess"),
          });
          this.$router.push("/cities/show-all");
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });

      // =============== End:: Add ===============
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.set_breadcrumb({
      title: this.$t("breadcrumb.cities.title"),
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.cities.title"),
          disabled: false,
          href: "/cities/show-all",
        },
        {
          text: this.$t("breadcrumb.cities.add"),
          disabled: true,
          href: "",
        },
      ],
    });

    if (this.id) {
      this.getEditData();
    }
  },
};
</script>
