<template>
  <div class="staticScreen">
    <div class="row">
      <div class="col-lg-3">
        <base-screen :values="values" url="tests"></base-screen>
      </div>
      <div class="col-lg-3">
        <base-screen :values="values" url="tests"></base-screen>
      </div>
      <div class="col-lg-3">
        <base-screen :values="values" url="tests"></base-screen>
      </div>
      <div class="col-lg-3">
        <base-screen :values="values" url="tests"></base-screen>
      </div>
    </div>
  </div>
</template>

<script>
import BaseScreen from '../../../components/StaticScreens/BaseScreen.vue';
export default {
  components: {BaseScreen},

  data() {
    return {
      values: {
        descValue: "LOL",
        titleValue: "LOL",
      }
    }
  },

  
};
</script>

<style lang="scss" scoped></style>
