<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <Breadcrumb :items="items" />
    <noData v-if="noData" />
    <div class="form countryForm custom_card fadeIn" v-else>
      <ValidationObserver ref="servicesForm" @submit.prevent="submit">
        <div class="row">
          <!-- start section one -->
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('labels.image')"
            class="d-block my-auto"
            style="width: 100%"
            :rules="`${data.section_one_image.preview ? '' : 'required'}`"
          >
            <!-- @change="sentImage($event)" -->
            <v-file-input
              @change="uploadImage($event, 'section_one_image')"
              v-model="data.section_one_image.image"
              class="d-none"
              :name="$t('labels.image')"
              accept="image/*,|size:2048"
              label=""
              id="section_one_image"
            ></v-file-input>
            <label
              for="section_one_image"
              class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
            >
              <v-img
                v-if="data.section_one_image.preview"
                class="d-flex"
                cover
                :src="data.section_one_image.preview"
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
          <!-- end section one -->

          <div class="col-12"></div>
          <!-- Start :: Checks -->
          <div class="col-lg-12 mb-5">
            <div class="divider">
              <h4>
                <h4>{{ $t("labels.features") }}</h4>
              </h4>
              <hr
                role="separator"
                aria-orientation="horizontal"
                class="v-divider theme--dark"
              />
            </div>
          </div>

          <!-- start feature icon one -->
          <div class="col-lg-3">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_one')"
              class="col-lg-6"
              :rules="`${data.icon_one.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'icon_one')"
                v-model="data.icon_one.image"
                class="d-none"
                :name="$t('labels.icon_one')"
                accept="image/*,|size:2048"
                label=""
                id="banner-create-icon-one"
              ></v-file-input>
              <label
                for="banner-create-icon-one"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.icon_one.preview"
                  class="d-flex"
                  cover
                  :src="data.icon_one.preview"
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
              :name="$t('labels.icon_text_one') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_one') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.icon_text_one') + $t('inArabic')"
                v-model="data.ar.icon_text_one"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_text_one') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_one') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.icon_text_one') + $t('inEnglish')"
                v-model="data.en.icon_text_one"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
          </div>
          <!-- end feature icon one -->

          <!-- start feature icon two -->
          <div class="col-lg-3">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_two')"
              class="col-lg-6"
              :rules="`${data.icon_two.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'icon_two')"
                v-model="data.icon_two.image"
                class="d-none"
                :name="$t('labels.icon_two')"
                accept="image/*,|size:2048"
                label=""
                id="banner-create-icon-two"
              ></v-file-input>
              <label
                for="banner-create-icon-two"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.icon_two.preview"
                  class="d-flex"
                  cover
                  :src="data.icon_two.preview"
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
              :name="$t('labels.icon_text_two') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_two') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.icon_text_two') + $t('inArabic')"
                v-model="data.ar.icon_text_two"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_text_two') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_two') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.icon_text_two') + $t('inEnglish')"
                v-model="data.en.icon_text_two"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
          </div>
          <!-- end feature icon two -->

          <!-- start feature icon three -->
          <div class="col-lg-3">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_three')"
              class="col-lg-6"
              :rules="`${data.icon_three.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'icon_three')"
                v-model="data.icon_three.image"
                class="d-none"
                :name="$t('labels.icon_three')"
                accept="image/*,|size:2048"
                label=""
                id="banner-create-icon-three"
              ></v-file-input>
              <label
                for="banner-create-icon-three"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.icon_three.preview"
                  class="d-flex"
                  cover
                  :src="data.icon_three.preview"
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
              :name="$t('labels.icon_text_three') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_three') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.icon_text_three') + $t('inArabic')"
                v-model="data.ar.icon_text_three"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_text_three') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_three') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.icon_text_three') + $t('inEnglish')"
                v-model="data.en.icon_text_three"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
          </div>
          <!-- end feature icon three -->

          <!-- start feature icon four -->
          <div class="col-lg-3">
            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.image')"
              class="col-lg-6"
              :rules="`${data.icon_four.preview ? '' : 'required'}`"
            >
              <!-- @change="sentImage($event)" -->
              <v-file-input
                @change="uploadImage($event, 'icon_four')"
                v-model="data.icon_four.image"
                class="d-none"
                :name="$t('labels.icon_four')"
                accept="image/*,|size:2048"
                label=""
                id="banner-create-icon-four"
              ></v-file-input>
              <label
                for="banner-create-icon-four"
                class="upload-image-label d-block d-flex justify-content-center align-items-center mx-auto text-center border rounded-xl overflow-hidden"
              >
                <v-img
                  v-if="data.icon_four.preview"
                  class="d-flex"
                  cover
                  :src="data.icon_four.preview"
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
              :name="$t('labels.icon_text_four') + $t('inArabic')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_four') + $t('inArabic')"
                type="text"
                :placeholder="$t('labels.icon_text_four') + $t('inArabic')"
                v-model="data.ar.icon_text_four"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              :name="$t('labels.icon_text_four') + $t('inEnglish')"
              class="col-lg-6"
              rules="required|min:2|max:250"
            >
              <base-input
                :name="$t('labels.icon_text_four') + $t('inEnglish')"
                type="text"
                :placeholder="$t('labels.icon_text_four') + $t('inEnglish')"
                v-model="data.en.icon_text_four"
              />
              <span v-if="errors[0]" class="error--text d-inline-block">
                {{ errors[0] }}
              </span>
            </ValidationProvider>
          </div>
          <!-- end feature icon four -->

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
              v-model="data.ar.section_two_title_one"
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
              v-model="data.en.section_two_title_one"
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
              v-model="data.ar.section_two_content_one"
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
              v-model="data.en.section_two_content_one"
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
              v-model="data.ar.section_two_title_two"
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
              v-model="data.en.section_two_title_two"
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
              v-model="data.ar.section_two_content_two"
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
              v-model="data.en.section_two_content_two"
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
        section_one_image: {
          preview: null,
          image: null,
        },

        icon_one: {
          preview: null,
          image: null,
        },
        icon_two: {
          preview: null,
          image: null,
        },
        icon_three: {
          preview: null,
          image: null,
        },
        icon_four: {
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
          icon_text_one: null,
          icon_text_two: null,
          icon_text_three: null,
          icon_text_four: null,

          section_two_title_one: null,
          section_two_title_two: null,
          section_two_content_one: null,
          section_two_content_two: null,

          section_three_title_one: null,
          section_three_title_two: null,
          section_three_content_one: null,
          section_three_content_two: null,
        },
        en: {
          icon_text_one: null,
          icon_text_two: null,
          icon_text_three: null,
          icon_text_four: null,

          section_two_title_one: null,
          section_two_title_two: null,
          section_two_content_one: null,
          section_two_content_two: null,

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
        url: `services`,
      })
        .then((res) => {
          this.loading = false;
          const result = res.data.data;

          this.data.section_one_image.preview = result.section_first.image.path;

          this.data.icon_one.preview = result.section_icons.icon_1.icon.path;
          this.data.icon_two.preview = result.section_icons.icon_2.icon.path;
          this.data.icon_three.preview = result.section_icons.icon_3.icon.path;
          this.data.icon_four.preview = result.section_icons.icon_4.icon.path;

          this.data.section_two_image.preview = result.section_two.image.path;

          this.data.section_three_image.preview =
            result.section_three.image.path;

          this.data.ar.icon_text_one = result.section_icons.icon_1.ar.text;
          this.data.en.icon_text_one = result.section_icons.icon_1.en.text;

          this.data.ar.icon_text_two = result.section_icons.icon_2.ar.text;
          this.data.en.icon_text_two = result.section_icons.icon_2.en.text;

          this.data.ar.icon_text_three = result.section_icons.icon_3.ar.text;
          this.data.en.icon_text_three = result.section_icons.icon_3.en.text;

          this.data.ar.icon_text_four = result.section_icons.icon_4.ar.text;
          this.data.en.icon_text_four = result.section_icons.icon_4.en.text;

          this.data.ar.section_two_title_one =
            result.section_two.first_content.ar.title;
          this.data.en.section_two_title_one =
            result.section_two.first_content.en.title;

          this.data.ar.section_two_title_two =
            result.section_two.second_content.ar.title;
          this.data.en.section_two_title_two =
            result.section_two.second_content.en.title;

          this.data.ar.section_two_content_one =
            result.section_two.first_content.ar.content;
          this.data.en.section_two_content_one =
            result.section_two.first_content.en.content;

          this.data.ar.section_two_content_two =
            result.section_two.second_content.ar.content;
          this.data.en.section_two_content_two =
            result.section_two.second_content.en.content;

          this.data.ar.section_three_title_one =
            result.section_three.first_content.ar.title;
          this.data.en.section_three_title_one =
            result.section_three.first_content.en.title;

          this.data.ar.section_three_title_two =
            result.section_three.second_content.ar.title;
          this.data.en.section_three_title_two =
            result.section_three.second_content.en.title;

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
      this.$refs.servicesForm.validate().then((d) => {
        if (d) {
          this.btnLoading = true;

          // Create FormData
          const data = new FormData();

          if (this.data.section_one_image.image) {
            data.append("section_one_image", this.data.section_one_image.image);
          }

          if (this.data.icon_one.image) {
            data.append("icon_one", this.data.icon_one.image);
          }

          if (this.data.icon_two.image) {
            data.append("icon_two", this.data.icon_two.image);
          }

          if (this.data.icon_three.image) {
            data.append("icon_three", this.data.icon_three.image);
          }

          if (this.data.icon_four.image) {
            data.append("icon_four", this.data.icon_four.image);
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

          data.append("ar[icon_text_one]", this.data.ar.icon_text_one);
          data.append("en[icon_text_one]", this.data.en.icon_text_one);

          data.append("ar[icon_text_two]", this.data.ar.icon_text_two);
          data.append("en[icon_text_two]", this.data.en.icon_text_two);

          data.append("ar[icon_text_three]", this.data.ar.icon_text_three);
          data.append("en[icon_text_three]", this.data.en.icon_text_three);

          data.append("ar[icon_text_four]", this.data.ar.icon_text_four);
          data.append("en[icon_text_four]", this.data.en.icon_text_four);

          data.append(
            "ar[section_two_title_one]",
            this.data.ar.section_two_title_one
          );
          data.append(
            "en[section_two_title_one]",
            this.data.en.section_two_title_one
          );

          data.append(
            "ar[section_two_content_one]",
            this.data.ar.section_two_content_one
          );
          data.append(
            "en[section_two_content_one]",
            this.data.en.section_two_content_one
          );

          data.append(
            "ar[section_two_title_two]",
            this.data.ar.section_two_title_two
          );
          data.append(
            "en[section_two_title_two]",
            this.data.en.section_two_title_two
          );

          data.append(
            "ar[section_two_content_two]",
            this.data.ar.section_two_content_two
          );
          data.append(
            "en[section_two_content_two]",
            this.data.en.section_two_content_two
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
            url: "services",
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
