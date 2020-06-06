<template>
  <div class="mx-auto w-75">
    <div class="row mt-4 justify-content-center">
      <div class="col-8 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-center border-bottom">
          <h5 class=" mb-2 mr-auto">个人基础资料</h5>
        </div>
        <form class="" novalidate="true" @submit.prevent>
          <div class="mt-3">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li
                  v-for="(error, index) in errors"
                  :key="index"
                >{{ error }}</li>
              </ul>
            </p>
            <div class="form-row">
              <div class="col-10">
                <form-input label="用户编码：" v-model="user.userId"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col-10">
                <form-input label="姓名：" v-model="user.name"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col-10">
                <form-input label="电子邮箱：" v-model="user.email"/>
              </div>
            </div>
            <div class="d-flex" v-if="!isReadOnly">
              <icon-button
                class="ml-1"
                icon="circle-slash"
                text="取消"
                @click="cancel"
              />
              <icon-button
                class="ml-1"
                width="100px"
                icon="database"
                text="保存"
                @click="save"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="col mt-4">
        <summary class="position-absolute m-0" data-toggle="dropdown">
          <!-- <img class="rounded-3" src="../static/img/clx.jpg" height="260px"/> -->
          <img class="rounded-3" :src="avatar" height="260px"/>
          <div class="position-absolute bg-gray-dark rounded-2 text-white px-2 py-2 ml-2 mb-2 bottom-0">
              <octicon class="mr-2" name="pencil"/>Edit
          </div>
          <div class="dropdown-menu" style="font-size:14px">
            <a class="dropdown-item" href="#">
              <span @click="onSelectPic">上载照片</span>
            </a>
            <a class="dropdown-item" href="#">
              <span @click="removePic">删除照片</span>
            </a>
          </div>
        </summary>
        <input type="file" class="form-control-file" ref="userPic" @change="uploadPic"/>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const user = {...this.$store.getters.user}
    return {
      user,
      avatar: this.$store.getters.avatar,
      userPicToUpload: '',
      errors: {}
    }
  },
  computed: {
    isReadOnly () {
      return true
    }
  },
  created() {
    this.$store.watch(
      state => {
        return this.$store.state.avatar
      },
      (newValue, oldValue) => {
        this.avatar = this.$store.getters.avatar
      },
      //Optional Deep if you need it
      {
        deep: true
      }
    )
  },
  methods: {
    onSelectPic () {
      this.$refs.userPic.click()
    },
    async uploadPic () {
      this.userPicToUpload = this.$refs.userPic.files[0]
      const formData = new FormData()
      formData.append('file', this.userPicToUpload)
      const result = await this.$store.dispatch('uploadUserPic', formData)
    },
    async removePic () {
      const result = await this.$store.dispatch('removeUserPic')
    },
    cancel () {
    },

    async save () {
    },
  }
}
</script>

<style>
.rounded-2 {
    border-radius: 6px!important;
}

.rounded-3 {
    border-radius: 12px!important;
}

.position-absolute {
    position: absolute!important;
}

.text-white {
    color: #fff!important;
}

.bg-gray-dark {
    background-color: #24292e!important;
}




.left-0 {
    left: 2!important;
}
.bottom-0 {
    bottom: 0!important;
}

input[type="file"]{
    position: absolute;
    top: -500px;
  }
</style>