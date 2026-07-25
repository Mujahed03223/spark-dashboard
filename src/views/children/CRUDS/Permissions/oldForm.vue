<template>
  <Loader v-if="loading && editMode"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="permissionForm" @submit.prevent="submitData">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.permission_categories')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              :disabled="!!id"
              :name="$t('labels.permission_categories')"
              v-model="data.permission_category_id"
              :static="true"
              @input="getSuggested($event)"
              :staticItems="permission_categories"
              :placeholder="$t('labels.permission_categories')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <div
            class="permissions_row mb-2"
            v-for="(row, index) in data.permission_row"
            :key="index"
          >
            <div class="row">
              <div class="col-10">
                <div class="row">
                  <div class="col-md-6">
                    <v-checkbox
                      title="الظهور في sidebar"
                      color="success"
                      v-model="row.is_side_show"
                      :label="$t('labels.is_side_show')"
                    ></v-checkbox>
                  </div>
                  <div class="col-md-6">
                    <v-checkbox
                      title="التحكم في التفعيل والحظر ...الخ"
                      color="success"
                      v-model="row.is_control_permissions"
                      :label="$t('labels.is_control_permissions')"
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

                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('labels.permission_url')"
                    class="col-lg-6"
                    rules="required"
                  >
                    <base-select-input
                      :name="$t('labels.permission_url')"
                      v-model="row.permission_route"
                      :static="true"
                      :staticItems="currentRoutes"
                      :placeholder="$t('labels.permission_url')"
                    ></base-select-input>
                    <span v-if="errors[0]" class="error--text d-inline-block">
                      {{ errors[0] }}
                    </span>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('labels.icon')"
                    class="col-md-6"
                  >
                    <base-input
                      @keypress="isEnglish"
                      :name="$t('labels.icon')"
                      type="text"
                      :placeholder="$t('labels.icon')"
                      v-model="row.icon"
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
            @click="submitData"
            :disabled="btnIsLoading"
            :loading="btnIsLoading"
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
export default {
  name: "Create",
  props: ["id"],

  data() {
    return {
      noData: false,
      loading: false,
      btnIsLoading: false,
      // ========== Breadcrumbs
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

      // ========== Loading

      // ========== create_data
      data: {
        permission_category_id: null,
        permission_row: [
          {
            title_ar: null,
            title_en: null,
            icon: null,
            permission_route: null,
            is_side_show: true,
            is_control_permissions: true,
          },
        ],
      },
      allRoutes: [],
      currentRoutes: [],
      permission_categories: [],
      selectedRoute: [],
    };
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  methods: {
    getPermissions() {
      this.axios
        .get(`${window.location.origin}/permissions.json`)
        .then((data) => {
          this.currentRoutes = data.data.allRoutes;
          this.allRoutes = data.data.allRoutes;
        });
    },
    resetForm() {
      this.data.permission_category_id = null;
      this.data.permission_row = [
        {
          title_ar: null,
          title_en: null,
          icon: null,
          permission_route: null,
          is_side_show: true,
          is_control_permissions: true,
        },
      ];
    },
    deleteRow(index) {
      this.data.permission_row.splice(index, 1);
    },
    appendRow() {
      this.data.permission_row.push({
        title_ar: null,
        title_en: null,
        icon: null,
        permission_route: null,
        is_side_show: true,
        is_control_permissions: true,
      });
    },
    // getSuggested(e) {
    //   let keys = [];
    //   this.allRoutes.map((el) => {
    //     let search = e.name.slice(2, 4);
    //     if (el.name.search(search) != -1) {
    //       keys.push(el);
    //     }
    //   });
    //   if (keys.length) {
    //     this.currentRoutes = keys;
    //   } else {
    //     this.currentRoutes = [];
    //   }
    // },
    // Validate Data
    getSuggested(e) {
      let keys = [];
      this.allRoutes.map((el) => {
        let search = e.name.slice(2, 4);
        if (el.name.search(search) != -1) {
          keys.push(el.key);
        }
      });
      keys = [...new Set(keys)];

      if (keys.length) {
        this.currentRoutes = this.allRoutes.filter((route) =>
          keys.includes(route.key)
        );

        // this.currentRoutes = keys;
      } else {
        this.currentRoutes = [];
      }
    },

    // Submit Data
    submitData() {
      this.$refs.permissionForm.validate().then((d) => {
        if (d) {
          this.btnIsLoading = true;
          const frmData = new FormData();
          frmData.append(
            "permission_category_id",
            this.data.permission_category_id.id
          );

          if (this.id) {
            this.data.permission_row.map((row) => {
              frmData.append("_method", "PUT");
              frmData.append(`ar[title]`, row.title_ar);
              frmData.append(`en[title]`, row.title_en);
              if (row.icon) {
                frmData.append(`icon`, row.icon);
              }
              frmData.append(
                `back_route_name`,
                row.permission_route.backend_url
              );
              frmData.append(
                `front_route_name`,
                row.permission_route.frontend_url
              );
              frmData.append(
                `is_control_permission`,
                +row.is_control_permissions
              );
              frmData.append(`show_in_side_bar`, +row.is_side_show);
            });
          } else {
            this.data.permission_row.map((row, index) => {
              frmData.append(`titles[${index}][ar][title]`, row.title_ar);
              frmData.append(`titles[${index}][en][title]`, row.title_en);

              frmData.append(`icons[${index}]`, row.icon ? row.icon : "");
              frmData.append(
                `back_route_names[${index}]`,
                row.permission_route.backend_url
              );
              frmData.append(
                `front_route_names[${index}]`,
                row.permission_route.frontend_url
              );
              frmData.append(
                `is_control_permissions[${index}]`,
                +row.is_control_permissions
              );
              frmData.append(`show_in_side_bar[${index}]`, +row.is_side_show);
            });
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

          this.axios
            .post(url, frmData)
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

              this.btnIsLoading = false;
            })
            .catch((err) => {
              this.btnIsLoading = false;
              this.$iziToast.error({
                timeout: 2000,
                message:
                  err.response.data.message ?? err.response.data.messages,
                position: "bottomRight",
              });
            });
        }
      });
    },
    getEditData() {
      this.noData = false;
      if (this.editMode) {
        this.loading = true;
        this.axios({
          method: "GET",
          url: `permissions/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            const result = res.data.data;

            this.data.permission_category_id = this.permission_categories.find(
              (el) => el.name == result.permission_category
            );

            this.data.permission_row = [
              {
                title_ar: result.ar.title,
                title_en: result.en.title,
                icon: result.icon,
                permission_route: this.allRoutes.find(
                  (el) => el.frontend_url == result.front_route_name
                ),
                is_side_show: result.show_in_side_bar,
                is_control_permissions: result.is_control_permission,
              },
            ];
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
      }
    },
    getCategories() {
      this.loading = true;
      this.axios
        .get("permission_category_not_paginated")
        .then((res) => {
          this.permission_categories = res.data.data.map((el) => ({
            id: el.id,
            name: el[this.$i18n.locale].name,
          }));
          if (this.id) {
            this.getEditData();
          } else {
            this.loading = false;
          }
        })
        .catch(() => (this.loading = false));
    },
  },

  mounted() {},
  async created() {
    this.control = this.$permission.setControls(this.$route.path);
    await this.getCategories();
    // this.getPermissions();
  },
};
</script>
<style lang="scss">
.permissions_row {
  border: 1px solid var(--main);
  border-radius: 10px;
  padding: 10px;
}
</style>
