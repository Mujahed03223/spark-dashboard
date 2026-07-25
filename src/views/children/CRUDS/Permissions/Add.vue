<template>
  <div class="create_wrapper">
    <!-- Start Breadcrumb -->
    <Breadcrumb :items="items" />
    <!-- End Breadcrumb -->

    <div class="custom_card">
      <ValidationObserver ref="formCoupon" @submit.prevent="submitData">
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
              @keypress="isArabic"
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
            :name="$t('labels.permissions')"
            class="col-lg-4"
            rules="required"
          >
            <base-select-input
              :name="$t('labels.permissions')"
              v-model="data.permissions"
              :static="true"
              :multiple="true"
              :staticItems="all_permissions"
              :placeholder="$t('labels.permissions')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <div class="permisions">
            <div
              v-for="permission in data.permissions"
              :key="permission.id"
              class="col-lg-12 switch_part d-flex justify-content-between align-items-center"
            >
              <h4 class="m-0">{{ permission.name }} :</h4>

              <div class="input_wrapper checkbox_input">
                <v-switch
                  v-model="permission.is_show.status"
                  :label="$t('show')"
                ></v-switch>
              </div>

              <div class="input_wrapper checkbox_input">
                <v-switch
                  v-model="permission.is_create.status"
                  :label="$t('add')"
                ></v-switch>
              </div>

              <div class="input_wrapper checkbox_input">
                <v-switch
                  v-model="permission.is_edit.status"
                  :label="$t('edit')"
                ></v-switch>
              </div>

              <div class="input_wrapper checkbox_input">
                <v-switch
                  v-model="permission.is_destroy.status"
                  :label="$t('delete')"
                ></v-switch>
              </div>
            </div>
            <!-- --------------------- -->
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
          text: this.$t("breadcrumb.permissions.title"),
          disabled: false,
          href: "/permissions",
        },
        {
          text: this.$t("breadcrumb.permissions.add"),
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

        permissions: [],
      },

      // ========== Fixed Data
      all_permissions: [],
    };
  },

  methods: {
    // Validate Data
    validateCreateForm() {
      this.btnIsLoading = true;

      if (!this.data.role.ar.name) {
        this.$iziToast.error({
          timeout: 2000,
          message: this.$t("forms.validation.name_ar"),
          position: "bottomRight",
        });
        this.btnIsLoading = false;
        return;
      } else if (!this.data.role.en.name) {
        this.$iziToast.error({
          timeout: 2000,
          message: this.$t("forms.validation.name_en"),
          position: "bottomRight",
        });
        this.btnIsLoading = false;
        return;
      } else {
        this.submitData();
        return;
      }
    },

    // Get_Permissions
    get_permissions() {
      // Convert 'JSON' Object to JS Object
      const ALLPERMISSIONS = JSON.parse(JSON.stringify(this.$t("sidebar")));

      ALLPERMISSIONS.forEach((el) => {
        if (el.items) {
          let inside_nested = false;

          // Check Nested
          el.items.forEach((element) => {
            if (element.items) {
              inside_nested = true;
            }
          });

          // IF Nested Else
          if (inside_nested) {
            el.items.forEach((subEl) => {
              this.all_permissions.push({
                id: Math.random()
                  .toString(36)
                  .replace(/[^a-z]+/g, "")
                  .substr(0, 5),
                name: subEl.title,
                route_name: subEl.items[0].url,
                is_show: { url: `${subEl.items[0].url}/show`, status: false },
                is_create: { url: `${subEl.items[0].url}/add`, status: false },
                is_edit: { url: `${subEl.items[0].url}/edit`, status: false },
                is_destroy: { url: "", status: false },
              });
            });
          } else {
            this.all_permissions.push({
              id: Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 5),
              name: el.title,
              route_name: el.items[0].url,
              is_show: { url: `${el.items[0].url}/show`, status: false },
              is_create: { url: `${el.items[0].url}/add`, status: false },
              is_edit: { url: `${el.items[0].url}/edit`, status: false },
              is_destroy: { url: "", status: false },
            });
          }
        }
      });

      // Remove First Obj [homePage]
      this.all_permissions.shift();
      // console.log(this.all_permissions);
    },

    // Submit Data
    submitData() {
      // this.$axios({
      //   method: "POST",
      //   url: "role",
      //   data: this.data,
      // })
      //   .then(() => {
      //     this.$iziToast.success({
      //       timeout: 2000,
      //       message: this.$t("addSuccess"),
      //       position: "bottomRight",
      //     });
      //     this.$router.push({ path: "/permissions" });
      //     this.btnIsLoading = false;
      //   })
      //   .catch((err) => {
      //     this.$iziToast.error({
      //       timeout: 2000,
      //       message: err.response.data.message,
      //       position: "bottomRight",
      //     });
      //     this.btnIsLoading = false;
      //   });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.get_permissions();
  },
};
</script>
