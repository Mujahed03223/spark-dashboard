<template>
  <div class="uplodeImageDirect">
    <label>{{ title }}</label>

    <div class="chooseImage" :class="{ loading: loading }">
      <div class="input_wrapper">
        <input
          ref="uplode_file"
          class="file_input"
          type="file"
          accept="image/*"
          name="imageToUplode"
          @change="chooseImage"
        />
        <input type="text" class="myShow" v-model="image.img_src" disabled />
        <span v-if="loading" class="spinner">
          <i class="fa-solid fa-spinner"></i>
        </span>
        <span v-if="file_exsisit && !loading" class="check">
          <i class="fa-solid fa-check"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["inputChanged"],

  props: {
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
    data_src: {
      default: "",
    },
  },

  data() {
    return {
      // Loading
      loading: false,

      file_exsisit: null,

      image: {
        img_file: null,
        img_src: this.data_src,
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
          this.fileName = this.image.img_file.name;
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

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    if (this.data_src) {
      this.file_exsisit = true;
    }
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
    width: 100%;
    height: 50px;
    border-radius: 20px;

    .input_wrapper {
      height: 100%;

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

      input.myShow {
        position: relative;
        width: 100%;
        height: 100%;
        border: 1px solid #333;
        border: 1px solid var(--main);
        border-radius: 10px;
        transition: all 0.4s ease-in-out;
        padding: 0 12px;
        padding-inline-end: 40px;
        color: var(--mainText);
        font-size: 18px;

        &::placeholder {
          color: var(--main);
          font-size: 16px;
          cursor: pointer;
        }
      }

      span.spinner,
      .check {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        font-size: 20px;
        z-index: 5;

        &.spinner {
          i {
            animation: rotation 1.5s linear infinite;
          }
        }
        &.check {
          i {
            font-size: 25px;
            color: green;
          }
        }
      }
    }
  }
}
</style>
