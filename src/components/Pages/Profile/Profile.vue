<template>
  <div class="personal_information">
    <BaseCard v-if="profileData">
      <div class="avatar mt-5">
        <div class="image text-center" v-if="profileData.image">
          <img
            @click="show_model_1(profileData.image)"
            @error="imageError"
            width="120"
            height="120"
            class="rounded-circle"
            :src="profileData.image"
            :alt="profileData.name"
          />
        </div>

        <h3 class="name">
          <span v-if="profileData.name || profileData.marketer">
            {{ profileData.name || profileData.marketer }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </h3>

        <div class="rate" v-if="name == 'rider' || name == 'partner'">
          <v-rating
            readonly
            background-color="#FFD700"
            color="#FFD700"
            half-increments
            length="5"
            size="20"
            :value="profileData.rate"
          ></v-rating>
        </div>

        <div
          class="actions"
          v-if="
            name == 'users' ||
            name == 'adsUser' ||
            name == 'winner' ||
            name == 'providers' ||
            name == 'sliders' ||
            name == 'referral-links' ||
            name == 'offers'
          "
        >
          <router-link
            v-if="canEdit"
            class="action"
            :to="`/${name === 'adsUser' || name === 'winner' ? 'users' : name}/edit/${
              profileData.id
            }`"
          >
            <i class="fas fa-edit"></i>
          </router-link>
          <template v-if="canShow">
            <router-link
              v-if="name === 'adsUser' || name == 'winner'"
              class="action"
              :to="`/${name === 'adsUser' || name === 'winner' ? 'users' : name}/show/${
                profileData.id
              }/cards`"
            >
              <i class="fas fa-eye"></i>
            </router-link>
          </template>

          <a
            v-if="profileData.phone"
            class="action"
            :href="`tel:${profileData.phone_code}${profileData.phone}`"
          >
            <i class="fas fa-phone"></i>
          </a>
        </div>
      </div>

      <div class="user_info" v-if="name === 'referral-links'">
        <h5 class="title">{{ $t("labels.city") }} :</h5>

        <p>
          <span v-if="profileData.city">
            {{ profileData.city.name }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'referral-links'">
        <h5 class="title">{{ $t("labels.type") }} :</h5>

        <p>
          <span v-if="profileData.type">
            {{
              profileData.type === "percentage"
                ? $t("labels.percentage")
                : $t("labels.amount")
            }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'referral-links'">
        <h5 class="title">{{ $t("labels.value") }} :</h5>

        <p>
          <span v-if="profileData.value">
            {{ profileData.value }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'referral-links'">
        <h5 class="title">{{ $t("labels.link") }} :</h5>

        <p>
          <span v-if="profileData.link">
            {{ profileData.link }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'receiverData' || name === 'senderData'">
        <h5 class="title">{{ $t("labels.email") }} :</h5>

        <p>
          <span v-if="profileData.email">
            {{ profileData.email }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'receiverData' || name === 'senderData'">
        <h5 class="title">{{ $t("labels.phone") }} :</h5>

        <p>
          <span v-if="profileData.phone">
            {{ profileData.phone }}
            {{ profileData.phone_code }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'receiverData' || name === 'senderData'">
        <h5 class="title">{{ $t("labels.gender") }} :</h5>

        <p>
          <span v-if="profileData.gender">
            {{ profileData.gender === "male" ? $t("male") : $t("female") }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name === 'receiverData' || name === 'senderData'">
        <h5 class="title">{{ $t("labels.status") }} :</h5>

        <p>
          <span :class="profileData.is_active ? 'active' : 'inactive'">{{
            profileData.is_active ? $t("active") : $t("inactive")
          }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'offers'">
        <h5 class="title">{{ $t("labels.discount") }} :</h5>

        <p>
          <span v-if="profileData.discount">
            {{ profileData.discount }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'offers'">
        <h5 class="title">{{ $t("labels.provider") }} :</h5>

        <p>
          <span v-if="profileData.provider.full_name">
            {{ profileData.provider.full_name }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>
      <!-- 
      <div class="user_info" v-if="name == 'users' || name == 'providers'">
        <h5 class="title">{{ $t("labels.email") }} :</h5>

        <p>
          <span v-if="profileData.email">
            {{ profileData.email }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div> -->

      <!-- <div
        class="user_info"
        v-if="
          name == 'users' ||
          name == 'providers' ||
          name == 'sliders' ||
          name == 'offers'
        "
      >
        <h5 class="title">{{ $t("labels.createdAt") }}</h5>
        <p>
          <span v-if="profileData.created_at">
            {{ profileData.created_at }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div> -->

      <!-- <div
        class="user_info"
        v-if="name == 'users' || name == 'providers' || name == 'callcenter'"
      >
        <h5 class="title">{{ $t("labels.phone") }}</h5>
        <p>
          <span v-if="profileData.phone_complete_form"
            ><bdi>{{ profileData.phone_complete_form }}</bdi></span
          >

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div> -->

      <div class="user_info" v-if="name == 'providers'">
        <h5 class="title">{{ $t("labels.title") + $t("inArabic") }}</h5>
        <p>
          <span v-if="profileData.ar.title">
            {{ profileData.ar.title }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'providers'">
        <h5 class="title">{{ $t("labels.title") + $t("inEnglish") }}</h5>
        <p>
          <span v-if="profileData.en.title">
            {{ profileData.en.title }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'providers'">
        <h5 class="title">{{ $t("labels.category") }}</h5>
        <p>
          <span v-if="profileData.category.title">
            {{ profileData.category.title }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'providers'">
        <h5 class="title">{{ $t("labels.subscribe_from") }}</h5>
        <p>
          <span v-if="profileData.subscribe_from">
            {{ profileData.subscribe_from }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'providers'">
        <h5 class="title">{{ $t("labels.subscribe_to") }}</h5>
        <p>
          <span v-if="profileData.subscribe_to">
            {{ profileData.subscribe_to }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'providers'">
        <h5 class="title">{{ $t("labels.address") }}</h5>
        <p>
          <span v-if="profileData.address">
            {{ profileData.address.location_description }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'sliders'">
        <h5 class="title">{{ $t("labels.title") + $t("inArabic") }}</h5>
        <p>
          <span v-if="profileData.ar.title">
            {{ profileData.ar.title }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'offers'">
        <h5 class="title">{{ $t("labels.title") }}</h5>
        <p>
          <span v-if="profileData.title">
            {{ profileData.title }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'sliders' || name == 'offers'">
        <h5 class="title">{{ $t("labels.title") + $t("inEnglish") }}</h5>
        <p>
          <span v-if="profileData.en.title">
            {{ profileData.en.title }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'sliders'">
        <h5 class="title">{{ $t("labels.desc") + $t("inArabic") }}</h5>
        <p>
          <span v-if="profileData.ar.desc">
            {{ profileData.ar.desc }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'sliders'">
        <h5 class="title">{{ $t("labels.desc") + $t("inEnglish") }}</h5>
        <p>
          <span v-if="profileData.en.desc">
            {{ profileData.en.desc }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'sliders'">
        <h5 class="title">{{ $t("labels.link") }}</h5>
        <p>
          <span v-if="profileData.link">
            {{ profileData.link }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_info" v-if="name == 'sliders'">
        <h5 class="title">{{ $t("labels.provider") }}</h5>
        <p>
          <span v-if="profileData.provider.full_name">
            {{ profileData.provider.full_name }}
          </span>

          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div class="user_status" v-if="false">
        <span class="active">{{ $t("labels.is_admin_active_user") }}</span>
        <span>
          <v-switch
            color="#26BE00"
            v-model="profileData.is_admin_active_user"
            @change="changeVerfyStatus"
          ></v-switch
        ></span>
      </div>

      <!-- <div class="user_status" v-if="name == 'users' || name == 'providers'">
        <span class="active">{{ $t("labels.is_active") }}</span>
        <span>
          <v-switch
            color="#26BE00"
            v-model="profileData.is_active"
            @change="changeActiveStatus"
          ></v-switch
        ></span>
      </div>

      <div class="user_status" v-if="name == 'users' || name == 'providers'">
        <span class="inactive">{{ $t("labels.is_ban") }}</span>
        <span>
          <v-switch
            color="#FF0000"
            @change="changeBanStatus"
            v-model="profileData.is_ban"
          ></v-switch
        ></span>
      </div> -->

      <div class="user_status" v-if="name == 'rider' || name == 'partner'">
        <span class="inactive">{{ $t("labels.lockAccount") }}</span>
        <span>
          <v-switch
            @change="changeLockStatus"
            color="#FF0000"
            v-model="profileData.is_locked"
          ></v-switch
        ></span>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <h5 class="title">{{ $t("labels.user_name") }}</h5>

        <p>
          <span v-if="profileData.username || profileData?.name">
            {{ profileData.username || profileData?.name }}
          </span>
          <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
        </p>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.username">
          <h5 class="title">{{ $t("labels.bank_name") }}</h5>

          <p>
            <span v-if="profileData.bank_name">
              {{ profileData.bank_name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.account_name">
          <h5 class="title">{{ $t("labels.account_name") }}</h5>

          <p>
            <span v-if="profileData.account_name">
              {{ profileData.account_name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.account_number">
          <h5 class="title">{{ $t("labels.account_number") }}</h5>

          <p>
            <span v-if="profileData.account_number">
              {{ profileData.account_number }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.iban">
          <h5 class="title">{{ $t("labels.iban") }}</h5>

          <p>
            <span v-if="profileData.iban">
              {{ profileData.iban }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.building">
          <h5 class="title">{{ $t("labels.building") }}</h5>

          <p>
            <span v-if="profileData.building">
              {{ profileData.building }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.city_name">
          <h5 class="title">{{ $t("labels.city") }}</h5>

          <p>
            <span v-if="profileData.city_name">
              {{ profileData.city_name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        class="user_info d-flex justify-content-between"
        v-if="name === 'adsUser' || name === 'winner'"
      >
        <template v-if="profileData.street">
          <h5 class="title">{{ $t("labels.street") }}</h5>

          <p>
            <span v-if="profileData.street">
              {{ profileData.street }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </template>
      </div>

      <div
        v-if="
          name == 'company' ||
          name == 'users' ||
          name == 'advertisements' ||
          name == 'callcenter'
        "
      >
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.user_name") }}</h5>

          <p>
            <span v-if="profileData.username">
              {{ profileData.username }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.phone") }}</h5>
          <p>
            <a
              v-if="profileData.phone"
              :href="`tel:${profileData.phone_code}${profileData.phone}`"
            >
              <bdi>{{ profileData.phone }}</bdi>
              <bdi> {{ profileData.phone_code }} </bdi></a
            >
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.gender") }}</h5>
          <p>
            <span v-if="profileData.gender">
              {{ $t(profileData.gender) }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.ID_number") }}</h5>
          <p>
            <span v-if="profileData.ID_number">
              {{ profileData.ID_number }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.country") }}</h5>
          <p>
            <span v-if="profileData.country && profileData.country.name">
              {{ profileData.country.name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.city") }}</h5>
          <p>
            <span v-if="profileData.city && profileData.city.name">
              {{ profileData.city.name }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.street") }}</h5>
          <p>
            <span v-if="profileData.street">
              {{ profileData.street }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_info d-flex justify-content-between">
          <h5 class="title">{{ $t("labels.building") }}</h5>
          <p>
            <span v-if="profileData.building">
              {{ profileData.building }}
            </span>
            <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
          </p>
        </div>

        <hr class="line" />
        <div class="user_status">
          <span class="active">{{ $t("labels.is_active") }}</span>
          <span
            class="status pt-2"
            :class="profileData.is_active ? 'active' : 'inactive'"
          >
            {{ profileData.is_active ? $t("active") : $t("inactive") }}
          </span>
        </div>

        <hr class="line" />
        <div class="user_status">
          <span class="active">{{ $t("labels.is_ban") }}</span>
          <span class="status pt-2" :class="profileData.is_ban ? 'inactive' : 'active'">
            {{ profileData.is_ban ? $t("yes") : $t("no") }}
          </span>
        </div>
        <hr class="line" />

        <div class="ban_reason" v-if="profileData.is_ban">
          <h5 class="title">{{ $t("labels.ban_reason") }}</h5>
          <div>
            <p>
              <span v-if="profileData.ban_reason">
                {{ profileData.ban_reason }}
              </span>
              <span class="redColor fontBold" v-else>{{ $t("notFound") }}</span>
            </p>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- <div v-if="name === 'users'">
      <TablesOrders :profileData="profileData" :name="name" />
    </div> -->
    <div v-if="name === 'callcenter'">
      <TablesOrders :profileData="profileData" :name="name" />
    </div>

    <!-- Start Image_Model -->
    <base-model @close="model_1.show = false" :show="model_1.show">
      <div class="image">
        <img v-if="model_1.src" :src="model_1.src" class="img-fluid" alt="..." />
      </div>
    </base-model>
    <!-- End Image_Model -->
  </div>
</template>

<script>
import TablesOrders from "../Profile/Tables/Orders.vue";
export default {
  props: ["profileData", "name"],
  components: {
    TablesOrders,
  },
  data() {
    return {
      show: false,
      showChat: false,
      notification_data: {
        title: null,
        body: null,
      },
      model_1: {
        src: null,
        show: null,
      },
      loading: false,
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
  },

    async mounted() {
    this.canShowUser = this.$permission.allowed("users/show");
    this.canShowProvider = this.$permission.allowed("providers/show");
    this.canShowCallCenter = this.$permission.allowed("callcenters/show");
  }
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

  .ban_reason {
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
</style>
