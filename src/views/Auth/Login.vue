<template>
  <div class="login">
    <div class="container">
      <div class="form">
        <div class="form">
          <div class="d-flex flex-column">
            <!-- Top Logo :D -->

            <div class="logo text-center mb-5">
              <router-link to="/">
                <img
                  width="120"
                  v-if="current_theme == 'dark'"
                  src="@/assets/media/images/logo/logo_white.png"
                />
                <img width="120" v-else src="@/assets/media/images/logo/logo.png" />
              </router-link>
            </div>
            <div class="text-info mb-5">
              <h3 class="text-start">{{ $t("welcomeBack") }}</h3>
              <p class="text-start">{{ $t("signInToAccessDashboard") }}</p>
            </div>
            <ValidationObserver ref="formLogin" @submit.prevent="submit">
              <div class="row" @keypress="handleKeypress">
                <!-- Start title -->
                <ValidationProvider
                  v-slot="{ errors }"
                  class="mb-5"
                  :name="$t('labels.email')"
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

                <ValidationProvider
                  class="mb-5"
                  v-slot="{ errors }"
                  :name="$t('labels.password')"
                  rules="required|min:3|max:250"
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
              </div>
              <div class="button_wrapper center big">
                <v-btn
                  @click="submit"
                  :disabled="loading"
                  :loading="loading"
                  class="center big"
                >
                  {{ $t("BUTTONS.login") }}
                </v-btn>
              </div>
            </ValidationObserver>
            <button @click="switchLocale()">
              <i class="fal fa-globe"></i>
            </button>
          </div>
        </div>

        <div class="img-holder">
          <img
            class="m-auto"
            src="@/assets/media/images/logo/logo_white.png"
            alt="login"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // Loading
      loading: false,

      data: {
        email: null,
        password: null,
      },
    };
  },

  computed: {
    ...mapGetters({
      current_theme: "theme_module/current_theme",
    }),
  },

  methods: {
    handleKeypress(event) {
      if (event.key === "Enter") {
        this.submit();
      }
    },

    switchLocale() {
      this.$store.dispatch("lang_module/switchLang");
    },

    submit() {
      this.$refs.formLogin.validate().then((d) => {
        if (d) {
          this.loading = true;

          this.axios({
            method: "POST",
            url: "login",
            data: this.data,
          })
            .then((res) => {
              this.loading = false;
              this.$iziToast.success({
                displayMode: 2,
                title: this.$t("validation.success"),
              });

              let user = {
                userId: res.data.data.id,
                token: res.data.data.token,
                userType: res.data.data.user_type,
                username: res.data.data.name,
                userImage: res.data.data.image,
                userPhone: res.data.data.phone,
                userEmail: res.data.data.email,
                userGender: res.data.data.gender,
                userPermissions:
                  res.data.data.role &&
                  res.data.data.role.permission.map((el) => el.name),
              };
              this.$store.dispatch("auth_module/logIn", user);
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              this.$iziToast.error({
                displayMode: 2,
                title: this.$t("validation.error"),
                message: err.response?.data?.message || err.response?.data?.messages || "Network error - backend server may be unreachable",
              });
            });
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
};
</script>

<style lang="scss">
.login {
  .v-input__slot {
    margin-bottom: 20px;
    // label {
    //   color: #fff !important;
    // }
    // background: #3b4148 !important;
    // border-color: #3b4148 !important;
  }
}

.login {
  // background: url("../../assets/media/images/bg/login.webp");
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .top_logo {
    img {
      height: 100px;
    }
  }

  .form {
    height: 80vh;
    border-radius: 20px;
    flex-wrap: wrap;
    display: flex;
    overflow: hidden;
    filter: drop-shadow(0px 4px 25px rgba(209, 209, 209, 0.25));

    .form {
      margin: 0;
      padding: 10px;
      background: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
      width: 100%;

      > div {
        width: 80%;
      }

      @media (min-width: 992px) {
        width: 50%;
      }

      .text-info {
        h3 {
          font-size: 24px;
        }

        p {
          font-size: 16px;
          color: #202020;
        }
      }
    }

    .img-holder {
      background: var(--main);
      display: flex;
      align-items: center;
      justify-content: flex-end;

      img {
        // height: 80vh;
        max-height: 14vh;
      }

      width: 50%;

      @media (max-width: 992px) {
        display: none;
      }
    }
  }
}

// body[dir="rtl"] {
//   .login {
//     .img-holder {
//       justify-content: flex-start;
//     }
//   }
// }
</style>
