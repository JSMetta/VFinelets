<template>
  <div class="w-100 px-5">
    <div class="row mt-4 justify-content-center">
      <div class="col-6">
        <div class="d-flex">
        <div class="d-flex align-items-baseline mr-auto">
          <p class="" style="font-size:24px;font-weight:400;">程序</p>
        </div>
        <div class="d-flex">
          <!-- <icon-button
            class="ml-1"
            icon="database"
            text="logs" style="height:38px"
            @click="onLoadLogs"
          /> -->
          <icon-button
            class="ml-1" v-if="savable"
            icon="database"
            text="保存" style="height:38px"
            @click="save"
          />
          <icon-button
            class="ml-1" v-if="runable"
            icon="pulse"
            text="运行" style="height:38px"
            @click="onRun"
          />
        </div>
        </div>
        <form class="border-top" novalidate="true" @submit.prevent>
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
              <div class="col-6 ml-1">
                <form-input label="标识：" v-model="obj.name"/>
              </div>
              <div class="col ml-1">
                <form-input label="编号：" v-model="obj.code"/>
              </div>
              <div class="col ml-1">
                <form-input label="标签：" v-model="obj.tags"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                <form-input label="说明：" v-model="obj.desc"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                <form-text-area rows="12" label="程序：" v-model="obj.prog"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                <icon-button class="" icon="repo" text="外部导入程序" @click="addProgram()"/>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="col p-0">
        <b-list-group id="logsView" class="text-light bg-dark" style="height:570px; overflow-y:scroll;">
          <b-list-group-item class="d-flex bg-dark p-1" v-for="(item, index) in logs" :key="index">
             <div class="p-0 m-0">{{item.start | onlyTime}}</div>
             <p class="ml-4 mb-0" style="overflow-wrap: anywhere;">{{item.message}}</p>
          </b-list-group-item>
        </b-list-group>
        <input type="file" class="form-control-file" ref="program" @change="uploadProgram()"/>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      obj: {
        name: null,
        desc: null,
        code: null,
        prog: JSON.stringify({process: [], subs: []}, null, 2),
        tags: null
      },
      logs: [],
      logHref: null,
      errors: {},
      programToUpload: '',
      running: false
    }
  },
  computed: {
    savable () {
      const currentDoc = this.$store.getters.selectedProgram
      const dataChanged = currentDoc ? !_.isEqual(this.obj, currentDoc.data) : true
      return dataChanged && this.validScript && !!this.obj.name
    },

    runable () {
      const currentDoc = this.$store.getters.selectedProgram
      const dataChanged = currentDoc ? !_.isEqual(this.obj, currentDoc.data) : true
      return currentDoc && this.validScript && !!this.obj.name && !dataChanged
    },

    validScript () {
      try {
        let script = this.obj.prog
        script = ` "use strict"; return (${this.obj.prog})`
        // eslint-disable-next-line no-new-func
        const obj = Function(script)()
        return !!obj
      } catch (e) {
        return false
      }
    }
  },
  async created () {
    const currentDoc = this.$store.getters.selectedProgram
    if (currentDoc) this.obj = {...currentDoc.data}
  },

  methods: {
    async save () {
      const currentDoc = this.$store.getters.selectedProgram
      if (!currentDoc) await this.createDoc()
      else await this.updateDoc()
    },

    async createDoc () {
      const state = this.$store
      try {
        const prog = await state.dispatch('createProgram', this.obj)
        const currentDoc = await state.dispatch('getProgram', prog.href)
        this.obj = {...currentDoc.data}
        state.commit('selectedProgram', currentDoc)
      } catch (e) {
        alert('新增程序失败')
      }
    },

    async updateDoc () {
      const state = this.$store
      let currentDoc
      try {
        currentDoc = state.getters.selectedProgram
        await state.dispatch('updateProgram', {data: this.obj, links: currentDoc.links})
        currentDoc = await state.dispatch('getProgram', currentDoc.links.self)
        state.commit('selectedProgram', currentDoc)
      } catch (e) {
        alert('更新程序失败')
      } finally {
        this.obj = {...currentDoc.data}
      }
    },

    async onRun () {
      const state = this.$store
      try {
        let currentDoc = state.getters.selectedProgram
        const res = await state.dispatch('runSerialPortProgram', currentDoc.links.processes)
        this.logHref = res.href
        this.logs = res.Process.logs
        let t = setInterval(async () => {
          const res = await state.dispatch('loadProgramLogs', this.logHref)
          this.logs = res.Process.logs
          this.logs = _.orderBy(res.Process.logs, ['start'], ['asc'])
          if (res.Process.state === 'over') clearInterval(t)
          const view = document.getElementById('logsView')
          view.scrollTop = view.scrollHeight
        }, 1000)
      } catch (e) {}
    },

    async uploadProgram () {
      this.programToUpload = this.$refs.program.files[0]
      this.obj.prog = await this.programToUpload.text()
    },

    upload () {
      let formData = new FormData()
      formData.append('rockstar.js', this.file)
    },

    addProgram () {
      this.$refs.program.click()
    }
  }
}
</script>

<style>
  input[type="file"]{
    position: absolute;
    top: -500px;
  }
</style>
