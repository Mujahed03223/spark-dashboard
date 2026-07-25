<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="termsForm" @submit.prevent="submit">
        <div class="row">
          <!-- <UploadFiles
            @change="updateFiles"
            :editedFiles="editedFiles"
            @deleteFile="deleteFile"
          /> -->

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
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.content') + $t('inArabic')"
              type="ckeditor"
              :placeholder="$t('labels.content') + $t('inArabic')"
              v-model="data.ar.content"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="ckeditor"
              :name="$t('labels.content') + $t('inEnglish')"
              :placeholder="$t('labels.content') + $t('inEnglish')"
              v-model="data.en.content"
            />
            <span class="error--text d-inline-block">
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
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UploadFiles from "@/components/Uploads/UploadFiles.vue";

export default {
  components: { UploadFiles },
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
          text: this.$t("breadcrumb.terms.title"),
          disabled: false,
          href: "/terms/show-all",
        },
        {
          text: this.$t(`breadcrumb.terms.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      uploadedFiles: [],
      editedFiles: [],

      data: {
        avatar: {
          mainMedia: null,
          preview: null,
          image: null,
          mainPreviewUrl: null,
        },

        ordering: null,
        uploadedFiles: [],
        ar: {
          title: null,
          content: null,
        },
        en: {
          title: null,
          content: null,
        },
      },
      noData: false,
    };
  },

  methods: {
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
        data.append("model", "terms");

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
        url: `terms/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.editedFiles = res.data.data.images;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;

          this.data.ar.content = result.ar.content;
          this.data.en.content = result.en.content;
          this.data.ordering = result.ordering;
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
      this.$refs.termsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.uploadedFiles.length) {
            this.data.uploadedFiles.forEach((e, i) => {
              data.append(`images[${i}][media]`, e);
            });
          }

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);

          data.append("ar[content]", this.data.ar.content);
          data.append("en[content]", this.data.en.content);
          data.append("ordering", this.data.ordering);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `terms/${this.id}`;
          } else {
            url = "terms";
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
              this.$router.push("/terms/show-all");
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
  mounted() {
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>

<style lang="scss" scoped></style>
