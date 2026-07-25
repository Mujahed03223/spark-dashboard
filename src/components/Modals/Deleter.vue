<template>
  <v-icon class="delete" small @click.stop="deleteItem()">
    fas fa-trash
  </v-icon>
</template>

<script>
export default {
  props: ["items", "id", "name"],
  methods: {
    // ===== Delete
    deleteItem() {
      // Start:: Sweet Alert  Modal
      this.$swal({
        title: this.$t("areYouSure"),
        text: this.$t("youWillNotBeAbleToGoBackInTheProcess"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("delete"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteItemConfirm();
        }
      });
      // End:: Sweet Alert  Modal
    },
    async deleteItemConfirm() {
      await this.axios({
        method: "DELETE",
        url: `${this.name}/${this.id}`,
      })
        .then(() => {
          // refresh table data
          let items = this.items.filter((item) => {
            return item.id != this.id;
          });
          this.$emit("refresh", items);
          // refresh table data

          this.$swal({
            title: this.$t("deletedSuccessfully"),
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("ok"),
          });
        })
        .catch((err) => {
          let message = "";
          err.response?.data.message
            ? (message = err.response.data.message)
            : (message = err.response.data.messages);
          this.$swal({
            title: message,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: this.$t("cancel"),
          });
        });
    },
  },
};
</script>

<style></style>
