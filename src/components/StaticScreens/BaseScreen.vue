<template>
  <div class="card" style="width: 18rem;">
    <img class="card-img-top" src="" />
    <div class="card-body">
      <div class="custom_edit" :class="{ active: editTitleActive }">
        <input
          ref="title"
          v-if="editTitleActive"
          maxlength="15"
          type="text"
          v-model="data.titleValue"
          @blur="doneEditingTitle"
          @keyup.enter="doneEditingTitle"
          @keyup.escape="cancelEditingTitle"
        />
        <h5 @dblclick="editTitle" class="card-title text-center showVal">
          {{ data.titleValue }}
        </h5>
      </div>

      <div class="custom_edit" :class="{ active: editDescActive }">
        <input
          ref="desc"
          v-if="editDescActive"
          maxlength="40"
          type="text"
          v-model="data.descValue"
          @blur="doneEditingDesc"
          @keyup.enter="doneEditingDesc"
          @keyup.escape="cancelEditingDesc"
        />
        <p @dblclick="editDesc" class="card-text text-center showVal">
          {{ data.descValue }}
        </p>
      </div>

      <button
        @click="confirmEdit"
        type="button"
        class="btn btn-primary text-white"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    values: {
      required: true,
      type: Object,
    },
    url: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      // Title
      editTitleActive: false,
      tempTitleVal: null,

      // Desc
      editDescActive: false,
      tempDescVal: null,

      data: {
        descValue: "",
        titleValue: "",
      },
    };
  },

  methods: {
    editTitle() {
      this.tempTitleVal = this.data.titleValue;
      setTimeout(() => {
        this.$refs.title.focus();
      }, 100);
      this.editTitleActive = true;
    },
    doneEditingTitle() {
      this.editTitleActive = false;
    },
    cancelEditingTitle() {
      this.editTitleActive = false;
      this.data.titleValue = this.tempTitleVal;
    },

    editDesc() {
      this.tempDescVal = this.data.descValue;
      setTimeout(() => {
        this.$refs.desc.focus();
      }, 100);
      this.editDescActive = true;
    },
    doneEditingDesc() {
      this.editDescActive = false;
    },
    cancelEditingDesc() {
      this.editDescActive = false;
      this.data.descValue = this.tempDescVal;
    },

    // Edit API
    confirmEdit() {
      console.log(this.data);
    },
  },

  created() {
    this.control = this.$permission.setControls(this.$route.path);
    this.data = this.values;
  },
};
</script>

<style lang="scss" scoped>
.custom_edit {
  position: relative;
  height: 40px;
  margin: 10px 0;

  &.active {
    input {
      z-index: 3;
    }

    .showVal {
      display: none;
    }
  }

  input {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    top: -10px;
    z-index: 1;
    background: #fff;
    font-size: 18px;
    color: inherit;
    border-radius: 10px;
    border: 1px solid #333;
    text-align: center;
  }

  .showVal {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    z-index: 2;
  }
}

.card-img-top {
  width: 100%;
  height: 260px;
  background: #333;
}

.card-body {
  .card-text {
    font-size: 15px;
    color: gray;
  }

  .btn {
    margin-inline: 0 auto;
    display: block;
  }
}
</style>
