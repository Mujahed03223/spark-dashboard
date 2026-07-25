<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="adminsForm" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto mt-5 mb-3"
            style="width: 100%"
            >
            <!-- :rules="`${data.avatar.preview ? '' : 'required'}`" -->
            <v-file-input
              @change="uploadImage($event, 'users', 'avatar')"
              v-model="data.avatar.image"
              class="d-none"
              :name="$t('labels.mainImage')"
              accept="image/*,|size:2048"
              label=""
              id="banner-create-image-main"
            ></v-file-input>
            <label
              for="banner-create-image-main"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.avatar.preview"
                class="d-flex"
                cover
                :src="data.avatar.preview"
                :aspect-ratio="3.4"
              />
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/placeholder.png"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </validation-provider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.username')"
            class="col-lg-6"
            rules="required|min:2|max:18"
          >
            <base-input
              :name="$t('labels.username')"
              type="text"
              :placeholder="$t('labels.username')"
              v-model="data.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start Phone -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.phone')"
            class="col-lg-6"
            :rules="`required|${
              data.phone.limit
                ? `min:${data.phone.limit}` + '|' + `max:${data.phone.limit}`
                : ''
            }`"
          >
            <base-country-flag-phone-input
              @changeKey="phoneKeyChanged"
              :name="$t('labels.phone')"
              :placeholder="$t('labels.phone')"
              :preSelectedPhoneCode="data.phone.key"
              v-model="data.phone.number"
            ></base-country-flag-phone-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Phone -->

          <!-- Start:: Email -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.email')"
            class="col-lg-6"
            rules="required|email"
          >
            <base-input
              :name="$t('labels.email')"
              type="email"
              @keypress="isEmailValid($event)"
              :placeholder="$t('labels.email')"
              v-model="data.email"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: Email -->

          <!-- Start Password -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.password')"
            class="col-lg-6"
            :rules="!editMode ? 'required|min:6|max:250' : ''"
          >
            <base-input
              :name="$t('labels.password')"
              type="password"
              :placeholder="$t('labels.password')"
              v-model="data.password"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.passwordConfirm')"
            class="col-lg-6"
            :rules="`${editMode ? '' : 'required'}|confirmed:${$t(
              'labels.password'
            )}`"
          >
            <base-input
              :name="$t('labels.passwordConfirm')"
              type="password"
              :placeholder="$t('labels.passwordConfirm')"
              v-model="data.passwordConfirmation"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider> -->
          <!-- End Password -->

          <!-- Start Role -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.role')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              v-model="data.role"
              getUrl="role-names"
              :placeholder="$t('labels.role')"
            ></base-select-input>

            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End Role -->
        </div>

        <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn
            type="button"
            class="back_btn"
            @click="handleBack('/admins/show-all')"
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
          href: "/"
        },
        {
          text: this.$t("breadcrumb.admins.title"),
          disabled: false,
          href: "/admins/show-all"
        },
        {
          text: this.$t(`breadcrumb.admins.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: ""
        }
      ],
      // Btn Loading
      loading: false,
      loadingRole: false,
      btnLoading: false,
      loadingCity: false,
      data: {
        avatar: {
          preview: null,
          image: null
        },
        name: null,
        email: null,
        phone: {
          number: null,
          key: null,
          limit: null
        },
        role: null,
        password: null
        // passwordConfirmation: null,
      },
      noData: false
    };
  },

  methods: {
    uploadImage(event, modal, varName) {
      if (event) {
        this.btnLoading = true;
        const data = new FormData();
        data.append("file", event);
        data.append("attachment_type", "image");
        data.append("model", modal);
        this.axios({
          method: "POST",
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}`,
          data: data
        })
          .then((res) => {
            this.data[varName].image = res.data.data;
            this.data[varName].preview = URL.createObjectURL(event);
            this.btnLoading = false;
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message
            });
            this.btnLoading = false;
          });
      }
    },

    // Phone Key Changed
    phoneKeyChanged(data) {
      this.data.phone.key = data.key;
      this.data.phone.limit = data.limit;
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `admins/${this.id}`
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.image;

          this.data.name = result.username;
          this.data.email = result.email;

          this.data.phone = {
            number: result.mobile,
            key: result.phone_code
          };
          this.data.role = result.role;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
          this.noData = true;
          this.loading = false;
        });
    },

    // Submit
    submit() {
      this.$refs.adminsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("image", this.data.avatar.image);
          }

          data.append("username", this.data.name);
          data.append("phone_code", this.data.phone.key);
          data.append("mobile", this.data.phone.number);
          data.append("email", this.data.email);
          data.append("role_id", this.data.role.id);

          this.data.password && data.append("password", this.data.password);
          // this.data.passwordConfirmation &&
          //   data.append(
          //     "password_confirmation",
          //     this.data.passwordConfirmation
          //   );

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `admins/${this.id}`;
          } else {
            url = "admins";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: url,
            data: data
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message
              });
              this.$router.push("/admins/show-all");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }
  },

  computed: {
    ...mapGetters({
      lang: "lang_module/lang"
    }),

    editMode() {
      return !!this.id;
    }
  },

  async mounted() {
    this.canEdit = this.$permission.allowed("admins/edit");
    this.canDelete = this.$permission.allowed("admins/delete");
    this.canAdd = this.$permission.allowed("admins/add");
    this.canShow = this.$permission.allowed("admins/show");
    this.canShowAll = this.$permission.allowed("admins/show-all");

    if (this.id) {
      if (!this.canEdit) {
        if (!this.canShow) {
          this.getEditData();
        }
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    } else if (this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    }
  }
};
</script>

<style lang="scss" scoped></style>
