<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="most_questionsForm" @submit.prevent="submit">
        <div class="row">
          <!-- Start question -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.question') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.question') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.name') + $t('inArabic')"
              v-model="data.ar.question"
              @keypress="isArabic"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.question') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.question') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.question') + $t('inEnglish')"
              v-model="data.en.question"
              @keypress="isEnglish"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Name -->

          <!-- Start answer -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.answer') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              @keypress="isArabic"
              :name="$t('labels.answer') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.answer') + $t('inArabic')"
              v-model="data.ar.answer"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.answer') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              @keypress="isEnglish"
              type="textarea"
              :name="$t('labels.answer') + $t('inEnglish')"
              :placeholder="$t('labels.answer') + $t('inEnglish')"
              v-model="data.en.answer"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End answer -->
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
            @click="handleBack('/most_questions/show-all')"
          >
            {{ $t("back") }}
            <span
              :class="$i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'"
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
          href: "/",
        },
        {
          text: this.$t("breadcrumb.most_questions.title"),
          disabled: false,
          href: "/most_questions/show-all",
        },
        {
          text: this.$t(`breadcrumb.most_questions.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        ar: {
          question: null,
          answer: null,
        },
        en: {
          question: null,
          answer: null,
        },
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
        url: `most_questions/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.ar.question = result.ar.question;
          this.data.en.question = result.en.question;

          this.data.ar.answer = result.ar.answer;
          this.data.en.answer = result.en.answer;
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
      this.$refs.most_questionsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("ar[question]", this.data.ar.question);
          data.append("en[question]", this.data.en.question);

          data.append("ar[answer]", this.data.ar.answer);
          data.append("en[answer]", this.data.en.answer);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `most_questions/${this.id}`;
          } else {
            url = "most_questions";
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
              this.$router.push("/most_questions/show-all");
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
