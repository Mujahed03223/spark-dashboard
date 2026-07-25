<template>
  <div class="form walletForm custom_card">
    <Breadcrumb :items="items" />
    <ValidationObserver ref="walletsForm" @submit.prevent="submit">
      <div class="row mt-5">
        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.monyAmount')"
          class="col-lg-6"
          rules="required"
        >
          <base-input
            :name="$t('labels.monyAmount')"
            type="number"
            @keypress="preventMinus"
            :placeholder="$t('labels.monyAmount')"
            v-model="data.amount"
          />
          <span v-if="errors[0]" class="error--text d-inline-block">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('labels.moatamer')"
          class="col-lg-6"
          rules="required"
        >
          <base-select-input
            v-model="data.moatamer"
            getUrl="moatmrs-without-pagination"
            :placeholder="$t('labels.moatamer')"
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
        <v-btn type="button" class="back_btn" @click="handleBack">
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
          text: this.$t("breadcrumb.wallets.title"),
          disabled: false,
          href: "/wallets/show-all",
        },
        {
          text: this.$t("breadcrumb.wallets.charge"),
          disabled: true,
          href: "",
        },
      ],
      // Loading
      loading: false,

      data: {
        amount: null,
        moatamer: null,
      },
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    submit() {
      this.$refs.walletsForm.validate().then((d) => {
        if (d) {
          this.loading = true;
          // Create FormData
          const data = new FormData();

          data.append("amount", this.data.amount);

          data.append("moatmer_id", this.data.moatamer.id);

          let message = this.$t("chargeSuccess");

          // =============== Start:: Add / Edit ===============

          this.axios({
            method: "POST",
            url: `charge-wallet`,
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                displayMode: 2,
                title: this.$t("success"),
                message: message,
              });
              this.loading = false;
              this.$router.push("/wallets/show-all");
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
    this.canAdd = this.$permission.allowed("charge-wallet");

    if (this.canAdd) {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
