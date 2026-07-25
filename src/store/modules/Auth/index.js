import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      user: {
        permissions: localStorage.getItem("spark_dash_permissions"),
        id: localStorage.getItem("spark_dash_User_Id"),
        token: localStorage.getItem("spark_dash_Token"),
        usertype: localStorage.getItem("spark_dash_User_Type"),
        name: localStorage.getItem("spark_dash_User_name"),
        image: localStorage.getItem("spark_dash_userImg"),
        phone: localStorage.getItem("spark_dash_userPhone"),
        email: localStorage.getItem("spark_dash_userEmail"),
        gender: localStorage.getItem("spark_dash_userGender"),
      },
    };
  },
  mutations,
  actions,
  getters,
};
