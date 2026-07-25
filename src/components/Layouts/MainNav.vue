<template>
  <nav class="main_nav">
    <div class="navContent">
      <div class="user" v-if="userDataExist">
        <div class="image">
          <router-link to="/profile/edit">
            <img :src="userDataExist.image" />
          </router-link>
          <!-- Profile dropdown -->
          <transition name="fadeUpTransform">
            <div
              v-if="profile_menu"
              class="custom_card profile_dropdown nav_dropdown"
            >
              <ul>
                <!-- <li>
                  <router-link to="/profile/show">
                    <span class="icon"></span>
                    <span class="text">
                      {{ $t("navbar.userMenu.profile") }}
                    </span>
                  </router-link>
                </li> -->
                <li>
                  <router-link to="/profile/edit">
                    <span class="text">
                      {{ $t("navbar.userMenu.editProfile") }}
                    </span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/profile/password">
                    <span class="text">
                      {{ $t("navbar.userMenu.updatePassword") }}
                    </span>
                  </router-link>
                </li>
                <!-- <li>
                    <router-link to="/chat">
                      <span class="icon"></span>
                      <span class="text">
                        {{ $t('navbar.userMenu.chats') }}
                      </span>
                    </router-link>
                  </li> -->
                <v-divider></v-divider>

                <li @click="logOut">
                  <span class="icon"></span>
                  <span class="text p-1">
                    {{ $t("navbar.userMenu.logout") }}
                  </span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div class="text">
          <span class="name">{{ userDataExist.username }}</span>
          <span class="available">{{ userDataExist.phone }}</span>
        </div>
        <a role="button" @click.stop="toggle_profile_menu" class="me-2"
          ><i
            class="fas"
            :class="profile_menu ? ' fa-angle-up' : 'fa-angle-down'"
          ></i
        ></a>
      </div>
      <div class="dashName" v-else>
        <span class="_title">
          {{ $t("dashName") }}
        </span>
      </div>
      <div class="otherSide">
        <div class="search-form" v-if="false">
          <form @submit.prevent>
            <div class="input_wrapper">
              <div class="form-group">
                <v-btn icon class="search-icon" color="black">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <input
                  type="text"
                  class="form-control search-input"
                  placeholder="بحث عن"
                  v-model="searchInput"
                />
              </div>
            </div>
          </form>
        </div>
        <ul class="routerIcons">
          <!-- LogOut -->
          <li @click="logOut">
            <i class="fa fa-sign-out"></i>
          </li>
          <!-- Notifications -->
          <li
            class="notification_list_item"
            @click.stop="toggle_notification_menu"
          >
            <div class="notification_icon">
              <i class="fa fa-bell"></i>
              <span
                v-if="unreadNotificationCount > 0"
                class="notificationNumber"
              >
                {{ unreadNotificationCount }}
              </span>
            </div>
            <transition name="fadeUpTransform">
              <div
                v-if="notification_menu"
                class="custom_card notification_dropdown nav_dropdown"
              >
                <header class="header">
                  <h3>
                    {{ unreadNotificationCount }}
                    {{ $t("navbar.notification.topTitle_1") }}
                  </h3>
                  <p>{{ $t("navbar.notification.topTitle_2") }}</p>
                </header>
                <div
                  class="empty_notifications_wrapper d-flex flex-column justify-content-center align-items-center py-4"
                  v-if="notifications.length == 0"
                >
                  <img
                    src="@/assets/media/images/Others/no_notifications.svg"
                    alt="No Notifications"
                    width="120"
                    height="150"
                  />
                  <h4>{{ $t("navbar.notification.no_notifications") }}</h4>
                </div>
                <ul class="notifications_container" v-else>
                  <li
                    v-for="item in notifications"
                    :key="item.id"
                    @click="handleReadNotification(item)"
                  >
                    <div
                      @click="routeTo(item)"
                      class="item"
                      :class="item.is_readed ? 'read' : ''"
                    >
                      <span class="icon">
                        <i class="far fa-bell"></i>
                      </span>
                      <div class="text">
                        <h4>{{ item.title }}</h4>
                        <p :title="item.body">
                          {{
                            item.body.slice(0, 40) +
                            `${item.body.length > 40 ? "..." : ""}`
                          }}
                        </p>
                      </div>
                      <span class="time">{{ item.created_at }}</span>
                    </div>
                  </li>
                </ul>
                <footer v-if="notifications.length">
                  <router-link to="/notifications/show-all">{{
                    $t("breadcrumb.notifications.all")
                  }}</router-link>
                </footer>
              </div>
            </transition>
          </li>
          <!-- Theme -->
          <li v-if="current_theme == 'dark'" @click="changeTheme('light')">
            <i class="fal fa-sun"></i>
          </li>
          <!-- <li
              v-if="current_theme == 'light' && !isSmallScreen"
              @click="changeTheme('dark')"
            >
              <i class="fal fa-moon"></i>
            </li> -->
          <!-- Lang -->
          <li @click="switchLocale()">
            <i class="fal fa-globe"></i>
          </li>
        </ul>
        <!-- Mobile Menue -->
        <span @click.stop="toggleMenu" class="toggleMenu">
          <i class="fa fa-bars"></i>
        </span>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      profile_menu: false,
      notification_menu: false,
      searchInput: "",
      userDataExist: false,
      notifications: [],
      unreadNotificationCount: 0,
    };
  },
  methods: {
    getUserData() {
      this.axios.get("profile").then((data) => {
        this.userDataExist = data.data.data;
      });
    },

    toggleSearch() {
      let searchForm = document.querySelector(".search-form .form-group");
      console.log(searchForm);
      searchForm.classList.toggle("show");
    },

    toggle_profile_menu() {
      this.profile_menu = !this.profile_menu;
      this.notification_menu = false;
    },

    toggle_notification_menu() {
      this.notification_menu = !this.notification_menu;
      this.profile_menu = false;
    },

    toggleMenu() {
      document.querySelector(".smallScreenSidebar").classList.toggle("active");
    },

    logOut() {
      this.$store.dispatch("auth_module/logOut");
    },

    changeTheme(value) {
      this.$store.dispatch("theme_module/changeTheme", value);
      if (value == "light") {
        this.$vuetify.theme.dark = false;
      } else {
        this.$vuetify.theme.dark = true;
      }
    },
    switchLocale() {
      this.$store.dispatch("lang_module/switchLang");
    },

    getUnreadNotificationsCount() {
      this.axios.get("notifications?type=read").then((res) => {
        this.unreadNotificationCount = res.data.unread_count;
      });
    },
    // getUnreadNotificationsCount() {
    //   this.axios.get("unread-notification-count").then((res) => {
    //     this.unreadNotificationCount = res.data.data.unread;
    //   });
    // },

    handleReadNotification(item) {
      this.axios.get(`notifications/${item.id}`).then(() => {
        this.getUnreadNotificationsCount();
      });
    },

    getNotifications() {
      this.axios.get("notifications").then((res) => {
        this.notifications = res.data.data;
        // this.unreadNotificationCount = this.notifications.length;
      });
    },
    handleOwnershipNotification(notify_id) {
      this.axios
        .get(`ownership_notification/${notify_id}`)
        .then(() => {
          this.$iziToast.success({
            title: this.$t("delegateSuccessfully"),
            message: message,
          });
        })
        .catch((err) => {
          this.isLoading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
        });
    },

    routeTo(item) {
      if (item.notifiable_type === "orders") {
        this.$router
          .push({ path: `/orders/show/` + item.notifiable_id })
          .catch(() => {});
      } else if (
        item.notifiable_type === "NewAd" ||
        item.notifiable_type === "DeliveryNotification"
      ) {
        this.$router
          .push({ path: `/advertisements/show/${item.notifiable_id}` })
          .catch(() => {});
      } else if (item.notifiable_type === "BankTransferToAdmin") {
        if (!item.is_readed) {
          this.handleOwnershipNotification(item.notifiable_id);
        }
        this.$router
          .push({ path: `/buy_process/show-all?ad_id=${item.notifiable_id}` })
          .catch(() => {});
        // this.$router.push({ path: `/advertisements/show-all` }).catch(() => {});
      } else if (item.notifiable_type === "OwnerShipToAdmin") {
        this.$router
          .push({ path: `/buy_process/show-all?ad_id=${item.notifiable_id}` })
          .catch(() => {});
      } else if (item.notifiable_type === "AuctionRequestRejected ") {
        this.$router.push({ path: `/advertisements/show-all` }).catch(() => {});
      } else if (item.notifiable_type === "contact") {
        this.$router
          .push({
            path: `/contact_messages/show-all`,
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: `/notifications/show-all` }).catch(() => {});
      }
    },
  },

  computed: {
    ...mapGetters({
      current_theme: "theme_module/current_theme",
      lang: "lang_module/lang",
      // notifications: "notifications_module/notifications",
      // unreadNotificationCount: "notifications_module/unreadCount",
    }),
  },
  mounted() {
    this.getUserData();
    this.getNotifications();
    this.getUnreadNotificationsCount();

    document.querySelector("body").addEventListener("click", () => {
      this.profile_menu = false;
      this.notification_menu = false;
      if (document.querySelector(".smallScreenSidebar")) {
        document
          .querySelector(".smallScreenSidebar")
          .classList.remove("active");
      }
    });
  },
};
</script>
<style lang="scss">
.search-form {
  flex: 1;
  margin-inline: 10px;

  .form-group {
    display: flex;
    align-items: center;
    position: relative;
    background: var(--mainBg1);
    border-radius: 8px;

    .v-text-field__details {
      display: none;
    }

    input.form-control.search-input {
      background: var(--mainBgColor) !important;
      padding-right: 35px;
      color: var(--blackColor) !important;
      height: 45px;
      border: 0;
      outline: 0 !important;
      box-shadow: none !important;
      color: var(--main) !important;
    }

    button.search-icon {
      position: absolute;
      right: -1px;
      color: var(--main) !important;
    }

    .v-select__selection {
      width: 100%;
    }

    .v-btn__content {
      color: var(--blackColor) !important;
      height: 45px;
    }

    .select-category {
      position: absolute;
      left: 3px;
      height: 40px;
      padding: 4px;
      width: 140px;
      color: var(--blackColor) !important;
      margin: 0;
      border: 1px solid var(--borderColor);
      border-radius: 0.375rem;
      background: var(--mainBgColor);
      padding: 0;

      .v-select__selections {
        display: flex;
        align-items: center;
      }

      input[role="readonly"] {
        display: none;
      }

      .v-select__slot {
        padding: 5px;
      }

      .v-input__slot:after {
        content: unset !important;
      }

      div[role="button"] {
        height: 42px;
        margin: 0 !important;
        bottom: 1px;

        &::before {
          content: unset;
        }

        display: flex;
        align-items: center;

        * {
          margin: 0;
          color: var(--blackColor) !important;
          font-size: 14px;
        }
      }
    }
  }
}

.otherSide .mobile-search-icon {
  @media (min-width: 559px) {
    display: none;
  }
}

.otherSide .form-group {
  input.search-input {
    padding-right: 35px;
    padding-left: 150px;
  }

  @media (max-width: 559px) {
    display: none;

    &.show {
      display: flex;
    }

    position: absolute;
    width: 100%;
    left: 0;
    top: 100%;
  }
}
</style>
