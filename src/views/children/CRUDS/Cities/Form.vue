<template>
  <div class="form countryForm custom_card">
    <Breadcrumb :items="items" />
    <ValidationObserver ref="citiesForm" @submit.prevent="submit">
      <div class="row mt-5">
        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.name') + $t('inArabic')"
          class="col-lg-6"
          rules="required|min:2|max:250"
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
          class="col-lg-6"
          rules="required|min:2|max:250"
        >
          <base-input
            @keypress="isEnglish"
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
          :name="$t('labels.country')"
          class="col-lg-6"
          rules="required"
        >
          <base-select-input
            v-model="data.country"
            getUrl="countries_without_pagination"
            :placeholder="$t('labels.country')"
          ></base-select-input>
          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>
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
          @click="handleBack('/cities/show-all')"
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
          text: this.$t("breadcrumb.cities.title"),
          disabled: false,
          href: "/cities/show-all",
        },
        {
          text: this.$t(`breadcrumb.cities.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Loading
      loading: false,

      data: {
        ar: {
          name: null,
        },
        en: {
          name: null,
        },
        country: null,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    getEditData() {
      if (this.editMode) {
        this.axios({
          method: "GET",
          url: `cities/${this.id}`,
        })
          .then((res) => {
            this.data = {
              ar: res.data.data.ar,
              en: res.data.data.en,
              country: res.data.data.country,
            };
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    submit() {
      this.$refs.citiesForm.validate().then((d) => {
        if (d) {
          this.loading = true;
          // Create FormData
          const data = new FormData();

          data.append("ar[name]", this.data.ar.name);

          data.append("en[name]", this.data.en.name);

          data.append("country_id", this.data.country.id);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `cities/${this.id}`;
          } else {
            url = "cities";
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
              this.$router.push("/cities/show-all");
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
  },

  computed: {
    editMode() {
      return !!this.id;
    },
  },

  async mounted() {
    this.canEdit = this.$permission.allowed("cities/edit");
    this.canDelete = this.$permission.allowed("cities/delete");
    this.canAdd = this.$permission.allowed("cities/add");
    this.canShow = this.$permission.allowed("cities/show");
    this.canShowAll = this.$permission.allowed("cities/show-all");

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
