<template>
  <Loader v-if="loading && editMode"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="permissionForm" @submit.prevent="submit">
        <div class="row">
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
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
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
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.front_name')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.front_name')"
              type="text"
              :placeholder="$t('labels.front_name')"
              v-model="data.front_name"
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

export default {
  name: "Create",
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
          text: this.$t("breadcrumb.permissions.title"),
          disabled: false,
          href: "/permissions/show-all",
        },
        {
          text: this.$t("breadcrumb.permissions.add"),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        ar: {
          title: null,
        },
        en: {
          title: null,
        },
        name: null,
        front_name: null,
      },
      noData: false,
    };
  },

  methods: {
    resetForm() {
      this.data.ar.title = null;
      this.data.en.title = null;
      this.data.name = null;
      this.data.front_name = null;
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `permissions/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;
          this.data.name = result.name;
          this.data.front_name = result.front_name;
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
      this.$refs.permissionForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);
          data.append("name", this.data.name);
          data.append("front_name", this.data.front_name);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `permissions/${this.id}`;
          } else {
            url = "permissions";
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
              if (!this.editMode) {
                this.$refs.permissionForm.reset();
                this.resetForm();
              } else {
                this.$router.push("/permissions/show-all");
              }

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
