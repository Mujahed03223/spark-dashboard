<template>
  <div class="uplodeImageDirect">
    <div class="chooseImage" :class="{ loading: loading }">
      <transition name="fadeInUp" mode="out-in">
        <img v-if="image.img_src && !loading" :src="image.img_src" />
        <div v-else-if="loading" class="loading">
          <i class="fa-solid fa-spinner"></i>
        </div>
        <img v-else-if="data_src" :src="data_src" />
        <div v-else class="placholder">
          <!-- <span>{{ title }}</span> -->
          <!-- <img
            src="@/assets/media/images/placeholder.webp"
            class="img-fluid"
            alt=""
          /> -->
          <!-- <i class="fas fa-camera-alt"></i> -->
        </div>
      </transition>

      <input
        ref="uplode_file"
        class="file_input"
        type="file"
        accept="image/*"
        name="imageToUplode"
        @change="chooseImage"
      />

      <div class="overlay">
        <i class="fas fa-camera-alt"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["inputChanged"],

  props: {
    data_src: {
      type: String,
      default: null,
      required: false,
    },
    postUrl: {
      type: String,
      default: "/",
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    title: {
      default: "الصوره الاساسيه",
      required: false,
    },
  },

  data() {
    return {
      // Loading
      loading: false,

      image: {
        img_file: null,
        img_src: "",
      },

      showModel: false,
    };
  },

  methods: {
    chooseImage(e) {
      this.image.img_file = e.target.files[0];

      if (this.image.img_file) {
        const imgSrc = URL.createObjectURL(this.image.img_file);
        this.sentImage(imgSrc);
      }

      e.target.value = null;
    },

    sentImage(src) {
      this.loading = true;

      const data = new FormData();
      data.append("file", this.image.img_file);
      data.append("attachment_type", "image");
      data.append("model", this.model);

      this.axios({
        method: "POST",
        url: this.postUrl,
        data: data,
      })
        .then((res) => {
          this.image.img_src = src;
          this.$emit("inputChanged", res.data.data);
          this.loading = false;
        })
        .catch((err) => {
          this.$iziToast.error({
            displayMode: 2,
            title: this.$t("validation.error"),
            message: err.response.data.message,
          });
          this.$emit("inputChanged", "LinkTEST");
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes rotation {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.uplodeImageDirect {
  .chooseImage {
    position: relative;
    text-align: center;
    cursor: pointer;
    margin: 10px auto;
    width: 100%;
    max-width: 300px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      .overlay {
        opacity: 1;

        i {
          transform: scale(5);
        }
      }
    }

    &.loading {
      pointer-events: none;
      &:hover {
        .overlay {
          display: none;
        }
      }
    }

    img {
      position: relative;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 150px;
      display: inline-block;
      font-size: 15px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 20px;
    }

    .placholder {
      position: relative;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 150px;
      padding: 6px 0;
      display: inline-block;
      font-size: 15px;
      text-transform: uppercase;
      border-radius: 20px;

      background: url("@/assets/media/images/placeholder.png");
      background-size: cover;
      background-position: center center;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      span {
        // color: #333;

        color: var(--main);
        display: block;
      }

      i {
        display: block;

        color: var(--main);
        margin-inline: 5px;
      }

      .icons {
        display: flex;
        justify-content: space-between;

        i {
          display: block;
          margin-inline: 5px;
        }
      }
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

    .overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s linear;
      opacity: 0;

      i {
        display: block;
        margin-inline: 35px;
        // color: #eee;
        color: var(--white);
        font-size: 15px;
        transition: all 0.2s linear;
        transform: scale(0);
      }
    }

    .loading {
      font-size: 60px;
      width: 100%;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--main);
      border-radius: 20px;
      color: #fff;

      i {
        animation: rotation 1.5s linear infinite;
      }
    }
  }
}
</style>
