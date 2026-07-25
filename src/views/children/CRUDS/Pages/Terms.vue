<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="form fadeIn">
      <form @submit.prevent="submit">
        <div class="row">
          <!-- ============= Start:: terms-conditions ============= -->
          <!-- ***** ar title -->
          <base-input
            col="6"
            :name="$t('labels.title') + $t('inArabic')"
            type="text"
            :placeholder="$t('labels.title') + $t('inArabic')"
            v-model="data.ar.title"
            @keypress="isArabic"
          />

          <!-- ***** en title -->
          <base-input
            col="6"
            :name="$t('labels.title') + $t('inEnglish')"
            type="text"
            :placeholder="$t('labels.title') + $t('inEnglish')"
            v-model="data.en.title"
            @keypress="isEnglish"
          />

          <!-- ***** ar desc -->
          <base-input
            col="6"
            type="ckeditor"
            :placeholder="$t('labels.desc') + $t('inArabic')"
            v-model="data.ar.desc"
            @keypress="isArabic"
          />

          <!-- ***** en desc -->
          <base-input
            col="6"
            type="ckeditor"
            :placeholder="$t('labels.desc') + $t('inEnglish')"
            v-model="data.en.desc"
            @keypress="isEnglish"
          />

          <!-- ***** ordering -->
          <base-input
            col="6"
            class="mt-5"
            :name="$t('labels.ordering')"
            type="number"
            :placeholder="$t('labels.ordering')"
            v-model="data.ordering"
          />

          <!-- ============= End:: terms-conditions ============= -->
        </div>
        <!-- End Map -->
        <base-button :loading="loading" class="center">
          {{ $t("submit") }}
        </base-button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],

  data() {
    return {
      // Loading
      loading: false,

      data: {
        id: null,
        ar: {
          title: null,
          desc: null,
        },
        en: {
          title: null,
          desc: null,
        },
        ordering: null,
      },
    };
  },

  methods: {
    getEditData() {
      this.loading = true;
      this.axios({
        method: "GET",
        url: `pages`,
        params: {
          type: "terms-conditions",
        },
      })
        .then((res) => {
          const result = res.data.data;
          if (result.length > 0) {
            const resultData = result[0];
            this.data.id = resultData.id;

            this.data.ar.title = resultData.ar.title;
            this.data.en.title = resultData.en.title;

            this.data.ar.desc = resultData.ar.desc;
            this.data.en.desc = resultData.en.desc;

            this.data.ordering = resultData.ordering;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    submit() {
      this.loading = true;

      // Create FormData
      const data = new FormData();
      data.append("en[title]", this.data.en.title);
      data.append("ar[title]", this.data.ar.title);
      data.append("en[desc]", this.data.en.desc);
      data.append("ar[desc]", this.data.ar.desc);
      data.append("ordering", this.data.ordering);

      data.append("type", "terms-conditions");

      if (this.data.id) {
        data.append("_method", "PUT");
      }

      let url = "";
      if (this.data.id) {
        url = `pages/${this.data.id}`;
      } else {
        url = "pages";
      }

      this.axios({
        method: "POST",
        url: url,
        data: data,
      })
        .then(() => {
          this.$iziToast.success({
            title: this.$t("success"),
            message: this.$t("editSuccess"),
          });
          this.getEditData();
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response.data.message,
          });
          this.loading = false;
        });
    },
  },

  computed: {},

  async mounted() {
    this.canAdd = this.$permission.allowed("pages/add");
    this.canShowAll = this.$permission.allowed("pages/show");

    if (!this.canAdd) {
      if (!this.canShowAll) {
        this.getEditData();
      }
    } else {
      this.$router.push({ path: `/permission-required` });
    }
  },
};
</script>
