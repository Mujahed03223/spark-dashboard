import axios from "axios";

export default {
  getChats(context) {
    axios.get(`${process.env.VUE_APP_BASE_URL}get-conversations`).then((res) =>
      context.commit(
        "setChats",
        res.data.data.map((el) => ({
          ago_time: el.ago_time,
          created_at: el.created_at,
          id: el.id,
          is_read: el.is_read,
          last_message: el.last_message?.message,
          owner: el.receiver,
          online: false,
          last_message_created_at: el.last_message?.agoTime,
          last_message_created: new Date(el.last_message?.agoTime).getTime(),
        }))
      )
    );
  },
};
