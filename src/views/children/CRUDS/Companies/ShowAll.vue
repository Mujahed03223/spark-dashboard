<template>
  <div class="countries_all">
    <template>
      <Breadcrumb
        :canAddNew="!canAdd"
        :items="items"
        search_route="/companies/add"
        :search_title="$t('breadcrumb.companies.add')"
        icon="fa-plus"
      />
      <the-filter :inputs="inputs" />
      <!-- @filterFired="filterFired" -->
      <!-- :custom-filter="helper_filterSearch" -->
      <div class="row">
        <div class="">
          <div class="mb-2 col-12 pt-0">
            <div class="row">
              <simple-card v-for="(card, index) in statistics" :key="index">
                <statistics-card :item="card" :color="getRandomColor()" />
              </simple-card>
            </div>
          </div>

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
                  @click="show_model_1(item.image)"
                  class="image"
                  :src="item.image"
                  @error="imageError(index)"
                  v-if="item.image"
                />
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.gender`]="{ item }">
                <span v-if="item.gender">{{ $t(item.gender) }}</span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.full_name`]="{ item }">
                <router-link
                  v-if="item.full_name"
                  :to="`/companies/show/${item?.id}`"
                >
                  <span>
                    {{ item.full_name }}
                  </span>
                </router-link>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <template v-slot:[`item.email`]="{ item }">
                <span v-if="item.email">
                  {{ item.email }}
                </span>

                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>
              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- IsActive -->
              <!-- IsActive -->
              <template v-slot:[`item.is_active`]="{ item }">
                <!-- <switcher
                  :disabled="canEdit"
                  name="companies"
                  :item="item"
                  value="update-active"
                  type="active"
                /> -->
                <span
                  class="status pt-2"
                  :class="item.is_admin_active_user ? 'active' : 'inactive'"
                >
                  {{
                    item.is_admin_active_user ? $t("active") : $t("inactive")
                  }}
                </span>
              </template>

              <template v-slot:[`item.is_locked`]="{ item }">
                <switcher
                  :disabled="canEdit"
                  name="partner"
                  :item="item"
                  value="is_locked"
                />

                <span
                  class="status"
                  :class="item.is_locked ? 'inactive' : 'active'"
                >
                  {{ item.is_locked ? $t("locked") : $t("unlocked") }}
                </span>
              </template>
              <template v-slot:[`item.is_ban`]="{ item }">
                <!-- <switcher
                  :disabled="canEdit"
                  name="partner"
                  :item="item"
                  value="is_ban"
                /> -->
                <span
                  class="status"
                  :class="item.is_ban ? 'inactive' : 'active'"
                >
                  {{ item.is_ban ? $t("ban") : $t("inban") }}
                </span>
              </template>

              <template v-slot:[`item.is_admin_active_user`]="{ item }">
                <!-- <switcher
                  :disabled="canEdit"
                  name="partner"
                  :item="item"
                  value="is_admin_active_user"
                  type="active"
                /> -->

                <span
                  class="status pt-2"
                  :class="item.is_admin_active_user ? 'active' : 'inactive'"
                >
                  {{
                    item.is_admin_active_user
                      ? $t("adminActive")
                      : $t("adminInActive")
                  }}
                </span>
              </template>

              <template v-slot:[`item.phone`]="{ item }">
                <a
                  :href="`tel:${item.phone_code}${item.phone}`"
                  v-if="item.phone"
                  ><bdi>{{ item.phone }}</bdi> -
                  <bdi>{{ item.phone_code }}</bdi></a
                >
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <!-- Select actions-->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="_actions">
                  <v-icon
                    class="show"
                    v-if="!canShow"
                    small
                    @click="showItem(item)"
                  >
                    fal fa-eye
                  </v-icon>
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
                    name="companies"
                    :id="item.id"
                    @refresh="rows = $event"
                  />
                </div>
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("breadcrumb.companies.title") }}
                  <span class="total">({{ total }})</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="primary" dark v-bind="attrs" v-on="on">
                        far fa-info-circle
                      </v-icon>
                    </template>
                    <span> {{ $t("breadcrumb.companies.all") }}</span>
                  </v-tooltip>
                </h3>
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
        <div class="col-xl-3" v-if="false">
          <!-- Start:: Small Screens Charts Button -->

          <!-- End:: Small Screens Charts Button -->

          <ChartsAside
            v-if="chartsData"
            :show="asideIsActive"
            @toggleAside="toggleAside"
            :chartsData="chartsData"
          />

          <!-- End:: Aside -->
        </div>
      </div>

      <!-- Start Image_Model -->
      <base-model
        @close="model_1.show_model = false"
        :show="model_1.show_model"
      >
        <div class="image">
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
          text: this.$t("breadcrumb.companies.title"),
          disabled: false,
          href: "/companies/show-all",
        },
        {
          text: this.$t("breadcrumb.companies.all"),
          disabled: true,
          href: "",
        },
      ],
      search: null,
      rows: [],

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
          text: this.$t("labels.fullname"),
          value: "full_name",
          align: "center",
          sortable: false,
        },
        {
          text: "رقم السجل التجاري",
          value: "commercial_registration_no",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.phone"),
          align: "center",
          value: "phone",
          sortable: false,
        },
        {
          text: this.$t("labels.is_admin_active_user"),
          align: "center",
          value: "is_admin_active_user",
          sortable: true,
        },
        // {
        //   text: this.$t("labels.is_ban"),
        //   align: "center",
        //   value: "is_ban",
        //   sortable: true,
        // },

        {
          text: this.$t("labels.control"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      // ========== Filter
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
      statistics: [],
      expandData: null,
    };
  },

  methods: {
    showItem(item) {
      this.$router.push({ path: `/companies/show/` + item.id });
    },
    editItem(item) {
      this.$router.push({ path: `/companies/edit/` + item.id });
    },

    mapItem(data) {
      this.expandData = {
        [this.$t("labels.phonecode")]: data.phone_code,
        [this.$t("labels.rate_avg")]: data.rate_avg,
        [this.$t("labels.country")]: data.country?.name,
        [this.$t("labels.city")]: data.city?.name,
        [this.$t("labels.is_active")]: this.helper_boolToText(data.is_active),
        [this.$t("labels.is_trip_active")]: this.helper_boolToText(
          data.is_trip_active
        ),
        [this.$t("labels.created_at")]: data.created_at,
        [this.$t("labels.created_at")]: data.created_at,
        ["هل اكمل السائق تسجيله ؟"]: data.is_complete_data,
      };
    },
    imageError(index) {
      this.rows[index].image = require("@/assets/media/images/logo/logo.png");
    },
    setRows() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `companies`,
        params: {
          page: this.paginations.current_page,
          key_word: this.$route.query.keyword,
          // from: this.$route.query.start_date,
          // to: this.$route.query.end_date,
          // status: this.$route.query.status,
        },
      })
        .then((res) => {
          this.paginations.last_page = res.data.meta?.last_page;
          this.paginations.items_per_page = res.data.meta?.per_page;
          this.total = res.data.meta?.total;
          this.rows = res.data.data;
          this.statistics = [];
          // for (const [key, value] of Object.entries(res.data.statistics)) {
          //   this.statistics.push({
          //     title: this.$t(key),
          //     count: value,
          //     route:
          //       key == "active_partner_count"
          //         ? "/companies/show-all?status=active"
          //         : key == "deactivate_partner_count"
          //         ? "/companies/show-all?status=deactivate"
          //         : key == "deactivate_partner_form_admin_count"
          //         ? "/companies/show-all?status=deactivate_form_admin"
          //         : "/companies/show-all",
          //   });
          // }

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
    this.canEdit = this.$permission.allowed("companies/edit/");
    this.canDelete = this.$permission.allowed("companies/delete");
    this.canAdd = this.$permission.allowed("companies/add");
    this.canShow = this.$permission.allowed("companies/show/");
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setRows();
  },
};
</script>
<style lang="scss">
.tabsss {
  .v-item-group {
    background-color: transparent !important;
    box-shadow: 0px 5px 14px rgb(0 0 0 / 5%);

    .v-tabs-bar__content {
      .v-tab {
        color: var(--main) !important;

        &.v-tab-active {
          background: linear-gradient(
            97.46deg,
            #322176 -1.53%,
            #2d70ab 132.35%
          );
          color: #fff !important;
          border-radius: 10px;
        }
      }
    }

    .v-tabs {
      .v-tab {
        letter-spacing: normal !important;
        // color: var(--main) !important;
        // &.v-tab {
        //   color: var(--main) !important;
        // }
      }

      background: linear-gradient(
        97.46deg,
        #322176 -1.53%,
        #2d70ab 132.35%
      ) !important;
    }

    &:not(.v-tab--active) {
      color: transparent !important;
    }
  }
}
</style>
