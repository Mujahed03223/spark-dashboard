<template>
  <div class="uplodeImage">
    <div class="chooseImage">
      <transition name="fadeInUp" mode="out-in">
        <img v-if="image.img_src" :src="image.img_src" />
        <img v-else-if="data_src" :src="data_src" />
        <div v-else class="placholder">
          <span>{{ title }}</span>
          <img src="@/assets/media/images/placeholder.png" alt="" />
          <i class="fas fa-camera-alt"></i>
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
      default: null,
      required: false,
    },
    title: {
      default: "الصورة الاساسيه",
      required: false,
    },
  },

  data() {
    return {
      image: {
        img_file: null,
        img_src: "",
      },
    };
  },

  methods: {
    chooseImage(e) {
      this.image.img_file = e.target.files[0];

      if (this.image.img_file) {
        this.image.img_src = URL.createObjectURL(this.image.img_file);
        this.uplodeDisabled = false;
      }

      this.$emit("inputChanged", this.image);
      e.target.value = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.uplodeImage {
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
      background: #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      span {
        color: #333;
        display: block;
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
        color: #eee;
        font-size: 15px;
        transition: all 0.2s linear;
        transform: scale(0);
      }
    }
  }
}
</style>
