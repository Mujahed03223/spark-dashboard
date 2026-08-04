<template>
  <Loader v-if="loading && editMode"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="rolesForm" @submit.prevent="submitData">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.name') + $t('inArabic')"
            class="col-md-6"
            rules="required|min:2|max:250"
          >
            <base-input
              @keypress="isArabic"
              :name="$t('labels.name') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.name') + $t('inArabic')"
              v-model="data.ar.name"
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
              v-model="data.en.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.is_active')"
            class="col-4"
            rules="required"
          >
            <div>
              <div class="input-title">
                <h4>
                  {{ $t("labels.active", { name: $t("labels.role") }) }}
                </h4>
              </div>
              <v-checkbox
                :name="$t('labels.is_active')"
                class="py-0 px-0"
                v-model="data.is_active"
                :label="$t('labels.is_active')"
              ></v-checkbox>
            </div>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->

          <p class="text-center mt-5">{{ $t("labels.permissions") }}</p>
          <div style="overflow-x: auto; width: 100%;">
          <table class="roles-table border rounded-lg">
            <tr v-for="(permission, index) in permissions" :key="index">
              <th>{{ $t(`permissions.${index}`) }}</th>
              <td
                v-for="per in permission"
                :key="per.id"
                class="m-auto items-center align-center text-center"
              >
                <v-checkbox
                  :title="per.title"
                  color="success"
                  :value="per.id"
                  v-model="data.permission_row"
                  :label="per.title"
                ></v-checkbox>
              </td>
            </tr>
          </table>
          </div>
        </div>

        <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submitData"
            :disabled="btnIsLoading"
            :loading="btnIsLoading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn
            type="button"
            class="back_btn"
            @click="handleBack('/roles/show-all')"
          >
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
          href: "/"
        },
        {
          text: this.$t("breadcrumb.roles.title"),
          disabled: false,
          href: "/roles/show-all"
        },
        {
          text: this.$t(`breadcrumb.roles.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: ""
        }
      ],

      // ========== Loading

      // ========== create_data
      data: {
        ar: {
          name: null
        },
        en: {
          name: null
        },
        permission_row: []
        // is_active: false,
      },
      permissions: null,
      permission_categories: []
    };
  },
  computed: {
    editMode() {
      return !!this.id;
    }
  },

  methods: {
    resetForm() {
      this.data.ar.name = null;
      this.data.en.name = null;

      this.data.permission_row = [];
    },

    // Validate Data

    // Submit Data
    submitData() {
      this.$refs.rolesForm.validate().then((d) => {
        if (d) {
          this.btnIsLoading = true;
          const frmData = new FormData();

          frmData.append("ar[name]", this.data.ar.name);
          frmData.append("en[name]", this.data.en.name);
          // frmData.append("is_active", +this.data.is_active);

          let main_index = 0;
          this.data.permission_row.map((el) => {
            // row.permissions.map((el) => {
            ++main_index;
            frmData.append(`permission_ids[${main_index}]`, el);

            // });
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
                message: message
              });
              if (!this.editMode) {
                this.$refs.rolesForm.reset();
                // this.resetForm();
                this.$router.push("/roles/show-all");
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
                position: "bottomRight"
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
          url: `role/${this.id}`
        })
          .then((res) => {
            this.loading = false;
            const result = res.data?.data;
            this.data.ar.name = result?.ar?.name;
            this.data.en.name = result?.en?.name;
            this.data.permission_row = [];
            result?.permission.map((el) => {
              this.data.permission_row.push(el.id);
            });
          })
          .catch((err) => {
            console.log(err);
            this.$iziToast.error({
              title: this.$t("error"),
              message: err.response?.data.message ?? err.response?.data.messages
            });
            this.noData = true;

            this.loading = false;
          });
      }
    },

    getPermissions() {
      this.axios.get("permission_not_paginated").then((res) => {
        // console.log(res.data.data);
        this.permissions = res.data?.data;
        // this.permission_categories = res.data.data.map((el) => ({
        //   id: el.id,
        //   permission_label: el.permission_label,
        //   name: el[this.$i18n.locale].name,
        //   permissions: el.permissions,
        // }));
        if (this.id) {
          if (!this.canShow) {
            this.getEditData();
          }
        } else if (this.canAdd) {
          this.$router.push({ path: `/permission-required` });
        }
      });
    }
  },

  async created() {
    this.canEdit = this.$permission.allowed("role/edit");
    this.canDelete = this.$permission.allowed("role/delete");
    this.canAdd = this.$permission.allowed("role/add");
    this.canShow = this.$permission.allowed("role/show");
    this.canShowAll = this.$permission.allowed("role/show-all");

    if (this.canEdit || this.canShow || this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    } else {
      // this.control = this.$permission.setControls(this.$route.path);
      await this.getPermissions();
    }
  }
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

.roles-table {
  table-layout: fixed;
  width: 100%;
  text-align: center;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0px;

  th {
    background-color: #eee;
    border: 1px solid lightgray;
    padding: 8px 12px;
    white-space: nowrap;
    font-weight: bold;
    width: 150px;
  }

  td {
    border: 1px solid #eee;
    padding: 4px 8px;
    white-space: nowrap;
    vertical-align: middle;
    width: 120px;
  }
}

.v-input--selection-controls__input {
  margin: auto;
}

.v-application--is-rtl .v-input--selection-controls__input {
  margin-left: auto !important;
}

.v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  text-align: right;
}
</style>
