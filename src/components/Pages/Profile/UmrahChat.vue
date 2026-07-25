<template>
  <div>
    <div class="wrapper">
      <div class="row">
        <div class="col-12">
          <!-- <p>
            {{ $t("labels.messages") }}
          </p> -->
          <h3 class="table-title title">
            {{ $t("labels.messages") }}
          </h3>
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
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      receiverData: null,
      senderData: null,
      messages: null,

      //Loading
      loading: false,
    };
  },

  methods: {
    // ============ Get Chat Data
    getData() {
      this.loading = true;

      this.axios({
        method: "GET",
        url: `users-chat-by-umrah-id/${this.id}`,
      })
        .then((res) => {
          this.messages = res.data.data && res.data.data.messages;
          this.receiverData = res.data.data && res.data.data.receiver;
          this.senderData = res.data.data && res.data.data.sender;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
        });
    },
  },

  async mounted() {
    // if (this.id) {
    this.getData();
    // }
  },
};
</script>
