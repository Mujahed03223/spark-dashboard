import axios from "axios";
// import store from "@/store/index";

export default {
  // ============ Logout
  logOut(context) {
    axios({
      method: "post",
      url: "logout",
    })
      .then((res) => {
        context.commit("remove_user_data");
        this.$iziToast.success({
          displayMode: 2,
          title: this.$t("validation.success"),
          message: res.response.data.message,
        });
        location.reload();
      })
      .catch((err) => {
        this.$iziToast.error({
          displayMode: 2,
          title: this.$t("validation.error"),
          message: err.response.data.message,
        });
      });

    context.commit("remove_user_data");
    location.reload();
  },

  // ============ Login
  logIn(context, payload) {
    context.commit("set_permissions", payload?.userPermissions || null);
    context.commit("set_userId", payload?.userId || null);
    context.commit("set_token", payload?.token || null);
    context.commit("set_usertype", payload?.userType || null);
    context.commit("set_userName", payload?.username || null);
    context.commit("set_userImage", payload?.userImage || null);
    context.commit("set_userPhone", payload?.userPhone || null);
    context.commit("set_userEmail", payload?.userEmail || null);
    context.commit("set_userGender", payload?.userGender || null);

    location.reload();
  },
};
