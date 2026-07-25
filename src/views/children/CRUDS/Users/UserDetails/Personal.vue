<template>
  <div class="user_data">
    <!-- Start Main Loader -->

    <!-- End Main Loader -->
    <div class="personal_data_wrapper fadeIn mt-5">
      <div class="order-details-page mb-5">
        <div class="row py-2 mx-1 justify-content-center align-items-center">
          <div class="col-12">
            <div class="image text-center mb-5" v-if="userInfo.image">
              <img
                @click="show_model_1(userInfo.image)"
                @error="imageError"
                width="120"
                height="120"
                class="rounded-circle"
                :src="userInfo.image"
                :alt="userInfo.name"
              />
            </div>
            <div class="details border-right-0">
              <div class="row">
                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.user_name") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.username">
                            {{ userInfo.username }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-user"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.phone") }}
                        </h5>
                        <p>
                          <a
                            v-if="userInfo.phone"
                            :href="`tel:${userInfo.phone_code}${userInfo.phone}`"
                          >
                            <bdi>{{ userInfo.phone }}</bdi>
                            <bdi> {{ userInfo.phone_code }} </bdi></a
                          >
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-phone"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.gender") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.gender">
                            {{ $t(userInfo.gender) }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-venus-mars"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.ID_number") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.ID_number">
                            {{ userInfo.ID_number }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-id-card"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.country") }}
                        </h5>
                        <p>
                          <span
                            v-if="userInfo.country && userInfo.country.name"
                          >
                            {{ userInfo.country.name }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-globe"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.city") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.city && userInfo.city.name">
                            {{ userInfo.city.name }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-globe"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.street") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.street">
                            {{ userInfo.street }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-globe"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.building") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.building">
                            {{ userInfo.building }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-building"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.bank_name") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.bank_name">
                            {{ userInfo.bank_name }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-credit-card"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.account_name") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.account_name">
                            {{ userInfo.account_name }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-credit-card"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.account_number") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.account_number">
                            {{ userInfo.account_number }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-credit-card"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">
                          {{ $t("labels.iban") }}
                        </h5>
                        <p>
                          <span v-if="userInfo.iban">
                            {{ userInfo.iban }}
                          </span>
                          <span class="redColor fontBold" v-else>{{
                            $t("notFound")
                          }}</span>
                        </p>
                      </div>
                      <div class="icon">
                        <i class="fal fa-credit-card"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">{{ $t("labels.is_active") }}</h5>
                        <span
                          class="status p-0"
                          :class="userInfo.is_active ? 'active' : 'inactive'"
                        >
                          {{
                            userInfo.is_active ? $t("active") : $t("inactive")
                          }}
                        </span>
                      </div>
                      <div class="icon">
                        <i class="fal fa-user-check"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 pt-0 mb-5">
                  <div class="customer">
                    <div class="item">
                      <div class="info">
                        <h5 class="title">{{ $t("labels.is_ban") }}</h5>
                        <!-- <p>{{ userInfo.is_ban ? "محظور" : "غير محظور" }}</p> -->
                        <span
                          class="status p-0"
                          :class="userInfo.is_ban ? 'inactive' : 'active'"
                        >
                          {{ userInfo.is_ban ? $t("yes") : $t("no") }}
                        </span>
                      </div>
                      <div class="icon">
                        <i class="fal fa-user-check"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="my-5 button_section d-flex gap-1 justify-content-end"
                >
                  <v-btn
                    v-if="!canEdit"
                    type="submit"
                    @click="editItem(userInfo.id)"
                    class="submit_btn"
                  >
                    {{ $t("edit") }}
                  </v-btn>

                  <v-btn
                    type="button"
                    class="back_btn"
                    @click="handleBack('/users/show-all')"
                  >
                    {{ $t("back") }}
                    <span
                      :class="
                        $i18n.locale === 'ar'
                          ? 'fas fa-arrow-left'
                          : 'fas fa-arrow-right'
                      "
                    ></span>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
</template>
<script>
export default {
  props: ["userInfo"],

  data() {
    return {
      model_1: {
        src: null,
        show: null
      }
    };
  },

  methods: {
    imageError(event) {
      event.target.src = require("@/assets/media/images/logo/logo.png");
    },

    show_model_1(e) {
      this.model_1.src = e;
      this.model_1.show = true;
    },

    editItem(id) {
      this.$router.push({ path: `/users/edit/` + id });
    }
  },
  created() {
    this.canEdit = this.$permission.allowed("users/edit");
  }
};
</script>

<style>
.border-right-0 {
  border-right-width: 0 !important;
}
</style>
