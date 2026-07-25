<template>
  <section class="sidebar" @click.stop>
    <!-- ============================== Big Screen Sidebar -->
    <v-navigation-drawer
      v-if="!isSmallScreen"
      class="main_sidebar"
      permanent
      :expand-on-hover="false"
    >
      <!-- Upper Scection -->
      <div class="top_logo" :class="{ smallLogo: !menueMinWidth }">
        <div class="logo">
          <router-link to="/">
            <img
              class="img-fluid"
              width="150"
              v-if="current_theme == 'light'"
              src="@/assets/media/images/logo/logo_white.png"
            />
            <img
              width="150"
              class="img-fluid"
              v-else
              src="@/assets/media/images/logo/logo_white.png"
            />
          </router-link>
        </div>
        <!-- <div class="toggleResize">
          <button
            @click="toggleSideBarFullWidth"
            class="btn ful-w"
            :class="{ ful_back: menueMinWidth }"
          ></button>
        </div> -->
      </div>

      <!-- <v-divider></v-divider> -->

      <v-list>
        <template v-for="item in sidebar">
          <!-- If Single Item (Not Dropdown) -->
          <!-- divider  -->
          <div class="divider_new" v-if="item.label" :key="item.id">
            <span>{{ item.label }}</span>
          </div>
          <v-list-item v-if="item.url != null" :key="item.id" :to="item.url">
            <v-icon>{{ item.action }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <!-- If DropDown -->
          <v-list-group
            v-else
            :key="item.title"
            :class="{
              activeDropDown: item.active,
            }"
            class="parnet"
            v-model="item.active"
            :prepend-icon="item.action"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <template>
              <v-list-item
                v-for="child in item.items"
                :to="child.url"
                :key="child.id"
              >
                <v-list-item-content v-if="!child.items">
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-group
                  v-else
                  v-model="child.active"
                  :class="{ activeDropDown: child.active }"
                  class="not_item"
                  :dir="lang == 'en' ? 'rtl' : 'ltr'"
                  no-action
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title class="sub_item_group">
                        {{ child.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item
                    v-for="sub_child in child.items"
                    :key="sub_child.title"
                    link
                    :to="sub_child.url"
                    class="sub_list_item"
                  >
                    <v-list-item-title class="tit_sub">{{
                      sub_child.title
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- ============================== Small Screen Sidebar -->
    <aside v-else class="smallScreenSidebar main_sidebar" ref="smallSidebar">
      <span @click="toggleMenu" class="close">
        <i class="fas fa-times"></i>
      </span>

      <!-- Upper Scection -->
      <!-- <div class="top_logo" :class="{ smallLogo: !menueMinWidth }">
        <div class="logo">
          <router-link to="/">
            <img
              v-if="current_theme == 'light'"
              src="@/assets/images/icons/logo_light.svg"
            />
            <img v-else src="@/assets/images/icons/logo_white.png" />
          </router-link>
        </div>
      </div> -->

      <v-list>
        <template v-for="item in sidebar">
          <!-- If Single Item (Not Dropdown) -->
          <!-- divider  -->
          <div class="divider_new" v-if="item.label" :key="item.id">
            <span>{{ item.label }}</span>
          </div>
          <v-list-item v-if="item.url != null" :key="item.id" :to="item.url">
            <v-icon>{{ item.action }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <!-- If DropDown -->
          <v-list-group
            v-else
            :key="item.title"
            :class="{
              activeDropDown: item.active,
            }"
            class="parnet"
            v-model="item.active"
            :prepend-icon="item.action"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <template>
              <v-list-item
                v-for="child in item.items"
                :to="child.url"
                :key="child.id"
              >
                <v-list-item-content v-if="!child.items">
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-group
                  v-else
                  v-model="child.active"
                  :class="{ activeDropDown: child.active }"
                  class="not_item"
                  :dir="lang == 'en' ? 'rtl' : 'ltr'"
                  no-action
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title class="sub_item_group">
                        {{ child.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item
                    v-for="sub_child in child.items"
                    :key="sub_child.title"
                    link
                    :to="sub_child.url"
                    class="sub_list_item"
                  >
                    <v-list-item-title class="tit_sub">{{
                      sub_child.title
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list>

      <ul class="navIcons">
        <!-- Theme -->
        <li v-if="current_theme == 'dark'" @click="changeTheme('light')">
          <i class="fal fa-sun"></i>
        </li>
        <li v-if="current_theme == 'light'" @click="changeTheme('dark')">
          <i class="fal fa-moon"></i>
        </li>

        <!-- Lang -->
        <li v-if="lang == 'ar'" @click="changeLang('en')">
          <i class="fal fa-globe"></i>
        </li>
        <li v-if="lang == 'en'" @click="changeLang('ar')">
          <i class="fal fa-globe"></i>
        </li>
      </ul>
    </aside>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      menueMinWidth: true,
      sidebar: [],
    };
  },

  methods: {
    toggleSideBarFullWidth() {
      this.menueMinWidth = !this.menueMinWidth;
      this.$store.dispatch("sideNav_module/onResize");
    },

    toggleMenu() {
      this.$refs.smallSidebar.classList.toggle("active");
    },

    changeTheme(value) {
      this.$store.dispatch("theme_module/changeTheme", value);
      if (value == "light") {
        this.$vuetify.theme.dark = false;
      } else {
        this.$vuetify.theme.dark = true;
      }
      this.$refs.smallSidebar.classList.remove("active");
    },

    changeLang(value) {
      this.$store.dispatch("lang_module/switchLang", value);
      this.$refs.smallSidebar.classList.remove("active");
    },

    manipulateTheSideBar() {
      // Convert 'JSON' Object to JS Object
      const Json_Sidebar = JSON.parse(JSON.stringify(this.$t("sidebar")));

      Json_Sidebar.forEach((el) => {
        // IF Dropdown
        if (el.items) {
          // ======== Check Nested
          let inside_nested = false;
          el.items.forEach((element) => {
            if (element.items) {
              inside_nested = true;
            }
          });

          // ======== IF Nested Else
          if (inside_nested) {
            el.items.forEach((subEl) => {
              // Active
              subEl.activeRoutesMatch = subEl.items[0].url;

              // DropDown
              if (this.$route.path.includes(subEl.activeRoutesMatch)) {
                subEl.active = true;
              } else {
                subEl.active = false;
              }
            });
            el.activeRoutesMatch = el.parentUrl;

            // DropDown
            if (this.$route.path.includes(el.activeRoutesMatch)) {
              el.active = true;
            } else {
              el.active = false;
            }
          } else {
            el.activeRoutesMatch = el.items[0].url;

            // DropDown
            if (this.$route.path.includes(el.activeRoutesMatch)) {
              el.active = true;
            } else {
              el.active = false;
            }
          }
        }
      });

      this.sidebar = Json_Sidebar;
    },
    getSideBar() {
      this.axios
        .get("admin_side_bar")
        .then((res) => (this.sidebar = res.data.data));
    },
  },

  computed: {
    ...mapGetters({
      isSmallScreen: "sideNav_module/isSmallScreen",
      current_theme: "theme_module/current_theme",
      lang: "lang_module/lang",
      user: "auth_module/currentUser",
    }),
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.manipulateTheSideBar();
    this.getSideBar();
  },
};
</script>

<style lang="scss">
.main_sidebar.v-navigation-drawer {
  width: 280px !important;
}
</style>
