import axios from "axios";

export default {
  getNotifications(context) {
    axios
      .get("notifications", {
        headers: {
          "Accept-Language": "ar",
          dashboard: "main",
        },
      })
      .then((res) => {
        context.commit("setNotifications", res.data.data);
        context.commit("setUnread", res.data.unread_count);
      });
  },
};
