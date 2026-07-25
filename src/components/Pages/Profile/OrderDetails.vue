<template>
  <div class="personal_information">
    <div class="row">
      <!-- Start :: Checks -->
      <template
        v-if="profileData.status == 'pending' || profileData.status == 'accept'"
      >
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>تاجيل الموعد</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="">
          <!-- <v-btn
            type="submit"
            @click="changeStatus('accept')"
            :disabled="loading1"
            :loading="loading1"
            class="ml-2"
          >
            {{ $t("accept") }}
          </v-btn> -->
          <div>
            <template
              v-if="
                profileData.status == 'pending' ||
                profileData.status == 'accept'
              "
            >
              <!-- <div class="col-lg-12">
              <div class="divider mb-3">
                <h4>
                  <h4>تخصيص فني</h4>
                </h4>
                <hr
                  role="separator"
                  aria-orientation="horizontal"
                  class="v-divider theme--dark"
                />
              </div>
            </div>
            <div class="d-flex mr-auto ml-auto">
            </div> -->
              <div class="input_wrapper row">
                <!-- Start::  Start At -->
                <ValidationProvider
                  v-slot="{ errors }"
                  :name="$t('labels.start_at')"
                  class="col-lg-6"
                  rules="required"
                >
                  <base-picker-input
                    :name="$t('labels.start_at')"
                    type="date"
                    :allowedDate="new Date()"
                    v-model="data.start_date"
                    :placeholder="$t('labels.start_at')"
                    :acceptToUp="true"
                  />

                  <span v-if="errors[0]" class="error--text d-inline-block">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
                <!-- End::  Start At -->
                <ValidationProvider
                  v-slot="{ errors }"
                  :name="$t('from')"
                  class="col-lg-6"
                  rules="required"
                >
                  <base-picker-input
                    :name="$t('from')"
                    type="time"
                    format="24hr"
                    v-model="data.start_time"
                    :placeholder="$t('from')"
                  />

                  <span v-if="errors[0]" class="error--text d-inline-block">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
                <!-- End::  Start At -->
                <div class="col-12 button_wrapper mb-5">
                  <v-btn
                    type="submit"
                    @click="delayOrder()"
                    :disabled="!data.start_date || !data.start_time"
                    :loading="loading2"
                  >
                    تاجيل
                  </v-btn>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4" v-if="profileData.user_delay">
                  <div class="order_card">
                    <div class="exp">
                      <h4>سبب التاجيل</h4>
                      <span>{{ profileData.user_delay?.reason?.title }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
                <div class="col-md-4" v-if="profileData.delay_reason">
                  <div class="order_card">
                    <div class="exp">
                      <h4>صاحب التاجيل</h4>
                      <span>{{ profileData.user_delay?.user?.full_name }}</span>
                    </div>
                    <div class="img">
                      <img src="@/assets/media/images/logo/logo.png" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template
        v-if="
          profileData.status == 'pending' ||
          profileData.status == 'agent_cancel' ||
          profileData.status == 'accept' ||
          profileData.status == 'in_the_way'
        "
      >
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>تغير الحالة</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="button_wrapper align-items-end gap-2 d-flex">
          <!-- <v-btn
            type="submit"
            @click="changeStatus('accept')"
            :disabled="loading1"
            :loading="loading1"
            class="ml-2"
          >
            {{ $t("accept") }}
          </v-btn> -->
          <div>
            <template
              v-if="
                profileData.status == 'pending' ||
                profileData.status == 'agent_cancel' ||
                profileData.status == 'accept' ||
                profileData.status == 'in_the_way'
              "
            >
              <!-- <div class="col-lg-12">
              <div class="divider mb-3">
                <h4>
                  <h4>تخصيص فني</h4>
                </h4>
                <hr
                  role="separator"
                  aria-orientation="horizontal"
                  class="v-divider theme--dark"
                />
              </div>
            </div>
            <div class="d-flex mr-auto ml-auto">
            </div> -->
              <div class="input_wrapper" style="width: 200px">
                <span class="title mb-2 fs-4">{{
                  $t("selectAgentToAcceptOrder")
                }}</span>
                <base-select-input
                  class="w-100"
                  @input="assignAgent"
                  v-model="agent"
                  label="hojv"
                  getUrl="agents-without-paginate"
                  :placeholder="$t('labels.agent')"
                ></base-select-input>
              </div>
            </template>
          </div>
          <v-btn
            type="submit"
            @click="changeStatus('admin_reject')"
            :disabled="loading2"
            :loading="loading2"
          >
            {{ $t("reject") }}
          </v-btn>
        </div>
      </template>

      <template v-if="profileData.cancel_users">
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>الفنيين الذين قاموا بالالغاء</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div
          class="col-md-4"
          v-for="item in profileData.cancel_users"
          :key="item.id"
        >
          <div class="order_card ver_design">
            <div class="exp">
              <h4>المستخدم الذي قام بالغاء</h4>
              <div class="pro_img">
                <img :src="item.user?.image" />
              </div>
              <ul>
                <li>
                  <span class="tit">{{ $t("labels.fullname") }}:</span>
                  <span class="desc">{{ item.user?.full_name }}</span>
                </li>
                <li>
                  <span class="tit">{{ $t("labels.phone") }}:</span>
                  <span class="desc">{{ item.user?.phone_complete_form }}</span>
                </li>
                <li>
                  <span class="tit">{{ $t("labels.cancel_reason") }}:</span>
                  <span class="desc">{{ item.cancel_reason?.title }}</span>
                </li>
                <li>
                  <span class="tit">من قام بالغاء الطلب:</span>
                  <span class="desc">{{
                    item.user?.user_type == "call_center"
                      ? "خدمة العملاء"
                      : "الفني"
                  }}</span>
                </li>
              </ul>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>
      </template>

      <template>
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>{{ $t("labels.users") }}</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="col-md-4" v-if="profileData.user">
          <div class="order_card ver_design">
            <div class="exp">
              <h4>{{ $t("labels.client") }}</h4>
              <div class="pro_img">
                <img :src="profileData.image" />
              </div>
              <ul>
                <li>
                  <span class="tit">{{ $t("labels.fullname") }}:</span>
                  <span class="desc">{{ profileData.user_name }}</span>
                </li>
                <li>
                  <span class="tit">{{ $t("labels.phone") }}:</span>
                  <span class="desc">{{
                    profileData.phone_code + profileData.phone
                  }}</span>
                </li>
              </ul>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>

        <div class="col-md-4" v-if="profileData.company">
          <div class="order_card ver_design">
            <div class="exp">
              <h4>{{ $t("labels.company") }}</h4>
              <div class="pro_img">
                <img :src="profileData.company.image" />
              </div>
              <ul>
                <li>
                  <span class="tit">{{ $t("labels.fullname") }}:</span>
                  <span class="desc">{{ profileData.company.full_name }}</span>
                </li>
              </ul>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>
        <div class="col-md-4" v-if="profileData.agent">
          <div class="order_card ver_design">
            <div class="exp">
              <h4>{{ $t("labels.agent") }}</h4>
              <div class="pro_img">
                <img :src="profileData.agent?.image" />
              </div>
              <ul>
                <li>
                  <span class="tit">{{ $t("labels.fullname") }}:</span>
                  <span class="desc">{{ profileData.agent?.full_name }}</span>
                </li>
              </ul>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>
      </template>
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
        <div class="col-md-4">
          <div class="order_card">
            <div class="exp">
              <h4>{{ $t("labels.title") }}</h4>
              <span>{{ profileData.service.title }}</span>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="order_card">
            <div class="exp">
              <h4>{{ $t("labels.is_active") }}</h4>
              <span
                class="status"
                :class="profileData.service.is_active ? 'active' : 'inactive'"
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
        </div>
        <div class="col-6">
          <div class="order_card">
            <div class="exp">
              <h4>{{ $t("labels.desc") }}</h4>
              <div v-html="profileData.service.desc"></div>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>
        <div class="col-6" v-if="profileData.report">
          <div class="order_card">
            <div class="exp">
              <h4>تقرير الفني</h4>
              <div v-html="profileData.report"></div>
            </div>
            <div class="img">
              <img src="@/assets/media/images/logo/logo.png" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="profileData.images.length">
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>صور الاصلاحات</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-4"
            v-for="item in profileData.images"
            :key="item.id"
          >
            <div class="img_div">
              <img :src="item.media" @click="show_model_1(item.media)" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="profileData.house_images.length">
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>صور المنزل</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-4"
            v-for="item in profileData.house_images"
            :key="item.id"
          >
            <div class="img_div">
              <img :src="item.media" @click="show_model_1(item.media)" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="profileData.call_center_images.length">
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>صور خدمة العملاء</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-4"
            v-for="item in profileData.call_center_images"
            :key="item.id"
          >
            <div class="img_div">
              <img :src="item.media" @click="show_model_1(item.media)" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="profileData.call_center_voice || profileData.agent_voice">
        <div class="col-lg-12">
          <div class="divider mb-3">
            <h4>
              <h4>الملفات الصوتية</h4>
            </h4>
            <hr
              role="separator"
              aria-orientation="horizontal"
              class="v-divider theme--dark"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6" v-if="profileData.call_center_voice">
            <div class="custom_card">
              <h5>الملف الصوتي الخاص بخدمة العملاء</h5>
              <audio controls>
                <source
                  :src="profileData.call_center_voice.media"
                  type="audio/ogg"
                />
                <source
                  :src="profileData.call_center_voice.media"
                  type="audio/mpeg"
                />
                <source
                  :src="profileData.call_center_voice.media"
                  type="audio/wav"
                />
              </audio>
            </div>
          </div>
          <div class="col-md-6" v-if="profileData.agent_voice">
            <div class="custom_card">
              <h5>الملف الصوتي الخاص الفني</h5>
              <audio controls>
                <source :src="profileData.agent_voice.media" type="audio/ogg" />
                <source
                  :src="profileData.agent_voice.media"
                  type="audio/mpeg"
                />
                <source :src="profileData.agent_voice.media" type="audio/wav" />
              </audio>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="order_card">
            <div class="exp">
              <h4>{{ $t("labels.is_active") }}</h4>
              <span
                class="status"
                :class="profileData.service.is_active ? 'active' : 'inactive'"
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
        </div>
      </template>

      <template v-if="profileData">
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
                <span>{{ profileData.desc }}</span>
              </div>
            </div>

            <div class="order_card">
              <div class="exp">
                <h4>{{ $t("labels.payment_type") }}</h4>
                <span>{{ profileData.payment_type_trans }}</span>
              </div>
            </div>

            <div class="order_card">
              <div class="exp">
                <h4>{{ $t("labels.is_delayed") }}</h4>
                <span :class="profileData.is_delayed ? 'active' : 'inactive'">{{
                  profileData.is_delayed ? $t("yes") : $t("no")
                }}</span>
              </div>
            </div>

            <div class="order_card">
              <div class="exp">
                <h4>{{ $t("labels.is_paid") }}</h4>
                <span :class="profileData.is_paid ? 'active' : 'inactive'">{{
                  profileData.is_paid ? $t("yes") : $t("no")
                }}</span>
              </div>
            </div>

            <div class="order_card">
              <div class="exp">
                <h4>{{ $t("labels.is_rated") }}</h4>
                <span :class="profileData.is_rated ? 'active' : 'inactive'">{{
                  profileData.is_rated ? $t("yes") : $t("no")
                }}</span>
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
            <div class="order_card" v-if="profileData.user_delay">
              <div class="exp">
                <h4>سبب التاجيل</h4>
                <span>{{ profileData.user_delay?.reason?.title }}</span>
              </div>
            </div>
            <!-- <div class="order_card" v-if="profileData.user_delay">
              <div class="exp">
                <h4>صاحب التاجيل</h4>
                <span>{{ profileData.user_delay?.user?.full_name }}</span>
              </div>
            </div> -->
            <!-- <div class="order_card" v-if="profileData.cancel_reason">
              <div class="exp">
                <h4>{{ $t("labels.cancel_reason") }}</h4>
                <span>{{ profileData.cancel_reason.title }}</span>
              </div>
            </div> -->
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
              <li v-for="(sub, index) in profileData.sub_services" :key="index">
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
    <div class="d-flex justify-content-center gap-3 align-items-center">
      <div
        @click="showForm = true"
        v-if="
          !profileData.is_admin_confirm_price &&
          profileData.status == 'pre_finished'
        "
      >
        <base-button class="center">{{ $t("confirm_price") }}</base-button>
      </div>

      <Report-pdf
        :profileData="profileData"
        v-if="profileData.status != 'client_cancel'"
      />

      <!-- <div @click="showForm = true" v-if>
        <base-button class="center">{{ $t("confirm_price") }}</base-button>
      </div> -->

      <div
        v-if="
          profileData.is_admin_confirm_price &&
          profileData.status == 'pre_finished'
        "
      >
        <label
          v-if="!files.pdfFile.preview"
          for="uploadNewPDF"
          class="w-100 h-100 border-1 d-flex align-items-center justify-content-center text-white"
          style="
            cursor: pointer;
            background-color: #003773;
            border-radius: 10px;
            padding: 4px 20px;
            font-size: 20px;
          "
        >
          {{ $t("labels.uploadNewPDF") }}
        </label>

        <input
          type="file"
          id="uploadNewPDF"
          class="d-none"
          @change="uploadFileToAttachment($event, 'orders', 'pdfFile')"
          accept=".pdf"
        />
      </div>

      <a
        v-if="profileData.report_file?.media || files.pdfFile.preview"
        :href="
          profileData.report_file?.media
            ? profileData.report_file?.media
            : files.pdfFile.preview
        "
        target="_blank"
      >
        {{ $t("labels.showNewPDF") }}
      </a>
    </div>
    <base-model :show="showForm" @close="showForm = false" name="fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <bdi>
            في حالة وجود تقرير كتابي من الفني يرجي ادخال السعر
            {{ profileData.report ? "" : "( إختياري )" }}</bdi
          >

          <!-- Start:: Reply -->
          <base-input
            col="12"
            type="number"
            :placeholder="$t('labels.report_price')"
            v-model="data.report_price"
            :required="profileData.report ? true : false"
          />
          <!-- End:: Reply -->
        </div>

        <base-button :loading="loading" class="center">{{
          $t("submit")
        }}</base-button>
      </form>
    </base-model>
    <!-- Start Image_Model -->
    <base-model @close="model_1.show_model = false" :show="model_1.show_model">
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
  </div>
</template>

<script>
import ReportPdf from "./Report.vue";
import OrderCard from "@/components/UI/OrderCard.vue";

export default {
  props: ["profileData", "name", "id"],
  components: {
    OrderCard,
    ReportPdf,
  },
  data() {
    return {
      show: false,
      showChat: false,
      showForm: false,
      uploadPdf: false,
      showReport: false,
      loading: false,
      data: {
        report_price: null,
        start_date: null,
        start_time: null,
      },
      files: {
        pdfFile: {
          file: null,
          preview: null,
        },
      },
      agent: null,
      colors: [
        {
          first: "#62EAE1",
          secound: "rgba(126, 229, 223, 0)",
        },
        {
          first: "#FF6370",
          secound: "rgba(255, 99, 112, 0)",
        },
        {
          first: "#9E62EA",
          secound: " #B199ED",
        },
        {
          first: "#EABC62",
          secound: "#E9BA62",
        },
      ],
      notification_data: {
        title: null,
        body: null,
      },
      model_1: {
        show_model: false,
        model_img_src: "",
      },
      loading1: false,
      loading2: false,
    };
  },
  methods: {
    async uploadNewPDF(file) {
      const data = new FormData();
      data.append("_method", "PATCH");
      data.append("report_file[id]", "");
      data.append("report_file[media]", file);

      await this.axios({
        method: "POST",
        url: `orders/${this.profileData.id}/review-report`,
        data: data,
      })
        .then((res) => {
          console.log(res);
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    uploadFileToAttachment(event, modal, varName) {
      if (event) {
        this.btnLoading = true;
        const data = new FormData();
        data.append("file", event.target.files[0]);
        data.append("attachment_type", "file");
        data.append("model", modal);

        this.axios({
          method: "POST",
          url: `${process.env.VUE_APP_BASE_ATTACHMENTS_URL}attachments`,
          data: data,
        })
          .then((res) => {
            this.btnLoading = false;
            console.log(res.data.data);
            this.files[varName].file = res.data.data;
            this.files[varName].preview = URL.createObjectURL(
              event.target.files[0]
            );
            this.uploadNewPDF(res.data.data);
          })
          .catch((err) => {
            this.$iziToast.error({
              title: this.$t("validation.error"),
              message: err.response.data.message,
            });

            this.btnLoading = false;
          });
      }
    },
    show_model_1(e) {
      this.model_1.model_img_src = e;
      this.model_1.show_model = true;
    },
    delayOrder() {
      const data = new FormData();
      // data.append("_method", "PATCH");
      data.append("start_date", this.data.start_date);
      data.append("start_time", this.data.start_time);
      this.axios({
        method: "post",
        url: `orders/${this.profileData.id}/delay`,
        data: data,
      })
        .then(() => {
          this.$router.push({ path: "/orders/show-all" });
          this.$iziToast.success({
            title: this.$t("success"),
            message: "تم التاجيل",
          });
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.btnLoading = false;
        });
    },
    changeStatus(status) {
      const data = new FormData();
      data.append("_method", "PATCH");
      data.append("status", status);
      this.axios({
        method: "post",
        url: `orders/${this.profileData.id}/change-status`,
        data: data,
      })
        .then(() => {
          this.$router.push({ path: "/orders/show-all" });
          this.$iziToast.success({
            title: this.$t("success"),
            message: status == "accept" ? "تم القبول" : "تم الرفض",
          });
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.btnLoading = false;
        });
    },
    assignAgent() {
      const data = new FormData();
      data.append("_method", "PATCH");
      data.append("agent_id", this.agent?.id);
      this.axios({
        method: "post",
        url: `orders/${this.profileData.id}/add-agent`,
        data: data,
      })
        .then(() => {
          this.$router.push({ path: "/orders/show-all" });
          this.$iziToast.success({
            title: this.$t("success"),
            message: "تم تخصيص الفني بنجاح",
          });
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.btnLoading = false;
        });
    },
    sendNotifications() {
      const frmData = new FormData();

      frmData.append("all", 0);
      frmData.append("user_type", this.name);
      frmData.append("user_ids[0]", this.profileData.id);
      frmData.append("title", this.notification_data.title);
      frmData.append("body", this.notification_data.body);

      this.axios
        .post(`notification`, frmData)
        .then(() => {
          this.show = false;
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
        })
        .catch((err) =>
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          })
        );
    },
    startChat() {
      // showChat
      this.axios
        .post(`support_chats/new/${this.profileData.id}`)
        .then((res) => console.log(res));
    },
    sendMessage() {
      const frmData = new FormData();
      // support_chats/new/306

      frmData.append("all", 0);
      frmData.append("user_type", this.name);
      frmData.append("user_ids[0]", this.profileData.id);
      frmData.append("title", this.notification_data.title);
      frmData.append("body", this.notification_data.body);

      this.axios
        .post(`${this.name}/notification`, frmData)
        .then(() => {
          this.show = false;
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
        })
        .catch((err) =>
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          })
        );
    },
    changeVerfyStatus() {
      // const frmData = new FormData();
      // frmData.append("_method", "PUT");
      // frmData.append("is_active", +this.profileData.is_admin_active_user);

      this.axios
        .post(`${this.name}/${this.profileData.id}/update-is-admin-accept`)
        .then(() =>
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          })
        )
        .catch((err) =>
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          })
        );
    },
    changeLockStatus() {
      const frmData = new FormData();
      frmData.append("_method", "PUT");
      frmData.append("is_locked", +this.profileData.is_locked);

      this.axios
        .post(`${this.name}/${this.profileData.id}/update-locked`, frmData)
        .then(() =>
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          })
        )
        .catch((err) =>
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          })
        );
    },

    changeActiveStatus() {
      // const frmData = new FormData();
      // frmData.append("_method", "PUT");
      // frmData.append("is_active", +this.profileData.is_active);

      let url = "";
      if (this.name == "users") {
        url = `${this.name}/${this.profileData.id}/toggle-active-user`;
      } else if (this.name == "providers") {
        url = `${this.name}/${this.profileData.id}/toggle-active-provider`;
      }

      this.axios
        .patch(url)
        .then(() =>
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          })
        )
        .catch((err) =>
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          })
        );
    },
    changeBanStatus() {
      // const frmData = new FormData();
      // frmData.append("_method", "PUT");
      // frmData.append("is_ban", +this.profileData.is_ban);

      let url = "";
      if (this.name == "users") {
        url = `${this.name}/${this.profileData.id}/toggle-ban-user`;
      } else if (this.name == "providers") {
        url = `${this.name}/${this.profileData.id}/toggle-ban-provider`;
      }

      this.axios
        .patch(url)
        .then(() =>
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          })
        )
        .catch((err) =>
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          })
        );
    },
    changeImage(e) {
      e.target.src = require("@/assets/media/images/car.gif");
    },
    orderStatusList(status) {
      if (this.allData.is_pickup_from_branch) {
        if (status == "pending") {
          return [
            {
              text: this.$t("accept"),
              value: "order_placed",
            },
            { text: this.$t("reject"), value: "admin_reject" },
          ];
        } else if (status == "order_placed") {
          return [
            {
              text: this.$t("progress"),
              value: "progress",
            },
            { text: this.$t("cancel"), value: "admin_cancel" },
          ];
        } else if (status == "progress") {
          return [
            {
              text: this.$t("deliverd"),
              value: "delivered",
            },
            { text: this.$t("cancel"), value: "admin_cancel" },
          ];
        }
      } else {
        if (status == "pending") {
          return [
            {
              text: this.$t("accept"),
              value: "order_placed",
            },
            { text: this.$t("reject"), value: "admin_reject" },
          ];
        } else if (status == "order_placed") {
          return [
            {
              text: this.$t("progress"),
              value: "progress",
            },
            { text: this.$t("cancel"), value: "admin_cancel" },
          ];
        } else if (status == "progress") {
          return [
            {
              text: this.$t("on_the_way"),
              value: "on_the_way",
            },
            { text: this.$t("cancel"), value: "admin_cancel" },
          ];
        } else if (status == "on_the_way") {
          return [
            {
              text: this.$t("arrived"),
              value: "arrived",
            },
            { text: this.$t("cancel"), value: "admin_cancel" },
          ];
        } else if (status == "arrived") {
          return [
            {
              text: this.$t("delivered"),
              value: "delivered",
            },
            { text: this.$t("cancel"), value: "admin_cancel" },
          ];
        }
      }
    },
    orderStatus(status) {
      let message = "";
      switch (status) {
        case "pending":
          message = this.$t("orderStatus.new");
          break;
        case "store_accept ":
          message = this.$t("orderStatus.new");

          break;
        case "in_progress":
          message = this.$t("orderStatus.progress");

          break;
        case "store_reject":
          message = this.$t("orderStatus.reject");

          break;
        case "admin_cancel":
          message = this.$t("orderStatus.cancel");

          break;
        default:
      }
      return message;
    },
    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      if (this.data.report_price) {
        data.append("report_price", this.data.report_price);
      }

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
  mounted() {},
};
</script>

<style lang="scss">
.personal_information {
  // margin-top: 30px;
  .avatar {
    h3.name {
      margin: 15px 0 0;
      text-align: center;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;

      text-transform: capitalize;

      color: #000000;
    }

    .rate {
      text-align: center;

      button {
        padding: 3px;
      }
    }

    .actions {
      display: flex;
      justify-content: center;

      .action {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 15px;
        background: #ffffff;
        border-radius: 5px;

        &:nth-child(2) {
          margin-inline: 5px;
        }

        font-size: 18px;
        color: var(--main);
      }
    }

    padding-bottom: 20px;
    border-bottom: 1px solid rgba(142, 142, 169, 0.2);
  }

  .user_info {
    margin-top: 10px;
    display: flex;
    align-items: center;

    h5.title {
      font-style: normal;
      font-weight: 400;
      font-size: 16px !important;
      line-height: 22px;
      text-transform: capitalize;
      margin: 0;
      color: var(--mainText);
      min-width: 120px;
    }

    p {
      margin: 5px 0 0;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-transform: lowercase;
      word-break: break-all;

      color: #000000;
    }

    &:last-child {
      margin-bottom: 15px;
    }
  }

  .user_status {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-transform: capitalize;

    .v-input--selection-controls__input {
      margin: 0;
    }

    .v-input__slot {
      padding: 0;
    }

    margin-top: 15px;
  }

  .section_title {
    text-align: start;
    margin-bottom: 10px;
    font-size: 16px !important;
  }
}

.order_card {
  background: #ffffff;
  border-radius: 10px;
  padding: 13px;
  @include flexSpaceBetweenAlignment;
  align-items: normal;

  .img {
    @include flexEndAlignment;
    flex-direction: column;

    img {
      opacity: 0.7;
      width: 95px;
    }
  }

  .exp {
    @include flexSpaceBetweenAlignment;
    flex-direction: column;

    h4 {
      font-size: 19px;
    }

    span {
      font-size: 16px;
      height: 55px;

      &.tit {
        font-size: 19px;
        color: #000000;
        display: inline-block;
        margin-inline-end: 5px;
        height: auto;
      }
    }

    img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
    }
  }

  &.ver_design {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .img {
      @include flexEndAlignment;
      flex-direction: column;
      align-items: end;
      width: 100%;
    }

    .exp {
      img {
        width: 70px;
        height: 70px;
      }

      min-height: 200px;

      li {
        margin-bottom: 10px;
      }
    }
  }
}

.order_details_container {
  display: flex;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 12px;

  .order_details_cards {
    background: #ffffff !important;
    padding: 1rem;
    width: 100%;

    @media (min-width: 768px) {
      width: 385px;
    }

    border-radius: 1rem;

    .order_card {
      padding: 0;
      margin-bottom: 0.5rem;
      background: transparent;

      .exp {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-direction: row;
        flex-wrap: wrap;

        h4 {
          margin: 0;
          font-weight: normal;
          position: relative;
          font-size: 1rem;

          &::after {
            content: " : ";
            display: inline;
          }
        }

        span {
          height: auto;
          color: #000000;
        }
      }
    }
  }

  .services {
    padding: 1rem;
    background: #fff;
    flex: 1;
    border-radius: 1rem;

    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        span {
          color: #000;
          font-size: 14px;
        }

        &.title {
          span {
            font-size: 16px !important;

            font-weight: 700;
          }
        }
      }
    }
  }
}
.img_div {
  height: 300px;
  img {
    max-width: 100%;
    height: 100%;
  }
}
.custom_card {
  audio {
    width: 100%;
  }
}
</style>
