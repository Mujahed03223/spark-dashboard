<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="wrapper" v-else>
      <div class="row">
        <!-- <div class="col-12 col-md-4">
          <p>
            {{ $t("labels.receiverData") }}
          </p>

          <Profile :profileData="receiverData" name="receiverData" />
          <p>
            {{ $t("labels.senderData") }}
          </p>
          <Profile :profileData="senderData" name="senderData" />
        </div> -->

        <div class="col-12">
          <p>
            {{ $t("labels.messages") }}
          </p>
          <div class="user_chat_box">
            <header class="user_chat_box_header">
              <div class="user">
                <div class="image" v-if="receiverData">
                  <img :src="receiverData.image" alt="..." />
                </div>
                <div>
                  <h3 class="name" v-if="receiverData">
                    {{ receiverData.name }}
                  </h3>
                  <p class="phone" v-if="receiverData">
                    {{ receiverData.phone }}
                  </p>
                </div>
              </div>
            </header>
            <div class="chat_view mt-5">
              <template v-if="messages && messages.length > 0">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="d-flex flex-column"
                >
                  <div
                    v-if="message.type === 'client'"
                    class="sentMessage px-7 py-2 mb-5"
                  >
                    <p class="text-start text-white">{{ message.message }}</p>
                    <p class="time text-end text-white">
                      {{ moment(message.created_at).format("hh:mm A") }}
                    </p>
                  </div>

                  <!-- received section -->
                  <div class="receivedMsgSection" v-else>
                    <div class="receivedMsg px-7 mb-5">
                      <p class="text-start">{{ message.message }}</p>
                      <div class="items-center justify-end">
                        <p class="time text-end">
                          {{ moment(message.created_at).format("hh:mm A") }}
                        </p>
                      </div>
                    </div>
                    <img
                      :src="receiverData && receiverData.image"
                      alt="image"
                      class="my-auto mx-1"
                      width="60"
                      height="60"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <h4 class="text-center my-10">
                  {{ $t("labels.no_conversations") }}
                </h4>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="button_section d-flex gap-1 justify-content-center">
        <v-btn type="button" class="back_btn" @click="handleBack">
          {{ $t("back") }}
          <span
            :class="
              $i18n.locale === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'
            "
          ></span>
        </v-btn>
      </div>
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
          text: this.$t("breadcrumb.usersChats.title"),
          disabled: false,
          href: "/users-chats/show-all",
        },
        {
          text: this.$t(`breadcrumb.usersChats.show`),
          disabled: true,
          href: "",
        },
      ],

      noData: false,
      receiverData: null,
      senderData: null,
      messages: null,

      //Loading
      loading: false,
      isLoading: false,
    };
  },

  methods: {
    // ============ Get Chat Data
    getData() {
      this.loading = true;
      this.noData = true;

      this.axios({
        method: "GET",
        url: `users-chat/${this.id}`,
      })
        .then((res) => {
          this.messages = res.data.data.messages;
          this.receiverData = res.data.data.receiver;
          this.senderData = res.data.data.sender;

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
    this.canShow = this.$permission.allowed("show-admin");

    if (this.id) {
      if (!this.canShow) {
        this.getData();
      } else {
        this.$router.push({ path: `/permission-required` });
      }
    }
  },
};
</script>
