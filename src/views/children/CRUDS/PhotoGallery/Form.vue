<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form photoGalleryForm custom_card fadeIn" v-else>
      <form @submit.prevent>
        <ValidationObserver ref="photoGalleryForm">
          <div class="row">
            <template v-if="editMode !== true">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('labels.chooseImages')"
                class="d-block my-auto"
                style="width: 100%"
                :rules="`${data.avatar.images.length ? '' : 'required'}`"
              >
                <ImageUpload
                  :label="$t('labels.chooseImages')"
                  :images="data.avatar.images"
                  @inputChanged="sentImage($event)"
                  v-model="data.avatar.mainMedia"
                />
                <!-- <div class="showImages">
                  <transition name="fadeInUp" mode="out-in">
                    <div
                      class="images"
                      v-if="
                        data.avatar.preview && data.avatar.preview.length > 0
                      "
                    >
                      <div
                        class="image"
                        v-for="img in data.avatar.preview"
                        :key="img.id"
                      >
                        <span class="close" @click="deleteImage(img)"
                          ><i class="fas fa-times-circle"></i
                        ></span>
                        <img :src="img.image" alt="product" />
                      </div>
                    </div>
                  </transition>
                </div> -->
                <span v-if="errors[0]" class="error--text d-block">
                  {{ errors[0] }}
                </span>
              </validation-provider>
            </template>
            <template v-else>
              <validation-provider
                v-slot="{ errors }"
                :name="$t('labels.image')"
                class="d-block my-auto mt-5 mb-3"
                style="width: 100%"
                :rules="`${data.avatar.preview ? '' : 'required'}`"
              >
                <v-file-input
                  :disabled="btnLoading"
                  :loading="btnLoading"
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

                  <span class="error--text d-block">
                    {{ errors[0] }}
                  </span>
                </label>
              </validation-provider>
            </template>

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
              :label="$t('labels.is_active')"
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
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ImageUpload from "@/components/Uploads/UplodeMultiple.vue";

export default {
  components: { ImageUpload },
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
          text: this.$t("breadcrumb.photoGallery.title"),
          disabled: false,
          href: "/photo-gallery/show-all",
        },
        {
          text: this.$t(`breadcrumb.photoGallery.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],

      // Btn Loading

      loading: false,
      btnLoading: false,
      loadingCity: false,
      noData: false,

      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          images: [],
          image: null,
        },
        is_active: false,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    sentImage(event) {
      if (event) {
        this.data.avatar.images = event;
      }
    },

    // deleteImage(img) {
    //   const index = this.data.avatar.preview.indexOf(img);
    //   if (index !== -1) {
    //     this.data.avatar.preview.splice(index, 1);
    //   }
    //   this.axios({
    //     method: "DELETE",
    //     url: `product/image/${img.id}/delete`,
    //   })
    //     .then(() => {
    //       this.$iziToast.error({
    //         message: this.$t("deletedSuccessfully"),
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.$iziToast.error({
    //         title: this.$t("validation.error"),
    //         message: err.response.data.message,
    //       });
    //       this.btnLoading = false;
    //     });
    // },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      if (this.editMode) {
        this.axios({
          method: "GET",
          url: `home-banner/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            const result = res.data.data;

            this.data.avatar.preview = result.image;

            this.data.is_active = result.is_active;
          })
          .catch((err) => {
            this.loading = false;
            this.$iziToast.error({
              title: this.$t("error"),
              message:
                err.response?.data.message ?? err.response?.data.messages,
            });
            this.noData = true;
          });
      }
    },

    // Submit
    submit() {
      this.$refs.photoGalleryForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const formData = new FormData();

          if (this.id) {
            if (this.data.avatar.image) {
              formData.append("image", this.data.avatar.image);
            }
          } else {
            this.data.avatar.images &&
              this.data.avatar.images.forEach((el, index) => {
                formData.append(`images[${index}]`, el.img_file);
              });
          }
          // if (this.data.avatar.image) {
          //   this.data.avatar.image.map((el, index) => {
          //     data.append(`images[${index}]`, el.img_file);
          //   });
          // }
          // if (this.id) {
          //   this.data.avatar.preview.map((el) => {
          //     if (el.mainMedia) {
          //       el.mainMedia.map((img, index) => {
          //         data.append(`images[${index}]`, img);
          //       });
          //     }
          //   });
          // }

          formData.append("is_active", +this.data.is_active);

          if (this.id) {
            formData.append("home_banner_id", this.id);
          }

          let url = "";
          if (this.id) {
            url = `update-home-banner`;
          } else {
            url = "create-home-banner";
          }
          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: url,
            data: formData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/photo-gallery/show-all");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
        for (const value of Object.entries(
          this.$refs.photoGalleryForm.errors
        )) {
          if (value[1].length) {
            this.$iziToast.error({
              timeout: 2000,
              message: value[1],
              displayMode: 2,
              position: "bottomRight",
            });
            return;
          }
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
    this.canEdit = this.$permission.allowed("update-banner");
    this.canDelete = this.$permission.allowed("delete-banner");
    this.canAdd = this.$permission.allowed("create-banner");
    this.canShow = this.$permission.allowed("show-banner");
    this.canShowAll = this.$permission.allowed("index-banner");

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
