<template>
  <div>
    <main-nav />
    <Sidebar />
    <div class="app-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// START:: IMPORTING VUEX HELPERS
import { mapGetters } from "vuex";
// END:: IMPORTING VUEX HELPERS
import io from "socket.io-client";
import Sidebar from "@/components/Layouts/Sidebar.vue";

import MainNav from "../components/Layouts/MainNav.vue";

export default {
  name: "Home",

  components: { Sidebar, MainNav },

  data() {
    return {};
  },

  computed: {
    // START:: VUEX GET AUTHENTICATED USER DATA
    ...mapGetters("auth_module", ["currentUser"]),
    // END:: VUEX GET AUTHENTICATED USER DATA
    chats() {
      return this.$store.getters["chat_module/chats"];
    },
    user() {
      return this.$store.getters["auth_module/currentUser"];
    }
  },

  methods: {
    launch_resize_dispatch() {
      this.$store.dispatch("sideNav_module/onResize");
    },
    setMessage(payload) {
      var audio = document.createElement("AUDIO");
      document.body.appendChild(audio);
      let found = this.chats.find((el) => el.id == payload.data.id);
      if (found) {
        found.last_message = payload.data.message;
        found.last_message_created_at = payload.data.ago_time;
        found.last_message_created = new Date(
          payload.data.created_at
        ).getTime();
        found["is_read"] = payload.data.is_read;
      }

      if (payload.data.message_type == "complaint") {
        audio.src = require("@/assets/media/sounds/complaint.wav");
        audio.play();
        this.$swal({
          title: this.$t("newComplaint"),
          text: `${this.$t(payload.data.sender.user_type)}  ${this.$t(
            payload.data.sender.name
          )}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: this.$t("cancel"),
          confirmButtonText: this.$t("show")
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push("/chats");
          }
        });
      } else {
        audio.src = require("@/assets/media/sounds/notification.wav");
        audio.play();
        this.$iziToast.show({
          title: this.$t("newMessage"),
          message: `${this.$t(payload.data.sender.user_type)}  ${this.$t(
            payload.data.sender.name
          )}`,
          balloon: true,
          displayMode: 2,
          timeout: 15000
        });
      }
    },
    allChatSoket() {
      const _self = this;
      var socket = io(process.env.VUE_APP_BASE_SOCKET_URL);
      console.log(socket);
      socket.on(
        `notification:${localStorage.getItem("spark_dash_User_Id")}`,
        (payload) => {
          console.log(payload);
          if (payload) {
            var audio = document.createElement("AUDIO");
            document.body.appendChild(audio);
            // var audio = new Audio();
            if (payload.notify_type == "unusual_behaviour") {
              audio.src = require("@/assets/media/sounds/complaint.wav");
              audio.play();
              this.$swal({
                title: payload.title[this.$i18n.locale],
                text: payload.body[this.$i18n.locale],
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: this.$t("cancel"),
                confirmButtonText: this.$t("show")
              }).then((result) => {
                if (result.isConfirmed) {
                  this.$router
                    .push(`/trips/show/${payload.trip_id}`)
                    .catch(() => {});
                }
              });
            } else {
              // var audio = new Audio();
              audio.src = require("@/assets/media/sounds/notification.wav");
              audio.play();
            }

            let dataToPush = {
              notify_id: payload.notify_id,
              body: payload.body,
              title: payload.title
            };

            _self.$store.commit(
              "notifications_module/pushNotification",
              dataToPush
            );

            // console.log(payload);
            this.$iziToast.show({
              title: payload.title,
              message: payload.body
            });
          }
        }
      );
    },
    getPermissions() {
      this.axios
        .get("get_my_permissions")
        .then((res) =>
          localStorage.setItem(
            "sianah_permissions",
            JSON.stringify(res.data.data)
          )
        );
    },
    getControls() {
      this.axios
        .get("get_my_control_permissions")
        .then((res) =>
          localStorage.setItem("sianah_controls", JSON.stringify(res.data.data))
        );
    }
  },

  mounted() {
    // this.$store.dispatch("chat_module/getChats");
    // this.$store.dispatch("notifications_module/getNotifications");
    // this.allChatSoket();
  },
  created() {
    // console.log(this.user.usertype);
    // if (this.user.usertype != "superadmin") {
    //   this.getPermissions();
    //   this.getControls();
    // } else {
    //   if (localStorage.getItem("sianah_controls")) {
    //     localStorage.removeItem("sianah_controls");
    //   }
    //   if (localStorage.getItem("sianah_permissions")) {
    //     localStorage.removeItem("sianah_permissions");
    //   }
    // }
  }
};
</script>
