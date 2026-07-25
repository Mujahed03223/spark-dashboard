<template>
  <div class="most_questions_all">
    <template>
      <!-- @filterFired="filterFired" -->
      <Breadcrumb
        :items="items"
        :canAddNew="!canAdd"
        search_route="/most_questions/add"
        :search_title="$t('breadcrumb.most_questions.add')"
        icon="fa-plus"
      />

      <!-- <the-filter :inputs="inputs" /> -->
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

          <template v-slot:[`item.question`]="{ item }">
            <span v-if="item.question">
              {{ item.question }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.answer`]="{ item }">
            <div class="_actions" v-if="item.answer">
              <v-icon class="show" small @click="show_answer(item.answer)">
                fas fa-eye
              </v-icon>
            </div>
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
                name="most_questions"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.most_questions.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.most_questions.all") }}</span>
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

      <!-- Start Desc_Model -->
      <base-model :show="showAnswer" @close="closeDescModal">
        <div>
          <p class="with_border" v-html="answerData || $t('notFound')"></p>
        </div>
      </base-model>
      <!-- End Desc_Model -->
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
          href: "/"
        },
        {
          text: this.$t("breadcrumb.most_questions.title"),
          disabled: false,
          href: "/most_questions/show-all"
        },
        {
          text: this.$t("breadcrumb.most_questions.all"),
          disabled: true,
          href: ""
        }
      ],
      // ========== headers
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false
        },

        {
          text: this.$t("labels.question"),
          value: "question",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.answer"),
          value: "answer",
          align: "center",
          sortable: false
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false
        }
      ],

      rows: [],

      search: null,

      showAnswer: false,
      answerData: "",

      inputs: [
        {
          keyName: "keyword"
        }
      ]
    };
  },

  methods: {
    // ===== showAnswer
    show_answer(item) {
      this.showAnswer = true;
      this.answerData = item;
    },

    closeDescModal() {
      this.showAnswer = !this.showAnswer;
    },

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `most_questions`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page
        }
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
            message: message
          });
          this.loading = false;
        });
    },

    // ==================== Start CRUD ====================
    addItem() {
      this.$router.push({ path: `/most_questions/add` });
    },
    showItem(item) {
      this.$router.push({ path: `/most_questions/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/most_questions/edit/` + item.id });
    },

    // ===== Delete

    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: e })
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      this.setRows();
    }

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
    }
  },
  created() {
    this.canEdit = this.$permission.allowed("most_questions/edit");
    this.canDelete = this.$permission.allowed("most_questions/delete");
    this.canAdd = this.$permission.allowed("most_questions/add");
    this.canShow = this.$permission.allowed("most_questions/show");
    this.canShowAll = this.$permission.allowed("most_questions/show-all");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }

    // Set Rows
    if (!this.canShowAll) {
      this.setRows();
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  }
};
</script>
