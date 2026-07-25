<template>
  <transition name="fadeInUp">
    <v-dialog
      class="image_modal"
      v-model="modalIsOpen"
      @click:outside="toggleModal"
    >
      <v-card>
        <img
          @error="imageError"
          :src="modalImage"
          alt="Modal Image"
          width="250"
          height="250"
        />
      </v-card>
    </v-dialog>
  </transition>
</template>

<script>
export default {
  name: "ImageModal",

  emits: ["toggleModal"],

  props: {
    modalIsOpen: {
      type: Boolean,
      required: true,
    },
    modalImage: {
      type: String,
      required: true,
    },
  },

  methods: {
    imageError(event) {
      event.target.src = require("@/assets/media/images/logo/logo.png");
    },

    toggleModal() {
      this.$emit("toggleModal");
    },
  },

  // watch: {
  //   modalIsOpen(newVal) {
  //     newVal ? this.test = true : this.test = false
  //   }
  // },

  // data() {
  //   return {
  //     test: this.modalIsOpen,
  //   }
  // },
};
</script>
