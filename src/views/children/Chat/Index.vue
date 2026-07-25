<template>
  <div>
    <Breadcrumb :items="items" />
    <div class="">
      <div class="chat_app mx-1 row my-5" @click="uplodesActive = false">
        <div
          @click="toggleMenu"
          class="overlay"
          :class="{ active: menuActive }"
        ></div>

        <div class="friends_col col-lg-4 col-xl-3 col-12">
          <div class="friends" :class="{ active: menuActive }">
            <span @click="toggleMenu" class="closeMenu">
              <i class="far fa-times"></i>
            </span>

            <header class="friends_header">
              <!-- <v-autocomplete
                ref="autocomplete"
                :items="users"
                clearable
                :search-input.sync="autocomplete_text"
                @input="getUsers($event)"
                :item-text="nameWithCode"
                item-value="id"
                label="ابحث أو ابدأ محادثة جديدة"
              ></v-autocomplete> -->
              <input
                class="chat_searchInput"
                placeholder="ابحث أو ابدأ محادثة جديدة"
                @input="getUsers($event)"
              />
            </header>
            <ul class="chats">
              <!-- <h3>المحادثات</h3> -->
              <li
                class="chat"
                :class="{ active: chat.isActive }"
                v-for="(chat, index) in filterChats"
                :key="chat.id"
                @click="set_active(chat.id)"
              >
                <div class="chat_content" v-if="chat.owner">
                  <div class="image">
                    <img
                      :src="chat.owner.image"
                      @error="defaultImage(index)"
                      alt="..."
                    />
                    <span
                      class="status"
                      :class="{ offline: !chat.online, online: chat.online }"
                    ></span>
                  </div>
                  <div class="user_info" :class="{ newMessage: !chat.is_read }">
                    <h3 class="friend_name">{{ chat.owner.name }}</h3>
                    <read-more
                      v-if="chat.last_message"
                      class="readMore chat_msg"
                      more-str=""
                      :text="chat.last_message"
                      link="#"
                      less-str=""
                      :max-chars="30"
                    ></read-more>
                  </div>
                </div>
                <div class="time_messages">
                  <span class="time">{{ chat.last_message_created_at }}</span>
                  <span class="num_of_messages" v-if="!chat.is_read"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="chatbox_col col-lg-8 col-xl-9 col-12">
          <div class="chat_box">
            <header class="chat_box_header">
              <div class="user">
                <span @click="toggleMenu" class="menu_icon">
                  <i class="far fa-bars"></i>
                </span>
                <div class="image" v-if="activeUser">
                  <img :src="activeUser.owner.image" alt="..." />
                  <!-- <span class="status online"></span> -->
                </div>
                <div class="mt-4">
                  <h3 class="name" v-if="activeUser">
                    {{ activeUser.owner.name }}
                  </h3>
                  <p class="phone" v-if="activeUser">
                    {{ activeUser.owner.phone }}
                  </p>
                </div>
              </div>
              <!-- <span
                @click="toggleFave"
                class="isFave"
                :class="{ active: this.isFave }"
                ><i class="far fa-star"></i
              ></span> -->
            </header>

            <div
              class="chat_view"
              v-chat-scroll="{
                always: true,
                smooth: true,
                scrollonremoved: true,
              }"
            >
              <div v-if="activeUser" :class="{ 'p-2': activeUser }">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="d-flex flex-column"
                >
                  <div
                    class="messageOwner"
                    :class="{
                      sender: message.type === 'me',
                      receiver: message.type === 'other',
                    }"
                  >
                    <!-- <img :src="message.sender.image" /> -->
                    <div class="content">
                      <p
                        v-if="
                          message.message_type == 'text' ||
                          message.message_type == 'complaint'
                        "
                        class="text"
                      >
                        <a
                          v-if="isURL(message.message)"
                          target="_blank"
                          style="text-decoration: underline"
                          :href="message.message"
                          >{{ message.message }}</a
                        >
                        <span v-else>
                          {{ message.message }}
                        </span>
                      </p>

                      <p class="text" v-if="message.message_type == 'file'">
                        <a
                          class="d-flex"
                          target="_blank"
                          :href="message.message"
                          download
                          ><i class="fa-solid fa-file fs-2"></i>
                          <span
                            v-html="message.message.slice(0, 30)"
                            class="mx-4"
                          ></span>
                        </a>
                      </p>

                      <div v-else class="media">
                        <div
                          v-if="message.message_type == 'image'"
                          class="image"
                        >
                          <img
                            width="200"
                            class="img-fluid"
                            @click="openModel(message.message)"
                            :src="message.message"
                          />
                          <!-- <p v-if="message.descreption" class="descreption">
                            {{ message.descreption }}
                          </p> -->
                        </div>

                        <div
                          v-if="message.message_type == 'video'"
                          class="video"
                        >
                          <video controls>
                            <source :src="message.message" type="video/mp4" />
                          </video>
                          <!-- <p v-if="message.descreption" class="descreption">
                        {{ message.descreption }}
                      </p> -->
                        </div>
                        <div v-if="message.message_type == 'location'">
                          <base-map1
                            :draggable="false"
                            :biggingMarkers="getLatLng(message.message)"
                          />
                          <!-- <p v-if="message.descreption" class="descreption">
                        {{ message.descreption }}
                      </p> -->
                        </div>

                        <div
                          v-if="message.message_type == 'sound'"
                          class="audio_media"
                        >
                          <audio controls>
                            <source :src="message.message" type="audio/ogg" />
                          </audio>
                        </div>
                      </div>
                      <span class="d-block time">
                        {{
                          moment(message.created_at).format(
                            "YYYY-MM-DD hh:mm A"
                          )
                        }}
                        <!-- {{ moment(message.created_at).format("hh:mm A") }} -->
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <img
                  src="@/assets/media/images/no_messages.png"
                  class="img-fluid w-100"
                  alt=""
                />
              </div>
            </div>

            <transition name="fadeInUp">
              <div v-if="showPreview_image" class="uplode_preview">
                <span @click="close_preview" class="close"
                  ><i class="far fa-times"></i
                ></span>
                <img
                  class="preview_img img-fluid preview_media"
                  width="100"
                  height="100"
                  @click="openModel(data.file_image_src)"
                  :src="data.file_image_src"
                  alt="..."
                />
              </div>
            </transition>

            <transition name="fadeInUp">
              <div v-if="showPreview_video" class="uplode_preview">
                <span @click="close_preview" class="close"
                  ><i class="far fa-times"></i
                ></span>
                <video class="preview_video preview_media" controls>
                  <source :src="data.file_video_src" type="video/mp4" />
                </video>
              </div>
            </transition>
            <transition name="fadeInUp">
              <div v-if="showPreview_map" class="uplode_preview">
                <span @click="close_preview" class="close"
                  ><i class="far fa-times"></i
                ></span>
                <base-map1 @getLocation="getLocation" />
              </div>
            </transition>

            <!-- <template> -->
            <template v-if="activeUser">
              <footer class="chat_footer">
                <!-- v-if="
                  dash_user.id == usersInChat?.sender?.id ||
                  dash_user.id == usersInChat?.receiver?.id
                " -->
                <!-- ====== Send_button ===== -->
                <div class="chat_footer_container">
                  <textarea
                    ref="message_text"
                    v-model="data.message_text"
                    placeholder="اكتب رسالتك هنا"
                    v-on:keydown.enter="send_message('text', $event)"
                  ></textarea>
                  <button
                    :disabled="data.message_text.trim().length === 0"
                    @click="send_message('text')"
                    class="send_button"
                  >
                    <span><i class="fas fa-paper-plane"></i></span>
                  </button>
                </div>

                <!-- <div class="attachments"> -->
                <!-- <button @click.stop="toggleUplodes" class="icon">
                    <i class="far fa-paperclip"></i>
                  </button> -->
                <!-- <transition name="fadeInUp"> -->
                <!-- <ul v-if="uplodesActive" class="uplode_options">
                    <li>
                      <input
                        class="upload_image uplode_Input"
                        type="file"
                        id="upload_image"
                        @change="uploadImage"
                      />
                      <label for="upload_image"
                        ><i class="far fa-image-polaroid"></i
                      ></label>
                    </li>
                    <li>
                      <input
                        class="uplode_video uplode_Input"
                        type="file"
                        id="uplode_video"
                        name="uplode_video"
                        accept="video/*"
                        @change="upload_video"
                      />
                      <label for="uplode_video">
                        <i class="far fa-video-slash"></i>
                      </label>
                    </li>
                    <li>
                      <input
                        class="uplode_video uplode_Input"
                        type="file"
                        id="upload_file"
                        name="upload_file"
                        @change="upload_file"
                      />
                      <label for="upload_file">
                        <i class="far fa-file"></i>
                      </label>
                    </li>
                    <li>
                      <a
                        role="button"
                        @click="showPreview_map = !showPreview_map"
                      >
                        <i class="fas fa-location-arrow"></i>
                      </a>
                    </li>
                  </ul> -->
                <!-- </transition> -->
                <!-- </div> -->
              </footer>
              <!-- <span v-else>هذه المحادثة بين اشخاص اخرين يمكنك الاطلاع فقط</span> -->
            </template>
          </div>
        </div>

        <!-- Dialog -->
        <base-model @close="closeModel" :show="model.show_model">
          <div class="image">
            <img
              class="img-fluid"
              v-if="model.model_img_src"
              :src="model.model_img_src"
              alt="..."
            />
          </div>
        </base-model>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  props: ["id"],
  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.chats.title"),
          disabled: false,
          href: "/chats",
        },
      ],
      autocomplete_text: "",
      search_text: "",

      messages: [],
      users: [],
      activeUser: null,
      chatId: null,
      usersInChat: null,
      // chats: [],
      // FormData
      data: {
        message_text: "",
        file_image_src: null,
        file_image: null,
        file_video_src: null,
        file_video: null,
        file_src: null,
        file: null,
        location: null,
      },

      model: {
        show_model: false,
        model_img_src: null,
      },

      showPreview_image: false,
      showPreview_file: false,
      showPreview_map: false,
      showPreview_video: false,
      uplodesActive: false,
      menuActive: false,
      isFave: false,
    };
  },
  computed: {
    isSmallScreen() {
      return this.$store.getters["sideNav_module/isSmallScreen"];
    },
    dash_user() {
      return this.$store.getters["auth_module/currentUser"];
    },
    chats() {
      return this.$store.getters["chat_module/chats"].sort(
        (a, b) => b.last_message_created - a.last_message_created
      );
    },

    canRecord() {
      return this.data.message_text == "";
    },

    filterChats() {
      if (this.search_text == "") {
        return this.chats;
      } else {
        return this.chats.filter((chat) => {
          if (
            chat.owner.name
              .toLowerCase()
              .indexOf(this.search_text.toLowerCase()) > -1
          ) {
            return chat;
          }
        });
      }
    },
  },

  methods: {
    nameWithCode({ name }) {
      return `${name} `;
    },
    set_active(id) {
      this.menuActive = false;
      this.chatId = id;
      this.axios({
        method: "GET",
        url: `chat`,
        params: {
          chat_id: id,
        },
      })
        // this.axios
        // .get(`${process.env.VUE_APP_BASE_URL}internal-chats/${id}`)
        .then((res) => {
          this.messages = res.data.data.messages;
          this.usersInChat = res.data.data;
        });

      let found = this.chats.find((el) => el.id == id);
      this.chats.map((chat) => {
        chat.isActive = false;
      });
      if (found) {
        this.activeUser = found;
        found.isActive = true;
        found.is_read = true;
      } else {
        this.$store.commit("chat_module/pushChat", {
          id: res.data.data.chat_id,
          last_message: "",
          last_message_created_at: "",
          isActive: true,
          last_message_created: new Date().getTime(),
          is_read: true,
          online: false,
          owner: res.data.data.sender,
        });
        this.activeUser = {
          id: res.data.data.chat_id,
          owner: res.data.data.sender,
          isActive: true,
          online: false,
          is_read: false,
        };
      }

      this.receiveSocketNotification();
    },
    getLatLng(location) {
      try {
        return JSON.parse(location);
      } catch (error) {
        let data = location.split(",");

        return {
          lat: data[0],
          lng: data[1],
        };
      }

      // console.log(typeof location);
    },
    defaultImage(index) {
      this.chats[
        index
      ].owner.image = require("@/assets/media/images/Avatars/no-user.png");
    },
    isURL(str) {
      var res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      ); // fragment locator
      return res !== null;
    },
    openModel(e) {
      this.model.show_model = true;
      this.model.model_img_src = e;
    },

    closeModel() {
      this.model.show_model = false;
    },

    toggleMenu() {
      this.menuActive = !this.menuActive;
    },

    toggleFave() {
      this.isFave = !this.isFave;
    },

    toggleUplodes() {
      this.uplodesActive = !this.uplodesActive;
    },

    close_preview() {
      this.showPreview_image = false;
      this.data.file_image_src = null;
      this.showPreview_video = false;
      this.showPreview_map = false;
      this.data.file_image_src = null;
      this.data.file = null;
      this.data.location = null;
    },

    uploadImage(e) {
      this.data.message_text = e.target.files[0].name;
      this.data.file_image_src = URL.createObjectURL(e.target.files[0]);
      this.data.file_image = e.target.files[0];
      this.uplodesActive = false;
      this.showPreview_image = true;
      this.uplodesActive = !this.uplodesActive;
    },
    upload_file(e) {
      this.data.message_text = e.target.files[0].name;
      this.data.file = e.target.files[0];

      this.uplodesActive = !this.uplodesActive;
    },

    upload_video(e) {
      this.data.message_text = e.target.files[0].name;
      this.data.file_video_src = URL.createObjectURL(e.target.files[0]);
      this.data.file_video = e.target.files[0];
      this.uplodesActive = false;
      this.showPreview_video = true;
      this.uplodesActive = !this.uplodesActive;
    },

    after_recording(data) {
      this.send_message("sound", data.blob);
    },

    send_message(e, event) {
      if (event) {
        if (event?.keyCode == 13 && !event?.shiftKey) {
          event.preventDefault();
          if (!this.data.message_text) {
            return;
          }
        }
      } else {
        if (!this.data.message_text) {
          return;
        }
      }
      let data;
      let type = e;
      if (this.data.message_text) {
        type = "text";
        data = this.data.message_text;
      }
      if (this.data.file_image_src) {
        type = "image";
        data = this.data.file_image;
      }
      if (this.data.file_video_src) {
        type = "video";
        data = this.data.file_video;
      }
      if (this.data.file) {
        type = "file";
        data = this.data.file;
      }
      if (this.data.location) {
        type = "location";
        data = this.data.location;
      }
      const frmData = new FormData();

      frmData.append("message_type", type);
      // frmData.append("chat_id", this.activeUser?.owner?.id);
      frmData.append("chat_id", this.chatId);

      if (this.data.location) {
        let data = {
          location: this.data.location.location,
          lat: this.data.location.center.lat,
          lng: this.data.location.center.lng,
        };

        frmData.append("message", JSON.stringify(data));
      } else {
        frmData.append("message", data ?? this.data.message_text);
      }
      this.axios
        .post(`${process.env.VUE_APP_BASE_URL}send-message`, frmData)
        .then((res) => {
          // this.getChats();

          this.messages = res.data.data.messages;
          this.chats.last_message_created_at = res.data.data.ago_time;
          this.close_preview();
          this.data.message_text = "";
          new Audio(
            require("../../../assets/media/sounds/message_sent.mp3")
          ).play();
        })
        .catch((err) => {
          if (err.response.data.errors) {
            this.$iziToast.error({
              displayMode: 2,
              title: this.$t("error"),
              message: err.response.data.errors.message[0],
            });
          } else {
            this.$iziToast.error({
              displayMode: 2,
              title: this.$t("error"),
              message: err.response.data.message ?? err.response.data.messages,
            });
          }
        });
    },
    receiveSocketNotification() {
      var socket = io(process.env.VUE_APP_BASE_SOCKET_URL);

      // Driver Connection Chanel
      socket.on(`chat_${this.chatId}`, (payload) => {
        if (payload) {
          console.log(payload);
          this.messages.push(payload);
          var audio = document.createElement("AUDIO");
          document.body.appendChild(audio);
          audio.src = require("@/assets/media/sounds/notification.mp3");
          audio.play();
          // new Audio(require("@/assets/media/sounds/notification.mp3")).play();
        }
      });
    },
    getUsers(event) {
      console.log(event);
      /*if (event) {
        this.axios.get(`support_chats/new/${event}`).then((res) => {
          this.autocomplete_text = "";
          this.set_active(res.data.data.chat_id);
          this.$refs.autocomplete.reset();
        });

        return;
      }
      // this.search_text = this.autocomplete_text;

      this.axios
        .get(
          `${process.env.VUE_APP_BASE_URL}internal-chats?key_word=${
            this.autocomplete_text ?? ""
          }`
        )
        .then((res) => (this.users = res.data.data));*/
      this.$store.dispatch("chat_module/getChats", event.target.value);
    },

    getLocation(e) {
      this.data.message_text = e.location;
      this.data.location = e;
    },
  },
  watch: {
    ["autocomplete_text"]() {
      // this.getUsers();
    },
  },

  mounted() {
    // this.getUsers();
    if (this.id) {
      this.axios.get(`support_chat/${this.id}`).then((res) => {
        this.autocomplete_text = "";

        this.set_active(res.data.data.chat_id);
        this.$refs.autocomplete.reset();
      });
    }
  },
};
</script>

<style lang="scss">
.messages_cotroller {
  // border: 1px solid var(--mainText);
  background: var(--main);
  color: white;
  padding: 0.7rem 1rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  // padding: 5px 8px;
  span {
    font-size: 14px;
  }
  &.receiver {
    background: var(--main);
  }
  &.sender {
    background: var(--mainColor-2);
  }
}
.v-autocomplete.v-input > .v-input__control > .v-input__slot {
  margin: 0 !important;

  padding-top: 10px;
}
</style>
