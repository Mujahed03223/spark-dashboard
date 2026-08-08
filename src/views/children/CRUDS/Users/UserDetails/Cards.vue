<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <noData v-if="noData" />
    <div class="" v-else>
      <div class="row justify-content-center mt-3">
        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/personal`"
            :icon="'fal fa-user'"
            :title="$t('labels.personal_data')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/ads`"
            :icon="'fal fa-star'"
            :title="$t('labels.user_ads')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/favorites`"
            :icon="'fal fa-star'"
            :title="$t('labels.user_favorites')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/auctions`"
            :icon="'fal fa-star'"
            :title="$t('labels.user_auctions')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/packages`"
            :icon="'fal fa-star'"
            :title="$t('labels.user_packages')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/participated_auctions`"
            :icon="'fal fa-star'"
            :title="$t('labels.participated_auctions')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="col-md-4">
          <profile-card
            :link="`/users/show/${id}/activity`"
            :icon="'fal fa-history'"
            :title="$t('labels.user_activity')"
            :color="'#0d4d3b'"
            :bgColor="'#0E755612'"
          ></profile-card>
        </div>

        <div class="my-5 button_section d-flex gap-1 justify-content-end">
          <v-btn
            type="button"
            class="back_btn"
            @click="handleBack('/users/show-all')"
          >
            {{ $t("back") }}
            <span
              :class="
                $i18n.locale === 'ar'
                  ? 'fas fa-arrow-left'
                  : 'fas fa-arrow-right'
              "
            ></span>
          </v-btn>
        </div>

        <router-view :key="$route.path"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      //Loading
      loading: false,
      noData: false,
    };
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
  },
};
</script>

<style>
.w-fit {
  width: fit-content;
}

.flex-1 {
  flex: 1;
}
</style>
