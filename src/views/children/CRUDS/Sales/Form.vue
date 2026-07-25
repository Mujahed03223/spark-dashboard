<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formSales" @submit.prevent="submit">
        <div class="row">
          <ValidationProvider v-slot="{ errors }" :name="$t('labels.fullname')" class="col-lg-6"
            rules="required|min:2|max:250">
            <base-input :name="$t('labels.fullname')" type="text" :placeholder="$t('labels.fullname')"
              v-model="data.full_name" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start Phone -->
          <ValidationProvider v-slot="{ errors }" :name="$t('labels.phone')" class="col-lg-6" :rules="`required|${data.phone.limit
            ? `min:${data.phone.limit}` + '|' + `max:${data.phone.limit}`
            : ''
            }`">
            <base-country-flag-phone-input @changeKey="phoneKeyChanged" :name="$t('labels.phone')"
              :placeholder="$t('labels.phone')" :preSelectedPhoneCode="data.phone.key"
              v-model="data.phone.number"></base-country-flag-phone-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Phone -->

          <!-- Start:: Email -->
          <ValidationProvider v-slot="{ errors }" :name="$t('labels.email')" class="col-lg-6" rules="required|email">
            <base-input :name="$t('labels.email')" type="email" @keypress="isEmailValid($event)"
              :placeholder="$t('labels.email')" v-model="data.email" />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: Email -->


          <!-- <div class="col-lg-12 py-0">
          <div class="divider">
            <h4>الحالة</h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div> -->

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
          text: this.$t("breadcrumb.sales.title"),
          disabled: false,
          href: "/sales/show-all",
        },
        {
          text: this.$t(`breadcrumb.sales.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCity: false,
      data: {
        full_name: null,

        phone: {
          number: null,
          key: null,
          limit: null,
        },

        email: null,
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
    getCities() {
      this.loadingCity = true;
      this.axios({
        method: "GET",
        url: `countries/${this.data.country.id}/cities_without_pagination`,
      })
        .then((res) => {
          this.cityItems = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          this.loadingCity = false;
          this.items = [
            { id: 1, name: "Item Default 1" },
            { id: 2, name: "Item Default 2" },
          ];
        })
        .finally(() => {
          this.loadingCity = false;
        });
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `sales/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.phone = {
            number: result.phone,
            key: result.phone_code,
          };
          this.data.email = result.email;
          this.data.full_name = result.name;
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
      this.$refs.formSales.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();


          data.append("name", this.data.full_name);
          data.append("email", this.data.email);
          data.append("phone_code", this.data.phone.key);
          data.append("phone", this.data.phone.number);


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
            url = `sales/${this.id}`;
          } else {
            url = "sales";
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
              this.$router.push("/sales/show-all");
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
