<template>
  <div class="contacts">
    <template>
      <Breadcrumb :items="items" />

      <div class="row mt-5">
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
            :expanded.sync="expanded"
            hide-default-footer
          >
            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.title`]="{ item }">
              <span v-if="item?.title">{{ item?.title }}</span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
              <span v-if="item?.created_at">{{ item?.created_at }}</span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.is_read`]="{ item }">
              <div class="action my-2">
                <div>
                  <span
                    class="status"
                    :class="item?.is_read ? 'active' : 'inactive'"
                  >
                    {{ item?.is_read ? $t("yes") : $t("no") }}
                  </span>
                </div>
                <div v-if="!canEdit">
                  <div
                    v-if="!item.is_read"
                    class="mt-3 d-flex align-items-center justify-content-center gap-3"
                  >
                    <button
                      @click="readItem(item.id)"
                      class="d-flex align-items-center justify-content-center gap-2"
                    >
                      <span class="text-success fw-bold">{{
                        $t("status.accept")
                      }}</span>
                      <i class="fal fa-check-circle text-success"></i>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <template v-slot:[`item.user`]="{ item }">
              <span v-if="item?.user?.name">{{ item?.user?.name }}</span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.content`]="{ item }">
              <div class="_actions" v-if="item?.content">
                <v-icon class="show" small @click="show_content(item.content)">
                  fas fa-eye
                </v-icon>
              </div>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <div class="_actions">
                <v-icon
                  @click="show_modal(item.id)"
                  class="reply"
                  v-if="!canShow"
                  small
                >
                  fas fa-reply
                </v-icon>

                <deleter
                  v-if="!canDelete"
                  :items="rows"
                  name="contacts"
                  :id="item?.id"
                  @refresh="rows = $event"
                />
              </div>
            </template>

            <!-- Custom expand toggle column (kept) -->
            <template v-slot:[`item.extendIcon`]="{ item }">
              <div class="_actions">
                <v-icon class="show" small @click="clickRow(item)">
                  fas fa-angle-double-down
                </v-icon>
              </div>
            </template>

            <!-- No data -->
            <template v-slot:no-data>
              {{ $t("table.noData") }}
            </template>

            <!-- Correct expanded content (per-row) -->
            <template v-slot:expanded-item="{ item }">
              <td :colspan="headers.length" class="expanded-cell">
                <div class="replies-container" v-if="item?.replies?.length">
                  <div class="replies-header">
                    <i class="fas fa-comments"></i>
                    <span
                      >{{ $t("labels.replies") }} ({{ item.replies.length }})
                    </span>
                  </div>
                  <div class="replies-list">
                    <div
                      v-for="(reply, index) in item.replies"
                      :key="reply.id"
                      class="reply-card"
                    >
                      <div class="reply-header">
                        <div class="reply-avatar">
                          <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="reply-meta">
                          <span class="reply-sender">
                            {{ reply.replied_by ? reply.replied_by.name : $t("admin") }}
                          </span>
                          <span class="reply-email text--secondary" v-if="reply.replied_by">
                            {{ reply.replied_by.email }}
                          </span>
                          <span class="reply-date">
                            <!-- <i class="far fa-clock"></i> -->
                            {{ reply.created_at }}
                          </span>
                        </div>
                        <div class="reply-badge">#{{ index + 1 }}</div>
                      </div>
                      <div class="reply-content">
                        {{ reply.content }}
                      </div>
                    </div>
                  </div>
                </div>
                <NoFound class="mt-5" v-else text="لا يوجد ردود"></NoFound>
              </td>
            </template>

            <!-- Top -->
            <template v-slot:top>
              <h3 class="table-title title">
                {{ $t("breadcrumb.contacts.title") }}
                <span class="total">({{ total }})</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on">
                      far fa-info-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("breadcrumb.contacts.all") }}</span>
                </v-tooltip>
              </h3>
            </template>
          </v-data-table>

          <!-- Pagination -->
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
              />
            </div>
          </template>
        </main>
      </div>

      <!-- Show content modal -->
      <base-model :show="showContent" @close="closeContent">
        <div>
          <p class="with_border" v-html="contentData || $t('notFound')"></p>
        </div>
      </base-model>

      <!-- Reply modal -->
      <base-model :show="showForm" @close="closeForm">
        <div class="form countryForm fadeIn">
          <h2 class="text-center">{{ $t("labels.sendReply") }}</h2>
          <ValidationObserver
            ref="replyForm"
            @submit.prevent="handleContactReply(itemId)"
          >
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.content')"
              class="col-lg-6"
              rules="required|min:2"
            >
              <base-input
                :name="$t('labels.content')"
                type="textarea"
                :placeholder="$t('labels.content')"
                v-model="data.content"
              />
              <span class="error--text d-inline-block">{{ errors[0] }}</span>
            </ValidationProvider>

            <div
              class="button_section d-flex gap-1 justify-content-center mt-10"
            >
              <v-btn
                type="submit"
                :disabled="!data.content"
                :loading="isLoading"
                @click="handleContactReply(itemId)"
                class="submit_btn"
              >
                {{ $t("submit") }}
              </v-btn>
              <v-btn type="button" class="back_btn" @click="closeForm">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </ValidationObserver>
        </div>
      </base-model>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // ========== Breadcrumbs
      items: [
        { text: this.$t("breadcrumb.mainPage"), disabled: false, href: "/" },
        {
          text: this.$t("breadcrumb.contacts.title"),
          disabled: false,
          href: "/contact_messages/show-all"
        },
        { text: this.$t("breadcrumb.contacts.all"), disabled: true, href: "" }
      ],

      data: { content: null },

      total: 0,
      rows: [],
      search: null,
      showContent: false,
      contentData: "",

      showForm: false,
      isLoading: false,
      expanded: [], // keep expanded items
      noExpand: false, // preserved (used by clickRow)

      // ========== headers (kept extendIcon)
      headers: [
        { text: "#", align: "center", value: "index", sortable: false },
        { text: this.$t("labels.title"), value: "title", align: "center" },
        {
          text: this.$t("labels.createdat"),
          value: "created_at",
          align: "center"
        },
        { text: this.$t("labels.user"), value: "user", align: "center" },
        { text: this.$t("labels.is_read"), value: "is_read", align: "center" },
        { text: this.$t("labels.content"), value: "content", align: "center" },
        {
          text: this.$t("labels.replies"),
          value: "extendIcon",
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

      // ========== Filter
      inputs: [{ keyName: "keyword" }]
    };
  },

  watch: {
    [`$route`]() {
      if (this.$route.query.page) {
        this.paginations.current_page = +this.$route.query.page;
      } else {
        this.paginations.current_page = 1;
      }
      this.setRows();
    }
  },

  methods: {
    clickRow(rowData) {
      if (this.noExpand) return;
      const i = this.expanded.findIndex((r) => r === rowData);
      if (i > -1) {
        this.expanded.splice(i, 1);
      } else {
        this.expanded = [rowData]; // single expand; use push for multi
      }
    },

    readItem(id) {
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("accept")
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleReadMessage(id);
        }
      });
    },

    handleReadMessage(id) {
      this.isLoading = true;
      this.axios({ method: "GET", url: `read-contacts-message/${id}` })
        .then(() => {
          this.isLoading = false;
          this.setRows();
          this.$swal({
            title: this.$t("acceptedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
          this.isLoading = false;
          const message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$swal({
            title: message,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: this.$t("cancel")
          });
        });
    },

    resetForm() {
      this.data = { content: null };
    },

    show_modal(item) {
      this.showForm = true;
      this.itemId = item;
    },

    closeForm() {
      this.showForm = !this.showForm;
    },

    show_content(item) {
      this.showContent = true;
      this.contentData = item;
    },

    closeContent() {
      this.showContent = !this.showContent;
    },

    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `contacts`,
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
          const message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$iziToast.error({ title: this.$t("validation.error"), message });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleContactReply(id) {
      const data = new FormData();
      data.append("content", this.data.content);

      this.axios({
        method: "POST",
        url: `add-contacts-replay/${id}`,
        data
      })
        .then(() => {
          this.setRows();
          this.showForm = false;
          this.resetForm();
          this.$swal({
            title: this.$t("replySentSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok")
          });
        })
        .catch((err) => {
          const message =
            err.response?.data.message ?? err.response?.data.messages;
          this.$swal({
            title: message,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: this.$t("cancel")
          });
        });
    },

    fetchData(e) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page: e })
      });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      this.setRows();
    }
  },

  created() {
    this.canEdit = this.$permission.allowed("contacts/edit");
    this.canDelete = this.$permission.allowed("contacts/delete");
    this.canAdd = this.$permission.allowed("contacts/add");
    this.canShow = this.$permission.allowed("contacts/show");
    this.canShowAll = this.$permission.allowed("contacts/show-all");

    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  }
};
</script>
