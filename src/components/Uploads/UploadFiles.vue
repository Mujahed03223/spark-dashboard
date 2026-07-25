<template>
  <div class="uploadFiles">
    <div class="chooseFiles">
      <div class="placeholder">
        <span>Choose Images</span>
        <div class="icons">
          <i class="far fa-image"></i>
          <i class="far fa-image"></i>
          <i class="far fa-image"></i>
        </div>
      </div>
      <input
        ref="upload_file"
        class="file_input"
        type="file"
        multiple
        accept="image/*"
        name="fileToUpload"
        @change="chooseFiles"
      />
      <div class="overlay">
        <div class="icons">
          <i class="far fa-image"></i>
          <i class="far fa-image"></i>
          <i class="far fa-image"></i>
        </div>
      </div>
    </div>
    <div class="showFiles">
      <transition name="fadeInUp" mode="out-in">
        <div class="files" v-if="files.length > 0">
          <div
            class="file"
            v-for="(file, index) in this.allFiles"
            :key="file.uniqueID"
          >
            <div v-if="file.link">
              <span class="close" @click="deleteFileIndex(index)"
                ><i class="fas fa-times-circle"></i
              ></span>
              <img :src="file.link" width="300" height="150" />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="showFiles">
      <transition name="fadeInUp" mode="out-in">
        <div class="files" v-if="editedFiles">
          <div class="file" v-for="file in this.editedFiles" :key="file.id">
            <div v-if="file.media">
              <span class="close" @click="deleteFile(file.id)"
                ><i class="fas fa-times-circle"></i
              ></span>
              <img :src="file.media" width="300" height="150" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  // emits: ["inputChanged"],

  props: {
    data_src: {
      default: () => [],
      required: false,
      type: Array,
    },
    editedFiles: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {
      filesToUpload: [],
      allFiles: [],
    };
  },

  computed: {
    files() {
      return [...this.filesToUpload, ...this.data_src];
    },
  },

  methods: {
    chooseFiles(e) {
      this.filesToUpload = Array.from(e.target.files);
      this.filesToUpload.forEach((file) => {
        if (file) {
          let src = URL.createObjectURL(file);

          this.allFiles.push({
            file_data: file,
            link: src,
            name: file.name,
            uniqueID: Math.random().toString(16).slice(2),
          });
        }
      });
      this.$emit("change", this.allFiles);

      return this.filesToUpload;
    },

    deleteFile(id) {
      if (id) {
        this.$emit("deleteFile", id);
      }
    },
    deleteFileIndex(index) {
      this.allFiles.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.uploadFiles {
  margin-bottom: 15px;

  .chooseFiles {
    position: relative;
    text-align: center;
    cursor: pointer;
    margin: 60px;
    width: 300px;
    @include flexCenterAlignment;
    margin: 10px auto;

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

    iframe {
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

    .placeholder {
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

  .showFiles {
    .files {
      display: flex;
      align-items: center;
      max-width: inherit;
      overflow-x: scroll;

      .file {
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
          width: 300px;
          height: 150px;
          // border-radius: 25px 0 25px 0;
        }
      }
    }
  }
}
</style>
