<template>
  <Loader v-if="loading && editMode"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="labelsForm" @submit.prevent="submitData">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.main_title') + $t('inArabic')"
            class="col-md-6"
            rules="required|min:3|max:250"
          >
            <base-input
              @keypress="isArabic"
              :name="$t('labels.main_title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.main_title') + $t('inArabic')"
              v-model="data.ar.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.main_title') + $t('inEnglish')"
            class="col-md-6"
            rules="required|min:2|max:250"
          >
            <base-input
              @keypress="isEnglish"
              :name="$t('labels.main_title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.main_title') + $t('inEnglish')"
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
          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('key')"
            class="col-md-6"
            rules="min:1"
          >
            <base-input
              @keypress="isEnglish"
              :name="$t('key')"
              type="text"
              :placeholder="$t('key')"
              v-model="data.key"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->
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
          text: this.$t("breadcrumb.permission-labels.title"),
          disabled: false,
          href: "/permission-labels/show-all",
        },
        {
          text: this.$t("breadcrumb.permission-labels.add"),
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
        key: null,
      },
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
      this.data.key = null;
    },
    // Validate Data

    // Submit Data
    submitData() {
      this.$refs.labelsForm.validate().then((d) => {
        if (d) {
          this.btnIsLoading = true;
          const frmData = new FormData();
          frmData.append("ar[name]", this.data.ar.name);
          frmData.append("en[name]", this.data.en.name);
          if (this.data.icon) {
            frmData.append("icon", this.data.icon);
          }
          if (this.data.key) {
            frmData.append("key", this.data.key);
          }

          if (this.id) {
            frmData.append("_method", "PUT");
          }
          let url = "";

          if (this.id) {
            url = `permission_label/${this.id}`;
          } else {
            url = "permission_label";
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
                this.$refs.labelsForm.reset();
                this.resetForm();
              } else {
                this.$router.push("/permission-labels/show-all");
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
          url: `permission_label/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            this.data = {
              ar: res.data.data.ar,
              en: res.data.data.en,
              key: res.data.data.key,
              icon: res.data.data.icon,
              // is_active: res.data.data.is_active,
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
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>
