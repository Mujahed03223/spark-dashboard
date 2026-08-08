import Vue from "vue";
import VueRouter from "vue-router";

// ============================== Start Views ==============================
// Home
import Home from "../views/Home.vue";

// ********** Children
import HomePage from "../views/children/HomePage.vue";

// ========== Start Profiles ==========

// ========== End Profiles ==========

// ============================== START:: CRUDS ==============================

// ********** Auth
import Login from "../views/Auth/Login.vue";

// ********** NotFound
import NotFound from "../views/NotFound.vue";

// ******* End Contact Messages *******
// ============================== End Views ==============================

// Vuex store
import store from "../store/index";
let router = null;
window.rootRouter = router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // Main
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "/",
          name: "HomePage",
          component: HomePage,
        },
        // ============================== Start CRUDS ==============================
        // ******* Start Countries *******
        {
          path: "/countries",
          component: () => import("../views/children/CRUDS/Countries/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllCountries",
              component: () =>
                import("../views/children/CRUDS/Countries/ShowAll.vue"),
            },
            // Show Single
            {
              path: "show/:id",
              name: "CountryShow",
              component: () =>
                import("../views/children/CRUDS/Countries/Show.vue"),
              props: true,
            },
            // Edit
            {
              path: "edit/:id",
              name: "CountryEdit",
              component: () =>
                import("../views/children/CRUDS/Countries/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "CountryAdd",
              component: () =>
                import("../views/children/CRUDS/Countries/Form.vue"),
            },
          ],
        },
        // ******* End Countries *******
        // ******* Start Cities *******
        {
          path: "/cities",
          component: () => import("../views/children/CRUDS/Cities/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllCities",
              component: () =>
                import("../views/children/CRUDS/Cities/ShowAll.vue"),
            },
            // Show Single
            {
              path: "show/:id",
              name: "CityShow",
              component: () =>
                import("../views/children/CRUDS/Cities/Show.vue"),
              props: true,
            },
            // Edit
            {
              path: "edit/:id",
              name: "CityEdit",
              component: () =>
                import("../views/children/CRUDS/Cities/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "CityAdd",
              component: () =>
                import("../views/children/CRUDS/Cities/Form.vue"),
            },
          ],
        },
        // ******* End Cities *******

        // ******* Start Advertisements *******
        {
          path: "/advertisements",
          component: () =>
            import("@/views/children/CRUDS/Advertisements/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllAdvertisements",
              component: () =>
                import("@/views/children/CRUDS/Advertisements/ShowAll.vue"),
            },

            // Show
            {
              path: "show/:id",
              name: "AdvertisementShow",
              component: () =>
                import("@/views/children/CRUDS/Advertisements/Show.vue"),
              props: true,
            },
          ],
        },
        // ******* End Advertisements *******

        // ******* Start Advertisements *******
        {
          path: "/new-advertisements",
          component: () =>
            import("@/views/children/CRUDS/NewAdvertisements/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllNewAdvertisements",
              component: () =>
                import("@/views/children/CRUDS/NewAdvertisements/ShowAll.vue"),
            },
          ],
        },
        // ******* End Advertisements *******

        // ******* Start BankTransfers *******
        {
          path: "/bank-transfers",
          component: () =>
            import("@/views/children/CRUDS/BankTransfers/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllBankTransfers",
              component: () =>
                import("@/views/children/CRUDS/BankTransfers/ShowAll.vue"),
            },
          ],
        },
        // ******* End BankTransfers *******

        // ******* Start OwnershipTransferDelegation *******
        {
          path: "/ownership-transfer-delegation",
          component: () =>
            import(
              "@/views/children/CRUDS/OwnershipTransferDelegation/Home.vue"
            ),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllOwnershipTransferDelegation",
              component: () =>
                import(
                  "@/views/children/CRUDS/OwnershipTransferDelegation/ShowAll.vue"
                ),
            },
          ],
        },
        // ******* End OwnershipTransferDelegation *******

        // ******* Start CompleteSelling *******
        {
          path: "/complete-selling",
          component: () =>
            import("@/views/children/CRUDS/CompleteSelling/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllCompleteSelling",
              component: () =>
                import("@/views/children/CRUDS/CompleteSelling/ShowAll.vue"),
            },
          ],
        },
        // ******* End CompleteSelling *******

        // ******* Start BuyProcess *******
        {
          path: "/buy-process",
          component: () => import("@/views/children/CRUDS/BuyProcess/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllBuyProcess",
              component: () =>
                import("@/views/children/CRUDS/BuyProcess/ShowAll.vue"),
            },
          ],
        },
        // ******* End BuyProcess *******

        // ******* Start Sliders *******
        {
          path: "/sliders",
          component: () => import("@/views/children/CRUDS/Sliders/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllSliders",
              component: () =>
                import("@/views/children/CRUDS/Sliders/ShowAll.vue"),
            },

            // Edit
            {
              path: "edit/:id",
              name: "SlidersEdit",
              component: () =>
                import("@/views/children/CRUDS/Sliders/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "SlidersAdd",
              component: () =>
                import("@/views/children/CRUDS/Sliders/Form.vue"),
            },
          ],
        },
        // ******* End Sliders *******

        // ******* Start MostQuestions *******
        {
          path: "/most_questions",
          component: () =>
            import("@/views/children/CRUDS/MostQuestions/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllMostQuestions",
              component: () =>
                import("@/views/children/CRUDS/MostQuestions/ShowAll.vue"),
            },

            // Edit
            {
              path: "edit/:id",
              name: "MostQuestionsEdit",
              component: () =>
                import("@/views/children/CRUDS/MostQuestions/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "MostQuestionsAdd",
              component: () =>
                import("@/views/children/CRUDS/MostQuestions/Form.vue"),
            },
          ],
        },
        // ******* End MostQuestions *******

        // ******* Start OwnershipGuide *******
        // {
        //   path: "/ownership-guide",
        //   component: () =>
        //     import("@/views/children/CRUDS/OwnershipGuide/Home.vue"),
        //   children: [
        //     // Show All
        //     {
        //       path: "show-all",
        //       name: "AllOwnershipGuide",
        //       component: () =>
        //         import("@/views/children/CRUDS/OwnershipGuide/ShowAll.vue"),
        //     },

        //     // Edit
        //     {
        //       path: "edit/:id",
        //       name: "OwnershipGuideEdit",
        //       component: () =>
        //         import("@/views/children/CRUDS/OwnershipGuide/Form.vue"),
        //       props: true,
        //     },
        //     // Add
        //     {
        //       path: "add",
        //       name: "OwnershipGuideAdd",
        //       component: () =>
        //         import("@/views/children/CRUDS/OwnershipGuide/Form.vue"),
        //     },
        //   ],
        // },
        // ******* End OwnershipGuide *******

        // ******* Start RejectReasons *******
        {
          path: "/reject",
          component: () =>
            import("@/views/children/CRUDS/RejectReasons/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllRejectReasons",
              component: () =>
                import("@/views/children/CRUDS/RejectReasons/ShowAll.vue"),
            },

            // Edit
            {
              path: "edit/:id",
              name: "RejectReasonsEdit",
              component: () =>
                import("@/views/children/CRUDS/RejectReasons/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "RejectReasonsAdd",
              component: () =>
                import("@/views/children/CRUDS/RejectReasons/Form.vue"),
            },
          ],
        },
        // ******* End RejectReasons *******

        // ******* Start CheckLists *******
        {
          path: "/check_lists",
          component: () => import("@/views/children/CRUDS/CheckLists/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllCheckLists",
              component: () =>
                import("@/views/children/CRUDS/CheckLists/ShowAll.vue"),
            },

            // Edit
            {
              path: "edit/:id",
              name: "CheckListsEdit",
              component: () =>
                import("@/views/children/CRUDS/CheckLists/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "CheckListsAdd",
              component: () =>
                import("@/views/children/CRUDS/CheckLists/Form.vue"),
            },
          ],
        },
        // ******* End CheckLists *******

        // ******* Start Banks *******
        {
          path: "/bank",
          component: () => import("@/views/children/CRUDS/Banks/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllBanks",
              component: () =>
                import("@/views/children/CRUDS/Banks/ShowAll.vue"),
            },

            // Edit
            {
              path: "edit/:id",
              name: "BanksEdit",
              component: () => import("@/views/children/CRUDS/Banks/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "BanksAdd",
              component: () => import("@/views/children/CRUDS/Banks/Form.vue"),
            },
          ],
        },
        // ******* End Banks *******

        // ******* Start Packages *******
        {
          path: "/package",
          component: () => import("@/views/children/CRUDS/Packages/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllPackages",
              component: () =>
                import("@/views/children/CRUDS/Packages/ShowAll.vue"),
            },

            // Show
            {
              path: "show/:id",
              name: "PackagesShow",
              component: () =>
                import("@/views/children/CRUDS/Packages/Show.vue"),
              props: true,
            },

            // Edit
            {
              path: "edit/:id",
              name: "PackagesEdit",
              component: () =>
                import("@/views/children/CRUDS/Packages/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "PackagesAdd",
              component: () =>
                import("@/views/children/CRUDS/Packages/Form.vue"),
            },
          ],
        },
        // ******* End Packages *******

        // ******* Start ReturnPackages *******
        {
          path: "/return-package",
          component: () =>
            import("@/views/children/CRUDS/ReturnPackages/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllReturnPackages",
              component: () =>
                import("@/views/children/CRUDS/ReturnPackages/ShowAll.vue"),
            },
          ],
        },
        // ******* End ReturnPackages *******

        // ******* Start Categories *******
        {
          path: "/main-categories",
          component: () => import("@/views/children/CRUDS/Categories/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllCategories",
              component: () =>
                import("@/views/children/CRUDS/Categories/ShowAll.vue"),
            },

            // Edit
            {
              path: "edit/:id",
              name: "CategoriesEdit",
              component: () =>
                import("@/views/children/CRUDS/Categories/Form.vue"),
              props: true,
            },
            // Add
            // {
            //   path: "add",
            //   name: "CategoriesAdd",
            //   component: () =>
            //     import("@/views/children/CRUDS/Categories/Form.vue"),
            // },
          ],
        },
        // ******* End Categories *******

        // ******* Start Users *******
        {
          path: "/users",
          component: () => import("../views/children/CRUDS/Users/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllUsers",
              component: () =>
                import("../views/children/CRUDS/Users/ShowAll.vue"),
            },
            // Show Single
            {
              path: "show/:id",
              name: "UserShow",
              component: () => import("../views/children/CRUDS/Users/Show.vue"),
              props: true,
              children: [
                {
                  path: "cards",
                  name: "Cards",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/Cards.vue"
                    ),
                  props: true,
                },
                {
                  path: "personal",
                  name: "PersonalData",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/Personal.vue"
                    ),
                  props: true,
                },
                {
                  path: "ads",
                  name: "UsersAds",
                  component: () =>
                    import("../views/children/CRUDS/Users/UserDetails/Ads.vue"),
                  props: true,
                },
                {
                  path: "favorites",
                  name: "UsersFavorites",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/Favorites.vue"
                    ),
                  props: true,
                },

                {
                  path: "auctions",
                  name: "UsersAuctions",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/Auctions.vue"
                    ),
                  props: true,
                },

                {
                  path: "packages",
                  name: "UsersPackages",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/Packages.vue"
                    ),
                  props: true,
                },

                {
                  path: "participated_auctions",
                  name: "UsersParticipatedAuctions",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/ParticipatedAuctions.vue"
                    ),
                  props: true,
                },
                {
                  path: "activity",
                  name: "UserActivity",
                  component: () =>
                    import(
                      "../views/children/CRUDS/Users/UserDetails/Activity.vue"
                    ),
                  props: true,
                },
              ],
            },
            // Edit
            {
              path: "edit/:id",
              name: "UserEdit",
              component: () => import("../views/children/CRUDS/Users/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "UserAdd",
              component: () => import("../views/children/CRUDS/Users/Form.vue"),
            },
          ],
        },
        // ******* End Users *******

        // ******* Start FinancialAnalyses *******
        {
          path: "/financial_analyses",
          component: () =>
            import("@/views/children/CRUDS/FinancialAnalyses/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllFinancialAnalyses",
              component: () =>
                import("@/views/children/CRUDS/FinancialAnalyses/ShowAll.vue"),
            },
          ],
        },
        // ******* End FinancialAnalyses *******

        // ******* Start ContactMessages *******
        {
          path: "/contacts",
          component: () =>
            import("@/views/children/CRUDS/ContactMessages/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllContactMessages",
              component: () =>
                import("@/views/children/CRUDS/ContactMessages/ShowAll.vue"),
            },

            // Show
            {
              path: "show/:id",
              name: "ContactMessageShow",
              component: () =>
                import("@/views/children/CRUDS/ContactMessages/Show.vue"),
              props: true,
            },
          ],
        },
        // ******* End ContactMessages *******

        // ******* Start notifications *******
        {
          path: "/notifications",
          component: () =>
            import("@/views/children/CRUDS/notifications/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "all-notifications",
              component: () =>
                import("@/views/children/CRUDS/notifications/ShowAll.vue"),
            },
            // SentNotifications
            {
              path: "sent",
              name: "sent",
              component: () =>
                import(
                  "@/views/children/CRUDS/notifications/SentNotifications.vue"
                ),
              props: true,
            },

            // add
            {
              path: "add",
              name: "add-notification",
              component: () =>
                import("@/views/children/CRUDS/notifications/Form.vue"),
            },
          ],
        },
        // ******* End notifications *******

        // ******* Start  roles *******
        {
          path: "/roles",
          component: () => import("@/views/children/CRUDS/Roles/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "all-roles",
              component: () =>
                import("@/views/children/CRUDS/Roles/ShowAll.vue"),
            },
            // Show Single

            // Edit
            {
              path: "edit/:id",
              name: "edit-role",
              component: () => import("@/views/children/CRUDS/Roles/Form.vue"),
              props: true,
            },
            // Edit
            {
              path: "add",
              name: "add-role",
              component: () => import("@/views/children/CRUDS/Roles/Form.vue"),
            },
          ],
        },
        // ******* End  roles *******

        // ******* Start  Admins *******
        {
          path: "/admins",
          component: () => import("@/views/children/CRUDS/Admins/Home.vue"),
          children: [
            // Show All
            {
              path: "show-all",
              name: "AllAdmins",
              component: () =>
                import("@/views/children/CRUDS/Admins/ShowAll.vue"),
            },
            // Show Single
            {
              path: "show/:id",
              name: "adminShow",
              component: () => import("@/views/children/CRUDS/Admins/Show.vue"),
              props: true,
            },
            // Edit
            {
              path: "edit/:id",
              name: "adminEdit",
              component: () => import("@/views/children/CRUDS/Admins/Form.vue"),
              props: true,
            },
            // Add
            {
              path: "add",
              name: "adminAdd",
              component: () => import("@/views/children/CRUDS/Admins/Form.vue"),
            },
          ],
        },
        // ******* End  Admins *******

        // ========== Start Pages ==========

        {
          path: "/pages/show",
          component: () => import("../views/children/CRUDS/Pages/Home.vue"),
          children: [
            // default: /pages/show → redirect to /pages/show/about-us
            {
              path: "",
              redirect: { name: "aboutUsPage" },
            },

            // /pages/show/about-us
            {
              path: "about-us",
              name: "aboutUsPage",
              component: () =>
                import("../views/children/CRUDS/Pages/AboutUs.vue"),
            },

            // /pages/show/terms
            {
              path: "terms",
              name: "termsPage",
              component: () =>
                import("../views/children/CRUDS/Pages/Terms.vue"),
            },

            // /pages/show/privacy-policy
            {
              path: "privacy-policy",
              name: "policyPage",
              component: () =>
                import("../views/children/CRUDS/Pages/Policy.vue"),
            },

            // /pages/show/most-questions
            // {
            //   path: "most-questions",
            //   name: "MostQuestionsPage",
            //   component: () =>
            //     import("../views/children/CRUDS/Pages/MostQuestions.vue"),
            // },
          ],
        },

        // ========== End Pages ==========

        // ========== Start Settings ==========

        {
          path: "/settings/show-all",
          component: () => import("../views/children/Settings/Home.vue"),
          children: [
            // default: /settings/show-all  → redirect to /settings/show-all/social
            {
              path: "",
              redirect: { name: "socialSettings" },
            },

            // /settings/show-all/social
            {
              path: "social",
              name: "socialSettings",
              component: () => import("../views/children/Settings/Social.vue"),
            },

            // /settings/show-all/app-links
            {
              path: "app-links",
              name: "app-links",
              component: () =>
                import("../views/children/Settings/AppLinks.vue"),
            },

            // /settings/show-all/fees
            {
              path: "fees",
              name: "fees",
              component: () => import("../views/children/Settings/Fees.vue"),
            },

            // /settings/show-all/instructions
            {
              path: "instructions",
              name: "instructions",
              component: () =>
                import("../views/children/Settings/Instructions.vue"),
            },
          ],
        },
        // ========== End Settings ==========

        // ========== Start Profiles ==========
        {
          path: "/profile",

          component: () => import("@/views/children/adminProfile/Home.vue"),
          children: [
            {
              path: "show",
              name: "showProfile",
              component: () => import("@/views/children/adminProfile/Show.vue"),
            },
            {
              path: "edit",
              name: "editProfile",
              component: () => import("@/views/children/adminProfile/Form.vue"),
            },
            {
              path: "password",
              name: "changePassword",
              component: () =>
                import("@/views/children/adminProfile/ChangePassword.vue"),
            },
          ],
        },
        // ========== End Profiles ==========
      ],
    },

    {
      path: "/permission-required",
      name: "permission-required",
      component: () => import("../views/PermissionRequired.vue"),
    },

    //  =========== Start Redirects ===============
    {
      path: "/countries",

      redirect: () => {
        return { path: "/countries/show-all" };
      },
    },
    {
      path: "/about",

      redirect: () => {
        return { path: "/about/show-all" };
      },
    },
    // {
    //   path: "/terms",

    //   redirect: () => {
    //     return { path: "/terms/show-all" };
    //   },
    // },
    {
      path: "/privacy",

      redirect: () => {
        return { path: "/privacy/show-all" };
      },
    },
    {
      path: "/about/add",

      redirect: () => {
        return { path: "/about/show-all" };
      },
    },
    // {
    //   path: "/terms/add",

    //   redirect: () => {
    //     return { path: "/terms/show-all" };
    //   },
    // },
    {
      path: "/privacy/add",

      redirect: () => {
        return { path: "/privacy/show-all" };
      },
    },
    //  =========== End  Redirects ===============
    // Auth
    {
      path: "/login",
      name: "Login",
      component: Login,
    },

    // NotFound
    { path: "/:notFound(.*)", name: "NotFound", component: NotFound },
  ],
});

const TOKEN = store.getters["auth_module/currentUser"].token;

router.beforeEach((to, _2, next) => {
  if (to.name !== "Login" && !TOKEN) {
    next({ name: "Login" });
  } else if (to.name == "Login" && TOKEN) {
    next("/");
  } else {
    next();
  }
});

Vue.use(VueRouter);
export default router;
