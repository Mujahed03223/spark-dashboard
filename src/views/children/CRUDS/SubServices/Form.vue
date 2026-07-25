<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="formsubService" @submit.prevent="submit">
        <div class="row">
          <div
            class="permission_row mb-2"
            v-for="(row, index) in data.permission_row"
            :key="index"
          >
            <div class="row">
              <div class="col-10">
                <div class="row">
                  <div class="col-md-6">
                    <v-checkbox
                      :title="$t('labels.is_active')"
                      color="success"
                      v-model="row.is_active"
                      :label="$t('labels.is_active')"
                    ></v-checkbox>
                  </div>
                  <div class="col-12"></div>
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('labels.title') + $t('inArabic')"
                    class="col-md-6"
                    rules="required|min:3|max:250"
                  >
                    <base-input
                      @keypress="isArabic"
                      :name="$t('labels.title') + $t('inArabic')"
                      type="text"
                      :placeholder="$t('labels.title') + $t('inArabic')"
                      v-model="row.title_ar"
                    />
                    <span v-if="errors[0]" class="error--text d-inline-block">
                      {{ errors[0] }}
                    </span>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('labels.title') + $t('inEnglish')"
                    class="col-md-6"
                    rules="required|min:2|max:250"
                  >
                    <base-input
                      @keypress="isEnglish"
                      :name="$t('labels.title') + $t('inEnglish')"
                      type="text"
                      :placeholder="$t('labels.title') + $t('inEnglish')"
                      v-model="row.title_en"
                    />
                    <span v-if="errors[0]" class="error--text d-inline-block">
                      {{ errors[0] }}
                    </span>
                  </ValidationProvider>
                  <!-- Start categories -->
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('labels.service')"
                    class="col-lg-6"
                    rules="required|min:2|max:250"
                  >
                    <base-select-input
                      v-model="row.service"
                      :static="true"
                      :name="$t('labels.service')"
                      :staticItems="services"
                      :placeholder="$t('labels.service')"
                    ></base-select-input>

                    <span v-if="errors[0]" class="error--text d-inline-block">
                      {{ errors[0] }}
                    </span>
                  </ValidationProvider>
                  <!-- Start categories -->
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('labels.price')"
                    class="col-md-6"
                    rules="required|min:1|max:250"
                  >
                    <base-input
                      :name="$t('labels.price')"
                      type="number"
                      :placeholder="$t('labels.price')"
                      v-model="row.price"
                    />
                    <span v-if="errors[0]" class="error--text d-inline-block">
                      {{ errors[0] }}
                    </span>
                  </ValidationProvider>
                </div>
              </div>
              <div class="col-2 d-flex" v-if="!id">
                <div class="d-flex justify-center align-center mx-1">
                  <span class="append" @click="appendRow()">
                    <i class="fas fa-plus-circle"></i>
                  </span>
                </div>
                <div
                  class="d-flex justify-center align-center mx-1"
                  v-if="data.permission_row.length > 1"
                >
                  <span class="append" @click="deleteRow(index)">
                    <i class="fas fa-minus-circle"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
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
          text: this.$t("breadcrumb.subService.title"),
          disabled: false,
          href: "/subService/show-all",
        },
        {
          text: this.$t(`breadcrumb.subService.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingProviders: false,
      loadingCategory: false,
      data: {
        permission_row: [
          {
            title_ar: null,
            title_en: null,
            price: null,
            is_active: false,
            service: null,
          },
        ],
      },
      services: [],
      noData: false,
    };
  },

  methods: {
    deleteRow(index) {
      this.data.permission_row.splice(index, 1);
    },
    appendRow() {
      this.data.permission_row.push({
        title_ar: null,
        title_en: null,
        price: null,
        is_active: false,
        service: null,
      });
    },

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    //services
    getServices() {
      this.loadingCategory = true;
      this.axios({
        method: "GET",
        url: `services-without-paginate`,
      })
        .then((res) => {
          this.services = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.title,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          this.loadingCategory = false;
          this.items = [
            { id: 1, name: "Item Default 1" },
            { id: 2, name: "Item Default 2" },
          ];
        })
        .finally(() => {
          this.loadingCategory = false;
        });
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `sub-services/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.permission_row = [
            {
              title_ar: result.ar.title,
              title_en: result.en.title,
              price: result.price,
              is_active: result.is_active,
              service: {
                name: result.service.title,
                id: result.service.id,
              }
            },
          ];
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
      this.$refs.formsubService.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const frmData = new FormData();

          if (this.id) {
            // this.data.permission_row.map((row) => {
            //   frmData.append("_method", "PUT");
            //   frmData.append(`ar[title]`, row.title_ar);
            //   frmData.append(`en[title]`, row.title_en);
            //   if (row.ordering) {
            //     frmData.append(`ordering`, row.ordering);
            //   }
            //   frmData.append(`is_active`, +row.is_active);
            // });
            frmData.append(
              `sub_services[0][ar][title]`,
              this.data.permission_row[0].title_ar
            );
            frmData.append(
              `sub_services[0][en][title]`,
              this.data.permission_row[0].title_en
            );

            frmData.append(
              `sub_services[0][service_id]`,
              this.data.permission_row[0].service.id
            );
            frmData.append(
              `sub_services[0][price]`,
              this.data.permission_row[0].price
            );
            frmData.append(
              `sub_services[0][is_active]`,
              +this.data.permission_row[0].is_active
            );
            frmData.append(`sub_services[0][id]`, this.id);
          } else {
            this.data.permission_row.map((row, index) => {
              frmData.append(`sub_services[${index}][ar][title]`, row.title_ar);
              frmData.append(`sub_services[${index}][en][title]`, row.title_en);

              frmData.append(
                `sub_services[${index}][service_id]`,
                row.service.id
              );
              frmData.append(`sub_services[${index}][price]`, row.price);
              frmData.append(
                `sub_services[${index}][is_active]`,
                +row.is_active
              );
              frmData.append(`sub_services[${index}][id]`, "");
            });
          }
          let url = "";
          if (this.id) {
            url = `sub-services`;
          } else {
            url = "sub-services";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: url,
            data: frmData,
            params: { internal: 1 },
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/subService/show-all");
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
    this.getServices();
  },
};
</script>

<style lang="scss" scoped>
.permission_row {
  border: 1px solid var(--main);
  border-radius: 10px;
  padding: 10px;
}
</style>
