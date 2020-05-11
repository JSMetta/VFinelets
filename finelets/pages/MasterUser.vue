<template>
  <master-details :master="master">
    <tabpage
      class="col-9"
      :tabs="tabs"
      activated="overview"
      slot="details"
      @changed="onPageChanged"
    >
      <div slot="overview">
        <h1>Welcome to our support center 1.0.1</h1>
        <p>
          We are here to help! Please read the <a>F.A.Q</a> first,
          and if you don't find the answer to your question, <a>send
            us a ticket!</a>
        </p>
      </div>
    </tabpage>
  </master-details>
</template>

<script>

import state from '../../src/store'
import enums from '../helpers/Enums.js'
import MasterDetails from '../components/MasterDetails/MasterDetails.vue'
import FiltersForm from '../components/FiltersForm.vue'
import ItemList from '../components/ItemList.vue'

const ROLE_NAME_ADMIN = '@@SYSADMIN@@'

export default {
  components: {
    MasterDetails,
    // FiltersForm,
    ItemList
  },
  computed: {
    master () {
      const user = state.getters.selectedUser.data
      const data = {...user}
      if (!data.inUse) data.roles = ''
      if (data.isAdmin) data.roles = ROLE_NAME_ADMIN

      return {
        editable: true,
        logo: user.pic ? user.pic : '/static/img/clx.jpg',
        title: user.name,
        subtitle: user.userId,
        email: user.email,
        items: [
          {
            name: 'roles',
            type: 'dropdown',
            label: '角色',
            options: [
              { name: '未授权或收回授权', value: '' },
              { name: '系统管理员', value: '@@SYSADMIN@@' },
              ...enums.roles
            ]
          }
        ],
        data,
        update: this.onSaveMaster
      }
    },
    tabs () {
      return [
        {
          id: 'overview',
          title: '概要'
        }
      ]
    }
  },
  async created () {
  },
  methods: {
    async onSaveMaster (data) {
      const url = state.getters.selectedUser.links.authorize
      const selfUrl = state.getters.selectedUser.links.self
      const toSave = {__v: data.__v}
      if (data.roles === ROLE_NAME_ADMIN) toSave.isAdmin = true
      if (data.roles !== '') toSave.roles = data.roles

      state.dispatch('authToUser', {selfUrl, url, data: toSave})
    },
    async onPageChanged (page) {
    }
  }
}
</script>

<style>
.selectable:hover {
  border-bottom: 2px solid #007bff;
  cursor: pointer;
}
</style>
