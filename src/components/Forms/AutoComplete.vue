<template>
  <div :class="col ? `col-md-${col}` : ''">
    <div class="input_wrapper">
      <v-autocomplete
        chips
        deletable-chips
        small-chips
        item-text="name"
        item-value="id"
        return-object
        @input="updateValue($event)"
        :loading="isLoading"
        :search-input.sync="search"
        :items="items"
        :label="placeholder"
        :value="value"
        :rules="required ? [(v) => !!v || validationHint] : []"
        :required="required"
        ><template v-slot:no-data>
          <div>{{ $t("noDataFound") }}</div>
        </template></v-autocomplete
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "AutoComplete",

  props: {
    url: {
      required: true,
      type: String,
      default: "",
    },
    value: {
      required: true,
    },
    placeholder: {
      required: true,
      type: String,
    },
    validationHint: {
      required: false,
      type: String,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    col: {
      required: false,
      type: String,
    },
  },

  data() {
    return {
      isLoading: false,
      search: "",

      items: [],
    };
  },

  watch: {
    search(newVal) {
      this.isLoading = true;
      this.axios({
        method: "POST",
        url: this.url,
        params: { key: newVal },
      })
        .then((res) => {
          this.isLoading = false;
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
          this.items = [];
        });
    },
  },

  methods: {
    updateValue(e) {
      this.$emit("input", e);
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.items = [
      {
        id: 1,
        name: "item 1",
      },
      {
        id: 3,
        name: "item 3",
      },
      {
        id: 2,
        name: "item 2",
      },
    ];
  },
};
</script>
