import Home from "../views/Home.vue";

// ********** Children
import HomePage from "../views/children/HomePage.vue";

// ========== Start Profiles ==========

// ========== End Profiles ==========

// ============================== START:: CRUDS ==============================

// ========== Start:: Static Screens ==========
import StaticScreens from "../views/children/StaticScreens/Home.vue";
// ========== End:: Static Screens ==========

// ========== Start:: Reference ==========
import Reference from "../Reference/Reference.vue";
// ========== End:: Reference ==========

// ********** Auth
import Login from "../views/Auth/Login.vue";

// ********** NotFound
import NotFound from "../views/NotFound.vue";

// ******* Start Contact Messages *******
import ContactMessagesHome from "../views/children/CRUDS/ContactMessages/Home.vue";
// Show All
import AllContactMessages from "../views/children/CRUDS/ContactMessages/ShowAll.vue";
// Show Single
import ContactMessageShow from "../views/children/CRUDS/ContactMessages/Show.vue";
// ******* End Contact Messages *******
// ============================== End Views ==============================

const admin_routers = [
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
            component: () => import("../views/children/CRUDS/Cities/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "CityEdit",
            component: () => import("../views/children/CRUDS/Cities/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "CityAdd",
            component: () => import("../views/children/CRUDS/Cities/Form.vue"),
          },
        ],
      },
      // ******* End Cities *******
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
      // ******* Start Companies *******
      {
        path: "/companies",
        component: () => import("../views/children/CRUDS/Companies/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllCompanies",
            component: () =>
              import("../views/children/CRUDS/Companies/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "CompanyShow",
            component: () =>
              import("../views/children/CRUDS/Companies/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "CompanyEdit",
            component: () =>
              import("../views/children/CRUDS/Companies/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "CompanyAdd",
            component: () =>
              import("../views/children/CRUDS/Companies/Form.vue"),
          },
        ],
      },
      // ******* End Companies *******
      // ******* Start Call Center *******
      {
        path: "/callCenter",
        component: () => import("../views/children/CRUDS/CallCenter/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllCallCeenters",
            component: () =>
              import("../views/children/CRUDS/CallCenter/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "CallCenterShow",
            component: () =>
              import("../views/children/CRUDS/CallCenter/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "CallCenterEdit",
            component: () =>
              import("../views/children/CRUDS/CallCenter/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "CallCenterAdd",
            component: () =>
              import("../views/children/CRUDS/CallCenter/Form.vue"),
          },
        ],
      },
      // ******* End Call Center *******
      // ******* Start Providers *******
      {
        path: "/providers",
        component: () => import("../views/children/CRUDS/Providers/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllProviders",
            component: () =>
              import("../views/children/CRUDS/Providers/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "ProviderShow",
            component: () =>
              import("../views/children/CRUDS/Providers/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "ProviderEdit",
            component: () =>
              import("../views/children/CRUDS/Providers/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "ProviderAdd",
            component: () =>
              import("../views/children/CRUDS/Providers/Form.vue"),
          },
        ],
      },
      // ******* End Providers *******
      // ******* Start Maintenance Technician *******
      {
        path: "/maintenanceTechnician",
        component: () =>
          import("../views/children/CRUDS/MaintenanceTechnician/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "maintenanceTechnicians",
            component: () =>
              import(
                "../views/children/CRUDS/MaintenanceTechnician/ShowAll.vue"
              ),
          },
          // Show Single
          {
            path: "show/:id",
            name: "maintenanceTechnicianShow",
            component: () =>
              import("../views/children/CRUDS/MaintenanceTechnician/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "maintenanceTechnicianEdit",
            component: () =>
              import("../views/children/CRUDS/MaintenanceTechnician/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "maintenanceTechnicianAdd",
            component: () =>
              import("../views/children/CRUDS/MaintenanceTechnician/Form.vue"),
          },
        ],
      },
      // ******* End Maintenance Technician *******
      // ******* Start Categories *******
      {
        path: "/services",
        component: () => import("@/views/children/CRUDS/Services/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllServices",
            component: () =>
              import("@/views/children/CRUDS/Services/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "serviceShow",
            component: () => import("@/views/children/CRUDS/Services/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "serviceEdit",
            component: () => import("@/views/children/CRUDS/Services/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "serviceAdd",
            component: () => import("@/views/children/CRUDS/Services/Form.vue"),
          },
        ],
      },
      // ******* End Categories *******
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
          // Show Single
          {
            path: "show/:id",
            name: "sliderShow",
            component: () => import("@/views/children/CRUDS/Sliders/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "sliderEdit",
            component: () => import("@/views/children/CRUDS/Sliders/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "sliderAdd",
            component: () => import("@/views/children/CRUDS/Sliders/Form.vue"),
          },
        ],
      },
      // ******* End Sliders *******
      // ******* Start Sub Service *******
      {
        path: "/subservice",
        component: () => import("@/views/children/CRUDS/SubServices/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllSubServices",
            component: () =>
              import("@/views/children/CRUDS/SubServices/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "subServiceShow",
            component: () =>
              import("@/views/children/CRUDS/SubServices/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "subServiceEdit",
            component: () =>
              import("@/views/children/CRUDS/SubServices/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "subServiceAdd",
            component: () =>
              import("@/views/children/CRUDS/SubServices/Form.vue"),
          },
        ],
      },
      // ******* End Days *******
      // ******* Start Days *******
      {
        path: "/days",
        component: () => import("@/views/children/CRUDS/Days/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllDays",
            component: () => import("@/views/children/CRUDS/Days/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "dayShow",
            component: () => import("@/views/children/CRUDS/Days/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "dayEdit",
            component: () => import("@/views/children/CRUDS/Days/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "sliderAdd",
            component: () => import("@/views/children/CRUDS/Days/Form.vue"),
          },
        ],
      },
      // ******* End Days *******
      // ******* Start Work Times *******
      {
        path: "/workTimes",
        component: () => import("@/views/children/CRUDS/WorkTimes/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllWorkTimes",
            component: () =>
              import("@/views/children/CRUDS/WorkTimes/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "workTimeShow",
            component: () =>
              import("@/views/children/CRUDS/WorkTimes/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "workTimeEdit",
            component: () =>
              import("@/views/children/CRUDS/WorkTimes/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "workTimeAdd",
            component: () =>
              import("@/views/children/CRUDS/WorkTimes/Form.vue"),
          },
        ],
      },
      // ******* End Work Times *******
      // ******* Start Advantages *******
      {
        path: "/advantages",
        component: () => import("@/views/children/CRUDS/Advantages/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllAdvantages",
            component: () =>
              import("@/views/children/CRUDS/Advantages/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "advantageShow",
            component: () =>
              import("@/views/children/CRUDS/Advantages/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "advantageEdit",
            component: () =>
              import("@/views/children/CRUDS/Advantages/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "advantageAdd",
            component: () =>
              import("@/views/children/CRUDS/Advantages/Form.vue"),
          },
        ],
      },
      // ******* End Advantages *******
      // ******* Start home_services *******
      {
        path: "/home_services",
        component: () => import("@/views/children/CRUDS/HomeService/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllHomeServices",
            component: () =>
              import("@/views/children/CRUDS/HomeService/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "homeServiceShow",
            component: () =>
              import("@/views/children/CRUDS/HomeService/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "homeServiceEdit",
            component: () =>
              import("@/views/children/CRUDS/HomeService/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "homeServiceAdd",
            component: () =>
              import("@/views/children/CRUDS/HomeService/Form.vue"),
          },
        ],
      },
      // ******* End home_services *******
      // ******* Start home_Experts *******
      {
        path: "/home_experts",
        component: () => import("@/views/children/CRUDS/HomeExperts/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllHomeExperts",
            component: () =>
              import("@/views/children/CRUDS/HomeExperts/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "homeExpertshow",
            component: () =>
              import("@/views/children/CRUDS/HomeExperts/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "homeServiceEdit",
            component: () =>
              import("@/views/children/CRUDS/HomeExperts/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "homeServiceAdd",
            component: () =>
              import("@/views/children/CRUDS/HomeExperts/Form.vue"),
          },
        ],
      },
      // ******* End home_Experts *******
      // ******* Start Testimonials *******
      {
        path: "/testimonials",
        component: () => import("@/views/children/CRUDS/Testimonials/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllTestimonials",
            component: () =>
              import("@/views/children/CRUDS/Testimonials/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "testimonialshow",
            component: () =>
              import("@/views/children/CRUDS/Testimonials/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "testimonialEdit",
            component: () =>
              import("@/views/children/CRUDS/Testimonials/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "testimonialAdd",
            component: () =>
              import("@/views/children/CRUDS/Testimonials/Form.vue"),
          },
        ],
      },
      // ******* End Testimonials *******
      // ******* Start What We Offer *******
      {
        path: "/what_we_offers",
        component: () => import("@/views/children/CRUDS/WhatWeOffer/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllwhatWeOffers",
            component: () =>
              import("@/views/children/CRUDS/WhatWeOffer/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "whatWeOfferShow",
            component: () =>
              import("@/views/children/CRUDS/WhatWeOffer/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "whatWeOfferEdit",
            component: () =>
              import("@/views/children/CRUDS/WhatWeOffer/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "whatWeOfferAdd",
            component: () =>
              import("@/views/children/CRUDS/WhatWeOffer/Form.vue"),
          },
        ],
      },
      // ******* End Testimonials *******
      // ******* Start Terms *******
      {
        path: "/terms",
        component: () => import("@/views/children/CRUDS/Terms/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllTerms",
            component: () => import("@/views/children/CRUDS/Terms/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "termsShow",
            component: () => import("@/views/children/CRUDS/Terms/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "termsEdit",
            component: () => import("@/views/children/CRUDS/Terms/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "termsAdd",
            component: () => import("@/views/children/CRUDS/Terms/Form.vue"),
          },
        ],
      },
      // ******* End Terms *******
      // ******* Start About *******
      {
        path: "/about",
        component: () => import("@/views/children/CRUDS/About/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllAbout",
            component: () => import("@/views/children/CRUDS/About/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "AboutShow",
            component: () => import("@/views/children/CRUDS/About/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "AboutEdit",
            component: () => import("@/views/children/CRUDS/About/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "AboutAdd",
            component: () => import("@/views/children/CRUDS/About/Form.vue"),
          },
        ],
      },
      // ******* End About *******
      // ******* Start Privacy *******
      {
        path: "/privacy",
        component: () => import("@/views/children/CRUDS/Privacy/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllPrivacies",
            component: () =>
              import("@/views/children/CRUDS/Privacy/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "privacyShow",
            component: () => import("@/views/children/CRUDS/Privacy/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "privacyEdit",
            component: () => import("@/views/children/CRUDS/Privacy/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "privacyAdd",
            component: () => import("@/views/children/CRUDS/Privacy/Form.vue"),
          },
        ],
      },
      // ******* End Privacy *******
      // ******* Start Steps *******
      {
        path: "/steps",
        component: () => import("@/views/children/CRUDS/Steps/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllSteps",
            component: () => import("@/views/children/CRUDS/Steps/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "stepShow",
            component: () => import("@/views/children/CRUDS/Steps/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "stepEdit",
            component: () => import("@/views/children/CRUDS/Steps/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "stepAdd",
            component: () => import("@/views/children/CRUDS/Steps/Form.vue"),
          },
        ],
      },
      // ******* End Steps *******
      // ******* Start Orders *******
      {
        path: "/orders",
        component: () => import("@/views/children/CRUDS/Orders/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllOrders",
            component: () =>
              import("@/views/children/CRUDS/Orders/ShowAll.vue"),
          },
          // Cancel Orders
          {
            path: "canceled-orders",
            name: "AllCancelOrders",
            component: () =>
              import("@/views/children/CRUDS/Orders/CancelOrders.vue"),
          },
          {
            path: "agent-cancel",
            name: "AgentCancel",
            component: () =>
              import("@/views/children/CRUDS/Orders/ShowAll.vue"),
          },
          {
            path: "mentainance-orders",
            name: "MentainanceOrders",
            component: () =>
              import("@/views/children/CRUDS/Orders/ShowAll.vue"),
          },
          {
            path: "today-orders",
            name: "TodayOrders",
            component: () =>
              import("@/views/children/CRUDS/Orders/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "orderShow",
            component: () => import("@/views/children/CRUDS/Orders/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "orderEdit",
            component: () => import("@/views/children/CRUDS/Orders/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "orderAdd",
            component: () => import("@/views/children/CRUDS/Orders/Form.vue"),
          },
        ],
      },
      // ******* End Orders *******
      // ******* Start Sales *******
      {
        path: "/sales",
        component: () => import("@/views/children/CRUDS/Sales/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllSales",
            component: () => import("@/views/children/CRUDS/Sales/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "saleShow",
            component: () => import("@/views/children/CRUDS/Sales/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "saleEdit",
            component: () => import("@/views/children/CRUDS/Sales/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "saleAdd",
            component: () => import("@/views/children/CRUDS/Sales/Form.vue"),
          },
        ],
      },
      // ******* End Sales *******
      // ******* Start CancelReasons *******
      {
        path: "/cancelReasons",
        component: () =>
          import("@/views/children/CRUDS/CancelReasons/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "CancelReasonsSales",
            component: () =>
              import("@/views/children/CRUDS/CancelReasons/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "cancelReasonsShow",
            component: () =>
              import("@/views/children/CRUDS/CancelReasons/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "cancelReasonsEdit",
            component: () =>
              import("@/views/children/CRUDS/CancelReasons/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "cancelReasonsAdd",
            component: () =>
              import("@/views/children/CRUDS/CancelReasons/Form.vue"),
          },
        ],
      },
      // ******* End CancelReasons *******
      // ******* Start DelayReasons *******
      {
        path: "/delayReasons",
        component: () => import("@/views/children/CRUDS/DelayReasons/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "DelayReasonsSales",
            component: () =>
              import("@/views/children/CRUDS/DelayReasons/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "delayReasonsShow",
            component: () =>
              import("@/views/children/CRUDS/DelayReasons/Show.vue"),
            props: true,
          },
          // Edit
          {
            path: "edit/:id",
            name: "delayReasonsEdit",
            component: () =>
              import("@/views/children/CRUDS/DelayReasons/Form.vue"),
            props: true,
          },
          // Add
          {
            path: "add",
            name: "delayReasonsAdd",
            component: () =>
              import("@/views/children/CRUDS/DelayReasons/Form.vue"),
          },
        ],
      },
      // ******* End DelayReasons *******
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
          // Show Single

          {
            path: "add",
            name: "add-notification",
            component: () =>
              import("@/views/children/CRUDS/notifications/Form.vue"),
          },
        ],
      },
      // ******* End notifications *******
      // ******* Start Points *******
      {
        path: "/points",
        component: () => import("@/views/children/CRUDS/Points/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllPoints",
            component: () =>
              import("@/views/children/CRUDS/Points/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "PointShow",
            component: () => import("@/views/children/CRUDS/Points/Show.vue"),
            props: true,
          },
        ],
      },
      // ******* End Points *******
      // ******* Start Discounts *******
      {
        path: "/discounts",
        component: () => import("@/views/children/CRUDS/Discounts/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllDiscounts",
            component: () =>
              import("@/views/children/CRUDS/Discounts/ShowAll.vue"),
          },
          // Show Single
          {
            path: "show/:id",
            name: "DiscountShow",
            component: () =>
              import("@/views/children/CRUDS/Discounts/Show.vue"),
            props: true,
          },
        ],
      },
      // ******* End Discounts *******
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

      // ******* Start  Permission *******
      {
        path: "/permissions",
        component: () => import("@/views/children/CRUDS/Permissions/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllPermissions",
            component: () =>
              import("@/views/children/CRUDS/Permissions/ShowAll.vue"),
          },
          // Show Single

          // Edit
          {
            path: "edit/:id",
            name: "EditPermission",
            component: () =>
              import("@/views/children/CRUDS/Permissions/Form.vue"),
            props: true,
          },
          // Edit
          {
            path: "add",
            name: "AddPermission",
            component: () =>
              import("@/views/children/CRUDS/Permissions/Form.vue"),
          },
        ],
      },
      // ******* End  Permission *******
      // ******* Start  permissions-labels *******
      {
        path: "/permission-labels",
        component: () =>
          import("@/views/children/CRUDS/PermissionLabels/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "all-permission-labels",
            component: () =>
              import("@/views/children/CRUDS/PermissionLabels/ShowAll.vue"),
          },
          // Show Single

          // Edit
          {
            path: "edit/:id",
            name: "edit-permission-label",
            component: () =>
              import("@/views/children/CRUDS/PermissionLabels/Form.vue"),
            props: true,
          },
          // Edit
          {
            path: "add",
            name: "add-permission-label",
            component: () =>
              import("@/views/children/CRUDS/PermissionLabels/Form.vue"),
          },
        ],
      },
      // ******* End  roles *******
      // ******* Start  roles *******
      {
        path: "/roles",
        component: () => import("@/views/children/CRUDS/Roles/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "all-roles",
            component: () => import("@/views/children/CRUDS/Roles/ShowAll.vue"),
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
      // ******* End  permissions-categories *******
      // ******* Start  permissions-categories *******
      {
        path: "/permission-categories",
        component: () =>
          import("@/views/children/CRUDS/PermissionCategory/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "all-permission-category",
            component: () =>
              import("@/views/children/CRUDS/PermissionCategory/ShowAll.vue"),
          },
          // Show Single

          // Edit
          {
            path: "edit/:id",
            name: "edit-permission-category",
            component: () =>
              import("@/views/children/CRUDS/PermissionCategory/Form.vue"),
            props: true,
          },
          // Edit
          {
            path: "add",
            name: "add-permission-category",
            component: () =>
              import("@/views/children/CRUDS/PermissionCategory/Form.vue"),
          },
        ],
      },
      // ******* End  permissions-categories *******

      // ******* Start Live  Chat*******
      {
        path: "/chats/:id?",
        component: () => import("@/views/children/Chat/Index.vue"),
        name: "chats",
        props: true,
      },
      // ******* End  Live  Chat *******

      // ============================== End CRUDS ==============================

      // ******* Start Contact Messages *******
      {
        path: "/contacts",
        component: ContactMessagesHome,
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllContactMessages",
            component: AllContactMessages,
          },
          // Show Single
          {
            path: "show/:id",
            name: "ContactMessageShow",
            component: ContactMessageShow,
            props: true,
          },
        ],
      },
      // ******* End Contact Messages *******

      // ========== Start StaticScreens ==========
      {
        path: "/static-screens",
        name: StaticScreens,
        component: StaticScreens,
      },
      // ========== End StaticScreens ==========

      // ========== Start Settings ==========
      // ***** Anout Us
      {
        path: "/home_slider",
        component: () => import("@/views/children/CRUDS/HomeSlider/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllHomeSlider",
            component: () =>
              import("@/views/children/CRUDS/HomeSlider/ShowAll.vue"),
          },
          // Edit
          {
            path: "edit",
            name: "HomeSliderEdit",
            component: () =>
              import("@/views/children/CRUDS/HomeSlider/Form.vue"),
            // props: true,
          },
          // Add
          // {
          //   path: "add",
          //   name: "AboutUsAdd",
          //   component: () =>
          //     import("@/views/children/Settings/AboutUs/Form.vue"),
          // },
        ],
      },

      {
        path: "/about",
        component: () => import("@/views/children/Settings/AboutUs/Home.vue"),
        children: [
          // Show All
          {
            path: "show-all",
            name: "AllAboutUs",
            component: () =>
              import("@/views/children/Settings/AboutUs/ShowAll.vue"),
          },
          // Edit
          {
            path: "edit",
            name: "AboutUsEdit",
            component: () =>
              import("@/views/children/Settings/AboutUs/Form.vue"),
            // props: true,
          },
          // Add
          // {
          //   path: "add",
          //   name: "AboutUsAdd",
          //   component: () =>
          //     import("@/views/children/Settings/AboutUs/Form.vue"),
          // },
        ],
      },

      {
        path: "/settings",
        component: () => import("../views/children/Settings/Home.vue"),
        children: [
          {
            path: "",
            name: "mainSettings",
            component: () => import("../views/children/Settings/General.vue"),
            redirect: () => {
              return { path: "/settings/social" };
            },
          },
          {
            path: "social",
            name: "socialSettings",
            component: () => import("../views/children/Settings/Social.vue"),
          },
          {
            path: "sms",
            name: "sms",
            component: () =>
              import("../views/children/Settings/SmsServices.vue"),
          },
          {
            path: "order-setting",
            name: "order-setting",
            component: () => import("../views/children/Settings/Orders.vue"),
          },
          {
            path: "app-links",
            name: "app-links",
            component: () => import("../views/children/Settings/AppLinks.vue"),
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

      // ========== Start Reference==========
      {
        path: "/reference",
        name: "Reference",
        component: Reference,
      },
      // ========== End Reference ==========

      // ========== Start Chat ==========
      {
        path: "/financial_reports",
        name: "FinancialReports",
        component: () => import("../views/children/FinancialReports/Home.vue"),
      },
      // ========== Start Chat ==========

      // ========== End Chat ==========

      // ========== Start DriversTracking ==========
      // {
      //   path: '/drivers_tracking',
      //   name: 'DriversTracking',
      //   component: DriversTracking,
      // },
      // ========== End DriversTracking ==========
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
];

export default admin_routers;
