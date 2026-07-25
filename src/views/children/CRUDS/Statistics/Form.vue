<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form statisticsForm custom_card fadeIn" v-else>
      <ValidationObserver ref="statisticsForm" @submit.prevent="submit">
        <div class="row">
          <!-- Start experience_years-->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.experience_years')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.experience_years')"
              type="number"
              :placeholder="$t('labels.experience_years')"
              v-model="data.experience_years"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End experience_years-->

          <!-- Start prizes-->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.prizes')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.prizes')"
              type="number"
              :placeholder="$t('labels.prizes')"
              v-model="data.prizes"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End prizes-->
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
          text: this.$t("breadcrumb.statistics.title"),
          disabled: false,
          href: "",
        },
      ],

      markers: null,

      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        experience_years: null,
        prizes: null,
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
        url: `statistics`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.experience_years = result.experience_years;
          this.data.prizes = result.prizes;
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
      this.$refs.statisticsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const formData = new FormData();

          formData.append("experience_years", this.data.experience_years);
          formData.append("prizes", this.data.prizes);

          let message = this.$t("editSuccess");

          this.axios({
            method: "POST",
            url: `statistics`,
            data: formData,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.btnLoading = false;
            })
            .catch((err) => {
              console.log(err, "error");
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
  },

  async mounted() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getEditData();
  },
};
</script>
