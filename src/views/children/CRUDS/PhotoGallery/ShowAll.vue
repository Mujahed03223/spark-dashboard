<template>
  <div class="photoGallery_all">
    <template>
      <Breadcrumb
        :items="items"
        :canAddNew="!canAdd"
        search_route="/photo-gallery/add"
        :search_title="$t('breadcrumb.photoGallery.add')"
        icon="fa-plus"
      />

      <the-filter :inputs="inputs" :status="galleryStatus" />

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
          <template v-slot:[`item.image`]="{ item, index }">
            <img
              class="image"
              :src="item.image"
              @error="imageError(index)"
              @click="show_model_1(item.image)"
              v-if="item.image"
            />
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </template>

          <template v-slot:[`item.is_active`]="{ item }">
            <span
              class="status"
              :class="item.is_active ? 'active' : 'inactive'"
            >
              {{ item.is_active ? $t("active") : $t("inactive") }}
            </span>
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
                name="home-banner"
                :id="item.id"
                @refresh="rows = $event"
              />
            </div>
          </template>

          <!-- ======================== Start Top Section ======================== -->
          <template v-slot:top>
            <h3 class="table-title title">
              {{ $t("breadcrumb.photoGallery.title") }}
              <span class="total">({{ total }})</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    far fa-info-circle
                  </v-icon>
                </template>
                <span> {{ $t("breadcrumb.photoGallery.all") }}</span>
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
          text: this.$t("breadcrumb.photoGallery.title"),
          disabled: false,
          href: "/photo-gallery/show-all",
        },
        {
          text: this.$t("breadcrumb.photoGallery.all"),
          disabled: true,
          href: "",
        },
      ],
      galleryStatus: [
        {
          id: "",
          name: this.$t(`all`),
        },
        {
          id: "active",
          name: this.$t(`status.active`),
        },
        {
          id: "inactive",

          name: this.$t(`status.inactive`),
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
          text: this.$t("labels.image"),
          align: "center",
          value: "image",
          sortable: false,
        },

        {
          text: this.$t("labels.status"),
          align: "center",
          value: "is_active",
          sortable: false,
        },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      rows: [],
      search: null,

      inputs: [
        {
          keyName: "keyword",
        },
        {
          keyName: "status",
        },
      ],
    };
  },

  methods: {
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `home-banners`,
        params: {
          page: this.paginations.current_page,
          keyword: this.$route.query.keyword,
          per_page: this.$route.query.per_page,
          status: this.$route.query.status,
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
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },
    // ==================== Start CRUD ====================

    editItem(item) {
      this.$router.push({ path: `/photo-gallery/edit/` + item.id });
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
    this.canEdit = this.$permission.allowed("update-banner");
    this.canDelete = this.$permission.allowed("delete-banner");
    this.canAdd = this.$permission.allowed("create-banner");
    this.canShow = this.$permission.allowed("show-banner");
    this.canShowAll = this.$permission.allowed("index-banner");

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
