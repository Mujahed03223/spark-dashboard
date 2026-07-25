<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="wrapper referralLinksDetails" v-else>
      <div class="row">
        <div class="col-md-4">
          <Profile
            :profileData="showData && showData.referral_link"
            name="referral-links"
          />
        </div>
        <div class="col-md-8">
          <BaseCard>
            <v-data-table
              class="thumb strip logsTable"
              :headers="headers"
              :items="rows"
              :loading="loading"
              :loading-text="$t('table.loadingData')"
              item-key="id"
              hide-default-footer
            >
              <!-- ================== You Can use any slots you want ================== -->

              <template v-slot:[`item.index`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.log_date`]="{ item }">
                <span v-if="item.log_date">
                  {{ moment(item.log_date).format("YYYY-MM-DD") }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.user_name`]="{ item }">
                <span v-if="item.user">
                  {{ item.user.name }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.user_email`]="{ item }">
                <span v-if="item.user">
                  {{ item.user.email }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <!-- Select no data State -->
              <template v-slot:no-data>
                {{ $t("table.noData") }}
              </template>

              <!-- ======================== Start Top Section ======================== -->
              <template v-slot:top>
                <h3 class="table-title title">
                  {{ $t("labels.logs") }}
                </h3>
              </template>
              <!-- ======================== End Top Section ======================== -->
            </v-data-table>
          </BaseCard>
        </div>
      </div>

      <div class="button_section d-flex gap-1 justify-content-end">
        <v-btn type="submit" @click="show_modal()" class="submit_btn">
          {{ $t("credit_withdraw") }}
        </v-btn>

        <v-btn
          type="button"
          class="back_btn"
          @click="handleBack('/referral-links/show-all')"
        >
          {{ $t("back") }}
          <span
            :class="
              $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
            "
          ></span>
        </v-btn>
      </div>

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
    </div>

    <!-- Start Base_Model -->
    <base-model :show="showForm" @close="closeForm">
      <div class="form countryForm custom_card fadeIn">
        <ValidationObserver
          ref="acceptForm"
          @submit.prevent="handleWithdrawCredit()"
        >
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.value')"
            class="col-lg-6"
            rules="required|min_value:1"
          >
            <base-input
              :name="$t('labels.value')"
              type="number"
              :placeholder="$t('labels.value')"
              v-model="data.value"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <div class="button_section d-flex gap-1 justify-content-center mt-10">
            <v-btn
              type="submit"
              :loading="btnLoading"
              :disabled="!data.value"
              @click="handleWithdrawCredit()"
              class="submit_btn"
            >
              {{ $t("save") }}
            </v-btn>
            <v-btn type="button" class="back_btn" @click="closeForm">
              {{ $t("cancel") }}
            </v-btn>
          </div>
        </ValidationObserver>
      </div>
    </base-model>
    <!-- End Base_Model -->
  </div>
</template>

<script>
import Profile from "@/components/Pages/Profile/Profile.vue";
export default {
  props: ["id"],
  components: { Profile },
  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.referralLinks.title"),
          disabled: false,
          href: "/referral-links/show-all",
        },
        {
          text: this.$t(`breadcrumb.referralLinks.show`),
          disabled: true,
          href: "",
        },
      ],

      noData: false,
      showData: null,
      btnLoading: false,

      //Loading
      loading: false,
      isLoading: false,

      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },
        {
          text: this.$t("labels.user_name"),
          value: "user_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.user_email"),
          value: "user_email",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.log_date"),
          value: "log_date",
          align: "center",
          sortable: false,
        },
      ],

      rows: [],

      data: {
        value: null,
      },

      showForm: false,
    };
  },

  methods: {
    // ===== showForm
    show_modal() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = !this.showForm;
    },

    // ===== Handle accept or reject request
    handleWithdrawCredit() {
      const data = new FormData();
      data.append("value", this.data.value);

      this.axios({
        method: "POST",
        url: `withdraw-referral-link/${this.id}`,
        data: data,
      })
        .then(() => {
          this.data.value = null;
          this.showForm = false;

          this.$iziToast.success({
            title: this.$t("success"),
            message: this.$t("withdrawnSuccessfully"),
          });
          this.$router.push({ path: `/referral-links/show-all` });
        })

        .catch((err) => {
          this.data.value = null;
          this.showForm = false;
          let message = "";
          err.response && err.response.data.message
            ? (message = err.response.data.message)
            : (message = err.response.data.messages);
          this.$swal({
            title: message,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: this.$t("cancel"),
          });
        });
    },

    imageError(index) {
      this.rows[index].media = require("@/assets/media/images/logo/logo.png");
    },

    // ============ Get Profile Data
    getReferralData() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `referral-link/${this.id}/logs`,
      })
        .then((res) => {
          this.showData = res.data.data;
          this.rows = res.data.data && res.data.data.logs;

          this.loading = false;
          this.noData = false;
        })
        .catch((err) => {
          this.noData = true;
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.getReferralData();
  },
};
</script>
<style lang="scss">
.referralLinksDetails {
  .logsTable {
    background-color: transparent;
  }
}
</style>
