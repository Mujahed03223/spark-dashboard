<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formdelayReasons" @submit.prevent="submit">
        <div class="row">
          <ValidationProvider v-slot="{ errors }" :name="$t('labels.title') + $t('inArabic')" class="col-md-6"
            rules="required|min:2">
            <base-input @keypress="isArabic" :name="$t('labels.title') + $t('inArabic')" type="text"
              :placeholder="$t('labels.title') + $t('inArabic')" v-model="data.ar.title" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.title') + $t('inEnglish')" class="col-md-6"
            rules="required|min:2">
            <base-input @keypress="isEnglish" :name="$t('labels.title') + $t('inEnglish')" type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')" v-model="data.en.title" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.ordering')" class="col-lg-6" rules="required">
            <base-input :name="$t('labels.ordering')" type="number" @keypress="preventMinus"
              :placeholder="$t('labels.ordering')" v-model="data.ordering" />

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- <ValidationProvider v-slot="{ errors }" :name="$t('labels.type')" class="col-lg-6"
            rules="required|min:2|max:250">
            <base-select-input v-model="data.type" :static="true" :name="$t('labels.type')" :staticItems="types"
              :placeholder="$t('labels.type')"></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->

          <ValidationProvider v-slot="{ errors }" :name="$t('labels.is_active')" class="col-4" rules="required">
            <div>
              <div class="input-title">
                <h4>
                  {{ $t("labels.active", { name: $t("") }) }}
                </h4>
              </div>
              <v-checkbox :name="$t('labels.is_active')" class="py-0 px-0" v-model="data.is_active"
                :label="$t('labels.is_active')"></v-checkbox>
            </div>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>

        <div class="button_wrapper center">
          <v-btn type="submit" @click="submit" :disabled="btnLoading" :loading="btnLoading">
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

export default {
  components: { BaseCountryFlagPhoneInput },
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
          text: this.$t("breadcrumb.delayReasons.title"),
          disabled: false,
          href: "/delayReasons/show-all",
        },
        {
          text: this.$t(`breadcrumb.delayReasons.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCity: false,
      types: [
        {
          id: "agent",
          name: this.$t('labels.agent')
        },
        {
          id: "client",
          name: this.$t('labels.client')
        }
      ],

      data: {
        ar: {
          title: null,
        },
        en: {
          title: null,
        },
        type: null,
        ordering: null,
        is_active: null,
      },
      noData: false,
      // Fixed Data
      cityItems: [],
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

    // Cities
    // getCities() {
    //   this.loadingCity = true;
    //   this.axios({
    //     method: "GET",
    //     url: `countries/${this.data.country.id}/cities_without_pagination`,
    //   })
    //     .then((res) => {
    //       this.cityItems = res.data.data.map((item) => {
    //         return {
    //           id: item.id,
    //           name: item.name,
    //         };
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.loadingCity = false;
    //       this.items = [
    //         { id: 1, name: "Item Default 1" },
    //         { id: 2, name: "Item Default 2" },
    //       ];
    //     })
    //     .finally(() => {
    //       this.loadingCity = false;
    //     });
    // },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `delay-reasons/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;

          this.data.is_active = result.is_active;
          this.data.ordering = result.ordering;
          // this.data.type = {
          //   id: result.for
          // };
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
      this.$refs.formdelayReasons.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();


          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);
          data.append("ordering", this.data.ordering);
          data.append("for", 'client');
          data.append("is_active", this.data.is_active);


          if (this.editMode) {
            if (this.data.password) {
              // data.append("password", this.data.password);
            }
          } else {
            // data.append("password", this.data.password);
          }

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `delay-reasons/${this.id}`;
          } else {
            url = "delay-reasons";
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
              this.$router.push("/delayReasons/show-all");
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
