<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="wrapper userDetails" v-else>
      <div class="row">
        <!-- Start:: Actions Buttons -->
        <div class="col-12 mb-5">
          <div
            class="action fs-6 d-flex align-items-end justify-content-end gap-3"
          >
            <div
              class="mt-3 d-flex align-items-center justify-content-start gap-3"
            >
              <button
                v-if="adsData?.ads_status === 'pending'"
                @click="show_modal(adsData?.id)"
                class="d-flex align-items-center justify-content-center gap-2"
              >
                <span class="text-success fw-bold">
                  {{ $t("status.accept") }}
                </span>

                <i class="fal fa-check-circle text-success"></i>
              </button>
              <button
                v-if="adsData?.ads_status === 'pending'"
                @click="show_reject_modal(adsData?.id)"
                class="d-flex align-items-center justify-content-center gap-2"
              >
                <span class="text-danger fw-bold">
                  {{ $t("status.reject") }}
                </span>

                <i class="fal fa-times-circle text-danger"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- End:: Actions Buttons -->

        <div class="col-md-4">
          <h3 class="table-title title">
            {{ $t("labels.user_details") }}
          </h3>
          <Profile :profileData="userData" name="adsUser" />

          <template v-if="winnerData">
            <h3 class="table-title title">
              {{ $t("labels.winner_details") }}
            </h3>
            <Profile :profileData="winnerData" name="winner" />
          </template>
        </div>
        <div class="col-md-8">
          <simple-card classes="w-100 h-100">
            <div class="col-12 my-2">
              <div class="row">
                <div class="col-12 mb-7">
                  <div class="row">
                    <div class="d-flex align-items-end justify-content-end">
                      <v-rating
                        readonly
                        background-color="#FFD700"
                        color="#FFD700"
                        half-increments
                        length="5"
                        size="20"
                        :value="adsData?.rate"
                      ></v-rating>
                    </div>

                    <!-- <div
                      class="ads_info col-12 d-flex flex-column align-items-center justify-content-center"
                    >
                      <h5 class="title">{{ $t("labels.board_image") }}</h5>
                      <img
                        v-if="adsData?.image"
                        @click="show_model_1(adsData.image)"
                        @error="imageError"
                        class="board_img"
                        :src="adsData?.image"
                        alt="image"
                      />

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div> -->

                    <div class="ads_info col-md-4">
                      <h5 class="title">{{ $t("labels.board_image") }}</h5>
                      <img
                        v-if="adsData?.image"
                        @click="show_model_1(adsData.image)"
                        @error="imageError"
                        class="board_img"
                        :src="adsData?.image"
                        alt="image"
                      />

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="ads_info col-md-4">
                      <h5 class="title">{{ $t("labels.id_image") }}</h5>

                      <img
                        v-if="adsData?.id_image"
                        @click="show_model_1(adsData.id_image)"
                        @error="imageError"
                        class="board_img"
                        :src="adsData?.id_image"
                        alt="image"
                      />
                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="ads_info col-md-4">
                      <h5 class="title">
                        {{ $t("labels.ownership_seller_transfer") }}
                      </h5>

                      <img
                        v-if="adsData?.buy_process?.ownership_seller_transfer"
                        @click="
                          show_model_1(
                            adsData.buy_process?.ownership_seller_transfer
                          )
                        "
                        @error="imageError"
                        class="board_img"
                        :src="adsData?.buy_process?.ownership_seller_transfer"
                        alt="image"
                      />

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.ad_number") }}</h5>
                  <p>
                    <span v-if="adsData?.id">
                      #{{ adsData?.id }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">
                    {{ $t("labels.board_no") }} {{ $t("inArabic") }}
                  </h5>
                  <p>
                    <span v-if="adsData?.board_ar">
                      {{ adsData?.board_ar }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">
                    {{ $t("labels.board_no") }} {{ $t("inEnglish") }}
                  </h5>
                  <p>
                    <span v-if="adsData?.board_en">
                      {{ adsData?.board_en }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.main_category") }}</h5>
                  <p>
                    <span
                      v-if="
                        adsData?.main_category && adsData.main_category.title
                      "
                    >
                      {{ adsData?.main_category.title }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.createdat") }}</h5>
                  <p>
                    <span v-if="adsData?.created_at">
                      {{ adsData?.created_at }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.auction_start_date") }}</h5>
                  <p>
                    <span v-if="adsData?.start_date">
                      {{ adsData?.start_date }}
                      <!-- {{ moment(adsData?.start_date).format("YYYY-MM-DD") }} -->
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.auction_start_time") }}</h5>
                  <p>
                    <span v-if="adsData?.start_time">
                      {{ adsData?.start_time }}
                      <!-- {{ moment(adsData?.start_time).format("hh:mm:ss") }} -->
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.auction_finish_date") }}</h5>
                  <p>
                    <span v-if="adsData?.finish_date">
                      {{ adsData?.finish_date }}
                      <!-- {{ moment(adsData?.finish_date).format("YYYY-MM-DD") }} -->
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.auction_finish_time") }}</h5>
                  <p>
                    <span v-if="adsData?.finish_time">
                      {{ adsData?.finish_time }}
                      <!-- {{ moment(adsData?.finish_time).format("hh:mm:ss") }} -->
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.price") }}</h5>
                  <p>
                    <span v-if="adsData?.price">
                      {{ adsData?.price }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.auction_end_price") }}</h5>
                  <p>
                    <span v-if="adsData?.auction_price">
                      {{ adsData?.auction_price }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.delivery_charge") }}</h5>
                  <p>
                    <span v-if="adsData?.delivery_charge">
                      {{ adsData?.delivery_charge }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">
                    {{ $t("labels.ownership_transfer_fees") }}
                  </h5>
                  <p>
                    <span v-if="adsData?.ownership_transfer_fees">
                      {{ adsData?.ownership_transfer_fees }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">
                    {{ $t("labels.price_percentage_value") }}
                  </h5>
                  <p>
                    <span v-if="adsData?.price_percentage">
                      {{ adsData?.price_percentage }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.bid_amount") }}</h5>
                  <p>
                    <span v-if="adsData?.price_range">
                      {{ adsData?.price_range }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.tax_fees") }}</h5>
                  <p>
                    <span v-if="adsData?.tax_fees">
                      {{ adsData?.tax_fees }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.total_price") }}</h5>
                  <p>
                    <span v-if="adsData?.total_price">
                      {{ adsData?.total_price }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-md-6 col-lg-4">
                  <h5 class="title">{{ $t("labels.tracking_fees") }}</h5>
                  <p>
                    <span v-if="adsData?.tracking_fees">
                      {{ adsData?.tracking_fees }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <div class="ads_info col-12">
                  <h5 class="title">{{ $t("labels.status") }}</h5>

                  <p v-if="adsData?.ads_status">
                    <span class="statuses" :class="adsData.ads_status">
                      {{ $t(`status.${adsData.ads_status}`) }}
                    </span>
                  </p>
                </div>

                <hr v-if="adsData?.ads_status === 'rejected'" />

                <div
                  class="ads_info col-12"
                  v-if="adsData?.ads_status === 'rejected'"
                >
                  <h5 class="title">{{ $t("labels.reject_reason") }}</h5>
                  <p>
                    <span v-if="adsData?.reject_reasone">
                      {{ adsData?.reject_reasone }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>

                <hr />
                <div class="ads_info col-12">
                  <h5 class="title">{{ $t("labels.desc") }}</h5>
                  <p>
                    <span v-if="adsData?.desc">
                      {{ adsData?.desc }}
                    </span>

                    <span class="redColor fontBold" v-else>
                      {{ $t("notFound") }}
                    </span>
                  </p>
                </div>
                <template v-if="adsData?.refuse_reason">
                  <hr />
                  <div class="ads_info col-12">
                    <h5 class="title">{{ $t("labels.reject_reason") }}</h5>
                    <p>
                      <span v-if="adsData?.refuse_reason">
                        {{ adsData?.refuse_reason }}
                      </span>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </p>
                  </div>
                </template>

                <hr />
                <div class="ads_info row mt-3">
                  <h5 class="title">{{ $t("labels.bank_details") }}</h5>
                  <div class="ads_info col-md-6 col-lg-4">
                    <h6 class="title">{{ $t("labels.account_name") }}</h6>
                    <p>
                      <span v-if="adsData?.account_name">
                        {{ adsData?.account_name }}
                      </span>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </p>
                  </div>

                  <div class="ads_info col-md-6 col-lg-4">
                    <h6 class="title">{{ $t("labels.account_number") }}</h6>
                    <p>
                      <span v-if="adsData?.account_number">
                        {{ adsData?.account_number }}
                      </span>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </p>
                  </div>

                  <div class="ads_info col-md-6 col-lg-4">
                    <h6 class="title">{{ $t("labels.bank_name") }}</h6>
                    <p>
                      <span v-if="adsData?.bank_name">
                        {{ adsData?.bank_name }}
                      </span>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </p>
                  </div>

                  <div class="ads_info col-md-6 col-lg-4">
                    <h6 class="title">{{ $t("labels.iban") }}</h6>
                    <p>
                      <span v-if="adsData?.iban">
                        {{ adsData?.iban }}
                      </span>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </p>
                  </div>
                </div>

                <template v-if="adsData?.ad_buyer">
                  <hr />
                  <div class="ads_info row mt-3">
                    <h5 class="title">{{ $t("labels.ad_buyer") }}</h5>

                    <div class="ads_info col-12 col-md-6 col-lg-3">
                      <h6 class="title">
                        {{ $t("labels.buyer_id_image") }}
                      </h6>

                      <img
                        @click="show_model_1(adsData?.buy_process?.id_image)"
                        v-if="adsData?.buy_process?.id_image"
                        class="board_img"
                        @error="imageError"
                        :src="adsData?.buy_process?.id_image"
                        alt="image"
                      />

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="ads_info col-12 col-md-6 col-lg-3">
                      <h6 class="title">
                        {{ $t("labels.board_image") }}
                      </h6>

                      <img
                        @click="show_model_1(adsData?.ad_buyer?.ad_image)"
                        v-if="adsData?.ad_buyer?.ad_image"
                        class="board_img"
                        @error="imageError"
                        :src="adsData?.ad_buyer?.ad_image"
                        alt="image"
                      />

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="ads_info col-12 col-md-6 col-lg-3">
                      <h6 class="title">{{ $t("labels.bank_transfer") }}</h6>
                      <img
                        v-if="adsData?.buy_process?.bank_transfer"
                        @click="show_model_1(adsData.buy_process.bank_transfer)"
                        @error="imageError"
                        class="board_img"
                        :src="adsData?.buy_process?.bank_transfer"
                        alt="image"
                      />
                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="ads_info col-12 col-md-6 col-lg-3">
                      <h6 class="title">
                        {{ $t("labels.ownership_buyer_transfer") }}
                      </h6>
                      <img
                        v-if="adsData?.buy_process?.ownership_buyer_transfer"
                        @click="
                          show_model_1(
                            adsData.buy_process?.ownership_buyer_transfer
                          )
                        "
                        @error="imageError"
                        class="board_img"
                        :src="adsData?.buy_process?.ownership_buyer_transfer"
                        alt="image"
                      />
                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="row">
                      <div class="ads_info col-12 col-md-6 col-lg-3">
                        <h6 class="title">
                          {{ $t("labels.board_no") }} {{ $t("inArabic") }}
                        </h6>
                        <p>
                          <span v-if="adsData?.ad_buyer?.board_ar">
                            {{ adsData?.ad_buyer?.board_ar }}
                          </span>

                          <span class="redColor fontBold" v-else>
                            {{ $t("notFound") }}
                          </span>
                        </p>
                      </div>

                      <div class="ads_info col-12 col-md-6 col-lg-3">
                        <h6 class="title">
                          {{ $t("labels.board_no") }} {{ $t("inEnglish") }}
                        </h6>
                        <p>
                          <span v-if="adsData?.ad_buyer?.board_en">
                            {{ adsData?.ad_buyer?.board_en }}
                          </span>

                          <span class="redColor fontBold" v-else>
                            {{ $t("notFound") }}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div class="ads_info col-12">
                      <h6 class="title">
                        {{ $t("labels.check_lists") }}
                      </h6>

                      <template v-if="adsData?.ad_buyer?.check_lists?.length">
                        <div
                          v-for="(item, index) in adsData?.ad_buyer
                            ?.check_lists"
                          :key="index"
                          class="mb-2"
                        >
                          {{ item?.title }}
                        </div>
                      </template>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>

                    <div class="ads_info col-12">
                      <h6 class="title">
                        {{ $t("labels.desc") }}
                      </h6>

                      <p>
                        <span v-if="adsData?.ad_buyer?.desc">
                          {{ adsData?.ad_buyer?.desc }}
                        </span>

                        <span class="redColor fontBold" v-else>
                          {{ $t("notFound") }}
                        </span>
                      </p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <hr />
                  <div class="ads_info row mt-3">
                    <div class="ads_info col-12">
                      <h5 class="title">
                        {{ $t("labels.check_lists") }}
                      </h5>

                      <template v-if="adsData?.check_lists?.length">
                        <div
                          v-for="(item, index) in adsData?.check_lists"
                          :key="index"
                          class="mb-2"
                        >
                          {{ item?.title }}
                        </div>
                      </template>

                      <span class="redColor fontBold" v-else>
                        {{ $t("notFound") }}
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </simple-card>
        </div>

        <div class="col-12 mt-5">
          <BaseCard>
            <v-data-table
              class="thumb strip auctionUsersTable"
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

              <template v-slot:[`item.user`]="{ item }">
                <span v-if="item.user">
                  {{ item.user }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.total_price`]="{ item }">
                <span v-if="item.total_price">
                  {{ item.total_price }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.buyer_price`]="{ item }">
                <span v-if="item.buyer_price">
                  {{ item.buyer_price }}
                </span>
                <span class="redColor fontBold" v-else>{{
                  $t("notFound")
                }}</span>
              </template>

              <template v-slot:[`item.date`]="{ item }">
                <span v-if="item.from">
                  {{ item.from }}
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
                  {{ $t("labels.auction_users") }}
                </h3>
                <!-- Delete dialog -->

                <!-- Add & Delete -->
              </template>
              <!-- ======================== End Top Section ======================== -->
            </v-data-table>
          </BaseCard>
        </div>
      </div>

      <!-- Ad Lifecycle Timeline -->
      <div class="col-12 mt-5" v-if="adsData">
        <BaseCard>
          <div class="pa-4">
            <h3 class="table-title title mb-4">
              {{ $t("labels.ad_lifecycle") }}
            </h3>
            <div class="lifecycle-timeline">
              <div
                v-for="(step, index) in lifecycleSteps"
                :key="'lc-' + index"
                class="lifecycle-item d-flex align-items-center"
                :class="{ 'completed': index + 1 <= currentStep, 'current': index + 1 === currentStep }"
              >
                <div class="step-indicator">
                  <div class="step-circle">
                    <i v-if="index + 1 < currentStep" class="fas fa-check"></i>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="step-line" v-if="index < lifecycleSteps.length - 1"></div>
                </div>
                <div class="step-content d-flex justify-content-between align-items-center flex-grow-1">
                  <span class="step-label">{{ step.label }}</span>
                  <span class="step-date text--secondary" v-if="getStepDate(step.status)">{{ getStepDate(step.status) }} ({{ getStepTimeAgo(step.status) }})</span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Admin Activity Log Section -->
      <div class="col-12 mt-5" v-if="adsData?.admin_activity_logs && adsData.admin_activity_logs.length">
        <BaseCard>
          <div class="pa-4">
            <h3 class="table-title title mb-4">
              {{ $t("labels.admin_activity") }}
            </h3>
            <v-timeline dense align-top>
              <v-timeline-item
                v-for="(log, index) in sortedAdminLogs"
                :key="index"
                :color="getActionColor(log.action)"
                small
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{{ log.admin_name }}</strong>
                    <span class="text--secondary text-caption d-block">{{ log.admin_email }}</span>
                    <p class="mb-0 mt-1 font-weight-medium">
                      {{ $t(`admin_actions_desc.${log.action}`) }}
                    </p>
                  </div>
                  <span class="text--secondary text-caption">{{ log.date }} ({{ log.time_ago }})</span>
                </div>
              </v-timeline-item>
              <!-- Completed step -->
              <v-timeline-item
                v-if="adsData.ads_status === 'finished'"
                color="success"
                small
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <p class="mb-0 mt-1 font-weight-bold text-success">
                      {{ $t('admin_actions_desc.completed') }}
                    </p>
                  </div>
                  <span class="text--secondary text-caption">{{ adsData.lifecycle_dates?.finished }}</span>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </BaseCard>
      </div>

      <div class="my-5 button_section d-flex gap-1 justify-content-end">
        <v-btn
          type="button"
          class="back_btn"
          @click="handleBack('/advertisements/show-all')"
        >
          {{ $t("back") }}
          <span
            :class="
              $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
            "
          ></span>
        </v-btn>
      </div>

      <!-- Start Base_Model -->
      <base-model :show="showRejectForm" @close="closeRejectForm">
        <div class="form countryForm custom_card fadeIn">
          <ValidationObserver
            ref="acceptForm"
            @submit.prevent="handleAcceptReject('refuse-ads', itemId)"
          >
            <div class="row">
              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.reject_reason')"
                class="col-12"
                rules=""
              >
                <base-input
                  :name="$t('labels.reject_reason')"
                  type="textarea"
                  :placeholder="$t('labels.reject_reason')"
                  v-model="data.refuse_reason"
                />
                <span class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>

              <div
                class="button_section d-flex gap-1 justify-content-center mt-10 mb-5"
              >
                <v-btn
                  type="submit"
                  :loading="isLoading"
                  @click="handleAcceptReject('refuse-ads', itemId)"
                  class="submit_btn"
                >
                  {{ $t("save") }}
                </v-btn>
                <v-btn type="button" class="back_btn" @click="closeRejectForm">
                  {{ $t("cancel") }}
                </v-btn>
              </div>
            </div>
          </ValidationObserver>
        </div>
      </base-model>
      <!-- End Base_Model -->

      <!-- Start Base_Model -->
      <base-model :show="showForm" @close="closeForm">
        <div class="form fadeIn">
          <ValidationObserver
            ref="acceptForm"
            @submit.prevent="handleAcceptReject('accept-ads', itemId)"
          >
            <div class="row">
              <!-- Start::  Start At -->
              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.start_date')"
                class="col-12 col-md-6"
                rules="required"
              >
                <base-picker-input
                  :name="$t('labels.start_date')"
                  type="date"
                  :allowedDate="new Date()"
                  v-model="data.start_date"
                  :placeholder="$t('labels.start_date')"
                  :acceptToUp="true"
                />

                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.start_time')"
                class="col-12 col-md-6"
                rules="required"
              >
                <base-picker-input
                  :name="$t('labels.start_time')"
                  type="time"
                  format="24hr"
                  v-model="data.start_time"
                  :placeholder="$t('labels.start_time')"
                />

                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <!-- End::  Start At -->

              <!-- Start::  End At -->
              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.finish_date')"
                class="col-12 col-md-6"
                rules="required"
              >
                <base-picker-input
                  :name="$t('labels.finish_date')"
                  type="date"
                  :allowedDate="data.start_date ? data.start_date : new Date()"
                  v-model="data.finish_date"
                  :placeholder="$t('labels.finish_date')"
                  :acceptToUp="true"
                />

                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.finish_time')"
                class="col-12 col-md-6"
                rules="required"
              >
                <base-picker-input
                  :name="$t('labels.finish_time')"
                  type="time"
                  format="24hr"
                  v-model="data.finish_time"
                  :placeholder="$t('labels.finish_time')"
                />

                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <!-- End::  End At -->

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.auction_start_price')"
                class="col-12"
                rules="required|min_value:1"
              >
                <base-input
                  :name="$t('labels.auction_start_price')"
                  type="number"
                  @keypress="preventMinus"
                  :placeholder="$t('labels.auction_start_price')"
                  v-model="data.start_price"
                />
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('labels.bid_amount')"
                class="col-12"
                rules="required|min_value:1"
              >
                <base-input
                  :name="$t('labels.bid_amount')"
                  type="number"
                  @keypress="preventMinus"
                  :placeholder="$t('labels.bid_amount')"
                  v-model="data.price"
                />
                <span v-if="errors[0]" class="error--text d-inline-block">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>

              <div
                class="button_section d-flex gap-1 justify-content-center mt-10 mb-5"
              >
                <v-btn
                  type="submit"
                  :disabled="
                    !data.start_date ||
                    !data.start_time ||
                    !data.finish_date ||
                    !data.finish_time ||
                    !data.price ||
                    !data.start_price
                  "
                  :loading="isLoading"
                  @click="handleAcceptReject('accept-ads', itemId)"
                  class="submit_btn"
                >
                  {{ $t("save") }}
                </v-btn>
                <v-btn type="button" class="back_btn" @click="closeForm">
                  {{ $t("cancel") }}
                </v-btn>
              </div>
            </div>
          </ValidationObserver>
        </div>
      </base-model>
      <!-- End Base_Model -->

      <!-- Start Image_Model -->
      <base-model @close="model_1.show = false" :show="model_1.show">
        <div class="image">
          <img
            v-if="model_1.src"
            :src="model_1.src"
            class="img-fluid"
            alt="..."
          />
        </div>
      </base-model>
      <!-- End Image_Model -->
    </div>
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
          text: this.$t("breadcrumb.advertisements.title"),
          disabled: false,
          href: "/advertisements/show-all",
        },
        {
          text: this.$t(`breadcrumb.advertisements.show`),
          disabled: true,
          href: "",
        },
      ],

      noData: false,
      adsData: null,
      userData: null,
      winnerData: null,

      //Loading
      loading: false,
      isLoading: false,

      data: {
        start_date: null,
        start_time: null,
        finish_date: null,
        finish_time: null,
        price: null,
        start_price: null,
        refuse_reason: null,
      },

      showForm: false,
      showRejectForm: false,
      itemId: null,

      rows: [],
      headers: [
        {
          text: "#",
          align: "center",
          value: "index",
          sortable: false,
        },

        {
          text: this.$t("labels.user"),
          value: "user",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.total_price"),
          value: "total_price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.buyer_price"),
          value: "buyer_price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("labels.date"),
          value: "from",
          align: "center",
          sortable: false,
        },
      ],

      model_1: {
        src: null,
        show: null,
      },

      lifecycleSteps: [
        { status: 'pending', label: this.$t('lifecycle.new') },
        { status: 'unactive', label: this.$t('lifecycle.admin_accepted') },
        { status: 'active', label: this.$t('lifecycle.auction_active') },
        { status: 'waiting', label: this.$t('lifecycle.pending_seller') },
        { status: 'accepted_by_seller', label: this.$t('lifecycle.seller_accepted') },
        { status: 'request_bank_transfer_buyer', label: this.$t('lifecycle.bank_transfer_submitted') },
        { status: 'accepted_bank_transfer', label: this.$t('lifecycle.bank_transfer_accepted') },
        { status: 'request_owner_ship_seller', label: this.$t('lifecycle.ownership_submitted_buyer') },
        { status: 'accepted_owner_ship_buyer', label: this.$t('lifecycle.ownership_buyer_accepted') },
        { status: 'ownership_transfer_seller', label: this.$t('lifecycle.ownership_submitted_seller') },
        { status: 'accepted_owner_ship_seller', label: this.$t('lifecycle.ownership_seller_accepted') },
        { status: 'delivery_uploaded', label: this.$t('lifecycle.delivery_submitted') },
        { status: 'finished', label: this.$t('lifecycle.completed') },
      ],
    };
  },

  computed: {
    currentStep() {
      if (!this.adsData) return 0;
      const status = this.adsData.ads_status;
      const index = this.lifecycleSteps.findIndex(s => s.status === status);
      return index >= 0 ? index + 1 : 1;
    },
    sortedAdminLogs() {
      if (!this.adsData?.admin_activity_logs) return [];
      const order = ['accepted', 'accepted_bank_transfer', 'accepted_ownership_buyer', 'accepted_ownership_seller', 'finished'];
      return [...this.adsData.admin_activity_logs].sort((a, b) => {
        return order.indexOf(a.action) - order.indexOf(b.action);
      });
    },
  },

  methods: {
    imageError(event) {
      event.target.src = require("@/assets/media/images/Icons/no-data.svg");
    },

    getActionColor(action) {
      const colors = {
        accepted: 'success',
        rejected: 'error',
        deleted: 'error',
        updated: 'info',
        finished: 'success',
        accepted_bank_transfer: 'success',
        rejected_bank_transfer: 'error',
        accepted_ownership_buyer: 'success',
        accepted_ownership_seller: 'success',
        rejected_ownership_buyer: 'error',
        rejected_ownership_seller: 'error',
      };
      return colors[action] || 'grey';
    },

    getStepDate(status) {
      if (!this.adsData || !this.adsData.lifecycle_dates) return null;
      return this.adsData.lifecycle_dates[status] || null;
    },

    getStepTimeAgo(status) {
      const date = this.getStepDate(status);
      if (!date) return '';
      const now = new Date();
      const then = new Date(date.replace(' ', 'T'));
      const diffMs = now - then;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays > 0) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      if (diffHours > 0) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      if (diffMins > 0) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      return 'just now';
    },

    show_model_1(e) {
      this.model_1.src = e;
      this.model_1.show = true;
    },

    // ===== showForm
    show_modal(item) {
      this.showForm = true;
      this.itemId = item;
    },

    closeForm() {
      this.showForm = !this.showForm;
    },

    // ===== showRejectForm
    show_reject_modal(item) {
      this.showRejectForm = true;
      this.itemId = item;
    },

    closeRejectForm() {
      this.showRejectForm = !this.showRejectForm;
    },

    // ===== Handle accept or reject request
    handleAcceptReject(status, id) {
      this.isLoading = true;
      const data = new FormData();

      if (status === "accept-ads") {
        data.append(
          "start_date",
          `${this.$moment(this.data.start_date).format("YYYY-MM-DD")}`
        );

        data.append(
          "finish_date",
          `${this.$moment(this.data.finish_date).format("YYYY-MM-DD")} ${
            this.data.finish_time
          }`
        );

        data.append("start_time", this.data.start_time);

        data.append("finish_time", this.data.finish_time);

        data.append("price_range", this.data.price);
        data.append("start_price", this.data.start_price);
      }

      if (status === "refuse-ads") {
        this.data.refuse_reason &&
          data.append("refuse_reason", this.data.refuse_reason);
      }

      this.axios({
        method: "POST",
        url: `${status}/${id}`,
        data: data,
        // data: status === "accept-ads" && data,
      })
        .then(() => {
          this.isLoading = false;

          this.getAdsData();
          this.showForm = false;
          this.showRejectForm = false;

          this.$swal({
            title:
              status === "accept-ads"
                ? this.$t("acceptedSuccessfully")
                : this.$t("rejectedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok"),
          });
        })
        .catch((err) => {
          this.isLoading = false;

          let message = "";
          err.response?.data.message
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

    // ============ Get Profile Data
    getAdsData() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `advertisements/${this.id}`,
      })
        .then((res) => {
          this.adsData = res?.data?.data;
          this.userData = res?.data?.data?.user;
          this.winnerData = res?.data?.data?.winner;

          this.rows = res?.data?.data?.auction_users;

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

  async mounted() {
    this.canShow = this.$permission.allowed("advertisements/show");

    if (this.id) {
      if (!this.canShow) {
        this.getAdsData();
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    }
  },
};
</script>
<style lang="scss">
.userDetails {
  .userTable {
    background-color: transparent;
  }

  .board_img {
    max-width: 150px;
    max-height: 150px;
    border-radius: 10px;
  }

  .ads_info {
    margin-bottom: 20px;

    h5.title {
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      text-transform: capitalize;
      color: var(--main);
    }

    p {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-transform: lowercase;
      word-break: break-all;
      color: var(--mainText);
    }
  }
  .auctionUsersTable {
    background-color: transparent;
  }

  .lifecycle-timeline {
    .lifecycle-item {
      position: relative;
      padding-bottom: 0;

      &.completed {
        .step-circle {
          background-color: #0d4d3b;
          color: white;
          border-color: #0d4d3b;
        }
        .step-line {
          background-color: #0d4d3b;
        }
        .step-label {
          color: #0d4d3b;
          font-weight: 600;
        }
      }

      &.current {
        .step-circle {
          background-color: #0d4d3b;
          color: white;
          border-color: #0d4d3b;
          box-shadow: 0 0 0 4px rgba(13, 77, 59, 0.2);
        }
        .step-label {
          font-weight: 700;
          color: #0d4d3b;
        }
      }

      .step-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;
      }

      .step-circle {
        width: 32px;
        height: 32px;
        min-width: 32px;
        border-radius: 50%;
        border: 2px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: #999;
        background: white;
      }

      .step-line {
        width: 2px;
        height: 24px;
        background-color: #e0e0e0;
      }

      .step-content {
        padding: 6px 0;
        width: 100%;

        .step-label {
          font-size: 14px;
          color: #666;
        }

        .step-date {
          font-size: 12px;
          color: #999;
          white-space: nowrap;
        }
      }
    }
  }

  .user-activity-card {
    background: var(--white);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 16px;

    .activity-list {
      .activity-item {
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .activity-label {
          font-weight: 500;
          color: var(--mainText);
          font-size: 14px;
        }

        .activity-value {
          font-weight: 600;
          color: var(--main);
          font-size: 14px;
        }
      }
    }
  }
}
</style>
