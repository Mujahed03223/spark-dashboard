<template>
  <div>
    <Breadcrumb :items="items" />
    <Loader v-if="loading && editMode"></Loader>
    <div v-else>
      <noData v-if="noData" />
      <div class="form countryForm custom_card" v-else>
        <ValidationObserver ref="formFaq" @submit.prevent="submit">
          <div class="row">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.question') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isArabic"
                :name="$t('labels.question') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.question') + $t('inArabic')"
                v-model="data.ar.question"
              />
              <span class="error--text d-inline-block">
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
                @keypress="isEnglish"
                :name="$t('labels.question') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.question') + $t('inEnglish')"
                v-model="data.en.question"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
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
              @keypress="isEnglish"
              v-slot="{ errors }"
              :name="$t('labels.answer') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2"
            >
              <base-input
                type="textarea"
                :name="$t('labels.answer') + $t('inEnglish')"
                :placeholder="$t('labels.answer') + $t('inEnglish')"
                v-model="data.en.answer"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <!-- Start:: user_type -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.user_type')"
              class="col-lg-6"
              rules="required"
            >
              <base-select-input
                v-model="data.user_type"
                getUrl="continents"
                :static="true"
                :name="$t('labels.user_type')"
                :staticItems="userTypes"
                :placeholder="$t('labels.user_type')"
              ></base-select-input>

              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <!-- End:: user_type -->

            <!-- Start:: Ordering -->

            <!-- <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.ordering')"
              class="col-lg-6"
              rules="required|min_value:0"
            >
              <base-input
                :name="$t('labels.ordering')"
                type="number"
                @keypress="preventMinus"
                :placeholder="$t('labels.ordering')"
                v-model="data.ordering"
              />

              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider> -->

            <!-- End:: Ordering -->
          </div>
          <div class="button_wrapper center">
            <v-btn
              type="submit"
              @click="submit"
              :disabled="loading"
              :loading="loading"
            >
              {{ $t("submit") }}
            </v-btn>
          </div>
          <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import MapWrite from "../../../../components/Maps/MapWrite.vue";

export default {
  // components: { MapWrite },
  props: ["id"],

  data() {
    return {
      noData: false,
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.faqs.title"),
          disabled: false,
          href: "/faqs/show-all",
        },
        {
          text: this.$t(`breadcrumb.faqs.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Loading

      loading: false,

      showArea: false,

      data: {
        ar: {
          question: null,
          answer: null,
        },
        en: {
          question: null,
          answer: null,
        },
        ordering: null,
        user_type: null,
      },
      userTypes: [
        {
          id: "rider",
          name: this.$t("rider"),
        },
        {
          id: "partner",
          name: this.$t("partner"),
        },
      ],
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    // === Images
    imageArUploded(link) {
      this.data.image_ar.title = link;
    },
    imageEnUploded(link) {
      this.data.image_en.title = link;
    },

    getEditData() {
      if (this.editMode) {
        this.noData = false;
        this.loading = true;
        this.axios({
          method: "GET",
          url: `faq/${this.id}`,
        })
          .then((res) => {
            this.loading = false;

            this.data = {
              ar: {
                question: res.data.data.ar.question,
                answer: res.data.data.ar.answer,
              },
              en: {
                question: res.data.data.en.question,
                answer: res.data.data.en.answer,
              },
              ordering: res.data.data.ordering,
              user_type: this.userTypes.find(
                (type) => type.id == res.data.data.user_type
              ),
            };
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("error"),
              message:
                err.response?.data.message ?? err.response?.data.messages,
            });
            this.noData = true;
            this.loading = false;
          });
      } else {
        this.showArea = true;
      }
    },

    submit() {
      this.$refs.formFaq.validate().then((d) => {
        if (d) {
          this.loading = true;
          const data = new FormData();

          data.append("ar[question]", this.data.ar.question);
          data.append("ar[answer]", this.data.ar.answer);
          data.append("en[question]", this.data.en.question);
          data.append("en[answer]", this.data.en.answer);
          data.append("ordering", this.data.ordering);
          data.append("user_type", this.data.user_type?.id);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `faq/${this.id}`;
          } else {
            url = "faq";
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
              this.loading = false;
              this.$router.push("/faqs/show-all");
            })
            .catch((err) => {
              this.loading = false;
              this.$iziToast.error({
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
    sentArImage(event) {
      if (event) {
        this.loading = true;

        this.data.image_ar.preview = URL.createObjectURL(event);

        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", "abouts");

        this.axios({
          method: "POST",
          url: "attachments",
          data: data,
        })
          .then((res) => {
            this.data.image_ar.image = res.data.data;
            // this.$emit('inputChanged', res.data.data)
            this.loading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });
            // this.$emit('inputChanged', 'LinkTEST')
            this.loading = false;
          });
      }
    },
    sentEnImage(event) {
      if (event) {
        this.loading = true;

        this.data.image_en.preview = URL.createObjectURL(event);

        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", "abouts");

        this.axios({
          method: "POST",
          url: "attachments",
          data: data,
        })
          .then((res) => {
            this.data.image_en.image = res.data.data;
            // this.$emit('inputChanged', res.data.data)
            this.loading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });
            // this.$emit('inputChanged', 'LinkTEST')
            this.loading = false;
          });
      }
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>
