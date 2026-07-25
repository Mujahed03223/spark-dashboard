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
            :name="$t('labels.name') + $t('inArabic')"
            class="col-md-6"
            rules="required|min:3|max:250"
          >
            <base-input
              @keypress="isArabic"
              :name="$t('labels.name') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.name') + $t('inArabic')"
              v-model="data.name_ar"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.name') + $t('inEnglish')"
            class="col-md-6"
            rules="required|min:2|max:250"
          >
            <base-input
              @keypress="isEnglish"
              :name="$t('labels.name') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.name') + $t('inEnglish')"
              v-model="data.name_en"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.permission_categories')"
            class="col-12"
            rules="required"
          >
            <base-select-input
              :name="$t('labels.permission_categories')"
              v-model="data.permission_row"
              :multiple="true"
              :static="true"
              :staticItems="permission_categories"
              :placeholder="$t('labels.permission_categories')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <div class="col-12">
            <div
              class="permissions_roles mb-2"
              v-for="(row, index) in data.permission_row"
              :key="index"
            >
              <div class="permission_name">
                <h3>{{ row.name }}</h3>
              </div>
              <div
                class="permissions_role"
                v-for="permission in row.permissions"
                :key="permission.id"
              >
                <ul class="list-unstyled">
                  <li>
                    <v-switch
                      color="success"
                      v-model="permission.status"
                      :label="permission[$i18n.locale].title"
                    ></v-switch>
                  </li>
                </ul>
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
          text: this.$t("breadcrumb.roles.title"),
          disabled: false,
          href: "/roles/show-all",
        },
        {
          text: this.$t("breadcrumb.roles.add"),
          disabled: true,
          href: "",
        },
      ],

      // ========== Loading

      // ========== create_data
      data: {
        name_ar: null,
        name_en: null,
        permission_row: [],
      },

      permission_categories: [],
    };
  },
  computed: {
    editMode() {
      return !!this.id;
    },
  },

  methods: {
    resetForm() {
      this.data.name_ar = null;
      this.data.name_en = null;

      this.data.permission_row = [];
    },

    // Validate Data

    // Submit Data
    submitData() {
      this.$refs.permissionForm.validate().then((d) => {
        if (d) {
          this.btnIsLoading = true;
          const frmData = new FormData();

          frmData.append(`ar[name]`, this.data.name_ar);
          frmData.append(`en[name]`, this.data.name_en);
          console.log(this.data.permission_row);
          let main_index = 0;
          this.data.permission_row.map((row) => {
            row.permissions.map((el) => {
              ++main_index;
              if (el.status) {
                frmData.append(`permission_ids[${main_index}]`, el.id);
              }
            });
          });

          if (this.id) {
            frmData.append("_method", "PUT");
          }
          let url = "";

          if (this.id) {
            url = `role/${this.id}`;
          } else {
            url = "role";
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
                this.$router.push("/roles/show-all");
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
          url: `role/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            const result = res.data.data;
            this.data.name_ar = result.ar.name;
            this.data.name_en = result.en.name;
            let newData = [];

            result.permission.map((el) => {
              let obj = null;
              obj = this.permission_categories.find(
                (value) => value.name == el.permission_category
              );
              obj.permissions.map((sub) => {
                if (sub.id == el.id) sub["status"] = true;
              });

              const found = newData.find((el) => el?.id == obj.id);

              if (!found) {
                newData.push(obj);
              }
            });

            this.data.permission_row = newData;
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
      this.axios.get("permission_category_not_paginated").then((res) => {
        this.permission_categories = res.data.data.map((el) => ({
          id: el.id,
          permission_label: el.permission_label,
          name: el[this.$i18n.locale].name,
          permissions: el.permissions,
        }));
        if (this.id) {
          this.getEditData();
        }
      });
    },
  },

  async created() {
    this.control = this.$permission.setControls(this.$route.path);
    await this.getCategories();
  },
};
</script>
<style lang="scss">
.permissions_roles {
  border: 1px solid var(--main);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .permission_name {
    h3 {
      font-size: 18px !important;
      margin: 0;
      margin-inline-end: 10px;
      font-weight: 500;
    }
    min-width: 150px;
  }
  .permissions_role {
    margin-bottom: 0.5rem;
  }
  ul {
    flex: 1;
    flex-wrap: wrap;
    display: flex;
    li {
      &:not(:first-child) {
        border-inline-start: 1px solid var(--mainText);
      }
    }
  }
  .v-input__slot {
    padding: 0 !important;
  }
}
</style>
