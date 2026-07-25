<template>
  <div class="contentWrapper">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from "../ContentWrapper/Navbar/MainNav.vue";

export default {
  components: { Navbar },
};
</script>

<style lang="scss" scoped></style>
