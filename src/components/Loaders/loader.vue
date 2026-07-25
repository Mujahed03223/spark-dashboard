<template>
  <div class="loader_gif">
    <div class="image_loader">
      <img
        src="../../assets/media/images/logo/logo.png"
        alt=""
        width="250"
        height="250"
      />
      <!-- <img
        v-if="current_theme == 'dark'"
        src="../../assets/media/images/logo/logo_light.svg"
        alt=""
      /> -->
    </div>
    <span></span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      current_theme: ["theme_module/current_theme"],
    }),
  },
};
</script>

<style lang="scss" scoped>
@keyframes loder {
  from {
    transform: scale(0.4);
  }

  to {
    transform: scale(0.9);
  }
}

.image_loader {
  height: 600px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    // animation: loder 1.5s ease-in-out alternate infinite;
    width: auto !important;
  }
}
</style>
