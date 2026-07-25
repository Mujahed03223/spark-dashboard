<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <noData v-if="noData" />
    <div class="form countryForm fadeIn" v-else>
      <ValidationObserver ref="updatePassword" @submit.prevent="submit">
        <div class="row">
          <!-- Start Password -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.oldPassword')"
            class="col-lg-6"
            rules="required|min:6|max:250"
          >
            <base-input
              :name="$t('labels.oldPassword')"
              type="password"
              :placeholder="$t('labels.oldPassword')"
              v-model="data.oldPassword"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.nPassword')"
            class="col-lg-6"
            rules="required|min:6|max:250"
          >
            <base-input
              :name="$t('labels.nPassword')"
              type="password"
              :placeholder="$t('labels.nPassword')"
              v-model="data.nPassword"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.passwordConfirm')"
            class="col-lg-6"
            :rules="`required|confirmed:${$t('labels.nPassword')}`"
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
          <!-- End Password -->
        </div>
        <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
        <!-- <div class="button_section d-flex gap-1 justify-content-center mt-10">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
            class="submit_btn"
          >
            {{ $t("save") }}
          </v-btn>
          <v-btn type="button" class="back_btn" @click="handleBack">
            {{ $t("back") }}
            <span
              :class="
                $i18n.locale === 'ar'
                  ? 'fas fa-arrow-left'
                  : 'fas fa-arrow-right'
              "
            ></span>
          </v-btn>
        </div> -->
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseCountryFlagPhoneInput from "@/components/Forms/BaseCountryFlagPhoneInput.vue";

export default {
  components: { BaseCountryFlagPhoneInput },

  data() {
    return {
      // Btn Loading
      loading: false,
      btnLoading: false,
      loadingCity: false,
      data: {
        oldPassword: null,
        nPassword: null,
        passwordConfirmation: null,
      },
      noData: false,
      // Fixed Data
      cityItems: [],
    };
  },

  methods: {
    // Submit
    submit() {
      this.$refs.updatePassword.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();
          data.append("old_password", this.data.oldPassword);
          data.append("password", this.data.nPassword);
          data.append("password_confirmation", this.data.passwordConfirmation);

          // data.append("_method", "PUT");

          let message = this.$t("editSuccess");

          this.axios({
            method: "POST",
            url: "update_password",
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.$router.push("/");
              this.btnLoading = false;
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
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
    ...mapGetters({
      lang: "lang_module/lang",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
