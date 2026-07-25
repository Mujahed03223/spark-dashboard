<template>
  <div class="state_card">
    <div class="content">
      <h5>{{ name }}</h5>
      <p>
        <span class="value">{{ value }}</span> {{ text }}
      </p>
    </div>

    <div class="icon" v-if="icon">
      <button type="button" @click="actions">
        <v-icon>{{ icon }}</v-icon>
      </button>
    </div>
    <div class="icon_logo">
      <img src="@/assets/media/images/Icons/logo.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "value", "text", "icon"],
  methods: {
    actions() {
      this.$emit("action");
    },
  },
};
</script>

<style lang="scss">
.state_card {
  background: linear-gradient(97.46deg, #2d70ab -1.53%, #322176 132.35%);
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.05);
  padding: 10px 15px;
  border-radius: 8px;
  position: relative;

  .content {
    display: flex;
    flex-direction: column;
    min-height: 70px;
  }
  h5 {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 1px;
    text-transform: capitalize;
    color: #ffffff;
    margin: 0;
  }
  p {
    margin: auto 0 0;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 1px;
    text-transform: capitalize;

    color: #ffffff;
    span.value {
      font-style: normal;
      font-weight: 700;
      font-size: 25px;
      line-height: 30px;
      color: #ffffff;
    }
  }
  .icon {
    position: absolute;
    top: 8px;
    right: 8px;
    button {
      background: #ffffff;
      border: 2.5px solid #2e5599;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: none !important;
      .v-icon {
        color: #000 !important;
        font-size: 16px !important;
      }
    }
  }
  .icon_logo {
    position: absolute;
    bottom: 5px;
    left: 10px;
  }
}

@keyframes buncing {
  0% {
    transform: translateY(0) scale(0.8);
  }
  50% {
    transform: translateY(-10px) scale(1);
  }
  100% {
    transform: translateY(0) scale(0.8);
  }
}

body[dir="rtl"] {
  .state_card {
    .icon {
      position: absolute;
      top: 8px;
      right: unset;
      left: 8px;
    }
  }
}
</style>
