<template>
  <div class="countries_all">
    <template>
      <!-- <the-filter :inputs="inputs" /> -->
      <!-- @filterFired="filterFired" -->

      <Breadcrumb
        :items="items"
        :canAddNew="!canAdd"
        search_route="/terms/add"
        :search_title="$t('breadcrumb.terms.add')"
        icon="fa-plus"
      />

      <!-- :custom-filter="helper_filterSearch" -->

      <main>
        <v-data-table
          class="thumb strip"
          :headers="headers"
          :items="rows"
          :search="search"
          :loading="loading"
          :loading-text="$t('table.loadingData')"
          item-key="id"
          :items-per-page="paginations.items_per_page"
          hide-default-footer
        >
          <!-- ================== You Can use any slots you want ================== -->

          <template v-slot:[`item.arTitle`]="{ item }">
            <span v-if="item.ar.title">
              {{ item.ar.title }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.enTitle`]="{ item }">
            <span v-if="item.en.title">
              {{ item.en.title }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.arDesc`]="{ item }">
            <div class="_actions" v-if="item.ar.desc">
              <v-icon
                class="show"
                small
                @click="show_model_1(item.ar.desc, `rtl`)"
              >
                fas fa-eye
              </v-icon>
            </div>
          </template>
          <template v-slot:[`item.enDesc`]="{ item }">
            <div class="_actions" v-if="item.en.desc">
              <v-icon
                class="show"
                small
                @click="show_model_1(item.en.desc, `ltr`)"
              >
                fas fa-eye
              </v-icon>
            </div>
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
                name="term"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.terms.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.terms.all") }}</span>
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
        <div :dir="direction">
          <p class="with_border" v-html="model_1.model_img_src"></p>
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
          text: this.$t("breadcrumb.terms.title"),
          disabled: false,
          href: "/terms/show-all",
        },
        {
          text: this.$t("breadcrumb.terms.all"),
          disabled: true,
          href: "",
        },
      ],
      search: null,
      // ========== headers
      headers: [
        {
          text: "#",
          value: "index",
          align: "center",
        },
        {
          text: this.$t("labels.title") + this.$t("inArabic"),
          value: "arTitle",
          align: "center",
        },
        {
          text: this.$t("labels.title") + this.$t("inEnglish"),
          value: "enTitle",
          align: "center",
        },
        {
          text: this.$t("labels.desc") + this.$t("inArabic"),
          value: "arDesc",
          align: "center",
        },
        {
          text: this.$t("labels.desc") + this.$t("inEnglish"),
          value: "enDesc",
          align: "center",
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      direction: null,
      rows: [],
    };
  },

  methods: {
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `terms`,
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
          // console.log(err.response.data.messages);
          let message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({
            title: this.$t("validation.error"),
            message: message,
          });
          this.loading = false;
        });
    },

    editItem(item) {
      this.$router.push({ path: `/terms/edit/` + item.id });
    },

    show_model_1(src, dir) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
      this.direction = dir;
    },
  },

  created() {
    this.canEdit = this.$permission.allowed("update-terms");
    this.canDelete = this.$permission.allowed("delete-terms");
    this.canAdd = this.$permission.allowed("create-terms");
    this.canShow = this.$permission.allowed("show-terms");
    this.canShowAll = this.$permission.allowed("index-terms");

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
