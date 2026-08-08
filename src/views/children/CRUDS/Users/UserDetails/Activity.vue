<template>
  <div class="user_data">
    <div class="personal_data_wrapper fadeIn mt-5">
      <div class="order-details-page mb-5">
        <div class="row py-2 mx-1 justify-content-center align-items-center">
          <div class="col-12">
            <h3 class="table-title title mb-4">
              {{ $t("labels.user_activity") }}
            </h3>

            <div class="user-activity-card pa-3">
              <div class="activity-list">
                <div
                  class="activity-item d-flex justify-content-between align-items-center py-3"
                >
                  <span class="activity-label">
                    <i class="fal fa-calendar-plus me-2"></i>
                    {{ $t("labels.user_registered_at") }}
                  </span>
                  <span class="activity-value" v-if="userInfo && userInfo.created_at">
                    {{ userInfo.created_at }}
                  </span>
                  <span class="activity-value text--secondary" v-else>
                    {{ $t("notFound") }}
                  </span>
                </div>

                <div
                  class="activity-item d-flex justify-content-between align-items-center py-3"
                >
                  <span class="activity-label">
                    <i class="fal fa-clock me-2"></i>
                    {{ $t("labels.user_last_active") }}
                  </span>
                  <span class="activity-value" v-if="userInfo && userInfo.last_login_at">
                    {{ userInfo.last_login_at }}
                  </span>
                  <span class="activity-value text--secondary" v-else>
                    {{ $t("labels.never") }}
                  </span>
                </div>

                <div
                  class="activity-item d-flex justify-content-between align-items-center py-3"
                >
                  <span class="activity-label">
                    <i class="fal fa-ad me-2"></i>
                    {{ $t("labels.user_total_ads") }}
                  </span>
                  <span class="activity-value">
                    {{ userInfo && userInfo.total_ads != null ? userInfo.total_ads : 0 }}
                  </span>
                </div>

                <div
                  class="activity-item d-flex justify-content-between align-items-center py-3"
                >
                  <span class="activity-label">
                    <i class="fal fa-info-circle me-2"></i>
                    {{ $t("labels.user_status") }}
                  </span>
                  <span class="activity-value" v-if="userInfo">
                    <v-chip
                      small
                      :color="userInfo.is_ban ? 'error' : userInfo.is_active ? 'success' : 'warning'"
                      text-color="white"
                    >
                      {{ userInfo.is_ban ? $t('status.banned') : userInfo.is_active ? $t('status.active') : $t('status.inactive') }}
                    </v-chip>
                  </span>
                  <span class="activity-value text--secondary" v-else>
                    {{ $t("notFound") }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userInfo"],
};
</script>

<style lang="scss" scoped>
.user-activity-card {
  background: var(--white);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px;

  .activity-list {
    .activity-item {
      border-bottom: 1px solid #f0f0f0;
      padding: 16px 8px;

      &:last-child {
        border-bottom: none;
      }

      .activity-label {
        font-weight: 500;
        color: var(--mainText);
        font-size: 15px;

        i {
          color: var(--main);
        }
      }

      .activity-value {
        font-weight: 600;
        color: var(--main);
        font-size: 15px;
      }
    }
  }
}
</style>
