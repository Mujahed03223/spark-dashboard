<template>
  <div :class="col ? `col-md-${col}` : ''">
    <div class="input_wrapper color_picker">
      <span class="custom_input_label"> {{ placeholder }} </span>
      <label
        class="custom_color_preview"
        :for="uniqueInputId"
        :style="{ background: labelBackground }"
      ></label>
      <input
        :id="uniqueInputId"
        type="color"
        :value="value"
        @input="updateValue($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseColorPicker",

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
  },

  data() {
    return {
      // Start:: Unique Input Id
      uniqueInputId: `color_picker_${Date.now()}`,
      // End:: Unique Input Id

      // Start:: Label Background Color
      labelBackground: this.value,
      // End:: Label Background Color
    };
  },

  watch: {
    value(newVal) {
      this.labelBackground = newVal;
    },
  },

  methods: {
    updateValue(e) {
      console.log(e.target.value);
      this.$emit("input", e.target.value);
    },
  },
};
</script>
