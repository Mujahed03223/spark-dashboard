<template>
  <div class="no_found">
    <div class="image">
      <img src="@/assets/media/images/Icons/happy-face.png" v-if="happy" />
      <img src="@/assets/media/images/Icons/not_found.png" v-else />
    </div>
    <div class="text">
      <h4 class="mb-5">{{ text }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: ["text", "happy"],
};
</script>

<style lang="scss">
.no_found {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .image {
    margin-bottom: 15px;
    animation: up 4s infinite linear;
    position: relative;
    img {
      width: 100px;
    }
  }
  .text {
    h4 {
      font-size: 20px;
      color: var(--main);
    }
  }
  @keyframes typeIt {
    0% {
      width: 0%;
    }
    50% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
}
</style>
