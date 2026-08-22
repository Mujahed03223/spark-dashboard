<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="categoriesForm" @submit.prevent="submit">
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
              @keypress="isEnglish"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start desc -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.desc') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              @keypress="isArabic"
              :name="$t('labels.desc') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.desc') + $t('inArabic')"
              v-model="data.ar.desc"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.desc') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              @keypress="isEnglish"
              type="textarea"
              :name="$t('labels.desc') + $t('inEnglish')"
              :placeholder="$t('labels.desc') + $t('inEnglish')"
              v-model="data.en.desc"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End desc -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.ordering')"
            class="col-lg-6"
            rules="required|min_value:1"
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

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.decimal_code')"
            class="col-lg-6"
            rules="required|length:2"
          >
            <base-input
              :name="$t('labels.decimal_code')"
              type="text"
              maxlength="2"
              :placeholder="$t('labels.decimal_code')"
              v-model="data.decimal_code"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.category_code')"
            class="col-lg-6"
            rules="required|length:3"
          >
            <base-input
              :name="$t('labels.category_code')"
              type="text"
              maxlength="3"
              :placeholder="$t('labels.category_code')"
              v-model="data.category_code"
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
            @click="handleBack('/main-categories/show-all')"
          >
            {{ $t("back") }}
            <span
              :class="$i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'"
            ></span>
          </v-btn>
        </div>

        <!-- <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
          >
            {{ $t("submit") }}
          </v-btn>
        </div> -->
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
          href: "/",
        },
        {
          text: this.$t("breadcrumb.mainCategories.title"),
          disabled: false,
          href: "/main-categories/show-all",
        },
        {
          text: this.$t(`breadcrumb.mainCategories.${this.id ? "edit" : "add"}`),
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
          desc: null,
        },
        en: {
          title: null,
          desc: null,
        },
        ordering: null,
        decimal_code: null,
        category_code: null,
      },
      noData: false,
    };
  },

  methods: {
    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `main-categories/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;

          this.data.ar.desc = result.ar.desc;
          this.data.en.desc = result.en.desc;

          this.data.ordering = result.ordering;
          this.data.decimal_code = result.decimal_code;
          this.data.category_code = result.category_code;
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
      this.$refs.categoriesForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);

          data.append("ar[desc]", this.data.ar.desc);
          data.append("en[desc]", this.data.en.desc);

          data.append("ordering", this.data.ordering);

          if (this.data.decimal_code) {
            data.append("decimal_code", this.data.decimal_code);
          }
          if (this.data.category_code) {
            data.append("category_code", this.data.category_code);
          }

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `main-categories/${this.id}`;
          } else {
            url = "main-categories";
          }

          let message = this.id ? this.$t("editSuccess") : this.$t("addSuccess");
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
              this.$router.push("/main-categories/show-all");
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
