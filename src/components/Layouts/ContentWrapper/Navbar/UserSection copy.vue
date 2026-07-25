<template>
  <div class="userSection" v-if="userDataExist">
    <div class="side_2">
      <!-- Dots -->
      <div class="dots_dropDown" @click.stop="toggle_profile_menu">
        <span class="dots"> <i class="fas fa-ellipsis-h"></i> </span>

        <!-- Profile dropdown -->
        <transition name="fadeUpTransform">
          <div
            v-if="profile_menu"
            class="custom_card profile_dropdown nav_dropdown"
          >
            <ul>
              <!-- <li>
                <router-link to="/userProfile/test">
                  <span class="icon"></span
                  ><span class="text">{{ $t("navbar.userMenu.profile") }}</span>
                </router-link>
              </li>
              <li>
                <router-link to="/edituserProfile">
                  <span class="icon"></span
                  ><span class="text">{{
                    $t("navbar.userMenu.editProfile")
                  }}</span>
                </router-link>
              </li> -->
              <!-- <li>
                <router-link to="/chat"
                  ><span class="icon"></span
                  ><span class="text">{{
                    $t("navbar.userMenu.chats")
                  }}</span></router-link
                >
              </li> -->
              <!-- <v-divider></v-divider> -->
              <li @click="logOut">
                <span class="icon"></span
                ><span class="text">{{ $t("navbar.userMenu.logout") }}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <!-- Notifications -->
      <div class="notifications">
        <div class="notification_icon" @click.stop="toggle_notification_menu">
          <i class="far fa-bell"></i>
          <span
            v-if="notifications.length > 0"
            class="notificationNumber"
          ></span>
        </div>

        <!-- notification dropdown -->
        <transition name="fadeUpTransform">
          <div
            v-if="notification_menu"
            class="custom_card notification_dropdown nav_dropdown"
          >
            <header class="header">
              <h3>
                {{ notifications.length }}
                {{ $t("navbar.notification.topTitle_1") }}
              </h3>
              <p>{{ $t("navbar.notification.topTitle_2") }}</p>
            </header>

            <!-- If Empty -->
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

            <!-- Else -->
            <ul class="notifications_container" v-else>
              <li v-for="item in notifications" :key="item.id">
                <router-link to="/" class="item">
                  <span class="icon"><i class="fal fa-plus-square"></i></span>
                  <div class="text">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.body.slice(0, 40) + "..." }}</p>
                  </div>
                  <span class="time">{{ item.created_time }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <span class="menueIcon" @click.stop="toggleSideMenu">
        <i class="fas fa-bars"></i>
      </span>
    </div>

    <div class="side_1">
      <!-- Logout -->
      <span class="logout">{{ currentUser.name }}</span>

      <!-- Image -->
      <img
        v-if="isSmallScreen"
        @click.stop="toggle_profile_menu"
        :src="currentUser.image"
      />
      <img v-else :src="currentUser.image" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      userDataExist: true,
      profile_menu: false,
      notification_menu: false,

      notifications: [
        // {
        //   title: "title",
        //   body: "lorem test test test test",
        //   created_time: "2022-5-7",
        // },
        // {
        //   title: "title",
        //   body: "lorem test test test test",
        //   created_time: "2022-5-7",
        // },
      ],
    };
  },

  methods: {
    toggle_profile_menu() {
      this.profile_menu = !this.profile_menu;
      this.notification_menu = false;
    },

    toggle_notification_menu() {
      this.notification_menu = !this.notification_menu;
      this.profile_menu = false;
    },

    toggleSideMenu() {
      document.querySelector(".sideBar.smallScreen").classList.toggle("active");
      this.notification_menu = false;
      this.profile_menu = false;
    },

    logOut() {
      this.$store.dispatch("auth_module/logOut");
    },
  },

  computed: {
    ...mapGetters({ isSmallScreen: "dom_module/isSmallScreen" }),
    ...mapGetters("auth_module", ["currentUser"]),
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    window.addEventListener("click", () => {
      this.notification_menu = false;
      this.profile_menu = false;
      if (document.querySelector(".sideBar.smallScreen")) {
        document
          .querySelector(".sideBar.smallScreen")
          .classList.remove("active");
      }
    });
  },
};
</script>
