<template>
  <div class="countries_all">
    <template>
      <!-- <the-filter :inputs="inputs" /> -->
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/report_reasons/add"
        :search_title="$t('breadcrumb.report_reasons.add')"
        icon="fa-plus"
      />
      <!-- :custom-filter="helper_filterSearch" -->
      <div class="row">
        <div class="">
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
              <!-- ====== Select row field ====== -->
              <!-- Expanded -->
              <template v-slot:expanded-item="{ headers }">
                <td :colspan="headers.length" class="expandDate fadeIn">
                  <span class="expandTitle">المزيد من التفاصيل</span>

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
              <template v-slot:[`item.user_type`]="{ item }">
                <span>{{ $t(item.user_type) }}</span>
              </template>

              <template v-slot:[`item.name`]="{ item }">
                <router-link
                  v-if="item.full_name"
                  :to="`/riders/show/${item?.id}`"
                >
                  <span>
                    {{ item.full_name }}
                  </span>
                </router-link>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- IsActive -->
              <template v-slot:[`item.is_active`]="{ item }">
                <span
                  class="status"
                  :class="item.is_active ? 'active' : 'inactive'"
                >
                  {{ item.is_active ? $t("active") : $t("inactive") }}
                </span>
              </template>

              <template v-slot:[`item.ar.desc`]="{ item }">
                <div class="_actions" v-if="item.ar.desc">
                  <v-icon
                    class="show"
                    small
                    @click="show_model_1(item.ar.desc)"
                  >
                    fas fa-eye
                  </v-icon>
                </div>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.en.desc`]="{ item }">
                <div class="_actions" v-if="item.en.desc">
                  <v-icon
                    class="show"
                    small
                    @click="show_model_1(item.en.desc)"
                  >
                    fas fa-eye
                  </v-icon>
                </div>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <!-- Select actions-->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="_actions">
                  <!-- <v-icon class="show" small @click="showItem(item)">
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
                    name="complaint-reason"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.report_reasons.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.report_reasons.all") }}</span>
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
        </div>
      </div>

      <!-- Start Image_Model -->
      <base-model
        @close="model_1.show_model = false"
        :show="model_1.show_model"
      >
        <p class="with_border" v-html="model_1.model_img_src"></p>
      </base-model>
      <!-- End Image_Model -->
    </template>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

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
          text: this.$t("breadcrumb.report_reasons.title"),
          disabled: false,
          href: "/report_reasons/show-all",
        },
        {
          text: this.$t("breadcrumb.report_reasons.all"),
          disabled: true,
          href: "",
        },
      ],
      loading: false,
      search: null,
      rows: [],
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.title") + this.$t("inArabic"),
          value: "ar.title",
          align: "center",
        },
        {
          text: this.$t("labels.title") + this.$t("inEnglish"),
          value: "en.title",
          align: "center",
        },

        {
          text: this.$t("labels.is_active"),
          value: "is_active",
          align: "center",
        },
        {
          text: this.$t("labels.extra"),
          value: "extendIcon",
          align: "center",
        },
        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      expandData: [],
      expanded: [],
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
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),
    showItem(item) {
      this.$router.push({ path: `/report_reasons/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/report_reasons/edit/` + item.id });
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `complaint-reason`,
        params: { page: this.paginations.current_page },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;

          this.loading = false;
        })
        .catch((err) => {
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },

    mapItem(data) {
      this.expandData = {
        [this.$t("labels.desc") + this.$t("inArabic")]: this.$t(data.ar.desc),
        [this.$t("labels.desc") + this.$t("inEnglish")]: this.$t(data.en.desc),
        [this.$t("labels.when_trip_status")]: this.$t(data.when_trip_status),
        [this.$t("labels.created_at")]: new Date(
          data.created_at
        ).toLocaleDateString(),
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
    this.canEdit = this.$permission.allowed("report_reasons/edit/");
    this.canDelete = this.$permission.allowed("report_reasons/delete");
    this.canAdd = this.$permission.allowed("report_reasons/add");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
