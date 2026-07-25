<template>
  <div>
    <v-switch
      :disabled="loading || disabled"
      :loading="loading"
      :color="type == 'active' ? '#26BE00' : '#ed143d'"
      v-model="
        item[value == 'toggle-active-user' ? 'is_admin_active_user' : value]
      "
      @mousedown="confirmSwith(item, value, $event)"
    ></v-switch>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      required: false
    },
    name: {
      required: true
    },
    value: {
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false
    };
  },
  methods: {
    // ===== Delete
    confirmSwith(item, value, event) {
      event.preventDefault();
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: "",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("confirm")
      }).then((result) => {
        if (result.isConfirmed) {
          this.SwitchToggle(item, value);
        }
      });
      // End:: Sweet Alert  Modal
    },

    SwitchToggle(item, value) {
      this.loading = true;
      const frmData = new FormData();
      // frmData.append("_method", "PUT");
      // // is_admin_active_user

      // frmData.append(
      //   value == "is_admin_active_user" ? "is_active" : value,
      //   +item[value] == 0 ? 1 : 0
      // );

      let url = "";
      let message = "";

      if (value == "is_locked") {
        url = `${this.name}/${item.id}/update-locked`;
        message = item.is_locked == 1 ? "تم الغاء حجب الحساب" : "تم حجب الحساب";
      } else if (value == "status" && this.name == "socials") {
        url = `${this.name}/${item.id}/status`;
        message = item.status ? "تم الغاء التفعيل" : "تم التفعيل";
        frmData.append(value, +item.status);
      } else if (
        value == "status" &&
        this.name == "update-main-category-status"
      ) {
        url = `${this.name}/${item.id}`;
        message = item.status ? "تم الغاء التفعيل" : "تم التفعيل";
        frmData.append(value, +item[value] === 0 ? 1 : 0);
      } else if (value == "is_coming" && this.name == "toggleComingSoon") {
        url = `${this.name}/${item.id}`;
        message = item.is_coming ? "تم الغاء التفعيل" : "تم التفعيل";
        frmData.append(value, +item[value] === 0 ? 1 : 0);
      } else if (value == "is_active" && this.name == "update-slider-status") {
        url = `${this.name}/${item.id}`;
        message = item.status ? "تم الغاء التفعيل" : "تم التفعيل";
        frmData.append(value, +item[value] === 0 ? 1 : 0);
      } else if (
        value === "accepted_by_admin" &&
        this.name === "accept-moatmer"
      ) {
        url = `${this.name}/${item.id}`;
        message = item.accepted_by_admin ? "تم رفض المعتمر" : "تم قبول المعتمر";
      } else if (
        (value == "status" && this.name == "admins") ||
        (value == "is_active" && this.name === "roles")
      ) {
        url = `${this.name}/${item.id}/status`;
        message = item.status ? "تم الغاء التفعيل" : "تم التفعيل";
        //frmData.append(value, +item.status);
        frmData.append(value, +item[value] === 0 ? 1 : 0);
        frmData.append("_method", "PUT");
      } else if (value == "is_active" && this.name === "activate-client") {
        url = `${this.name}/${item.id}`;
        message = item.status ? "تم الغاء التفعيل" : "تم التفعيل";
      } else if (value == "is_active" && this.name == "users") {
        url = `${this.name}/${item.id}/toggle-active-user`;
        message = item.is_active ? "تم الغاء تفعيل الحساب" : "تم تفعيل الحساب";
      } else if (value == "is_ban" && this.name == "users") {
        url = `${this.name}/${item.id}/toggle-ban-user`;
        message = item.is_ban == 1 ? "تم الغاء حظر الحساب" : "تم حظر الحساب";
      } else if (value == "is_active" && this.name == "providers") {
        url = `${this.name}/${item.id}/toggle-active-provider`;
        message = item.is_active ? "تم الغاء تفعيل الحساب" : "تم تفعيل الحساب";
      } else if (value == "is_ban" && this.name == "providers") {
        url = `${this.name}/${item.id}/toggle-ban-provider`;
        message = item.is_ban == 1 ? "تم  الغاء حظر الحساب" : "تم حظر الحساب";
      } else if (value == "is_admin_active_user") {
        url = `toggle-active-admin/${item.id}`;
        message = item.is_admin_active_user
          ? "تم الغاء تفعيل الحساب"
          : "تم  تفعيل الحساب";
        // frmData.append(value, +item[value] === 0 ? 1 : 0);
        frmData.append("_method", "patch");
      } else if (value == "toggle-active-user") {
        url = `${this.name}/toggle-active-admin/${item.id}`;
        message = item.is_admin_active_user
          ? "تم الغاء تفعيل الحساب"
          : "تم  تفعيل الحساب";
      } else if (value == "agents_cant_receive_orders") {
        url = `${this.name}`;
        message =
          item.agents_cant_receive_orders == 1
            ? "تم الغاء تفعيل الاشعارات"
            : "تم  تفعيل الاشعارات";
        frmData.append(value, +item.agents_cant_receive_orders);
      }

      this.axios({
        method:
          value == "agents_cant_receive_orders" ||
          value == "status" ||
          value == "accepted_by_admin" ||
          value == "is_active" ||
          value == "is_coming" ||
          value == "is_admin_active_user"
            ? "post"
            : "patch",
        url: url,
        data: frmData
      })
        .then((res) => {
          item[value == "toggle-active-user" ? "is_admin_active_user" : value] =
            +item[
              value == "toggle-active-user" ? "is_admin_active_user" : value
            ] == 1
              ? 0
              : 1;
          this.loading = false;
          this.$iziToast.success({
            title: this.$t("success"),
            message: res.data?.message || message
          });
        })
        .catch((err) => {
          this.loading = false;
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages
          });
        });
    }
  }
};
</script>

<style></style>
