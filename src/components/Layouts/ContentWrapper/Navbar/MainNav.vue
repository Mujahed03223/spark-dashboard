<template>
  <nav class="main_nav">
    <div class="navContent">
      <div class="user" v-if="userDataExist">
        <div @click.stop="toggle_profile_menu" class="image">
          <img :src="userDataExist.image" />
          <!-- Profile dropdown -->
          <transition name="fadeUpTransform">
            <div
              v-if="profile_menu"
              class="custom_card profile_dropdown nav_dropdown"
            >
              <ul>
                <li>
                  <router-link to="/profile/show">
                    <span class="icon"></span>
                    <span class="text">
                      {{ $t("navbar.userMenu.profile") }}
                    </span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/profile/edit">
                    <span class="icon"></span>
                    <span class="text">
                      {{ $t("navbar.userMenu.editProfile") }}
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
                  <span class="text">{{ $t("navbar.userMenu.logout") }}</span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div class="text">
          <span class="name">{{ userDataExist.fullname }}</span>
          <span class="available">{{ userDataExist.phone }}</span>
        </div>
      </div>

      <div class="dashName" v-else>
        <span class="_title">
          {{ $t("dashName") }}
        </span>

        <!-- <span class="icon"><i class="fas fa-video mt-2"></i></span> -->
      </div>

      <div class="otherSide">
        <!-- <v-btn
            @click="toggleSearch"
            icon
            class="search-icon mobile-search-icon"
            color="black"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <div class="search-form">
            <form @submit.prevent>
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
                <v-select
                  class="select-category"
                  placeholder="product"
                  :items="['product', 'product1', 'product2']"
                ></v-select>
              </div>
            </form>
          </div> -->
        <ul class="routerIcons">
          <!-- LogOut -->
          <li v-if="!isSmallScreen" @click="logOut">
            <i class="fal fa-sign-out"></i>
          </li>
          <!-- Notifications -->
          <li
            class="notification_list_item"
            @click.stop="toggle_notification_menu"
            v-if="false"
          >
            <div class="notification_icon">
              <i class="far fa-bell"></i>
              <span v-if="unreadNotifCount > 0" class="notificationNumber">
                {{ unreadNotifCount }}
              </span>
            </div>
            <!-- notification dropdown -->
            <transition name="fadeUpTransform">
              <div
                v-if="notification_menu"
                class="custom_card notification_dropdown nav_dropdown"
              >
                <header class="header">
                  <h3>
                    {{ unreadNotifCount }}
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
                    <router-link
                      :to="`/notifications/show/${item.id}`"
                      class="item"
                    >
                      <span class="icon">
                        <i class="far fa-bell"></i>
                      </span>
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
          </li>
          <!-- Theme -->
          <li
            v-if="current_theme == 'dark' && !isSmallScreen"
            @click="changeTheme('light')"
          >
            <i class="fal fa-sun"></i>
          </li>
          <!-- <li
              v-if="current_theme == 'light' && !isSmallScreen"
              @click="changeTheme('dark')"
            >
              <i class="fal fa-moon"></i>
            </li> -->
          <!-- Lang -->
          <!-- <li v-if="lang == 'ar' && !isSmallScreen" @click="changeLang('en')">
              <i class="fal fa-globe"></i>
            </li>
            <li v-if="lang == 'en' && !isSmallScreen" @click="changeLang('ar')">
              <i class="fal fa-globe"></i>
            </li> -->
        </ul>
        <!-- Mobile Menue -->
        <span @click="toggleMenu" class="toggleMenu">
          <i class="fas fa-bars"></i>
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
      notifications: [],
      unreadNotifCount: null,
      userDataExist: true,
    };
  },
  methods: {
    getNotifications() {
      this.axios.get("notification").then((data) => {
        this.notifications = data.data.data;
        this.unreadNotifCount = this.notifications.length;
      });
    },
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
    changeLang(value) {
      this.$store.dispatch("lang_module/switchLang", value);
    },
  },
  computed: {
    ...mapGetters({
      current_theme: "theme_module/current_theme",
      lang: "lang_module/lang",
    }),
  },
  mounted() {
    this.getNotifications();
    this.getUserData();
    // document.querySelector("body").addEventListener("click", () => {
    //   this.profile_menu = false;
    //   this.notification_menu = false;
    //   if (document.querySelector(".smallScreenSidebar")) {
    //     document
    //       .querySelector(".smallScreenSidebar")
    //       .classList.remove("active");
    //   }
    // });
  },
};
</script>
<style lang="scss">
.form-group {
  display: flex;
  align-items: center;
  position: relative;
  .v-text-field__details {
    display: none;
  }
  input.form-control.search-input {
    background: var(--mainBgColor) !important;
    padding-right: 35px;
    color: var(--blackColor) !important;
    height: 45px;
    border: 0;
  }
  button.search-icon {
    position: absolute;
    right: -1px;
    color: var(--blackColor) !important;
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
