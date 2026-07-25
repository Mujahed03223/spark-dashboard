<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="socialsForm" @submit.prevent="submit">
        <div class="row">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto"
            style="width: 100%"
            :rules="`${data.avatar.preview ? '' : 'required'}`"
          >
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
            :name="$t('labels.name') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.ar.title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
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
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.en.title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.ordering')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.ordering')"
              type="number"
              :placeholder="$t('labels.ordering')"
              v-model="data.ordering"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.link')"
            class="col-lg-6"
            rules="required"
          >
            <base-input
              :name="$t('labels.link')"
              type="text"
              :placeholder="$t('labels.link')"
              v-model="data.link"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <div class="col-lg-12">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.status") }}</h4>
              </h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.is_active')"
            class="col-4"
            rules="required"
          >
            <div>
              <div class="input-title">
                <h4>
                  {{ $t("labels.active", { name: $t("") }) }}
                </h4>
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
import { mapGetters } from "vuex";

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
          text: this.$t("breadcrumb.socials.title"),
          disabled: false,
          href: "/socials/show-all",
        },
        {
          text: this.$t(`breadcrumb.socials.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        avatar: {
          preview: null,
          image: null,
        },

        ar: {
          title: null,
        },
        en: {
          title: null,
        },
        ordering: null,
        link: null,
        is_active: false,
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
        url: `socials/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.avatar.preview = result.icon;

          this.data.ar.title = result.ar.title;
          this.data.en.title = result.en.title;

          this.data.ordering = result.ordering;
          this.data.link = result.link;
          this.data.is_active = result.status;
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
      this.$refs.socialsForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.avatar.image) {
            data.append("icon", this.data.avatar.image);
          }

          data.append("ar[title]", this.data.ar.title);
          data.append("en[title]", this.data.en.title);

          data.append("ordering", this.data.ordering);
          data.append("link", this.data.link);
          data.append("status", +this.data.is_active);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `socials/${this.id}`;
          } else {
            url = "socials";
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
              this.$router.push("/socials/show-all");
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
    ...mapGetters({
      lang: "lang_module/lang",
    }),

    editMode() {
      return !!this.id;
    },
  },
  mounted() {
    if (this.id) {
      this.getEditData();
    }
  },
};
</script>

<style lang="scss" scoped></style>
