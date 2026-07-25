<template>
  <div class="form languageForm custom_card">
    <Breadcrumb :items="items" />
    <ValidationObserver ref="formLanguages" @submit.prevent="submit">
      <div class="row">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('labels.flag')"
          class="d-block my-auto mt-5 mb-3"
          style="width: 100%"
          :rules="`${data.avatar.preview ? '' : 'required'}`"
        >
          <v-file-input
            @change="uploadImage($event, 'avatar')"
            v-model="data.avatar.image"
            class="d-none"
            :name="$t('labels.flag')"
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
          :name="$t('labels.name') + $t('inArabic')"
          class="col-lg-6"
          rules="required|min:2|max:250"
        >
          <base-input
            @keypress="isArabic"
            :name="$t('labels.name') + $t('inArabic')"
            type="text"
            :placeholder="$t('labels.name') + $t('inArabic')"
            v-model="data.ar.name"
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
            @keypress="isEnglish"
            :name="$t('labels.name') + $t('inEnglish')"
            type="text"
            :placeholder="$t('labels.name') + $t('inEnglish')"
            v-model="data.en.name"
          />
          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.shortname')"
          class="col-lg-6"
          rules="required|min:2|max:5"
        >
          <base-input
            :name="$t('labels.shortname')"
            type="text"
            :placeholder="$t('labels.shortname')"
            v-model="data.short_name"
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
        <v-btn type="button" class="back_btn" @click="handleBack">
          {{ $t("back") }}
          <span
            :class="
              $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
            "
          ></span>
        </v-btn>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
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
          text: this.$t("breadcrumb.languages.title"),
          disabled: false,
          href: "/languages/show-all",
        },
        {
          text: this.$t(`breadcrumb.languages.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Loading
      loading: false,

      data: {
        avatar: {
          preview: null,
          image: null,
        },

        ar: {
          name: null,
        },
        en: {
          name: null,
        },
        short_name: null,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    getEditData() {
      if (this.editMode) {
        this.axios({
          method: "GET",
          url: `language/${this.id}`,
        })
          .then((res) => {
            this.data = {
              avatar: {
                image: null,
                preview: res.data.data.flag,
              },

              ar: res.data.data.ar,
              en: res.data.data.en,
              short_name: res.data.data.short_name,
            };
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    submit() {
      this.$refs.formLanguages.validate().then((d) => {
        if (d) {
          this.loading = true;
          // Create FormData
          const data = new FormData();
          if (this.data.avatar.image) {
            data.append("flag", this.data.avatar.image);
          }

          data.append("ar[name]", this.data.ar.name);
          data.append("en[name]", this.data.en.name);
          data.append("short_name", this.data.short_name);

          // if (this.id) {
          //   data.append("_method", "PUT");
          // }
          let url = "";
          if (this.id) {
            url = `language/${this.id}`;
          } else {
            url = "language";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");

          // =============== Start:: Add / Edit ===============

          this.axios({
            method: "POST",
            url: url,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                displayMode: 2,
                title: this.$t("success"),
                message: message,
              });
              this.loading = false;
              this.$router.push("/languages/show-all");
            })
            .catch((err) => {
              this.loading = false;
              this.$iziToast.error({
                displayMode: 2,
                title: this.$t("error"),
                message: err.response.data.message,
              });
            });
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },

    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  async mounted() {
    this.canEdit = this.$permission.allowed("update-language");
    this.canDelete = this.$permission.allowed("delete-language");
    this.canAdd = this.$permission.allowed("create-language");
    this.canShow = this.$permission.allowed("show-language");
    this.canShowAll = this.$permission.allowed("index-language");

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
