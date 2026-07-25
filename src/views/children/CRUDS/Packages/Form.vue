<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="packageForm" @submit.prevent="submit">
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
              @change="uploadImage($event, 'packages', 'avatar')"
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

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.ar.title"
              @keypress="isArabic"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.en.title"
              @keypress="isEnglish"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.auction_no')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.auction_no')"
              type="number"
              @keypress="preventMinus"
              :placeholder="$t('labels.auction_no')"
              v-model="data.auction_no"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.price')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.price')"
              type="number"
              @keypress="preventMinus"
              :placeholder="$t('labels.price')"
              v-model="data.price"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.ordering')"
            class="col-lg-6"
            rules="min_value:1"
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
            @click="handleBack('/package/show-all')"
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

export default {
  props: ["id"],

  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/"
        },
        {
          text: this.$t("breadcrumb.package.title"),
          disabled: false,
          href: "/package/show-all"
        },
        {
          text: this.$t(`breadcrumb.package.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: ""
        }
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        avatar: {
          preview: null,
          image: null
        },

        ar: {
          title: null
        },
        en: {
          title: null
        },
        auction_no: null,
        price: null,
        ordering: null
      },
      noData: false
    };
  },

  methods: {
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
          data: data
        })
          .then((res) => {
            this.data[varName].image = res.data.data;
            this.data[varName].preview = URL.createObjectURL(event);
            this.btnLoading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message
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
        url: `package/${this.id}`
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.image;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;

          this.data.auction_no = result.auction_no;
          this.data.price = result.price;
          this.data.ordering = result.ordering;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
          this.noData = true;
          this.loading = false;
        });
    },

    // Submit
    submit() {
      this.$refs.packageForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);

          data.append("auction_no", this.data.auction_no);
          data.append("price", this.data.price);
          data.append("ordering", this.data.ordering);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `package/${this.id}`;
          } else {
            url = "package";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: url,
            data: data
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message
              });
              this.$router.push("/package/show-all");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }
  },

  computed: {
    ...mapGetters({
      lang: "lang_module/lang"
    }),

    editMode() {
      return !!this.id;
    }
  },
  mounted() {
    if (this.id) {
      this.getEditData();
    }
  }
};
</script>

<style lang="scss" scoped></style>
