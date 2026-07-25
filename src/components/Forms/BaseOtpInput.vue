<template>
  <div :class="col ? `col-md-${col}` : ''">
    <div class="input_wrapper" dir="ltr">
      <v-otp-input
        type="text"
        :length="otpLength"
        :value="value"
        @input="updateValue($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseOtpInput",

  props: {
    // ====== General Inputs Props
    otpLength: {
      required: true,
      type: String,
    },
    value: {
      required: true,
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
  },

  methods: {
    updateValue(e) {
      this.$emit("input", e);
    },
  },
};
</script>
