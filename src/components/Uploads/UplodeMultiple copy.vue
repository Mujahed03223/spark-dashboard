<template>
  <div class="uplodeImages">
    <div class="chooseImages">
      <div class="placholder">
        <span>product images</span>
        <div class="icons">
          <i class="fas fa-camera-alt"></i>
          <i class="fas fa-camera-alt"></i>
          <i class="fas fa-camera-alt"></i>
        </div>
      </div>
      <input
        ref="uplode_file"
        class="file_input"
        type="file"
        multiple
        accept="image/*"
        name="imageToUplode"
        @change="chooseImages"
      />
      <div class="overlay">
        <div class="icons">
          <i class="fas fa-camera-alt"></i>
          <i class="fas fa-camera-alt"></i>
          <i class="fas fa-camera-alt"></i>
        </div>
      </div>
    </div>

    <div class="showImages">
      <transition name="fadeInUp" mode="out-in">
        <div class="images" v-if="images.length > 0">
          <div class="image" v-for="img in images" :key="img.id">
            <span class="close" @click="deleteImage(img)"
              ><i class="fas fa-times-circle"></i
            ></span>
            <img :src="img.link" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["inputChanged"],

  props: {
    data_src: {
      default: () => [],
      required: false,
      type: Array,
    },
  },

  data() {
    return {
      imagesToUplode: [],
    };
  },

  computed: {
    images() {
      return [...this.imagesToUplode, ...this.data_src];
    },
  },

  methods: {
    chooseImages(e) {
      let images = Array.from(e.target.files);

      images.forEach((img) => {
        if (img) {
          let src = URL.createObjectURL(img);
          this.imagesToUplode.push({
            img_file: img,
            link: src,
            name: img.name,
            uniqeID: Math.random().toString(16).slice(2),
          });

          this.helper_containsObject(img, this.imagesToUplode, "name");
        }

        e.target.value = null;
      });

      this.$emit("inputChanged", this.images);
    },

    deleteImage(img) {
      if (img.id) {
        this.$emit("imageDeleted", img.id);
      } else {
        this.imagesToUplode = this.imagesToUplode.filter((image) => {
          return img.link != image.link;
        });
        this.$emit("inputChanged", this.images);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.uplodeImages {
  margin-bottom: 15px;
  .chooseImages {
    position: relative;
    text-align: center;
    cursor: pointer;
    margin: 10px auto;
    width: 300px;

    &:hover {
      .overlay {
        opacity: 1;

        .icons {
          i {
            transform: scale(5);
          }
        }
      }
    }

    img {
      position: relative;
      top: 0;
      left: 0;
      z-index: 0;
      max-width: 100%;
      height: 150px;
      padding: 6px 0;
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

      .icons {
        display: flex;

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

  .showImages {
    .images {
      display: flex;
      align-items: center;
      max-width: inherit;
      overflow-x: scroll;

      .image {
        position: relative;

        .close {
          background: #fff;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          position: absolute;
          top: 12px;
          right: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          i {
            color: crimson;
          }
        }

        img {
          margin: 10px;
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 25px 0 25px 0;
        }
      }
    }
  }
}
</style>
