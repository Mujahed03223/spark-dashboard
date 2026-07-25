<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formSteps" @submit.prevent="submit">
        <div class="row">
          <validation-provider v-slot="{ errors }" :name="$t('labels.profileImage')" class="d-block my-auto"
            style="width: 100%" :rules="editMode ? '' : 'required'">
            <!-- @change="sentImage($event)" -->
            <v-file-input :disabled="btnLoading" :loading="btnLoading" @change="uploadImage($event, 'steps', 'avatar')"
              v-model="data.avatar.mainMedia" class="d-none" :name="$t('labels.profileImage')" accept="image/*,|size:2048"
              label="" id="banner-create-image-main"></v-file-input>
            <label for="banner-create-image-main"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden">
              <v-img v-if="data.avatar.preview" class="d-flex" cover :src="data.avatar.preview" :aspect-ratio="3.4" />
              <img v-else class="d-flex img-fluid mx-auto" src="@/assets/media/images/placeholder.png" />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.title') + $t('inArabic')" class="col-md-6"
            rules="required|min:2">
            <base-input @keypress="isArabic" :name="$t('labels.title') + $t('inArabic')" type="text"
              :placeholder="$t('labels.title') + $t('inArabic')" v-model="data.ar.title" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.title') + $t('inEnglish')" class="col-md-6"
            rules="required|min:2">
            <base-input @keypress="isEnglish" :name="$t('labels.title') + $t('inEnglish')" type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')" v-model="data.en.title" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start :: Checks -->
          <div class="col-lg-12">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.status") }}</h4>
              </h4>
              <hr role="separator" aria-orientation="horizontal" class="v-divider theme--dark" />
            </div>
          </div>

          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.is_active')"
            class="col-4"
            rules="required"
          >
            <div>
              <div class="input-title">
                <h4>
                  {{ $t("labels.active", { name: $t("") }) }}
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
        </div>
        <div class="button_wrapper center">
          <v-btn type="submit" @click="submit" :disabled="btnLoading" :loading="btnLoading">
            {{ $t("submit") }}
          </v-btn>
        </div>
        <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
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
          text: this.$t("breadcrumb.steps.title"),
          disabled: false,
          href: "/steps/show-all",
        },
        {
          text: this.$t(
            `breadcrumb.steps.${this.id ? "edit" : "add"}`
          ),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCountries: false,

      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        ar: {
          title: null,
        },
        en: {
          title: null,
        },

        // is_active: false,
      },
      types: [
        {
          id: "popular",
          name: this.$t("labels.popular"),
        },
        {
          id: "cashback",
          name: this.$t("labels.cashback"),
        },
        {
          id: "seasonal",
          name: this.$t("labels.seasonal"),
        },
      ],
      save_types: [
        {
          id: "value",
          name: this.$t("labels.amount"),
        },
        {
          id: "percentage",
          name: this.$t("labels.percentage"),
        },
      ],
      noData: false,
      center: null,
    };
  },

  methods: {
    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `steps/${this.id}`,
      })
        .then((res) => {
          const result = res.data.data;
          this.data.avatar.preview = res.data.data.image;
          this.data.ar = {
            title: result.ar.title,
          };
          this.data.en = {
            title: result.en.title,
          };

          // this.data.is_active = result.is_active;

          this.loading = false;
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
      this.$refs.formSteps.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);

          // data.append("is_active", +this.data.is_active);
          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `steps/${this.id}`;
          } else {
            url = "steps";
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
              this.$router.push("/steps/show-all");
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
          // for (const value of Object.entries(this.$refs.formSteps.errors)) {
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

    makerChanged(e) {
      this.data.lat = e.lat;
      this.data.lng = e.lng;
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },
  // async mounted() {
  //   this.getPartners();
  //   this.getPackages();
  //   this.getModels();
  //   this.manufactruingYears();
  //   await this.getVehicleRequirements();
  //   if (this.editMode) {
  //     this.getEditData();
  //   }
  // },
  async created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.editMode) {
      this.getEditData();
    }
  },
};
</script>

<style lang="scss">
.v-input--radio-group--column {
  .v-input--radio-group__input {
    flex-direction: row !important;
  }
}

.v-input--selection-controls.v-input {
  margin-bottom: 0 !important;

  .v-messages {
    display: none !important;
  }
}

// .v-input--radio-group.v-input .v-input__control .v-input__slot {
//   padding-top: 0 !important;
// }
.v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
  margin-bottom: 0;
}

.vehicle_requirement {
  margin-top: 10px;

  padding: 6px;

  .input-title {
    min-width: 200px;
    padding-top: 15px !important;

    h4 {
      margin: 0 !important;
    }
  }
}
</style>
