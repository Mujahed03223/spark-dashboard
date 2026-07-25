<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="ambassadorsForm" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto"
            style="width: 100%"
            :rules="`${data.avatar.preview ? '' : 'required'}`"
          >
            <!-- @change="sentImage($event)" -->
            <v-file-input
              :disabled="btnLoading"
              :loading="btnLoading"
              @change="uploadImage($event, 'avatar')"
              v-model="data.avatar.image"
              class="d-none"
              :name="$t('labels.image')"
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
            :name="$t('labels.fullname')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.fullname')"
              type="text"
              :placeholder="$t('labels.fullname')"
              v-model="data.full_name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

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
            :rules="`${editMode ? '' : 'required'}|min:6|max:250`"
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
          <!-- End Password -->

          <!-- Start Confirm Password -->
          <ValidationProvider
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
          </ValidationProvider>
          <!-- End Confirm Password -->

          <div class="col-12"></div>
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
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
export default {
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
          text: this.$t("breadcrumb.ambassadors.title"),
          disabled: false,
          href: "/ambassadors/show-all",
        },
        {
          text: this.$t(`breadcrumb.ambassadors.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      loadingRole: false,
      btnLoading: false,
      loadingCity: false,
      data: {
        avatar: {
          preview: null,
          image: null,
        },
        full_name: null,
        email: null,
        password: null,
        passwordConfirmation: null,
      },
      noData: false,
    };
  },

  methods: {
    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `ambassadors/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.national_image;

          this.data.email = result.email;
          this.data.full_name = result.full_name;
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
      this.$refs.ambassadorsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("national_image", this.data.avatar.image);
          }

          data.append("full_name", this.data.full_name);

          data.append("email", this.data.email);
          if (this.editMode) {
            if (this.data.password && this.data.passwordConfirmation) {
              data.append("password", this.data.password);
              data.append(
                "password_confirmation",
                this.data.passwordConfirmation
              );
            }
          } else {
            data.append("password", this.data.password);
            data.append(
              "password_confirmation",
              this.data.passwordConfirmation
            );
          }

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `ambassadors/${this.id}`;
          } else {
            url = "ambassadors";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");
          this.axios({
            method: "POST",
            url: url,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/ambassadors/show-all");
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
    editMode() {
      return !!this.id;
    },
  },
  async mounted() {
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>

<style lang="scss" scoped></style>
