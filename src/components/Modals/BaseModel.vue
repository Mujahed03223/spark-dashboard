<template>
  <transition name="fadeIn">
    <div v-if="show" class="baseModel" @click.stop="$emit('close')">
      <div
        class="main"
        @click.stop
        :class="{ closeIcon: isSmallScreen && closeIcon }"
      >
        <span
          v-if="isSmallScreen && closeIcon"
          @click.stop="$emit('close')"
          class="close"
        >
          <i class="fas fa-times"></i>
        </span>

        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["show", "closeIcon"],

  computed: {
    ...mapGetters({
      isSmallScreen: "sideNav_module/isSmallScreen",
    }),
  },
};
</script>

<style lang="scss">
.baseModel {
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0;
  z-index: 999;
  background: #333333d4;
  display: flex;
  justify-content: center;
  align-items: center;
  .image {
    text-align: center !important;
  }
  .main {
    width: 600px;

    height: auto;
    background: #fff;
    position: relative;
    border-radius: 10px;
    max-height: 97vh;
    overflow-y: scroll;
    padding: 22px 30px;
    font-size: 16px;
    min-height: 200px;
    @media (max-width: 992px) {
      width: 100vw;
      max-width: 600px;
      // border-radius: 0;
    }
    p {
      font-size: 15px;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-size: 18px;
    }

    &.closeIcon {
      padding: 50px 40px;
    }

    .close {
      position: absolute;
      top: 15px;
      left: 15px; // RTL
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--main);
      border-radius: 50%;
      z-index: 99;

      i {
        color: #fff;
        font-size: 20px;
      }
    }
  }
}
</style>
