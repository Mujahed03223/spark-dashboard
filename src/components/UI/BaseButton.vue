<template>
  <div class="button_wrapper" v-if="!link">
    <button type="submit">
      <span v-if="loading" class="btn_loader"></span>
      <slot></slot>
    </button>
  </div>
  <div class="button_wrapper" v-else>
    <router-link :to="to">
      <span v-if="loading" class="btn_loader"></span>
      <slot></slot>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: String,
      required: false,
      default: "/",
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss">
@keyframes rotation {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.button_wrapper {
  height: 40px;
  width: 200px;

  &.block {
    width: 100%;
  }
  &.big {
    width: 250px;
    height: 50px;
  }
  &.fitContent {
    width: auto;
    height: auto;
    padding: 0;
  }
  &.center {
    display: block;
    margin: 20px auto;
  }

  button,
  a {
    margin-top: 0;
    text-decoration: none;
    position: relative;
    display: inline-block;
    width: 80%;
    text-align: center;
    padding: 8px 20px;
    font-size: 16px;
    font-family: mediumArFont;
    color: var(--white) !important;
    background-image: linear-gradient(90deg, transparent 50%, var(--main) 50%);
    background-position: 100%;
    background-size: 400%;
    border: 1px solid var(--main);
    border-radius: 10px;
    transition: all 0.6s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 20px;
    margin-top: 2px;
    padding: 6px 20px;

    .btn_loader {
      position: absolute;
      left: 15px;
      top: 30%;
      width: 20px;
      height: 20px;
      padding: 2px;
      border: 3px dotted var(--white);
      border-style: solid solid dotted dotted;
      border-radius: 50%;
      transition: all 0.6s ease-in-out;
      display: inline-block;
      animation: rotation 1.5s linear infinite;
    }
    .v-btn__loader {
      color: var(--white);
    }

    &:hover {
      background-position: 0;
      color: var(--main) !important;
      .btn_loader {
        border: 3px dotted var(--main);
      }
    }
    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
