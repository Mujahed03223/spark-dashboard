<template>
  <div class="uplodevideo">
    <base-card>
      <div class="chooseVideo">
        <span class="label" :style="{ color: color, background: background }"
          >choose video</span
        >
        <input
          ref="uplode_file"
          class="file_input"
          type="file"
          accept="video/*"
          name="videoToUplode"
          @change="chooseVideo"
        />
      </div>

      <transition name="fadeInUp" mode="out-in">
        <div v-if="video.video_src" class="video">
          <video :src="video.video_src" controls></video>
        </div>
      </transition>

      <span v-if="noUplodeButt" @click="uplodeVideo"
        ><base-button :disabled="uplodeDisabled" class="uplodeButton"
          >Uplode video</base-button
        ></span
      >
    </base-card>
  </div>
</template>

<script>
export default {
  emits: ["uplodeVideo", "inputChanged"],

  props: {
    url: { type: String, required: false },
    color: { type: String, required: false, default: "#fff" },
    background: {
      type: String,
      required: false,
      default: "linear-gradient(to right, #007cd6, #031e477d)",
    },
    noUplodeButt: { type: Boolean, required: false, default: true },
  },

  data() {
    return {
      uplodeDisabled: true,

      video: {
        video_file: null,
        video_src: "",
      },
    };
  },

  methods: {
    chooseVideo(e) {
      this.video.video_file = e.target.files[0];

      if (this.video.video_file) {
        this.video.video_src = URL.createObjectURL(this.video.video_file);
        this.uplodeDisabled = false;
      }

      this.$emit("inputChanged", this.video);
      e.target.value = null;
    },

    uplodeVideo() {
      if (this.video.video_file == null) {
        this.$iziToast.error({
          displayMode: 2,
          title: "Error",
          message:
            this.$store.getters["lang_module/lang"] == "en"
              ? "choose video first"
              : "اختر فيديو اولا",
        });
      } else {
        if (this.url) {
          // Submit Request here with your url
          this.$iziToast.success({
            displayMode: 2,
            title: "success",
            message:
              this.$store.getters["lang_module/lang"] == "en"
                ? "video added successfuly"
                : "تمت اضافة الفيديو بنجاح",
          });
        } else {
          // Or emit and submit outside
          this.$emit("uplodeVideo", this.video);
        }

        // Reseat
        this.video.video_file = null;
        this.video.video_src = "";
        this.uplodeDisabled = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.uplodevideo {
  .chooseVideo {
    position: relative;
    width: 15rem;
    text-align: center;
    cursor: pointer;
    margin-inline-end: auto;

    span.label {
      position: relative;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      padding: 0.6rem 0;
      display: inline-block;
      font-size: 1.5rem;
      text-transform: uppercase;
      cursor: pointer;
    }

    .file_input {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: inline-block;
      opacity: 0;
      cursor: pointer;
    }
  }

  .video {
    width: 50%;
    margin: 2rem auto;

    @media (max-width: 900px) {
      width: 70%;
    }

    @media (max-width: 500px) {
      width: 100%;
    }

    video {
      display: block;
      width: 100%;
      min-height: 30rem;
      max-height: 30rem;
    }
  }

  .uplodeButton {
    margin-inline-start: auto;
    display: block;
  }
}
</style>
