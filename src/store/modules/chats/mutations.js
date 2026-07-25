export default {
  setChats(state, payload) {
    state.chats = payload
  },
  pushChat(state, payload) {
    state.chats.push(payload)
  },
}
