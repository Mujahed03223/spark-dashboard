<template>
  <div class="form countryForm custom_card">
    <Breadcrumb :items="items" />
    <ValidationObserver ref="formCountries" @submit.prevent="submit">
      <div class="row">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('labels.flag')"
          class="d-block my-auto mt-5 mb-3"
          style="width: 100%"
          :rules="`${data.avatar.preview ? '' : 'required'}`"
        >
          <v-file-input
            @change="uploadImage($event, 'avatar')"
            v-model="data.avatar.image"
            class="d-none"
            :name="$t('labels.flag')"
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
            :name="$t('labels.name') + $t('inArabic')"
            type="text"
            :placeholder="$t('labels.name') + $t('inArabic')"
            v-model="data.ar.name"
            @input="addDataLocalStorage"
            @keypress="isArabic"
          />
          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.name') + $t('inEnglish')"
          class="col-lg-6"
          rules="required|min:2|max:250"
        >
          <base-input
            :name="$t('labels.name') + $t('inEnglish')"
            type="text"
            :placeholder="$t('labels.name') + $t('inEnglish')"
            v-model="data.en.name"
            @input="addDataLocalStorage"
            @keypress="isEnglish"
          />
          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.phone_length')"
          class="col-lg-6"
          rules="required"
        >
          <base-input
            :name="$t('labels.phone_length')"
            type="number"
            :placeholder="$t('labels.phone_length')"
            v-model="data.phone_number_limit"
            @input="addDataLocalStorage"
          />
          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <!-- Start:: PhoneCode -->
        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.phonecode')"
          class="col-lg-6"
          rules="required"
        >
          <base-input
            :name="$t('labels.phonecode')"
            type="number"
            @keypress="preventMinus"
            :placeholder="$t('labels.phonecode')"
            @input="addDataLocalStorage"
            v-model="data.phone_code"
          />

          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <!-- End:: PhoneCode -->
      </div>
      <div class="button_section d-flex gap-1 justify-content-center mt-10">
        <v-btn
          type="submit"
          @click="submit"
          :disabled="loading"
          :loading="loading"
          class="submit_btn"
        >
          {{ $t("save") }}
        </v-btn>
        <v-btn
          type="button"
          class="back_btn"
          @click="handleBack('/countries/show-all')"
        >
          {{ $t("back") }}
          <span
            :class="
              $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
            "
          ></span>
        </v-btn>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
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
          text: this.$t("breadcrumb.countries.title"),
          disabled: false,
          href: "/countries/show-all",
        },
        {
          text: this.$t(`breadcrumb.countries.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Loading
      loading: false,

      data: {
        avatar: {
          preview: null,
          image: null,
        },

        ar: {
          name: null,
        },
        en: {
          name: null,
        },
        phone_number_limit: null,
        phone_code: null,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),
    addDataLocalStorage() {
      localStorage.setItem("country_data", JSON.stringify(this.data));
    },

    getDataLocalStorage() {
      if (localStorage.getItem("country_data")) {
        this.data = JSON.parse(localStorage.getItem("country_data"));
      }
    },

    getEditData() {
      if (this.editMode) {
        this.axios({
          method: "GET",
          url: `countries/${this.id}`,
        })
          .then((res) => {
            this.data = {
              avatar: {
                image: null,
                preview: res.data.data.flag,
              },

              ar: res.data.data.ar,
              en: res.data.data.en,

              phone_number_limit: res.data.data.phone_number_limit,
              phone_code: res.data.data.phone_code,
            };
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    submit() {
      this.$refs.formCountries.validate().then((d) => {
        if (d) {
          this.loading = true;
          localStorage.removeItem("country_data");

          // Create FormData
          const data = new FormData();
          if (this.data.avatar.image) {
            data.append("flag", this.data.avatar.image);
          }

          data.append("ar[name]", this.data.ar.name);
          data.append("en[name]", this.data.en.name);

          data.append("phone_code", this.data.phone_code);
          data.append("phone_number_limit", this.data.phone_number_limit);

          if (this.id) {
            data.append("_method", "PUT");
          }

          let url = "";
          if (this.id) {
            url = `countries/${this.id}`;
          } else {
            url = "countries";
          }

          let message = this.id
            ? this.$t("editSuccess")
            : this.$t("addSuccess");

          // =============== Start:: Add / Edit ===============

          this.axios({
            method: "POST",
            url: url,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                displayMode: 2,
                title: this.$t("success"),
                message: message,
              });
              this.loading = false;
              this.$router.push("/countries/show-all");
            })
            .catch((err) => {
              this.loading = false;
              this.$iziToast.error({
                displayMode: 2,
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

    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  async mounted() {
    this.canEdit = this.$permission.allowed("countries/edit");
    this.canDelete = this.$permission.allowed("countries/delete");
    this.canAdd = this.$permission.allowed("countries/add");
    this.canShow = this.$permission.allowed("countries/show");
    this.canShowAll = this.$permission.allowed("countries/show-all");

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
  },
};
</script>
