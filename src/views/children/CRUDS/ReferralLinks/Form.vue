<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form custom_card fadeIn" v-else>
      <ValidationObserver ref="referralLinksForm" @submit.prevent="submit">
        <div class="row">
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.name')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.name')"
              type="text"
              :placeholder="$t('labels.name')"
              v-model="data.name"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- Start:: type -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.type')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              :name="$t('labels.type')"
              v-model="data.type"
              :static="true"
              :staticItems="typesList"
              :placeholder="$t('labels.type')"
            ></base-select-input>
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- End:: type -->

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.value')"
            class="col-lg-6"
            :rules="`required|min_value:1|${
              data.type && data.type.id == 'percentage' ? 'max_value:100' : ''
            }`"
          >
            <base-input
              :name="$t('labels.value')"
              type="number"
              :placeholder="$t('labels.value')"
              v-model="data.value"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.city')"
            class="col-lg-6"
            rules="required"
          >
            <base-select-input
              v-model="data.city"
              getUrl="cities-with-no-pag"
              :placeholder="$t('labels.city')"
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
        </div>
        <!-- <div class="button_wrapper center d-flex gap-1 justify-content-center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
            class="submit_btn"
          >
            {{ $t("submit") }}
          </v-btn>
          <v-btn type="button" class="back_btn" @click="handleBack">
            {{ $t("back") }}
            <span class="fas fa-arrow-left"></span>
          </v-btn>
        </div> -->
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
          text: this.$t("breadcrumb.referralLinks.title"),
          disabled: false,
          href: "/referral-links/show-all",
        },
        {
          text: this.$t(`breadcrumb.referralLinks.${this.id ? "edit" : "add"}`),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        name: null,
        type: null,
        city: null,
        value: null,
      },
      noData: false,

      typesList: [
        {
          id: "amount",
          name: this.$t("labels.amount"),
        },
        {
          id: "percentage",
          name: this.$t("labels.percentage"),
        },
      ],
    };
  },

  methods: {
    // Main Edit Data
    getEditData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `referral-link/${this.id}`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.name = result.marketer;
          this.data.city = result.city;
          this.data.type = result.type;
          this.data.value = result.value;
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
      this.$refs.referralLinksForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          data.append("name", this.data.name);

          // if (this.data.type) {
          data.append("type", this.data.type.id || this.data.type);
          // }
          data.append("value", this.data.value);
          data.append("city_id", this.data.city.id);

          if (this.id) {
            data.append("_method", "PUT");
          }
          let url = "";
          if (this.id) {
            url = `update-referral-link/${this.id}`;
          } else {
            url = "create-referral-link";
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
              this.$router.push("/referral-links/show-all");
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

  async mounted() {
    this.canEdit = this.$permission.allowed("update-referral-links");
    this.canDelete = this.$permission.allowed("delete-referral-links");
    this.canAdd = this.$permission.allowed("create-referral-links");
    this.canShow = this.$permission.allowed("show-referral-links");
    this.canShowAll = this.$permission.allowed("index-referral-links");

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

<style lang="scss" scoped></style>
