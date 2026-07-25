<template>
  <simpleCard classes="w-100 mb-3">
    <div class="d-flex flex-wrap bread_flex">
      <v-breadcrumbs divider=">>" :items="items">
        <template v-slot:item="{ item }">
          <router-link :to="item.href" :disabled="item.disabled">
            {{ item.text.toUpperCase() }}
          </router-link>
        </template>
      </v-breadcrumbs>
      <div class="filter_icon frm-action">
        <div class="d-flex flex-wrap gap-1 justify-content-center">
          <router-link
            class="btn"
            :to="search_route"
            v-if="search_route && canAddNew"
          >
            {{ search_title }}
            <span class="fas fa-plus"></span>
          </router-link>
          <v-btn
            class="deleteBtn"
            v-if="btn_title && canDeleteAll"
            @click.stop="deleteConfirmSwal()"
          >
            {{ btn_title }}
            <span class="fas fa-trash"></span>
          </v-btn>
        </div>
      </div>
    </div>
  </simpleCard>
</template>

<script>
export default {
  props: [
    "items",
    "title",
    "search_title",
    "search_route",
    "icon",
    "canAddNew",
    "btn_title",
    "canDeleteAll",
    "handleDeleteConfirm",
  ],

  methods: {
    deleteConfirmSwal() {
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
          this.handleDeleteConfirm();
        }
      });
      // End:: Sweet Alert  Modal
    },
  },
};
</script>

<style lang="scss" scoped>
.frm-action a.btn {
  background: linear-gradient(
    97.46deg,
    var(--main) -1.53%,
    var(--main2) 132.35%
  ) !important;
  color: #fff !important;
  height: 45px;
  font-size: 16px;
  min-width: 200px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  opacity: 1;
  &:hover {
    opacity: 0.8;
  }
}

.deleteBtn {
  background: crimson !important;
  color: #fff !important;
  height: 42px !important;
  font-size: 16px;
  min-width: 200px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  opacity: 1;
  &:hover {
    opacity: 0.8;
  }
}
</style>
