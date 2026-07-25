<template>
  <div class="countries_all">
    <template>
      <!-- <the-filter :inputs="inputs" /> -->
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/services/add"
        :search_title="$t('breadcrumb.services.add')"
        icon="fa-plus"
      />
      <the-filter :inputs="inputs" />
      <!-- :custom-filter="helper_filterSearch" -->

      <main>
        <div class="col-12 mb-2 pt-0">
          <div class="row">
            <simple-card v-for="(card, index) in statistics" :key="index">
              <statistics-card :item="card" :color="getRandomColor()" />
            </simple-card>
          </div>
        </div>
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
              <span class="expandTitle">المزيد من التفاصيل</span>
              <ul>
                <li v-for="(value, key) of expandData" :key="key">
                  <span class="key">{{ key }}</span>
                  <span class="value">
                    <template v-if="value != null && value != 'null'">
                      <p v-html="value"></p>
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
          <!-- IsActive -->
          <template v-slot:[`item.is_active`]="{ item }">
            <span
              class="status"
              :class="item.is_active ? 'active' : 'inactive'"
            >
              {{ item.is_active ? $t("yes") : $t("no") }}
            </span>
          </template>
          <template v-slot:[`item.type`]="{ item }">
            <span class="status">
              {{
                item.type == "popular"
                  ? $t("popular")
                  : item.type == "seasonal"
                  ? $t("seasonal")
                  : $t("cashback")
              }}
            </span>
          </template>

          <template v-slot:[`item.save_type`]="{ item }">
            <span v-if="item.save_type">{{ item.save_type }}</span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.save`]="{ item }">
            <span v-if="item.save">{{ item.save }}</span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.desc`]="{ item }">
            <span v-if="item.desc" v-html="item.desc"></span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.image`]="{ item, index }">
            <img
              @click="show_model_1(item.main_image.media)"
              class="image"
              :src="item.main_image.media"
              @error="imageError(index)"
              v-if="item.main_image.media"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>
          <template v-slot:[`item.invoice`]="{ item, index }">
            <img
              @click="show_model_1(item.invoice)"
              class="image"
              :src="item.invoice"
              @error="imageError(index)"
              v-if="item.invoice"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>
          <template v-slot:expand>
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
          </template>

          <!-- Select no data State -->
          <template v-slot:no-data>
            {{ $t("table.noData") }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="_actions">
              <!-- <v-icon
                class="show"
                v-if="!canShow"
                small
                @click="showItem(item)"
              >
                fal fa-eye
              </v-icon> -->
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
                name="services"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.services.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span>Tooltip</span>
              </v-tooltip>
            </h3>
            <!-- Delete dialog -->

            <!-- Add & Delete -->
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
        <div class="image text-center">
          <img
            class="img-fluid"
            v-if="model_1.model_img_src"
            :src="model_1.model_img_src"
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
          text: this.$t("breadcrumb.services.title"),
          disabled: false,
          href: "/services/show-all",
        },
        {
          text: this.$t("breadcrumb.services.all"),
          disabled: true,
          href: "",
        },
      ],
      expanded: [],

      loading: false,
      button_: {
        id: "",
      },
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.image"),
          value: "image",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.title"),
          value: "title",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.desc"),
          value: "desc",
          align: "center",
          width: "30%",
          sortable: false,
        },
        {
          text: this.$t("labels.invoiceImg"),
          value: "invoice",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.is_active"),
          value: "is_active",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.created_at"),
          value: "created_at",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      statistics: [],
      // ========== Filter
      inputs: [
        {
          keyName: "keyword",
        },
      ],
      rows: [],
      search: null,
      expandData: null,
    };
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
  methods: {
    imageError(index) {
      this.rows[index].avatar = require("@/assets/media/images/logo/logo.png");
    },

    mapItem(data) {
      this.expandData = {
        [this.$t("labels.manufacturing_year")]: data.manufacturing_year,
        [this.$t("labels.license_number")]: data.license_number,
        [this.$t("labels.license_serial_number")]: data.license_serial_number,

        [this.$t("labels.plate_number")]: data.plate_number,

        [this.$t("labels.created_at")]: data.created_at,
      };
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `services`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
        },
      })
        .then((res) => {
          this.loading = false;
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
          // this.statistics = [];
          // if (res.data.statistics) {
          //   for (const [key, value] of Object.entries(res.data.statistics)) {
          //     this.statistics.push({
          //       title: this.$t(key),
          //       count: value,
          //       route:
          //         key == "active_vehicle_count"
          //           ? "/categories/show-all?is_active=1"
          //           : key == "deactivate_vehicle_count"
          //           ? "/categories/show-all?is_active=0"
          //           : key == "categories_count"
          //           ? "/categories/show-all"
          //           : "/categories/show-all?is_locked=1",
          //     });
          //   }
          // }
        })
        .catch((err) => {
          // console.log(err.response.data.messages);
          console.log(err);
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
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
    showItem(item) {
      this.$router.push({ path: `/services/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/services/edit/` + item.id });
    },
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
  },

  created() {
    this.canEdit = this.$permission.allowed("services/edit/");
    this.canAdd = this.$permission.allowed("services/add");
    this.canDelete = this.$permission.allowed("services/delete");
    this.canShow = this.$permission.allowed("services/show/");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
