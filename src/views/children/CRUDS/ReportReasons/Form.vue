<template>
  <div>
    <Breadcrumb :items="items" />
    <Loader v-if="loading && editMode"></Loader>
    <div v-else>
      <noData v-if="noData" />
      <div class="form countryForm custom_card" v-else>
        <ValidationObserver ref="formCancelReason" @submit.prevent="submit">
          <div class="row">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.title') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isArabic"
                :name="$t('labels.title') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.title') + $t('inArabic')"
                v-model="data.ar.title"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.title') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isEnglish"
                :name="$t('labels.title') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.title') + $t('inEnglish')"
                v-model="data.en.title"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.desc') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isArabic"
                :name="$t('labels.desc') + $t('inArabic')"
                type="textarea"
                :placeholder="$t('labels.desc') + $t('inArabic')"
                v-model="data.ar.desc"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.desc') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                @keypress="isEnglish"
                type="textarea"
                :name="$t('labels.desc') + $t('inEnglish')"
                :placeholder="$t('labels.desc') + $t('inEnglish')"
                v-model="data.en.desc"
              />
              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <!-- Start:: user_type -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.user_type')"
              class="col-lg-6"
              rules="required"
            >
              <base-select-input
                v-model="data.user_type"
                :static="true"
                :name="$t('labels.user_type')"
                :staticItems="userTypes"
                :placeholder="$t('labels.user_type')"
              ></base-select-input>

              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <!-- End:: user_type -->

            <!-- Start:: user_type -->
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.when_trip_status')"
              class="col-lg-6"
              rules="required"
            >
              <base-select-input
                v-model="data.when_trip_status"
                :static="true"
                :name="$t('labels.when_trip_status')"
                :staticItems="whenTripStatus"
                :placeholder="$t('labels.when_trip_status')"
              ></base-select-input>

              <span class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <!-- End:: user_type -->
          </div>
          <!-- Start :: Checks -->
          <div class="col-lg-12 py-0">
            <div class="divider">
              <h4>{{ $t("labels.status") }}</h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <!-- End :: Checks -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.is_active')"
            class="col-md-6"
            rules="required"
          >
            <div>
              <div class="input-title">
                <h4>{{ $t("labels.active") }}</h4>
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
          </ValidationProvider>

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
          <!-- <base-button type="submit" @click="submit" class="center"></base-button> -->
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // components: { MapWrite },
  props: ["id"],

  data() {
    return {
      noData: false,
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.report_reasons.title"),
          disabled: false,
          href: "/report_reasons/show-all",
        },
        {
          text: this.$t(
            `breadcrumb.report_reasons.${this.id ? "edit" : "add"}`
          ),
          disabled: true,
          href: "",
        },
      ],
      // Loading

      loading: false,
      btnLoading: false,

      showArea: false,

      data: {
        ar: {
          title: null,
          desc: null,
        },
        en: {
          title: null,
          desc: null,
        },

        is_active: false,
        user_type: null,
        when_trip_status: null,
      },
      userTypes: [
        {
          id: "rider",
          name: this.$t("rider"),
        },
        {
          id: "partner",
          name: this.$t("partner"),
        },
      ],
      whenTripStatus: [
        {
          id: "pre_ride",
          name: this.$t("pre_ride"),
        },
        {
          id: "in_ride",
          name: this.$t("in_ride"),
        },
        {
          id: "post_ride",
          name: this.$t("post_ride"),
        },
      ],
    };
  },

  methods: {
    getEditData() {
      if (this.editMode) {
        this.noData = false;
        this.loading = true;
        this.axios({
          method: "GET",
          url: `complaint-reason/${this.id}`,
        })
          .then((res) => {
            this.loading = false;
            this.data = {
              ar: {
                title: res.data.data.ar.title,
                desc: res.data.data.ar.desc,
              },
              en: {
                title: res.data.data.en.title,
                desc: res.data.data.en.desc,
              },
              is_active: res.data.data.is_active,
              user_type: this.userTypes.find(
                (type) => type.id == res.data.data.user_type
              ),
              when_trip_status: this.whenTripStatus.find(
                (type) => type.id == res.data.data.when_trip_status
              ),
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
      } else {
        this.showArea = true;
      }
    },

    submit() {
      this.$refs.formCancelReason.validate().then((d) => {
        if (d) {
          this.btnLoading = true;
          const data = new FormData();
          data.append("ar[title]", this.data.ar.title);
          data.append("ar[desc]", this.data.ar.desc);
          data.append("en[title]", this.data.en.title);
          data.append("en[desc]", this.data.en.desc);

          data.append("user_type", this.data.user_type?.id);
          data.append("is_active", +this.data.is_active);

          data.append("when_trip_status", this.data.when_trip_status?.id);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `complaint-reason/${this.id}`;
          } else {
            url = "complaint-reason";
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
              this.btnLoading = false;
              this.$router.push("/report_reasons/show-all");
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
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

  computed: {
    editMode() {
      return !!this.id;
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
