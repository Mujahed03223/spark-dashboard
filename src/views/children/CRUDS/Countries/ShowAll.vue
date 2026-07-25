<template>
  <div class="countries_all">
    <template>
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :items="items"
        :canAddNew="!canAdd"
        search_route="/countries/add"
        :search_title="$t('breadcrumb.countries.add')"
        icon="fa-plus"
      />

      <the-filter :inputs="inputs" />
      <!-- :custom-filter="helper_filterSearch" -->

      <main>
        <v-data-table
          class="thumb strip"
          :headers="headers"
          :items="rows"
          :search="search"
          :loading="loading"
          :expanded.sync="expanded"
          :loading-text="$t('table.loadingData')"
          item-key="id"
          :items-per-page="paginations.items_per_page"
          hide-default-footer
        >
          <!-- ================== You Can use any slots you want ================== -->
          <!-- Expanded -->
          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length" class="expandDate fadeIn">
              <span class="expandTitle">{{ $t("labels.extraDetails") }}</span>
              <ul>
                <li v-for="(value, key) of expandData" :key="key">
                  <span class="key">{{ key }}</span>
                  <span class="value">
                    <template v-if="value != null && value != 'null'">
                      {{ value }}
                    </template>
                    <template v-else-if="value == null || value == 'null'">
                      {{ $t("table.noData") }}
                    </template>
                  </span>
                </li>
              </ul>
            </td>
          </template>
          <template v-slot:[`item.extendIcon`]="{ item }">
            <div class="_actions">
              <v-icon class="show" small @click="clickRow(item)">
                fas fa-angle-double-down
              </v-icon>
            </div>
          </template>

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.flag`]="{ item, index }">
            <img
              class="image"
              :src="item.flag"
              @error="imageError(index)"
              @click="show_model_1(item.flag)"
              v-if="item.flag"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.name`]="{ item }">
            <span v-if="item.name">
              {{ item[$i18n.locale].name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.phone_code`]="{ item }">
            <span v-if="item.phone_code">
              {{ item.phone_code }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.phone_number_limit`]="{ item }">
            <span v-if="item.phone_number_limit">
              {{ item.phone_number_limit }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="_actions">
              <v-icon
                class="edit"
                v-if="!canEdit"
                small
                @click="editItem(item)"
              >
                fal fa-edit
              </v-icon>
              <deleter
                v-if="!canDelete"
                :items="rows"
                name="countries"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.countries.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.countries.all") }}</span>
              </v-tooltip>
            </h3>
            <!-- Delete dialog -->

            <!-- Add & Delete -->

            <v-row>
              <v-col cols="12" sm="8"></v-col>
            </v-row>
          </template>
          <!-- ======================== End Top Section ======================== -->
        </v-data-table>
        <!-- Start Pagination -->
        <template>
          <div
            class="pagination_container text-center mb-5 d-flex justify-content-end"
          >
            <v-pagination
              color="primary"
              v-model="paginations.current_page"
              :length="paginations.last_page"
              :total-visible="5"
              @input="fetchData($event)"
            ></v-pagination>
          </div>
        </template>
        <!-- End Pagination -->
      </main>

      <!-- Start Image_Model -->
      <base-model
        @close="model_1.show_model = false"
        :show="model_1.show_model"
      >
        <div class="image">
          <img
            v-if="model_1.model_img_src"
            :src="model_1.model_img_src"
            class="img-fluid"
            alt="..."
          />
        </div>
      </base-model>
      <!-- End Image_Model -->
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.countries.title"),
          disabled: false,
          href: "/countries/show-all",
        },
        {
          text: this.$t("breadcrumb.countries.all"),
          disabled: true,
          href: "",
        },
      ],
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.flag"),
          align: "center",
          value: "flag",
          sortable: false,
        },
        {
          text: this.$t("labels.name"),
          // value: "name",
          value: `${this.$i18n.locale}.name`,
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("labels.phone_length"),
          value: "phone_number_limit",
          align: "center",
        },
        {
          text: this.$t("labels.phone_code"),
          value: "phone_code",
          align: "center",
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      rows: [],
      expandData: [],
      expanded: [],
      search: null,
      noExpand: false,

      inputs: [
        {
          keyName: "keyword",
        },
        // {
        //   keyName: "start_date",
        // },
        // {
        //   keyName: "end_date",
        // },
      ],
    };
  },

  methods: {
    mapItem(data) {
      this.expandData = {
        [this.$t("labels.name") + this.$t("inArabic")]: data.ar.slug,
        [this.$t("labels.name") + this.$t("inEnglish")]: data.en.slug,

        [this.$t("labels.phone_limit")]: data.phone_limit,
        [this.$t("labels.created_at")]: data.created_at,
      };
    },
    clickRow(rowData) {
      if (this.noExpand) return;
      const indexExpanded = this.expanded.findIndex((i) => i === rowData);
      if (indexExpanded > -1) {
        // Exisit
        this.expanded.splice(indexExpanded, 1);
      } else {
        this.expanded = [];
        this.expanded.push(rowData);
        this.mapItem(rowData);
        // this.expandData = rowData
      }
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `countries`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
        },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },
    imageError(index) {
      this.rows[index].flag = require("@/assets/media/images/logo/logo.png");
    },
    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: `/countries/add` });
    },
    showItem(item) {
      this.$router.push({ path: `/countries/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/countries/edit/` + item.id });
    },

    // ===== Delete

    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: e }),
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      this.setRows();
    },

    // ==================== End CRUD ====================
  },

  watch: {
    [`$route`]() {
      if (this.$route.query.page) {
        this.paginations.current_page = +this.$route.query.page;
        this.setRows();
      } else {
        this.paginations.current_page = 1;
        this.setRows();
      }
    },
  },
  created() {
    this.canEdit = this.$permission.allowed("countries/edit");
    this.canDelete = this.$permission.allowed("countries/delete");
    this.canAdd = this.$permission.allowed("countries/add");
    this.canShow = this.$permission.allowed("countries/show");
    this.canShowAll = this.$permission.allowed("countries/show-all");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }

    // Set Rows
    if (!this.canShowAll) {
      this.setRows();
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
