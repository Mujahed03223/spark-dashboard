<template>
  <div :class="col ? `col-md-${col}` : ''">
    <!-- Start:: Text || Number || Tel || Email Input -->
    <div
      :class="classes"
      class="input_wrapper"
      v-if="
        type == 'text' ||
        type == 'number' ||
        type == 'tel' ||
        type == 'email' ||
        type == 'url'
      "
    >
      <v-text-field
        step="any"
        :type="type"
        :disabled="disabled"
        :label="placeholder"
        :value="value"
        @blur="validateInput(value)"
        v-on:keyup.enter="updateValue($event, 'enter')"
        @input="updateValue($event, 'input')"
        @keypress="keypress($event)"
        :required="required"
        :append-icon="icon"
      ></v-text-field>
      <!-- :prepend-icon="icon" -->

      <!-- Validation -->
      <transition name="fadeIn">
        <p class="validationErr" v-if="showAlert">{{ validationMessage }}</p>
      </transition>
    </div>
    <!-- End:: Text || Number || Tel || Email Input -->

    <!-- Start:: Password Input -->
    <div class="input_wrapper" :class="classes" v-else-if="type == 'password'">
      <v-text-field
        :append-icon="passwordIsVisible ? 'mdi-eye' : 'mdi-eye-off'"
        :type="passwordIsVisible ? 'text' : 'password'"
        :label="placeholder"
        :required="required"
        autocomplete="off"
        :value="value"
        @blur="validateInput(value)"
        @input="updateValue($event, 'input')"
        @click:append="passwordIsVisible = !passwordIsVisible"
      ></v-text-field>
      <!-- Validation -->
      <transition name="fadeIn">
        <p class="validationErr" v-if="showAlert">{{ validationMessage }}</p>
      </transition>
    </div>
    <!-- End:: Password Input -->

    <!-- Start:: Textarea Input -->
    <div class="input_wrapper" :class="classes" v-else-if="type == 'textarea'">
      <v-textarea
        :label="placeholder"
        :value="value"
        @blur="
          validateInput(value);
          updateValue($event, 'blur');
        "
        @input="updateValue($event, 'input')"
        @keypress="keypress($event)"
        :required="required"
        :rows="rows"
      ></v-textarea>
      <transition name="fadeIn">
        <p class="validationErr" v-if="showAlert">{{ validationMessage }}</p>
      </transition>
    </div>

    <template v-else-if="type == 'ckeditor'">
      <label class="v-label">{{ placeholder }}</label>
      <ckeditor
        :class="classes"
        @input="updateValue($event, 'input')"
        :value="value"
      ></ckeditor>
    </template>
    <!-- End:: Textarea Input -->
  </div>
</template>

<script>
export default {
  name: "BaseInput",

  props: {
    // ====== General Inputs Props
    value: {
      required: true,
    },
    type: {
      required: true,
      type: String,
    },
    disabled: {
      required: false,
    },
    classes: {
      required: false,
      type: String,
    },
    icon: {
      type: String,
    },
    placeholder: {
      required: false,
      type: String,
    },
    col: {
      required: false,
      type: String,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },

    // ====== Textarea Input Props
    rows: {
      required: false,
      type: String,
      default: "4",
    },
  },

  data() {
    return {
      // Validation Alert
      showAlert: false,
      validationMessage: "errer",

      // Start:: Password Visibility Data
      passwordIsVisible: false,
      // End:: Password Visibility Data
    };
  },

  methods: {
    updateValue(e, input) {
      this.$emit(input, e);
    },

    keypress(e) {
      this.$emit("keypress", e);
    },

    validateInput(value) {
      this.$emit("blur", value);

      if (this.required) {
        let valid = true;
        if (this.type == "email") {
          this.validationMessage = this.$t("validation.email");
          valid = this.helper_validEmail(value);
        } else {
          if (!value) {
            this.validationMessage = this.$t("validation.empty");
            valid = false;
          }
        }

        this.showAlert = !valid;
      }
    },
  },
};
</script>
