export default {
  setNotifications(state, payload) {
    state.notifications = payload;
  },
  setUnread(state, payload) {
    state.unreadCount = payload;
  },
  pushNotification(state, payload) {
    state.notifications.unshift(payload);
    ++state.unreadCount;
  },
  decreaseCounter(state) {
    --state.unreadCount;
  },
};
