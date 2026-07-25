<template>
  <div class="charge_wallet_card_content_wrapper">
    <div class="card_title mb-4" @click="show = true">
      <i class="fas fa-plus"></i>
    </div>

    <base-model :show="show" @close="show = false">
      <div class="chargePopup">
        <h3 class="text-center mb-7">{{ $t("labels.chargeWallet") }}</h3>

        <div class="row">
          <ValidationObserver ref="walletsForm" @submit.prevent="submit">
            <!-- Amount -->
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

            <div class="button_wrapper center">
              <v-btn
                type="submit"
                @click="submit"
                :disabled="loading"
                :loading="loading"
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </base-model>
  </div>
</template>

<script>
export default {
  name: "ChargeWalletCard",

  props: ["id", "getData"],

  data() {
    return {
      // ===== Loading
      loading: false,

      // ===== Model
      show: false,

      data: {
        amount: null,
      },
    };
  },

  methods: {
    submit() {
      this.$refs.walletsForm.validate().then((d) => {
        if (d) {
          this.loading = true;
          // Create FormData
          const data = new FormData();

          data.append("amount", this.data.amount);

          data.append("moatmer_id", this.id);

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
              this.show = false;
              this.getData();
            })
            .catch((err) => {
              this.$iziToast.error({
                displayMode: 2,
                title: this.$t("error"),
                message: err.response.data.message,
              });
              this.loading = false;
              this.show = false;
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

<style lang="scss" scoped>
.charge_wallet_card_content_wrapper {
  .card_title {
    // align-self: flex-end;
    font-family: mediumArFont;
    background-color: var(--main);
    color: var(--white);
    padding: 2px 10px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 15px;
  }
}
</style>
