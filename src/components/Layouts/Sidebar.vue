<template>
  <section class="sidebar">
    <section class="fullScreen" id="sidebar">
      <!-- ============================== Big Screen Sidebar -->
      <v-navigation-drawer
        class="main_sidebar"
        permanent
        :expand-on-hover="false"
      >
        <!-- Upper Section -->
        <div class="top_logo">
          <div class="logo">
            <router-link to="/">
              <img
                class="img-fluid"
                width="120"
                v-if="current_theme == 'light'"
                src="@/assets/media/images/logo/logo.svg"
              />
              <img
                width="120"
                class="img-fluid"
                v-else
                src="@/assets/media/images/logo/logo.svg"
              />
            </router-link>
          </div>
          <!-- <div class="toggleResize">
          <button
            @click="toggleSideBarFullWidth"
            class="btn ful-w"
            :class="{ ful_back: menuMinWidth }"
          ></button>
        </div> -->
        </div>

        <!-- <v-divider></v-divider> -->

        <v-list>
          <template>
            <v-list-item to="/">
              <v-icon>fas fa-home</v-icon>
              <v-list-item-title>{{ $t("navs.home") }}</v-list-item-title>
            </v-list-item>
          </template>
          <template v-for="item in sidebar">
            <div
              class="divider_new"
              v-if="handleShowLabels(item)"
              :key="item.id"
            >
              <span>{{ item.label }} </span>
            </div>

            <template v-for="sub_item in item.categories">
              <v-list-item
                v-if="
                  sub_item.key == 'general' &&
                  !$permission.allowed(`${sub_item.permissions[0].url}`)
                "
                :key="sub_item.id"
                :to="`/${sub_item.permissions[0].url}`"
              >
                <v-icon>{{ sub_item.icon }}</v-icon>
                <v-list-item-title>{{ sub_item.title }} </v-list-item-title>
              </v-list-item>
              <!-- If DropDown -->
              <v-list-group
                :key="sub_item.uuid"
                v-else-if="
                  !$permission.allowed(`${sub_item.permissions[0].url}`) ||
                  !$permission.allowed(`${sub_item.permissions[1]?.url}`)
                "
                :class="{
                  activeDropDown: sub_item.active
                }"
                class="parnet"
                v-model="sub_item.active"
                :prepend-icon="sub_item.icon"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ sub_item.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <div v-for="child in sub_item.permissions" :key="child.id">
                  <v-list-item
                    :to="`/${child.url}`"
                    v-if="!$permission.allowed(`${child.url}`)"
                  >
                    <v-list-item-content>
                      <!-- <span class="polit"></span> -->
                      <v-list-item-title>{{ child.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-group>
            </template>
          </template>
        </v-list>
        <div
          class="input_wrapper rounded mx-2"
          v-if="countries && countries.length > 0"
        >
          <label class="form-label">
            {{ $t("labels.country") }}
          </label>

          <multiselect
            v-model="country"
            @input="changeCountry"
            :options="countries"
            label="name"
            track-by="id"
            :placeholder="$t('labels.country')"
            :searchable="true"
            :allow-empty="true"
            :show-labels="false"
          ></multiselect>
        </div>
      </v-navigation-drawer>

      <!-- ============================== Small Screen Sidebar -->
    </section>
    <aside class="smallScreenSidebar main_sidebar" ref="smallSidebar">
      <span @click="toggleMenu" class="close">
        <i class="fas fa-times"></i>
      </span>

      <!-- Upper Section -->
      <div class="top_logo">
        <div class="logo">
          <router-link to="/">
            <img
              class="img-fluid"
              width="100"
              v-if="current_theme == 'light'"
              src="@/assets/media/images/logo/logo.svg"
            />
            <img
              width="100"
              class="img-fluid"
              v-else
              src="@/assets/media/images/logo/logo.svg"
            />
          </router-link>
        </div>
      </div>
      <v-list>
        <v-list-item to="/">
          <v-icon>fas fa-home</v-icon>
          <v-list-item-title>{{ $t("navs.home") }}</v-list-item-title>
        </v-list-item>
        <template v-for="item in sidebar">
          <div class="divider_new" v-if="item.label" :key="item.id">
            <span>{{ item.label }}</span>
          </div>

          <template v-for="sub_item in item.categories">
            <v-list-item
              v-if="sub_item.key == 'general'"
              :key="sub_item.id"
              :to="`/${sub_item.permissions[0].url}`"
            >
              <v-icon>{{ sub_item.icon }}</v-icon>
              <v-list-item-title>{{ sub_item.title }}</v-list-item-title>
            </v-list-item>
            <!-- If DropDown -->
            <v-list-group
              v-else
              :key="sub_item.uuid"
              :class="{
                activeDropDown: sub_item.active
              }"
              class="parnet"
              v-model="sub_item.active"
              :prepend-icon="sub_item.icon"
              @click.stop
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ sub_item.title }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <template>
                <v-list-item
                  v-for="child in sub_item.permissions"
                  :to="`/${child.url}`"
                  :key="child.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ child.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-group>
          </template>
        </template>
      </v-list>
      <ul class="navIcons" v-if="false">
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
      menuMinWidth: true,
      sidebar: [],
      country: JSON.parse(localStorage.getItem("matlop_dash_country")) || null
    };
  },

  methods: {
    changeCountry(e) {
      if (e) {
        localStorage.setItem("matlop_dash_country", JSON.stringify(e));
        setTimeout(() => window.location.reload(), 300);
      } else {
        localStorage.removeItem("matlop_dash_country");
        setTimeout(() => window.location.reload(), 300);
      }
    },

    toggleSideBarFullWidth() {
      this.menuMinWidth = !this.menuMinWidth;
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
        if (el.categories) {
          el.categories.forEach((sub_item) => {
            if (sub_item.permissions) {
              sub_item.active = sub_item.permissions.some((child) => {
                return this.$route.path.includes(child.url);
              });
            }
          });

          el.active = el.categories.some((sub_item) => sub_item.active);
        }
      });

      this.sidebar = Json_Sidebar;
    },

    customManipulateTheSideBar() {
      let Json_Sidebar = JSON.parse(JSON.stringify(this.$t("sidebar")));

      this.axios.get("get_my_permissions").then((res) => {
        localStorage.setItem(
          "spark_dash_permissions",
          JSON.stringify(res.data.data)
        );

        Json_Sidebar.forEach((el) => {
          if (el.categories) {
            el.categories.forEach((sub_item) => {
              if (sub_item.permissions) {
                sub_item.active = sub_item.permissions.some((child) => {
                  return this.$route.path.includes(child.url);
                });
              }
            });

            el.active = el.categories.some((sub_item) => sub_item.active);
          }
        });

        this.sidebar = Json_Sidebar;
      });
    },

    // customManipulateTheSideBar() {
    //   let Json_Sidebar = JSON.parse(JSON.stringify(this.$t("sidebar")));

    //   this.axios.get("get_my_permissions").then((res) => {
    //     localStorage.setItem("spark_dash_permissions", JSON.stringify(res.data.data));

    //     // let currUserPermissions = [];

    //     // res.data.data &&
    //     //   res.data.data.map((item) => {
    //     //     currUserPermissions.push(item.back_route_name);
    //     //   });
    //     // let currentSidebar = [];

    //     // Json_Sidebar &&
    //     //   Json_Sidebar.length &&
    //     //   Json_Sidebar.map((item) => {
    //     //     item.categories &&
    //     //       item.categories.map((category) => {
    //     //         category.permissions &&
    //     //           category.permissions.map((permission) => {
    //     //             if (currUserPermissions.includes(permission.back_route_name)) {
    //     //               if (!currentSidebar.find((el) => el.label == item.label)) {
    //     //                 currentSidebar.push(item);
    //     //               }
    //     //             }
    //     //           });
    //     //       });
    //     //   });
    //     // Json_Sidebar = currentSidebar;
    //     Json_Sidebar &&
    //       Json_Sidebar.forEach((el) => {
    //         // IF Dropdown
    //         if (el.items) {
    //           // ======== Check Nested
    //           let inside_nested = false;
    //           el.items.forEach((element) => {
    //             if (element.items) {
    //               inside_nested = true;
    //             }
    //           });

    //           // ======== IF Nested Else
    //           if (inside_nested) {
    //             el.items.forEach((subEl) => {
    //               // Active
    //               subEl.activeRoutesMatch = subEl.items[0].url;

    //               // DropDown
    //               if (this.$route.path.includes(subEl.activeRoutesMatch)) {
    //                 subEl.active = true;
    //               } else {
    //                 subEl.active = false;
    //               }
    //             });
    //             el.activeRoutesMatch = el.parentUrl;

    //             // DropDown
    //             if (this.$route.path.includes(el.activeRoutesMatch)) {
    //               el.active = true;
    //             } else {
    //               el.active = false;
    //             }
    //           } else {
    //             el.activeRoutesMatch = el.items[0].url;

    //             // DropDown
    //             if (this.$route.path.includes(el.activeRoutesMatch)) {
    //               el.active = true;
    //             } else {
    //               el.active = false;
    //             }
    //           }
    //         }
    //       });

    //     this.sidebar = Json_Sidebar;
    //   });
    // },

    handleShowLabels(item) {
      let currentPermissions = [];

      item.categories &&
        item.categories.map((category) => {
          category.permissions &&
            category.permissions.map((permission) => {
              currentPermissions.push(permission.url);
            });
        });

      return currentPermissions.some((url) => {
        return !this.$permission.allowed(url);
      });
    }
  },

  computed: {
    ...mapGetters({
      current_theme: "theme_module/current_theme",
      lang: "lang_module/lang",
      user: "auth_module/currentUser",
      countries: "countries"
    })
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);

    // this.manipulateTheSideBar();
    if (this.user.usertype == "superadmin") {
      this.manipulateTheSideBar();
      this.$watch("$route", this.manipulateTheSideBar);
    } else {
      this.customManipulateTheSideBar();
      this.$watch("$route", this.customManipulateTheSideBar);
    }
  }
};
</script>

<style lang="scss"></style>
