export default {
  // ============================= Set_User_Dataa
  set_permissions(state, payload) {
    localStorage.setItem("spark_dash_permissions", payload);
    state.user.permissions = payload;
  },

  set_userId(state, payload) {
    localStorage.setItem("spark_dash_User_Id", payload);
    state.user.id = payload;
  },
  set_token(state, payload) {
    localStorage.setItem("spark_dash_Token", payload);
    state.user.token = payload;
  },
  set_userName(state, payload) {
    localStorage.setItem("spark_dash_User_name", payload);
    state.user.name = payload;
  },
  set_usertype(state, payload) {
    localStorage.setItem("spark_dash_User_Type", payload);
    state.user.usertype = payload;
  },
  set_userImage(state, payload) {
    localStorage.setItem("spark_dash_userImg", payload);
    state.user.image = payload;
  },
  set_userPhone(state, payload) {
    localStorage.setItem("spark_dash_userPhone", payload);
    state.user.phone = payload;
  },
  set_userEmail(state, payload) {
    localStorage.setItem("spark_dash_userEmail", payload);
    state.user.email = payload;
  },
  set_userGender(state, payload) {
    localStorage.setItem("spark_dash_userGender", payload);
    state.user.gender = payload;
  },

  // ============================= Remove_User_Dataa
  remove_user_data(state) {
    localStorage.removeItem("spark_dash_User_Id");
    localStorage.removeItem("spark_dash_Token");
    localStorage.removeItem("spark_dash_userImg");
    localStorage.removeItem("spark_dash_User_Type");
    localStorage.removeItem("spark_dash_userPhone");
    localStorage.removeItem("spark_dash_userEmail");
    localStorage.removeItem("spark_dash_userGender");
    localStorage.removeItem("spark_dash_permissions");

    state.user.id = null;
    state.user.token = null;
    state.user.image = null;
    state.user.usertype = null;
    state.user.phone = null;
    state.user.email = null;
    state.user.gender = null;
    state.user.permissions = null;
  },
};
