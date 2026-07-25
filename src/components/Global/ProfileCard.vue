<template>
  <!-- START:: PROFILE CARD -->
  <router-link :to="link">
    <div class="profile_card my-5">
      <div class="profile_card_component">
        <div :style="{ background: bgColor }" class="icon">
          <span :style="{ color: color }"><i :class="[icon]"></i></span>
        </div>
        <span class="title">{{ title }}</span>
      </div>
    </div>
  </router-link>
  <!-- END:: PROFILE CARD  -->
</template>

<script>
export default {
  props: ["icon", "title", "bgColor", "color", "link"],
};
</script>

<style></style>
