<template>
  <div class="create_wrapper">
    <!-- Start Breadcrumb -->
    <Breadcrumb :items="items" />
    <!-- End Breadcrumb -->

    <div class="custom_card">
      <div class="card-header">
        <h4 class="card-title">{{ $t("addNew") }}</h4>
      </div>

      <!-- ==== Start Form ==== -->
      <form @submit.prevent="validateCreateForm">
        <div class="container">
          <div class="row justify-content-between">
            <!-- Name_ar -->
            <div class="col-lg-12 py-0">
              <div class="input_wrapper top_label">
                <input
                  type="text"
                  class="form-control"
                  @input="helper_checkIfInputIsEmpty"
                  v-model.trim="data.role.ar.name"
                />
                <label for="name_input" class="form-label">{{
                  $t("forms.labels.name_ar")
                }}</label>
              </div>
            </div>

            <!-- Name_en -->
            <div class="col-lg-12 py-0">
              <div class="input_wrapper top_label">
                <input
                  type="text"
                  class="form-control"
                  @input="helper_checkIfInputIsEmpty"
                  v-model.trim="data.role.en.name"
                />
                <label for="name_input" class="form-label">{{
                  $t("forms.labels.name_en")
                }}</label>
              </div>
            </div>

            <!-- Permissions -->
            <!-- Select -->
            <div class="col-lg-12 py-0">
              <div class="input_wrapper top_label">
                <label class="form-label">{{
                  $t("forms.labels.permissions")
                }}</label>
                <multiselect
                  v-model="data.permissions"
                  :options="all_permissions"
                  label="name"
                  track-by="id"
                  placeholder=" "
                  multiple
                  :searchable="true"
                  :allow-empty="true"
                  :show-labels="false"
                >
                </multiselect>
              </div>
            </div>
            <!-- Options -->
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
        </div>

        <div class="buttons_wrapper">
          <button
            class="button_style_1"
            :class="btnIsLoading ? 'disabled' : ''"
          >
            {{ $t("forms.submit") }}
            <span class="btn_loader" v-if="btnIsLoading"></span>
          </button>
        </div>
      </form>
      <!-- ==== End Form ==== -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Edit",

  props: ["id"],

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
        _method: "PATCH",
        role: {
          ar: {
            name: null,
          },
          en: {
            name: null,
          },
        },
        permissions: [],
      },

      // ========== Fixed Data
      all_permissions: [],
    };
  },

  methods: {
    // Get_Data
    getData() {
      this.$axios({
        method: "GET",
        url: `role/${this.id}`,
      }).then((res) => {
        this.data.role.ar.name = res.data.data.ar.name;
        this.data.role.en.name = res.data.data.en.name;
        this.data.permissions = res.data.data.permissions;
      });
    },

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
      this.$axios({
        method: "POST",
        url: `role/${this.id}`,
        data: this.data,
      })
        .then(() => {
          this.$iziToast.success({
            timeout: 2000,
            message: this.$t("editSuccess"),
            position: "bottomRight",
          });
          this.$router.push({ path: "/permissions" });
          this.btnIsLoading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            timeout: 2000,
            message: err.response.data.message,
            position: "bottomRight",
          });
          this.btnIsLoading = false;
        });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.get_permissions();
    this.getData();
  },
};
</script>
