<template>
  <div class="countries_all">
    <template>
      <!-- <the-filter :inputs="inputs" /> -->
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :items="items"
        :canAddNew="!canAdd"
        search_route="/faqs/add"
        :search_title="$t('breadcrumb.faqs.add')"
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

          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.ar.desc`]="{ item }">
            <div class="_actions">
              <v-icon
                class="show"
                small
                @click="show_model_1(item.ar.desc, `rtl`)"
              >
                fas fa-eye
              </v-icon>
            </div>
          </template>
          <template v-slot:[`item.en.desc`]="{ item }">
            <div class="_actions">
              <v-icon
                class="show"
                small
                @click="show_model_1(item.en.desc, `ltr`)"
              >
                fas fa-eye
              </v-icon>
            </div>
          </template>
          <template v-slot:[`item.user_type`]="{ item }">
            <span>{{ $t(item.user_type) }}</span>
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
                :items="rows"
                v-if="!canDelete"
                name="faq"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.faqs.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span>{{ $t("breadcrumb.faqs.all") }}</span>
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
          text: this.$t("breadcrumb.faqs.title"),
          disabled: false,
          href: "/faqs/show-all",
        },
        {
          text: this.$t("breadcrumb.faqs.all"),
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
          text: this.$t("labels.question") + this.$t("inArabic"),
          value: "ar.question",
          align: "center",
        },
        {
          text: this.$t("labels.question") + this.$t("inEnglish"),
          value: "en.question",
          align: "center",
        },
        {
          text: this.$t("labels.answer") + this.$t("inArabic"),
          value: "ar.answer",
          align: "center",
        },
        {
          text: this.$t("labels.answer") + this.$t("inEnglish"),
          value: "en.answer",
          align: "center",
        },
        {
          text: this.$t("labels.user_type"),
          value: "user_type",
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
        url: `faq`,
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
      this.$router.push({ path: `/faqs/edit/` + item.id });
    },
    show_model_1(src, dir) {
      this.model_1.model_img_src = src;
      this.model_1.show_model = true;
      this.direction = dir;
    },
  },

  created() {
    this.canEdit = this.$permission.allowed("faqs/edit/");
    this.canDelete = this.$permission.allowed("faqs/delete");
    this.canAdd = this.$permission.allowed("faqs/add");
    this.setRows();
  },
};
</script>
