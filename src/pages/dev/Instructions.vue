<template>
  <div class="w-100 px-5">
    <div class="row mt-4 justify-content-center">
      <div class="col-3 px-2">
        <div class="d-flex justify-content-between align-items-center">
              <h6>指令列表</h6>
              <icon-button class="btn-outline-success" icon="repo" text="新增" style="height: 32px;"
                v-if="isReadOnly" @click="onCreate()"/>
        </div>
        <div class="d-flex mt-2 align-items-center">
              <input class="form-control form-control-sm mr-auto" placeholder="Search"
                 v-model="searchValue" @change="onSearchInstructions"/>
        </div>
        <div class="d-flex flex-column mt-4">
          <div class="d-flex mt-1" v-for="item in instructions" :key="item.data.id">
            <octicon name="gist" scale="1.1" class="" style="color:green"/>
            <h6 class="text-primary selectable ml-2" style="font-size:14px"  @click="selectInstruction(item)">
              {{item.data.name}}
            </h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex justify-content-between align-items-center border-bottom">
          <h5 class=" mb-2 mr-auto">设置</h5>
          <icon-button class=" mb-2 btn-outline-success" icon="repo" text="修改" style="height: 32px;"
            v-if="isReadOnly" @click="onEdit()"/>
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
              <div class="col-3 ml-1">
                <form-input label="标识：" v-model="obj.name" :readonly="isReadOnly"/>
              </div>
              <div class="col-6 ml-1">
                <form-input label="说明：" v-model="obj.desc" :readonly="isReadOnly"/>
              </div>
              <div class="col ml-1">
                <form-input label="标签：" v-model="obj.tags" :readonly="isReadOnly"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col-6 ml-1">
                <form-input label="指令：" v-model="obj.req" :readonly="isReadOnly"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col-6 ml-1">
                <form-input label="回复：" v-model="obj.res" :readonly="isReadOnly"/>
              </div>
              <div class="col-3">
                <form-input type="number" label="最大长度：" v-model="obj.resMaxLength" :readonly="isReadOnly"/>
              </div>
              <div class="col">
                <form-input type="number" label="响应时长：" v-model="obj.timeout" :readonly="isReadOnly"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col-8 ml-1">
                <form-text-area rows="6" label="响应校验：" v-model="obj.checkResponse" :readonly="isReadOnly"/>
              </div>
            </div>
            <div class="d-flex" v-if="!isReadOnly">
              <icon-button
                class="ml-1 btn-outline-success"
                icon="circle-slash"
                text="取消"
                @click="cancel"
              />
              <icon-button
                class="ml-1 btn-outline-success"
                width="100px"
                icon="database"
                text="保存"
                @click="save"
              />
            </div>
          </div>
        </form>
      </div>
      <!-- <slot name="details"/> -->
    </div>
  </div>
</template>

<script>
import {createQueryString} from '../../../finelets/helpers/QueryHelper.js'
import state from '../../store'

const EDIT_MODE_DISPLAY = 'display'
const EDIT_MODE_NEW = 'new'
const EDIT_MODE_MODIFY = 'modify'

export default {
  data () {
    return {
      editmode: EDIT_MODE_DISPLAY,
      searchValue: null,
      obj: {
        name: null,
        desc: null,
        req: null,
        res: null,
        resMaxLength: null,
        timeout: null,
        checkResponse: null,
        tags: null
      },
      errors: {},
      instructions: [],
      currentDoc: null
    }
  },
  computed: {
    isReadOnly () {
      return (this.editmode === EDIT_MODE_DISPLAY)
    }
  },
  async created () {
    await this.onSearchInstructions({search: '', filters: []})
  },
  methods: {
    async onSearchInstructions () {
      const cond = {search: this.searchValue}
      this.instructions = []
      let r = createQueryString([], cond)
      let data = await state.dispatch('searchInstructions', r)
      this.instructions = data
      if (data.length > 0) await this.selectInstruction(data[0])
    },
    async selectInstruction (data) {
      const doc = await state.dispatch('getInstruction', data.links.self)
      this.currentDoc = doc
      this.obj = doc.data
    },
    onCreate () {
      this.obj = {
        name: null,
        desc: null,
        req: null,
        res: null,
        resMaxLength: null,
        timeout: null,
        checkResponse: null,
        tags: null
      }
      this.editmode = EDIT_MODE_NEW
    },
    onEdit () {
      this.editmode = EDIT_MODE_MODIFY
    },
    cancel () {
      this.editmode = EDIT_MODE_DISPLAY
    },

    async save () {
      if (this.editmode === EDIT_MODE_NEW) await this.createDoc()
      else if (this.editmode === EDIT_MODE_MODIFY) await this.updateDoc()
      this.editmode = EDIT_MODE_DISPLAY
    },

    async createDoc () {
      let toCreate = {
        ...this.obj,
        resMaxLength: parseInt(this.obj.resMaxLength),
        timeout: parseInt(this.obj.timeout)
      }
      try {
        await state.dispatch('createInstruction', toCreate)
        await this.onSearchInstructions({search: '', filters: []})
        this.editmode = EDIT_MODE_DISPLAY
      } catch (e) {}
    },

    async updateDoc () {
      let data = {
        ...this.obj,
        resMaxLength: parseInt(this.obj.resMaxLength),
        timeout: parseInt(this.obj.timeout)
      }
      try {
        await state.dispatch('updateInstruction', {data, links: this.currentDoc.links})
        await this.onSearchInstructions({search: '', filters: []})
        this.editmode = EDIT_MODE_DISPLAY
      } catch (e) {}
    }
  }
}
</script>

<style>
.selectable:hover {
  border-bottom: 2px solid #007bff;
  cursor: pointer;
}
html, body, #editor {
  margin: 0;
  height: 1000;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

textarea, #editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}

.field-label {
  font-size: 14px
}
</style>
