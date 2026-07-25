<template>
  <div :class="col ? `col-md-${col}` : ''">
    <!-- Start:: Date Picker Input -->
    <div class="input_wrapper picker" v-if="type == 'date'">
      <v-dialog
        ref="dialog"
        persistent
        v-model="DateModalIsActive"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            @input="updateValue($event)"
            :label="placeholder"
            readonly
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            v-model="Datevalue"
            v-on="on"
          ></v-text-field>
          <span
            @click="
              $emit('emptyData', Datevalue);
              Datevalue = '';
            "
            :class="{ show: Datevalue }"
            class="closeIcon"
            ><i class="fas fa-times-circle"></i
          ></span>
        </template>
        <v-date-picker
          :allowedDates="allowedDates"
          @input="updateValue($event, 'DateModalIsActive')"
          v-model="Datevalue"
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="DateModalIsActive = false">
            {{ $t("BUTTONS.cancel") }}
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(Datevalue)">
            {{ $t("BUTTONS.select") }}
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </div>
    <!-- End:: Date Picker Input -->

    <!-- Start:: Time Picker Input -->
    <div class="input_wrapper picker" v-else-if="type == 'time'">
      <v-dialog
        ref="dialog"
        v-model="timeModalIsActive"
        :return-value.sync="value"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="value"
            @input="updateValue($event)"
            :label="placeholder"
            readonly
            prepend-icon="mdi-clock-time-four-outline"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="timeModalIsActive"
          :value="value"
          @input="updateValue($event)"
          full-width
          :format="format"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="timeModalIsActive = false">
            {{ $t("BUTTONS.cancel") }}
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(value)">
            {{ $t("BUTTONS.select") }}
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </div>
    <!-- End:: Time Picker Input -->
  </div>
</template>

<script>
export default {
  name: "BasePickerInput",
  props: {
    type: {
      required: true,
      type: String,
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
    col: {
      required: false,
      type: String,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    allowedDate: {
      required: false,
    },
    acceptToUp: {
      required: false,
    },
    format: {
      required: false,
    },
  },

  data() {
    return {
      DateModalIsActive: false,
      timeModalIsActive: false,
      Datevalue: null,
    };
  },

  methods: {
    updateValue(event, input) {
      this[input] = false;

      this.$emit("getData", event);
      this.$emit("input", event);
    },
    allowedDates(val) {
      if (this.acceptToUp) {
        // if i want to accept date from date to up
        if (this.allowedDate) {
          return val >= new Date(this.allowedDate).toISOString().substr(0, 10);
        } else {
          return val;
        }
      } else {
        // if i want to accept date from date to down
        if (this.allowedDate) {
          return val <= new Date(this.allowedDate).toISOString().substr(0, 10);
        } else {
          return val;
        }
      }
    },
  },
  mounted() {
    if (this.value) {
      this.Datevalue = this.value;
    }
  },
};
</script>
<style scoped lang="scss">
.picker {
  border: none !important;
}
</style>
