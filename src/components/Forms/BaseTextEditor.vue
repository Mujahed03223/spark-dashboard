<template>
  <div :class="col ? `col-md-${col}` : ''">
    <div class="input_wrapper text_editor">
      <label class="custom_input_label">
        {{ placeholder }}
      </label>
      <ckeditor 
        :config="editorConfig"
        :value="value"
        @input="updateValue($event)"
        :required="required"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "BaseTextEditor",

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
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      editorData: null,
      editorConfig: {
        editorplaceholder : "Start typing here...",
        toolbarGroups: [{
          "name": "basicstyles",
          "groups": ["basicstyles"]
        },
        {
          "name": "links",
          "groups": ["links"]
        },
        {
          "name": "paragraph",
          "groups": ["list", "blocks"]
        },
        {
          "name": "insert",
          "groups": ["insert"]
        },
        {
          "name": "styles",
          "groups": ["styles"]
        },
      ],
      },
    }
  },

  methods: {
    updateValue(e) {
      this.$emit("input", e);
    },
  },
}
</script>