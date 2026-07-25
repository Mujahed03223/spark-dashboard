<template>
  <div>
    <div @click="downloadPDF">
      <base-button class="center">{{ $t("review_report") }}</base-button>
    </div>

    <!-- <button @click="showReport = true">show report</button> -->

    <div>
      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="2800"
        filename="invoice"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="900px"
        @beforeDownload="hasGenerated($event)"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <div style="height: 1100px; width: 780px">
            <!-- <div
            style="height: 1100px; width: 780px; background-size: contain;"
            :style="{
              backgroundImage:
                profileData.service?.id == '2'
                  ? `url(${require('@/assets/media/images/report.jpeg')})`
                  : `url(${require('@/assets/media/images/report2.png')})`,
            }"
          > -->
            <template v-if="profileData.service">
              <div class="col-lg-12">
                <div class="divider mb-3">
                  <h4>
                    <h4>{{ $t("labels.service") }}</h4>
                  </h4>
                  <hr
                    role="separator"
                    aria-orientation="horizontal"
                    class="v-divider theme--dark"
                  />
                </div>
              </div>
              <div
                class="aa_htmlTable"
                style="
                  padding-top: 180px;
                  padding-right: 50px;
                  padding-left: 50px;
                "
              >
                <table
                  :class="`${
                    profileData.service.id == '2' ? 'tasreeb' : 'azl'
                  }`"
                >
                  <tbody>
                    <tr>
                      <td>{{ $t("labels.service") }}</td>
                      <td>{{ profileData.service.title }}</td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.desc") }}</td>
                      <td v-html="profileData.service.desc"></td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.address") }}</td>
                      <td v-html="profileData.address"></td>
                    </tr>
                    <tr v-if="profileData.agent">
                      <td>{{ $t("labels.agent") }}</td>
                      <td v-html="profileData.agent.full_name"></td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.company") }}</td>
                      <td v-html="profileData.company.full_name"></td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.client") }}</td>
                      <td v-html="profileData.user?.full_name"></td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.phone") }}</td>
                      <td v-html="profileData.user?.phone"></td>
                    </tr>
                    <tr v-if="profileData.sub_services.length">
                      <td colspan="2">{{ $t("labels.sub_services") }}</td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.service") }}</td>
                      <td>{{ $t("labels.price") }}</td>
                    </tr>
                    <tr v-for="item in profileData.sub_services" :key="item.id">
                      <td>{{ item.title }}</td>
                      <td>{{ item.price }}</td>
                    </tr>
                    <tr>
                      <td colspan="2">التقرير</td>
                    </tr>
                    <tr>
                      <td>{{ $t("labels.price") }}</td>
                      <td>{{ profileData.report_price }}</td>
                    </tr>
                    <tr>
                      <td colspan="2">الاجمالي : {{ profileData.price }}</td>
                    </tr>
                  </tbody>
                </table>
                <!-- <ul class="list-unstyled order_list">
                  <li>
                    <h4>{{ $t("labels.service") }} :</h4>
                    <span>{{ profileData.service.title }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.desc") }} :</h4>
                    <span v-html="profileData.service.desc"></span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.address") }} :</h4>
                    <span v-html="profileData.address"></span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.agent") }} :</h4>
                    <span>{{ profileData.agent.full_name }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.company") }} :</h4>
                    <span>{{ profileData.company.full_name }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.client") }} :</h4>
                    <span>{{ profileData.user.full_name }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.phone") }} :</h4>
                    <span>{{ profileData.user.phone_complete_form }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.price") }} :</h4>
                    <span>{{ profileData.price }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.report_price") }} :</h4>
                    <span>{{ profileData.report_price }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.payment_type") }} :</h4>
                    <span>{{
                      profileData.payment_type == "cash" ? "كاش" : "اون لاين"
                    }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.start_date") }} :</h4>
                    <span>{{ profileData.start_date }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.start_time") }} :</h4>
                    <span>{{ profileData.start_time }}</span>
                  </li>
                  <li>
                    <h4>{{ $t("labels.is_paid") }} :</h4>
                    <span
                      :class="profileData.is_paid ? 'active' : 'inactive'"
                      >{{ profileData.is_paid ? $t("yes") : $t("no") }}</span
                    >
                  </li>
                  <li>
                    <h4>{{ $t("labels.is_delayed") }} :</h4>
                    <span
                      :class="profileData.is_delayed ? 'active' : 'inactive'"
                      >{{ profileData.is_delayed ? $t("yes") : $t("no") }}</span
                    >
                  </li>
                  <li>
                    <h4>{{ $t("labels.status") }} :</h4>
                    <span>{{ profileData.status_trans }}</span>
                  </li>
                </ul> -->
                <!-- <div class="col-md-4">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.is_active") }}</h4>
                      <span
                        class="status"
                        :class="
                          profileData.service.is_active ? 'active' : 'inactive'
                        "
                      >
                        {{ helper_boolToText(profileData.service.desc) }}</span
                      >
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="order_card">
                    <div class="exp">
                      <h4>الصورة</h4>
                      <img :src="profileData.service.main_image.media" />
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div> -->
              </div>
            </template>

            <template v-if="false">
              <div class="col-lg-12">
                <div class="divider mb-3">
                  <h4>
                    <h4>المزيد من التفاصيل</h4>
                  </h4>
                  <hr
                    role="separator"
                    aria-orientation="horizontal"
                    class="v-divider theme--dark"
                  />
                </div>
              </div>
              <div class="order_details_container">
                <div class="order_details_cards">
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.address") }}</h4>
                      <span>{{ profileData.address.slice(0, 40) }}</span>
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.desc") }}</h4>
                      <span>{{ profileData.desc.slice(0, 40) }}</span>
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.payment_type") }}</h4>
                      <span>{{ profileData.payment_type.slice(0, 40) }}</span>
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.is_delayed") }}</h4>
                      <span
                        :class="profileData.is_delayed ? 'active' : 'inactive'"
                        >{{
                          profileData.is_delayed ? $t("yes") : $t("no")
                        }}</span
                      >
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.is_paid") }}</h4>
                      <span
                        :class="profileData.is_paid ? 'active' : 'inactive'"
                        >{{ profileData.is_paid ? $t("yes") : $t("no") }}</span
                      >
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.is_rated") }}</h4>
                      <span
                        :class="profileData.is_rated ? 'active' : 'inactive'"
                        >{{ profileData.is_rated ? $t("yes") : $t("no") }}</span
                      >
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.price") }}</h4>
                      <span>{{ profileData.price }}</span>
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.report_price") }}</h4>
                      <span>{{ profileData.report_price }}</span>
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.start_date") }}</h4>
                      <span>{{ profileData.start_date }}</span>
                    </div>
                  </div>

                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.start_time") }}</h4>
                      <span>{{ profileData.start_time }}</span>
                    </div>
                  </div>
                  <div class="order_card">
                    <div class="exp">
                      <h4>{{ $t("labels.status") }}</h4>
                      <span>{{ profileData.status_trans.slice(0, 40) }}</span>
                    </div>
                  </div>
                </div>
                <div class="services" v-if="profileData.sub_services.length">
                  <h4>{{ $t("labels.sub_services") }}</h4>

                  <hr
                    role="separator"
                    aria-orientation="horizontal"
                    class="v-divider theme--dark"
                  />
                  <ul>
                    <li
                      class="title"
                      v-for="sub in profileData.sub_services"
                      :key="sub.id"
                    >
                      <span>
                        {{ $t("labels.service") }}
                      </span>
                      <span>
                        {{ $t("labels.price") }}
                      </span>
                    </li>
                    <li
                      v-for="(sub, index) in profileData.sub_services"
                      :key="index"
                    >
                      <span>
                        {{ sub.title }}
                      </span>
                      <span>
                        {{ sub.price }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </div>

          <!-- PDF Content Here -->
        </section>
      </vue-html2pdf>
    </div>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    VueHtml2pdf,
  },
  props: ["profileData"],
  data() {
    return {
      showReport: false,
      loading: false,
      data: {
        report_price: null,
      },
    };
  },
  methods: {
    downloadPDF() {
      console.log(this.$refs.html2Pdf.pdfFile);
      this.$refs.html2Pdf.generatePdf();
    },

    hasGenerated(e) {
      console.log(e.html2pdf());
    },
    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      data.append("report_price", this.data.report_price);

      data.append("_method", "PATCH");

      // =============== Start:: Send Reply ===============
      this.axios({
        method: "POST",
        url: `orders/${this.id}/confirm-price`,
        data: data,
      })
        .then((res) => {
          this.$emit("refresh", res.data);
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });

          this.showForm = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });
      // =============== End:: Send Reply ===============
    },
  },
};
</script>

<style lang="scss">
.order_list {
  li {
    display: flex;
    align-items: baseline;
    margin-bottom: 10px;
    h4 {
      font-size: 17px;
    }
    span,
    p {
      margin-bottom: 0;
      margin-inline-start: 5px;
      font-size: 19px;
    }
  }
}
.aa_htmlTable {
  table {
    width: 100%;
    &.azl {
      tr {
        td {
          background-color: #eeeed2 !important;
          color: #000;
          border: 1px solid #cbcb93;
        }
      }
    }
  }
  table,
  thead,
  tbody,
  tfoot,
  tr,
  td,
  th {
    text-align: center;
    margin: auto;
    border: 1px solid #dedede;
    padding: 0.4rem;
    width: auto;
    font-size: 18px;
  }
  .table {
    display: table;
    width: auto;
  }
  .tr {
    display: table-row;
  }
  .thead {
    display: table-header-group;
  }
  .tbody {
    display: table-row-group;
  }
  .tfoot {
    display: table-footer-group;
  }
  .col {
    display: table-column;
  }
  .colgroup {
    display: table-column-group;
  }
  .td,
  .th {
    display: table-cell;
    width: 50%;
  }
  .caption {
    display: table-caption;
  }

  .table,
  .thead,
  .tbody,
  .tfoot,
  .tr,
  .td,
  .th {
    text-align: center;
    margin: auto;
    padding: 1rem;
  }
  .table {
    margin: auto;
    border: none;
    padding: 0;
    margin-bottom: 5rem;
  }

  .th {
    font-weight: 700;
    border: 1px solid #dedede;
    &:nth-child(odd) {
      border-right: none;
    }
  }
  .td {
    font-weight: 300;
    border: 1px solid #dedede;
    border-top: none;
    font-size: 17px;
    &:nth-child(odd) {
      border-right: none;
    }
  }

  .aa_htmlTable {
    // background: tomato;
    padding: 5rem;
    display: table;
    width: 100%;
    vertical-align: middle;
  }
}
// .table {
//   tr {
//     td {
//       font-size: 18px;
//     }
//   }
//   &.azl {
//     tr {
//       td {
//         background-color: #eeeed2;
//       }
//     }
//   }
// }
</style>
