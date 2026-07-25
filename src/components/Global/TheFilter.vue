<template>
  <simple-card classes="w-100 mb-5 py-5">
    <!-- <div
              v-for="input in inputs"
              :key="input.id"
              :class="`py-0 col-lg-${cloumnWidth}`"
            > -->
    <div class="filter-content">
      <div class="contents row">
        <div
          class="my-1"
          v-for="input in inputs"
          :key="input.id"
          :class="[
            input.keyName == 'keyword'
              ? `py-0 col-md-6`
              : input.keyName == 'from_timee' || input.keyName == 'to_timee'
              ? `col-md-6`
              : 'py-0 col-md-3',
          ]"
        >
          <!-- AutoComplete -->
          <template v-if="input.url">
            <base-select-input
              v-model="data[input.keyName]"
              :getUrl="input.url"
              @input="setData($event, input.keyName, input.keyName)"
              :placeholder="$t(`labels.${input.keyName}`)"
              :returnObject="false"
            ></base-select-input>
          </template>

          <template v-else-if="input.keyName == 'manufacturing_year'">
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
              :returnObject="false"
              :staticItems="years"
              @input="setData($event, input.keyName, 'year')"
              static
            ></base-select-input>
          </template>

          <template v-else-if="input.keyName == 'payment'">
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
              :returnObject="false"
              @input="setData($event, input.keyName, 'payment_method')"
              :staticItems="paymentTypes"
              static
            ></base-select-input>
          </template>

          <template v-else-if="input.keyName == 'is_ban'">
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.ban_status`)"
              :returnObject="false"
              @input="getInputBan"
              :staticItems="is_ban_status"
              static
            ></base-select-input>
          </template>

          <template v-else-if="input.keyName == 'status'">
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
              :returnObject="false"
              :staticItems="input.status ? input.status : status"
              @input="getInput"
              static
            ></base-select-input>
          </template>

          <template v-else-if="input.keyName == 'month'">
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
              :returnObject="false"
              :staticItems="months"
              @input="setData($event, input.keyName, 'month')"
              static
            ></base-select-input>
          </template>

          <template v-else-if="input.keyName == 'provider_id'">
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.provider`)"
              :returnObject="false"
              getUrl="providers_not_paginated"
              @input="setData($event, input.keyName, 'provider_id')"
            ></base-select-input>
          </template>

          <!-- ber_page -->
          <template v-else-if="input.keyName == 'per_page'">
            <base-input
              icon="mdi-magnify"
              type="number"
              @blur="setData($event, input.keyName, 'per_page')"
              @enter="setKeyWord($event, input.keyName, 'per_page')"
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
            ></base-input>
          </template>

          <!-- Keyword -->
          <template v-else-if="input.keyName == 'keyword'">
            <base-input
              icon="mdi-magnify"
              type="text"
              @blur="setData($event, input.keyName, 'keyword')"
              @enter="setKeyWord($event, input.keyName, 'keyword')"
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
            ></base-input>
          </template>

          <!-- phone -->
          <template v-else-if="input.keyName == 'phone'">
            <base-input
              icon="mdi-phone"
              type="number"
              @blur="setData($event, input.keyName, 'phone')"
              @enter="setKeyWord($event, input.keyName, 'phone')"
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
            ></base-input>
          </template>

          <template v-else-if="input.keyName == 'id'">
            <base-input
              icon="mdi-magnify"
              type="text"
              @blur="setData($event, input.keyName, 'id')"
              @enter="setKeyWord($event, input.keyName, 'id')"
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
            ></base-input>
          </template>

          <!-- Start Date -->
          <template v-else-if="input.keyName == 'from_date'">
            <base-picker-input
              @emptyData="emptyData(input.keyName)"
              type="date"
              @input="setData($event, input.keyName, 'from_date')"
              :placeholder="$t(`labels.${input.keyName}`)"
              v-model="data[input.keyName]"
            />
          </template>

          <!-- End Date -->
          <template v-else-if="input.keyName == 'to_date'">
            <base-picker-input
              @emptyData="emptyData(input.keyName)"
              type="date"
              :value="data[input.keyName]"
              @input="setData($event, input.keyName, 'to_date')"
              :allowedDate="data.from_date ? data.from_date : null"
              :placeholder="$t(`labels.${input.keyName}`)"
              :acceptToUp="true"
              v-model="data[input.keyName]"
            />
          </template>

          <!-- Start Time -->
          <template v-else-if="input.keyName == 'from_time'">
            <base-picker-input
              @emptyData="emptyData(input.keyName)"
              type="time"
              format="24"
              :value="data[input.keyName]"
              @input="setData($event, input.keyName, 'from_time')"
              :placeholder="$t(`labels.${input.keyName}`)"
              v-model="data[input.keyName]"
            />
          </template>

          <!-- End Date -->
          <template v-else-if="input.keyName == 'to_time'">
            <base-picker-input
              @emptyData="emptyData(input.keyName)"
              type="time"
              format="24"
              @input="setData($event, input.keyName, 'to_time')"
              :placeholder="$t(`labels.${input.keyName}`)"
              v-model="data[input.keyName]"
            />
          </template>

          <template v-else-if="input.keyName == 'last_login'">
            <base-picker-input
              @emptyData="emptyData(input.keyName)"
              type="date"
              :value="data[input.keyName]"
              @input="setData($event, input.keyName, 'last_login')"
              :allowedDate="data.from_date ? data.from_date : null"
              :placeholder="$t(`labels.${input.keyName}`)"
              v-model="data[input.keyName]"
            />
          </template>

          <template v-else-if="input.keyName == 'last_logout'">
            <base-picker-input
              @emptyData="emptyData(input.keyName)"
              type="date"
              :value="data[input.keyName]"
              @input="setData($event, input.keyName, 'last_logout')"
              :allowedDate="data.from_date ? data.from_date : null"
              :placeholder="$t(`labels.${input.keyName}`)"
              v-model="data[input.keyName]"
            />
          </template>

          <!-- <template
            v-else-if="
              input.keyName == 'from_time' || input.keyName == 'to_time'
            "
          >
            <div class="input_wrapper d-flex align-items-center">
              <label :for="$t(input.keyName)" class="me-2 fs-6">
                {{ $t(`labels.${input.keyName}`) }}
              </label>
              <input
                type="datetime-local"
                class="w-100"
                :id="$t(input.keyName)"
                :name="$t(input.keyName)"
                v-model="data[input.keyName]"
                @input="setData($event, input.keyName, input.keyName)"
              />
              <input
               
                :id="$t(input.keyName)"
                type="datetime-local"
              
             
              />
            </div>
          </template> -->

          <template v-else>
            <base-select-input
              v-model="data[input.keyName]"
              :placeholder="$t(`labels.${input.keyName}`)"
              :returnObject="false"
              :staticItems="input.status"
              @input="setData($event, input.keyName, input.keyName)"
              static
            ></base-select-input>
          </template>
        </div>
      </div>

      <div class="button_wrapper">
        <button type="button" @click="restFields" class="error">
          <i class="fas fa-redo-alt"></i>
        </button>
      </div>
    </div>
  </simple-card>
</template>

<script>
export default {
  props: {
    inputs: {
      required: true,
      type: Array,
    },

    status: {
      required: false,
      type: Array,
    },

    is_ban: {
      required: false,
      type: Array,
    },
  },

  data() {
    return {
      paymentTypes: [
        {
          id: "cash",
          name: this.$t("cash"),
        },
        {
          id: "wallet",
          name: this.$t("wallet"),
        },
      ],
      is_ban_status: [
        {
          id: "",
          name: this.$t(`all`),
        },
        {
          id: 1,
          name: this.$t(`ban`),
        },
        {
          id: 0,
          name: this.$t(`inban`),
        },
      ],

      months: [
        {
          id: "1",
          name: this.$t("months.January"),
        },
        {
          id: "2",
          name: this.$t("months.February"),
        },
        {
          id: "3",
          name: this.$t("months.March"),
        },
        {
          id: "4",
          name: this.$t("months.April"),
        },
        {
          id: "5",
          name: this.$t("months.May"),
        },
        {
          id: "6",
          name: this.$t("months.June"),
        },
        {
          id: "7",
          name: this.$t("months.July"),
        },
        {
          id: "8",
          name: this.$t("months.August"),
        },
        {
          id: "9",
          name: this.$t("months.September"),
        },
        {
          id: "10",
          name: this.$t("months.October"),
        },
        {
          id: "11",
          name: this.$t("months.November"),
        },
        {
          id: "12",
          name: this.$t("months.December"),
        },
      ],
      years: [],
      data: {},
    };
  },

  computed: {
    cloumnWidth() {
      const inputLength = this.inputs.length;
      if (inputLength == 1) return "12";
      if (inputLength == 2) return "6";
      if (inputLength == 3) return "4";
      if (inputLength == 4) return "3";
      if (inputLength == 5) return "2";
    },
  },

  methods: {
    closeFilter() {
      this.$emit("closeFilter");
    },
    manufactruingYears() {
      let max = new Date().getFullYear();
      let min = max - 30;
      let years = [];
      for (let i = max; i >= min; i--) {
        years.push({ id: i, name: i });
      }
      this.years = years;
    },

    getInput(event) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: 1, status: event }),
      });
    },

    getInputBan(event) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: 1, is_ban: event }),
      });
    },
    setData(event, input, query) {
      if (query == "to_timee" || query == "from_timee") {
        this.data[query] = event.target.value;

        this.$router
          .push({
            query: Object.assign({}, this.$route.query, {
              page: 1,
              [query]: event.target.value,
            }),
          })
          .catch(() => {});
      } else {
        this.data[query] = event;

        this.$router
          .push({
            query: Object.assign({}, this.$route.query, {
              page: 1,
              [query]: event,
            }),
          })
          .catch(() => {});
      }
    },
    setKeyWord(event, input, query) {
      this.data[input] = event.target.value;

      this.$router
        .push({
          query: Object.assign({}, this.$route.query, {
            page: 1,
            [query]: event.target.value,
          }),
        })
        .catch(() => {});
    },
    emptyData(input) {
      this.data[input] = null;
      this.$router
        .push({
          query: Object.assign({}, this.$route.query, {
            page: 1,
            [input]: "",
          }),
        })
        .catch(() => {});
    },
    restFields() {
      this.inputs.map((input) => {
        this.data[input.keyName] = null;
        this.$router
          .push({
            query: Object.assign({}, this.$route.query, {
              page: 1,
              [input.keyName]: "",
              year: "",
            }),
          })
          .catch(() => {});
      });
    },
    resetDateValue() {
      this["Datevalue"] = null;
    },
    guessPlacholder(keyName) {
      if (keyName.includes("country")) return "الدوله";
      if (keyName.includes("keyword")) return "بحث";
      if (keyName.includes("phone")) return "رقم العميل";
      if (keyName.includes("from_date")) return "من";
      if (keyName.includes("to_date")) return "إلي";
      if (keyName == "type") return "نوع السائق";
      if (keyName.includes("provider_id")) return "مزود الخدمة";
      if (keyName.includes("brand_id")) return "البراند";
      if (keyName.includes("month")) return "الشهر";
      if (keyName.includes("model_id")) return "الموديل";
      if (keyName.includes("package_id")) return "الباكدج";
      if (keyName.includes("manufacturing_year")) return "سنة الصنع";
      if (keyName.includes("payment")) return "طريقة الدفع";
      if (keyName.includes("status")) return "الحالة";
      if (keyName == "order_type") return "نوع الرحلة";
      if (keyName == "per_page") return "عدد الصفوف فى الصفحة";
      return "غير معروف";
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.manufactruingYears();
    this.inputs.map((input) => {
      this.$set(this.data, [input.keyName], null);

      if (input.keyName == "manufacturing_year") {
        if (this.$route.query.year) {
          this.data[input.keyName] = this.years.find(
            (el) => el.id == this.$route.query.year
          );
        }
      } else {
        if (this.$route.query[input.keyName]) {
          if (input.status) {
            this.data[input.keyName] = input.status.find(
              (el) => el.id == this.$route.query[input.keyName]
            );
          } else {
            this.data[input.keyName] = this.$route.query[input.keyName];
          }
        }
      }
    });
  },
};
</script>

<style lang="scss">
.filter-content {
  display: flex;
  align-items: center;

  .contents {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    .v-input {
      margin: 0;
    }
  }

  .button_wrapper {
    width: fit-content;
    height: 50px;
    display: block;
    // margin: 10px auto;
    margin-inline-start: 10px;

    button {
      border: 0 !important;
    }
  }
}
</style>
