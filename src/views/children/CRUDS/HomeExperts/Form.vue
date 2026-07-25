<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formhome_experts" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto"
            style="width: 100%;"
            :rules="!editMode ? 'required' : ''"
          >
            <v-file-input
              @change="sentImage($event)"
              v-model="data.mainMedia"
              class="d-none"
              :name="$t('labels.country_flag')"
              accept="image/*,|size:2048"
              label=""
              id="banner-create-image-main"
            ></v-file-input>

            <label
              for="banner-create-image-main"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.preview"
                class="d-flex"
                cover
                :src="data.preview"
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
            :name="$t('labels.name') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.name') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.name') + $t('inArabic')"
              v-model="data.ar.title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.name') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.name') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.name') + $t('inEnglish')"
              v-model="data.en.title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.job') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.job') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.job') + $t('inArabic')"
              v-model="data.ar.job"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.job') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.job') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.job') + $t('inEnglish')"
              v-model="data.en.job"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.ordering')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.ordering')"
              type="number"
              @keypress="preventMinus"
              :placeholder="$t('labels.ordering')"
              v-model="data.ordering"
            />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <!-- <div class="col-lg-12">
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
import UploadFiles from "@/components/Uploads/UploadFiles.vue";

export default {
  components: { BaseCountryFlagPhoneInput, UploadFiles },
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
          text: this.$t("breadcrumb.home_experts.title"),
          disabled: false,
          href: "/home_experts/show-all",
        },
        {
          text: this.$t(`breadcrumb.home_experts.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingProviders: false,
      uploadedFiles: [],
      editedFiles: [],
      data: {
        // avatar: {
        //   mainMedia: null,
        //   preview: null,
        //   image: null,
        //   mainPreviewUrl: null,
        // },
        mainMedia: null,
        preview: null,

        avatar: null,
        mainPreviewUrl: null,
        ordering: null,
        uploadedFiles: [],
        ar: {
          title: null,
          job: null,
          desc: null,
        },
        en: {
          title: null,
          job: null,
          desc: null,
        },
        is_active: false,
      },
      noData: false,
      // Fixed Data
      cityItems: [],
      providers: [],
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

    updateFiles(files) {
      this.uploadedFiles = files;
      this.UploadFiles();
    },

    UploadFiles() {
      this.uploadedFiles.forEach((file) => {
        this.btnLoading = true;

        const data = new FormData();
        data.append("file", file.file_data);
        data.append("attachment_type", "image");
        data.append("model", "home_experts");

        this.axios({
          method: "POST",
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}attachments`,
          data: data,
        })
          .then((res) => {
            this.data.uploadedFiles.push(res.data.data);
            this.btnLoading = false;
          })
          .catch((err) => {
            this.btnLoading = false;
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });
          });
      });
    },

    sentImage(event) {
      if (event) {
        this.data.preview = URL.createObjectURL(event);
        this.data.avatar = event;
      }
    },

    deleteFile(id) {
      this.axios({
        method: "delete",
        url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}attachments/${id}`,
      })
        .then(() => {
          this.editedFiles = this.editedFiles.filter((file) => file.id !== id);
          this.btnLoading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: err.response.data.message,
          });

          this.btnLoading = false;
        });
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `home_experts/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.preview = result.image;

          this.data.ar.title = result.ar.name;
          this.data.en.title = result.en.name;
          this.data.ar.job = result.ar.job;
          this.data.en.job = result.en.job;
          this.data.ordering = result.ordering;
          // this.data.is_active = result.is_active;
          // this.data.is_active = result.is_active;
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
      this.$refs.formhome_experts.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar) {
            data.append("image", this.data.avatar);
          }

          data.append("ar[name]", this.data.ar.title);
          data.append("en[name]", this.data.en.title);
          data.append("ar[job]", this.data.ar.job);
          data.append("en[job]", this.data.en.job);
          data.append("ordering", this.data.ordering);
          // data.append("is_active", +this.data.is_active);

          // if (this.editMode) {
          //   if (this.data.password) {
          //     data.append("password", this.data.password);
          //   }
          // } else {
          //   data.append("password", this.data.password);
          // }

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `home_experts/${this.id}`;
          } else {
            url = "home_experts";
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
              this.$router.push("/home_experts/show-all");
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
