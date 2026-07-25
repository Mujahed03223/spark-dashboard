<template>
  <Loader v-if="loading && editMode"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="categoryForm" @submit.prevent="submitData">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.permission_label')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              :name="$t('labels.permission_label')"
              v-model="data.permission_label_id"
              :static="true"
              :staticItems="permission_labels"
              :placeholder="$t('labels.permission_label')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.permission_type')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              :name="$t('labels.permission_type')"
              v-model="data.permission_type"
              :static="true"
              :staticItems="permission_types"
              :placeholder="$t('labels.permission_type')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
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

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.icon')"
            class="col-md-6"
            rules="min:1"
          >
            <base-input
              @keypress="isEnglish"
              :name="$t('labels.icon')"
              type="text"
              :placeholder="$t('labels.icon')"
              v-model="data.icon"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
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
          text: this.$t("breadcrumb.permission-categories.title"),
          disabled: false,
          href: "/permission-categories/show-all",
        },
        {
          text: this.$t("breadcrumb.permission-categories.add"),
          disabled: true,
          href: "",
        },
      ],

      // ========== Loading

      // ========== create_data
      data: {
        ar: {
          name: null,
        },
        en: {
          name: null,
        },
        icon: null,

        permission_label_id: null,
        permission_type: null,
      },
      permission_labels: [],
      permission_types: [
        {
          id: "general",
          name: this.$t("general"),
        },
        {
          id: "with_category",
          name: this.$t("with_category"),
        },
      ],
    };
  },
  computed: {
    editMode() {
      return !!this.id;
    },
  },

  methods: {
    resetForm() {
      this.data.ar.name = null;
      this.data.en.name = null;
      this.data.icon = null;
      this.data.permission_type = null;
      this.data.permission_label_id = null;
    },

    submitData() {
      this.$refs.categoryForm.validate().then((d) => {
        if (d) {
          this.btnIsLoading = true;
          const frmData = new FormData();
          frmData.append("ar[name]", this.data.ar.name);
          frmData.append("en[name]", this.data.en.name);

          frmData.append("icon", this.data.icon ?? "");
          frmData.append(
            "permission_label_id",
            this.data.permission_label_id.id
          );

          frmData.append("key", this.data.permission_type.id);

          if (this.id) {
            frmData.append("_method", "PUT");
          }
          let url = "";

          if (this.id) {
            url = `permission_category/${this.id}`;
          } else {
            url = "permission_category";
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
                this.$refs.categoryForm.reset();
                this.resetForm();
              } else {
                this.$router.push("/permission-categories/show-all");
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
          url: `permission_category/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            const result = res.data.data;

            this.data = {
              ar: result.ar,
              en: result.en,
              permission_type: this.permission_types.find(
                (el) => el.id == result.key
              ),
              icon: result.icon,
              permission_label_id: {
                id: result.permission_label.id,
                name: result.permission_label[this.$i18n.locale].name,
              },
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
      }
    },
    getCategoryLabels() {
      this.axios.get("permission_label_not_paginated").then(
        (res) =>
          (this.permission_labels = res.data.data.map((el) => ({
            id: el.id,
            name: el[this.$i18n.locale].name,
          })))
      );
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.id) {
      this.getEditData();
    }
    this.getCategoryLabels();
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
