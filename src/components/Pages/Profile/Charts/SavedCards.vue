<template>
  <div class="saved_cards_card_content_wrapper">
    <div class="card_title mb-4" @click="show = true">
      <i class="fa-solid fa-plus"></i>
    </div>

    <h3 class="h_3">شحن الرصيد</h3>

    <div class="cards mb-2">
      <img
        src="@/assets/media/images/Others/cards.png"
        alt="saved cards"
        width="250"
        height="190"
      />
    </div>

    <base-model :show="show" @close="show = false">
      <div class="chargePopup">
        <h3>شحن رصيد للمحفظه</h3>

        <div class="row">
          <form @submit.prevent="submit">
            <!-- Amount -->
            <base-input
              col="12"
              type="number"
              @keypress="preventMinus"
              :placeholder="this.$t('labels.amount')"
              :required="true"
              v-model="data.amount"
            />

            <!-- Charge Type -->
            <base-select-input
              col="12"
              v-model="data.charge_type"
              :static="true"
              :staticItems="chargeTypes"
              :placeholder="$t('labels.charge_type')"
            ></base-select-input>

            <base-button :loading="loading" class="center">{{
              $t("submit")
            }}</base-button>
          </form>
        </div>
      </div>
    </base-model>
  </div>
</template>

<script>
export default {
  name: "BalanceCard",

  props: ["id"],

  data() {
    return {
      // ===== Loading
      loading: false,

      // ===== Model
      show: false,

      data: {
        amount: null,
        charge_type: null,
      },
    };
  },

  methods: {
    submit() {
      this.loading = true;
      const data = new FormData();
      data.append("amount", this.data.amount);
      data.append("wallet_type", "balance");
      data.append("type", this.data.charge_type.value);

      this.axios({
        method: "POST",
        url: `/wallet/${this.id}`,
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("submitSuccess"),
          });
          this.$emit("chargeSubmited");
          this.show = false;
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.show = false;
          this.loading = false;
        });
    },
  },

  computed: {
    // walletTypes() {
    //   if (this.lang == "ar") {
    //     return [
    //       {
    //         id: 1,
    //         name: "Balance",
    //         value: "balance",
    //       },
    //       {
    //         id: 2,
    //         name: "Balance",
    //         value: "points",
    //       },
    //     ];
    //   } else {
    //     return [
    //       {
    //         id: 1,
    //         name: "رصيد",
    //         value: "balance",
    //       },
    //       {
    //         id: 2,
    //         name: "نقاط",
    //         value: "points",
    //       },
    //     ];
    //   }
    // },

    chargeTypes() {
      if (this.lang == "ar") {
        return [
          {
            id: 1,
            name: "Charge",
            value: "charge",
          },
          {
            id: 2,
            name: "Withdrawal",
            value: "withdrawal",
          },
        ];
      } else {
        return [
          {
            id: 1,
            name: "شحن",
            value: "charge",
          },
          {
            id: 2,
            name: "سحب",
            value: "withdrawal",
          },
        ];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chargePopup {
  background: #fff;
  padding: 15px;
  border-radius: 15px;
  text-align: center;

  h3 {
    margin-bottom: 20px;
  }
}

.saved_cards_card_content_wrapper {
  padding: 15px;
  background-color: var(--lightBg);
  border-radius: 20px;
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 6px;
  color: var(--mainText);
  position: relative;
  overflow: hidden;

  .coming_soon_overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(21, 50, 82, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .coming_soon_text {
      color: #edd70c;
    }
  }

  .card_title {
    position: absolute;
    top: 7px;
    left: 7px;
    align-self: flex-end;
    font-family: mediumArFont;
    background-color: var(--main);
    color: var(--white);
    padding: 5px 15px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
  }

  .cards {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 185px;
      height: 100px;
      object-fit: contain;
    }
  }

  button {
    color: var(--main);
    font-size: 15px;
  }
}
</style>
