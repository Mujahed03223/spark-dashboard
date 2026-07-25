<template>
  <div :class="col ? `col-md-${col}` : ''">
    <!-- Start:: Select Input -->
    <div class="input_wrapper select" :class="classes">
      <v-autocomplete
        :disabled="disabled"
        :chips="multiple"
        :loading="itemsLoading"
        :deletable-chips="multiple"
        :small-chips="multiple"
        :multiple="multiple"
        :items="isStatic ? _staticItems : items"
        item-text="name"
        item-value="id"
        :return-object="returnObject"
        :value="value"
        :label="placeholder"
        @blur="validateInput(value)"
        @input="updateValue($event)"
        :required="required"
      ></v-autocomplete>
      <span class="spinnerIcon">
        <i v-if="isStatic && loading" class="fas fa-spinner"></i>
      </span>
      <transition name="fadeIn">
        <p class="validationErr" v-if="showAlert">{{ validationMessage }}</p>
      </transition>
    </div>
    <!-- End:: Select Input -->
  </div>
</template>

<script>
export default {
  name: "BaseSelectInput",

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    staticItems: {
      required: false,
      type: Array,
    },
    classes: {
      required: false,
      type: String,
    },
    returnObject: {
      required: false,
      type: Boolean,
      default: true,
    },
    static: {
      required: false,
      type: Boolean,
      default: false,
    },
    getUrl: {
      required: false,
      type: String,
    },
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
    multiple: {
      required: false,
      type: Boolean,
      default: false,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // Validation Alert
      showAlert: false,
      validationMessage: "errer",

      items: [],
      itemsLoading: false,
    };
  },

  computed: {
    _staticItems() {
      return this.staticItems;
    },

    isStatic() {
      return this.static;
    },
  },

  methods: {
    updateValue(e) {
      this.$emit("input", e);
    },

    validateInput(value) {
      if (this.required) {
        let valid = true;

        if (!value) {
          this.validationMessage = this.$t("validation.empty");
          valid = false;
        }

        this.showAlert = !valid;
      }
    },

    getSelectItems() {
      if (this.static) {
        // this.items = [...this._staticItems];

        return;
      }
      this.itemsLoading = true;
      this.axios({
        method: "GET",
        url: `${this.getUrl}`,
      })
        .then((res) => {
          this.items = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item[this.$i18n.locale]?.name
                ? item[this.$i18n.locale].name
                : item.full_name
                ? item.full_name
                : item[this.$i18n.locale]?.title
                ? item[this.$i18n.locale].name
                : item.title
                ? item.title
                : item.city
                ? item.city
                : item.name,
            };
          });
          this.itemsLoading = false;
        })
        .catch(() => {
          this.itemsLoading = false;
        });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getSelectItems();
  },
};
</script>

<style scoped lang="scss">
.select {
  border: none !important;
}
</style>
