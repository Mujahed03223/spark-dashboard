<template>
  <div class="form" v-if="messageData">
    <div class="messageInfo custome_card">{{ messageData.content }}</div>

    <div class="my-5">
      <div class="replies" v-if="messageData.replies.length > 0">
        <div
          class="custome_card reply"
          v-for="reply in messageData.replies"
          :key="reply.id"
        >
          <div class="userInfo">
            <div class="image">
              <img :src="reply.sender.avatar" alt="" />
            </div>

            <h4>{{ reply.sender.first_name + reply.sender.last_name }}</h4>
          </div>

          <div class="content">
            <p class="para">{{ reply.reply }}</p>
          </div>

          <span class="created_at">{{ reply.created_at }}</span>
        </div>
      </div>
      <div class="noData" v-else>No Replies Yet</div>
    </div>

    <div @click="showForm = true">
      <base-button class="center">{{ $t("reply") }}</base-button>
    </div>

    <base-model :show="showForm" @close="showForm = false" name="fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- Start:: Reply -->
          <base-input
            col="12"
            type="ckeditor"
            :placeholder="$t('labels.reply')"
            :required="true"
            v-model="data.reply"
          />
          <!-- End:: Reply -->

          <!-- Start:: SendType -->
          <base-select-input
            col="12"
            v-model="data.send_type"
            getUrl="send_types"
            :static="true"
            :staticItems="sendTypes"
            :placeholder="$t('labels.send_type')"
          ></base-select-input>
          <!-- End:: SendType -->
        </div>

        <base-button :loading="loading" class="center">{{
          $t("submit")
        }}</base-button>
      </form>
    </base-model>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: ["id"],

  data() {
    return {
      // Loading
      loading: false,

      showForm: false,

      data: {
        send_type: null,
        reply: null,
      },

      messageData: null,
    };
  },

  methods: {
    ...mapMutations({
      set_breadcrumb: "set_breadcrumb",
    }),

    getData() {
      this.axios({
        method: "GET",
        url: `contacts/${this.id}`,
      })
        .then((res) => {
          this.messageData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      data.append("reply", this.data.reply);
      data.append("send_type", this.data.send_type.value);
      data.append("_method", "PUT");

      // =============== Start:: Send Reply ===============
      this.axios({
        method: "POST",
        url: `contacts/${this.id}`,
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            displayMode: 2,
            title: this.$t("success"),
            message: this.$t("sendSuccess"),
          });
          this.getData();
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

  computed: {
    sendTypes() {
      if (this.lang == "ar") {
        return [
          {
            id: 1,
            name: "Fcm",
            value: "fcm",
          },
          {
            id: 2,
            name: "Sms",
            value: "sms",
          },
          {
            id: 3,
            name: "Email",
            value: "email",
          },
        ];
      }
      return [
        {
          id: 1,
          name: "Fcm",
          value: "fcm",
        },
        {
          id: 2,
          name: "Sms",
          value: "sms",
        },
        {
          id: 3,
          name: "Email",
          value: "email",
        },
      ];
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.set_breadcrumb({
      title: this.$t("breadcrumb.contacts.title"),
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.contacts.title"),
          disabled: false,
          href: "/contacts",
        },
        {
          text: this.$t("breadcrumb.contacts.show"),
          disabled: true,
          href: "",
        },
      ],
    });

    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.custome_card {
  background: #fff;
  padding: 15px;
  border-radius: 20px;
}

.replies {
  max-height: 75vh;
  overflow-y: scroll;
  // border: 1px solid #d2d2d2;
  // border-radius: 20px;
  // padding: 20px;

  .reply {
    position: relative;
    display: flex;
    align-items: center;
    margin: 20px 0;
    padding-inline-end: 85px;

    .userInfo {
      margin-inline-end: 20px;
      text-align: center;

      .image {
        margin-bottom: 10px;

        img {
          height: 70px;
          width: 70px;
          border-radius: 50%;
        }
      }

      h4 {
        font-size: 17px;
      }
    }

    span.created_at {
      position: absolute;
      top: 5px;
      left: 8px; // RTL
      font-size: 13px;
      color: var(--lightGray);
    }
  }
}

form {
  padding: 20px;
  background: #eee;
  border-radius: 20px;
}
</style>
