<template>
  <section class="headSection breadcrumb">
    <h1>{{ title }}</h1>

    <v-breadcrumbs divider=">>" :items="items">
      <template v-slot:item="{ item }">
        <router-link :to="item.href" :disabled="item.disabled">
          {{ item.text.toUpperCase() }}
        </router-link>
      </template>
    </v-breadcrumbs>
  </section>
</template>

<script>
export default {
  props: ["items", "title"],
};
</script>

<style lang="scss" scoped></style>
