<template>
  <div class="create_wrapper">
    <!-- Start Breadcrumb -->
    <Breadcrumb :items="items" />
    <!-- End Breadcrumb -->

    <div class="custom_card">
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
          <ValidationProvider
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

  data() {
    return {
      // ========== Breadcrumbs
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.permissions-categories.title"),
          disabled: false,
          href: "/permissions-categories/show-all",
        },
        {
          text: this.$t("breadcrumb.permissions-categories.add"),
          disabled: true,
          href: "",
        },
      ],

      // ========== Loading
      btnIsLoading: false,

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

  methods: {
    resetForm() {
      this.ar.name = null;
      this.en.name = null;
      this.icon = null;
      this.key = null;
    },
    // Validate Data

    // Submit Data
    submitData() {
      this.$refs.labelsForm.validate().then((d) => {
        if (d) {
          const frmData = new FormData();
          frmData.append("ar[name]", this.data.ar.name);
          frmData.append("en[name]", this.data.en.name);
          if (this.data.icon) {
            frmData.append("icon", this.data.icon);
          }
          if (this.data.key) {
            frmData.append("key", this.data.key);
          }
          this.axios
            .post("permission_label", frmData)
            .then((res) => {
              console.log(res);
              this.$iziToast.success({
                timeout: 2000,
                message: this.$t("addSuccess"),
                position: "bottomRight",
              });
              // this.$refs.labelsForm.reset();
              this.resetForm();
              this.btnIsLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                timeout: 2000,
                message:
                  err.response.data.message ?? err.response.data.messages,
                position: "bottomRight",
              });
              this.btnIsLoading = false;
            });
        }
      });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
  },
};
</script>
