<template>
  <div :class="col ? `col-md-${col}` : ''">
    <div class="flagged_phone_content_wrapper">
      <!-- Start:: Phone Input -->
      <div class="input_wrapper">
        <!-- class="my-2" -->
        <v-text-field
          type="number"
          @keypress="preventMinus"
          :label="placeholder"
          :value="value"
          @blur="validateInput(value)"
          @input="updateValue($event)"
          :required="required"
        ></v-text-field>
        <!-- <transition name="fadeIn">
          <p class="validationErr" v-if="showAlert">{{ validationMessage }}</p>
        </transition> -->
      </div>
      <!-- End:: Phone Input -->
      <!-- Start:: Flag & Country Key -->
      <div class="position-relative my-auto">
        <!-- ********** Start:: Selected Flag & Key ********** -->
        <button
          type="button"
          class="selected_flag_wrapper"
          @click.stop="toggleCountriesKeysMenu"
          v-if="selectedCountry"
        >
          <span class="selected_country_key">
            {{ selectedCountry.key }}
          </span>
          <img
            @error="imageError"
            class="selected_country_flg"
            :src="selectedCountry.flag"
            alt=""
            width="30"
            height="22"
          />
        </button>
        <!-- ********** End:: Selected Flag & Key ********** -->

        <!-- ********** Start:: Flags & Keys List ********** -->
        <transition name="fadeInUp">
          <ul class="keys_and_flags_list" v-if="countriesKeysMenuIsOpen">
            <li
              v-for="item in countriesKeys"
              :key="item.id"
              @click.stop="selectKey(item)"
              class="list_item"
            >
              <span class="country_key">
                {{ item.key }}
              </span>
              <img
                @error="imageError"
                class="country_flg"
                :src="item.flag"
                alt=""
                width="30"
                height="22"
              />
            </li>
          </ul>
        </transition>
        <!-- ********** End:: Flags & Keys List ********** -->
      </div>
      <!-- End:: Flag & Country Key -->
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseCountryFlagPhoneInput",

  props: {
    // ====== General Inputs Props
    value: {
      required: true,
    },
    placeholder: {
      required: true,
      type: String,
    },
    col: {
      required: false,
      type: String,
    },
    preSelectedPhoneCode: {
      required: false,
      // type: String,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    only: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // Validation Alert
      showAlert: false,
      validationMessage: "error",

      countriesKeys: [],

      // Start:: control Countries Keys Menu Data
      countriesKeysMenuIsOpen: false,
      // End:: control Countries Keys Menu Data

      // Start:: Selected Country Data
      selectedCountry: null,
      // End:: Selected Country Data

      // Start:: Front End Input Validation
      frontEndInputValidation: {
        inputValue: [(val) => (val || "").length > 0 || this.validationHint],
      },
      // End:: Front End Input Validation
    };
  },

  methods: {
    imageError(event) {
      event.target.src = require("@/assets/media/images/Icons/no-data.svg");
    },

    // Start:: Update Input Value
    updateValue(e) {
      this.$emit("input", e);
    },
    // End:: Update Input Value

    // Start:: Toggle Countries Keys Menu
    toggleCountriesKeysMenu() {
      this.countriesKeysMenuIsOpen = !this.countriesKeysMenuIsOpen;
    },
    // End:: Toggle Countries Keys Menu

    // Start:: Update Selected Country Key Value
    updateSelectedCountryKeyValue() {
      this.$emit("changeKey", {
        key: this.selectedCountry.key,
        limit: this.selectedCountry.limit,
      });
    },
    // End:: Update Selected Country Key Value

    // Start:: Select Country Key
    selectKey(country) {
      this.selectedCountry = country;
      this.updateSelectedCountryKeyValue();
      this.toggleCountriesKeysMenu();
    },
    // End:: Select Country Key

    validateInput(value) {
      let valid = true;

      if (!value) {
        this.validationMessage = this.$t("validation.empty");
        valid = false;
      }

      this.showAlert = !valid;
    },

    getCountryKeys() {
      this.axios({
        method: "GET",
        url: `countries_without_pagination`,
      })
        .then((res) => {
          if (this.only) {
            this.countriesKeys = res.data.data
              .filter((opt) => opt.phone_code == "971")
              .map((item) => {
                return {
                  id: item.id,
                  flag: item.flag,
                  key: item.phone_code,
                  limit: item.phone_number_limit,
                };
              });
          } else {
            this.countriesKeys = res.data.data.map((item) => {
              return {
                id: item.id,
                flag: item.flag,
                key: item.phone_code,
                limit: item.phone_number_limit,
              };
            });
          }

          // ********** Start:: Set Initial Selected Key **********

          if (this.preSelectedPhoneCode) {
            this.selectedCountry =
              this.countriesKeys &&
              this.countriesKeys.find(
                (country) => country.key == this.preSelectedPhoneCode
              );
          } else {
            this.selectedCountry = this.countriesKeys[0];
          }
          this.updateSelectedCountryKeyValue();
          // ********** End:: Set Initial Selected Key **********
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    // Start:: Fire Methods
    this.getCountryKeys();
    window.addEventListener("click", () => {
      this.countriesKeysMenuIsOpen = false;
    });
    // End:: Fire Methods
  },
};
</script>
