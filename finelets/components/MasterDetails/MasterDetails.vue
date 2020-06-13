<template>
  <div class="mx-auto w-75">
    <div class="row mt-4 justify-content-center">
      <div class="col-3 d-flex flex-column">
        <img :src="master.avatar" height="240px"/>
        <h1 class="vcard-names mt-3">
          <span class="vcard-fullname d-block">{{master.title}}</span>
          <span v-if="master.subtitle" class="vcard-subname d-block">{{master.subtitle}}</span>
        </h1>
        <div v-if="master.email" class="d-inline text-truncate font-weight-light">
          <octicon name="mail" />
          <small>{{master.email}}</small>
        </div>
        <div v-if="master.editable || master.visible" class="position-relative" :class="collapse" id="masterform">
            <div>
              <div v-for="(item, index) in master.items" :key="index">
                <input-text v-if="!item.type || item.type=='text' || item.type == 'number'" :type = "item.type || 'text'" class="mt-2" :icon="item.icon"
                            v-model="masterAttrs[item.name]" :readonly="isMasterItemReadonly(item)"/>
                <radio v-else-if="item.type=='radio'" class="mt-2" :icon="item.icon" :options="item.options"
                            v-model="masterAttrs[item.name]" :readonly="isMasterItemReadonly(item)"/>
                <dropdown v-else-if="item.type=='dropdown'" class="mt-2" :options="item.options" :label="item.label" :value="masterAttrs[item.name]"
                          @changed="(...args) => onDropdownValueChanged(item.name, ...args)"
                          :readonly="isMasterItemReadonly(item)"/>
                <div v-else-if="item.type=='checkbox'" class="form-check mt-2">
                    <input type="checkbox" class="form-check-input" v-model="masterAttrs[item.name]" :disabled="isMasterItemReadonly(item)">
                    <p class="mt-1" style="font-size:14px">{{item.label}}</p>
                </div>
              </div>
            </div>
            <div v-if="!isMasterReadonly" class="d-flex my-3">
              <button type="button" class="btn btn-success btn-sm border-1 ml-2" @click="onSave(true)">保存</button>
              <button type="button" class="btn btn-light btn-cancel btn-sm border-1 ml-2" @click="onSave()">取消</button>
          </div>
        </div>
        <button v-if="master.editable || master.visible" type="button" class="btn border-secondary bg-light mt-3 p-0"
          data-toggle="collapse" data-target="#masterform" @click="onEdit">
          详情
        </button>
      </div>
      <slot name="details"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Radio from './Radio.vue'
import InputText from './Input.vue'
import constDef from '../../../finelets/ConstantsDef.js'

export default {
  components: {
    Radio,
    InputText
  },
  props: {
    master: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      masterAttrs: {},
      showmaster: false
    }
  },
  computed: {
    collapse () {
      let collapse = this.showmaster ? 'collapse.show' : 'collapse'
      return collapse
    },
    isMasterReadonly () {
      if (this.master.editable) return false
      if (!this.master.items || this.master.items.length < 1) return true
      return !_.some(this.master.items, item => {
        return item.editable
      })
    }
  },
  methods: {
    isMasterItemReadonly (item) {
      return !this.master.editable || !item.editable
    },
    onEdit () {
      this.showmaster = true
      this.masterAttrs = {...this.master.data}
    },
    onDropdownValueChanged: function (name, val) {
      this.masterAttrs[name] = val
    },
    onSave: function (save) {
      this.showmaster = false
      if (save) this.master.update(this.masterAttrs)
    }
  }
}
</script>

<style>
.vcard-names {line-height: 1;}
.vcard-fullname {font-size: 26px; line-height: 30px;}
.vcard-subname {color: #666; font-size: 20px; font-style: normal; font-weight: 300; line-height: 24px;}
</style>
