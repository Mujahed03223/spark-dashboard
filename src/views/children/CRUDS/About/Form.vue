<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="weHelpYouForm" @submit.prevent="submit">
        <div class="row">
          <!-- start section one -->
          <div class="col-lg-6">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.image')"
              class="col-lg-6"
              :rules="`${data.section_one_image_one.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'section_one_image_one')"
                v-model="data.section_one_image_one.image"
                class="d-none"
                :name="$t('labels.image')"
                accept="image/*,|size:2048"
                label=""
                id="section_one_image_one"
              ></v-file-input>
              <label
                for="section_one_image_one"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.section_one_image_one.preview"
                  class="d-flex"
                  cover
                  :src="data.section_one_image_one.preview"
                  :aspect-ratio="3.4"
                />
                <img
                  v-else
                  class="d-flex img-fluid mx-auto"
                  src="@/assets/media/images/placeholder.png"
                />

                <span class="error--text d-block">
                  {{ errors[0] }}
                </span>
              </label>
            </ValidationProvider>
          </div>
          <div class="col-lg-6">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.image')"
              class="col-lg-6"
              :rules="`${data.section_one_image_two.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'section_one_image_two')"
                v-model="data.section_one_image_two.image"
                class="d-none"
                :name="$t('labels.image')"
                accept="image/*,|size:2048"
                label=""
                id="section_one_image_two"
              ></v-file-input>
              <label
                for="section_one_image_two"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.section_one_image_two.preview"
                  class="d-flex"
                  cover
                  :src="data.section_one_image_two.preview"
                  :aspect-ratio="3.4"
                />
                <img
                  v-else
                  class="d-flex img-fluid mx-auto"
                  src="@/assets/media/images/placeholder.png"
                />

                <span class="error--text d-block">
                  {{ errors[0] }}
                </span>
              </label>
            </ValidationProvider>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.ar.section_one_title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.en.section_one_title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.content') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.content') + $t('inArabic')"
              v-model="data.ar.section_one_content"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="textarea"
              :name="$t('labels.content') + $t('inEnglish')"
              :placeholder="$t('labels.content') + $t('inEnglish')"
              v-model="data.en.section_one_content"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <!-- end section one -->

          <!-- start section two -->
          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <div class="col-lg-12 mb-5">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.section_two") }}</h4>
              </h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto"
            style="width: 100%"
            :rules="`${data.section_two_image.preview ? '' : 'required'}`"
          >
            <!-- @change="sentImage($event)" -->
            <v-file-input
              @change="uploadImage($event, 'section_two_image')"
              v-model="data.section_two_image.image"
              class="d-none"
              :name="$t('labels.image')"
              accept="image/*,|size:2048"
              label=""
              id="section_two_image"
            ></v-file-input>
            <label
              for="section_two_image"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.section_two_image.preview"
                class="d-flex"
                cover
                :src="data.section_two_image.preview"
                :aspect-ratio="3.4"
              />
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/placeholder.png"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.ar.section_two_title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.en.section_two_title"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.content') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.content') + $t('inArabic')"
              v-model="data.ar.section_two_content"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="textarea"
              :name="$t('labels.content') + $t('inEnglish')"
              :placeholder="$t('labels.content') + $t('inEnglish')"
              v-model="data.en.section_two_content"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- end section two -->

          <!-- start section three -->
          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <div class="col-lg-12 mb-5">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.section_three") }}</h4>
              </h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto"
            style="width: 100%"
            :rules="`${data.section_three_image.preview ? '' : 'required'}`"
          >
            <!-- @change="sentImage($event)" -->
            <v-file-input
              @change="uploadImage($event, 'section_three_image')"
              v-model="data.section_three_image.image"
              class="d-none"
              :name="$t('labels.image')"
              accept="image/*,|size:2048"
              label=""
              id="section_three_image"
            ></v-file-input>
            <label
              for="section_three_image"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.section_three_image.preview"
                class="d-flex"
                cover
                :src="data.section_three_image.preview"
                :aspect-ratio="3.4"
              />
              <img
                v-else
                class="d-flex img-fluid mx-auto"
                src="@/assets/media/images/placeholder.png"
              />

              <span class="error--text d-block">
                {{ errors[0] }}
              </span>
            </label>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.ar.section_three_title_one"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.en.section_three_title_one"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.content') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.content') + $t('inArabic')"
              v-model="data.ar.section_three_content_one"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="textarea"
              :name="$t('labels.content') + $t('inEnglish')"
              :placeholder="$t('labels.content') + $t('inEnglish')"
              v-model="data.en.section_three_content_one"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inArabic')"
              type="text"
              :placeholder="$t('labels.title') + $t('inArabic')"
              v-model="data.ar.section_three_title_two"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.title') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2|max:250"
          >
            <base-input
              :name="$t('labels.title') + $t('inEnglish')"
              type="text"
              :placeholder="$t('labels.title') + $t('inEnglish')"
              v-model="data.en.section_three_title_two"
            />
            <span v-if="errors[0]" class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inArabic')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              :name="$t('labels.content') + $t('inArabic')"
              type="textarea"
              :placeholder="$t('labels.content') + $t('inArabic')"
              v-model="data.ar.section_three_content_two"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.content') + $t('inEnglish')"
            class="col-lg-6"
            rules="required|min:2"
          >
            <base-input
              type="textarea"
              :name="$t('labels.content') + $t('inEnglish')"
              :placeholder="$t('labels.content') + $t('inEnglish')"
              v-model="data.en.section_three_content_two"
            />
            <span class="error--text d-inline-block">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <!-- end section three -->
        </div>

        <div class="button_wrapper center">
          <v-btn
            type="submit"
            @click="submit"
            :disabled="btnLoading"
            :loading="btnLoading"
          >
            {{ $t("submit") }}
          </v-btn>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      items: [
        {
          text: this.$t("breadcrumb.mainPage"),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t("breadcrumb.WeHelpYou.title"),
          disabled: false,
          href: "/we-help-you/show-all",
        },
        {
          text: this.$t("breadcrumb.WeHelpYou.edit"),
          disabled: true,
          href: "",
        },
      ],
      // Btn Loading
      loading: false,
      btnLoading: false,
      data: {
        section_one_image_one: {
          preview: null,
          image: null,
        },
        section_one_image_two: {
          preview: null,
          image: null,
        },
        section_two_image: {
          preview: null,
          image: null,
        },
        section_three_image: {
          preview: null,
          image: null,
        },

        ar: {
          section_one_title: null,
          section_one_content: null,
          section_two_title: null,
          section_two_content: null,
          section_three_title_one: null,
          section_three_title_two: null,
          section_three_content_one: null,
          section_three_content_two: null,
        },
        en: {
          section_one_title: null,
          section_one_content: null,
          section_two_title: null,
          section_two_content: null,
          section_three_title_one: null,
          section_three_title_two: null,
          section_three_content_one: null,
          section_three_content_two: null,
        },
      },
      noData: false,
    };
  },

  methods: {
    uploadImage(event, varName) {
      if (event) {
        this.data[varName].preview = URL.createObjectURL(event);
      }
    },

    // Main Edit Data
    handleShowData() {
      this.noData = false;
      this.loading = true;
      this.axios({
        method: "GET",
        url: `abouts`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.section_one_image_one.preview =
            result.section_one.image_one.path;
          this.data.section_one_image_two.preview =
            result.section_one.image_one.path;

          this.data.section_two_image.preview = result.section_two.image.path;
          this.data.section_three_image.preview =
            result.section_three.image.path;

          this.data.ar.section_one_title = result.section_one.ar.title;
          this.data.en.section_one_title = result.section_one.en.title;

          this.data.ar.section_two_title = result.section_two.ar.title;
          this.data.en.section_two_title = result.section_two.en.title;

          this.data.ar.section_three_title_one =
            result.section_three.first_content.ar.title;
          this.data.en.section_three_title_one =
            result.section_three.first_content.en.title;

          this.data.ar.section_three_title_two =
            result.section_three.second_content.ar.title;
          this.data.en.section_three_title_two =
            result.section_three.second_content.en.title;

          this.data.ar.section_one_content = result.section_one.ar.content;
          this.data.en.section_one_content = result.section_one.en.content;

          this.data.ar.section_two_content = result.section_two.ar.content;
          this.data.en.section_two_content = result.section_two.en.content;

          this.data.ar.section_three_content_one =
            result.section_three.first_content.ar.content;
          this.data.en.section_three_content_one =
            result.section_three.first_content.en.content;

          this.data.ar.section_three_content_two =
            result.section_three.second_content.ar.content;
          this.data.en.section_three_content_two =
            result.section_three.second_content.en.content;
        })
        .catch((err) => {
          this.$iziToast.error({
            title: this.$t("error"),
            message: err.response?.data.message ?? err.response?.data.messages,
          });
          this.noData = true;
          this.loading = false;
        });
    },

    // Submit
    submit() {
      this.$refs.weHelpYouForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.section_one_image_one.image) {
            data.append(
              "section_one_image_one",
              this.data.section_one_image_one.image
            );
          }

          if (this.data.section_one_image_two.image) {
            data.append(
              "section_one_image_two",
              this.data.section_one_image_two.image
            );
          }

          if (this.data.section_two_image.image) {
            data.append("section_two_image", this.data.section_two_image.image);
          }

          if (this.data.section_three_image.image) {
            data.append(
              "section_three_image",
              this.data.section_three_image.image
            );
          }

          data.append("ar[section_one_title]", this.data.ar.section_one_title);
          data.append("en[section_one_title]", this.data.en.section_one_title);

          data.append(
            "ar[section_one_content]",
            this.data.ar.section_one_content
          );
          data.append(
            "en[section_one_content]",
            this.data.en.section_one_content
          );

          data.append("ar[section_two_title]", this.data.ar.section_two_title);
          data.append("en[section_two_title]", this.data.en.section_two_title);

          data.append(
            "ar[section_two_content]",
            this.data.ar.section_two_content
          );
          data.append(
            "en[section_two_content]",
            this.data.en.section_two_content
          );

          data.append(
            "ar[section_three_title_one]",
            this.data.ar.section_three_title_one
          );
          data.append(
            "en[section_three_title_one]",
            this.data.en.section_three_title_one
          );

          data.append(
            "ar[section_three_content_one]",
            this.data.ar.section_three_content_one
          );
          data.append(
            "en[section_three_content_one]",
            this.data.en.section_three_content_one
          );

          data.append(
            "ar[section_three_title_two]",
            this.data.ar.section_three_title_two
          );
          data.append(
            "en[section_three_title_two]",
            this.data.en.section_three_title_two
          );

          data.append(
            "ar[section_three_content_two]",
            this.data.ar.section_three_content_two
          );
          data.append(
            "en[section_three_content_two]",
            this.data.en.section_three_content_two
          );

          let message = this.$t("editSuccess");
          this.axios({
            method: "POST",
            url: "abouts",
            data: data,
          })
            .then(() => {
              this.$iziToast.success({
                title: this.$t("success"),
                message: message,
              });
              this.handleShowData();
              this.btnLoading = false;
            })
            .catch((err) => {
              this.$iziToast.error({
                title: this.$t("error"),
                message: err.response.data.message,
              });
              this.btnLoading = false;
            });

          // =============== End:: Add ===============
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
  },

  computed: {
    ...mapGetters({
      lang: "lang_module/lang",
    }),
  },
  mounted() {
    this.handleShowData();
  },
};
</script>

<style lang="scss" scoped></style>
