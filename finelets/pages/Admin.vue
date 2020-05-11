<template>
  <master-details :master="master">
    <tabpage
      class="col-9"
      :tabs="tabs"
      activated="users"
      slot="details"
      @changed="onPageChanged"
    >
      <div slot="users">
        <filters-form
          :config="authFilters"
          class="my-2"
          @search="onSearchUsers"
          @action="onCreateUser"
        />
        <item-list :items="users">
          <template slot-scope="users">
            <div class="row border-0 p-2">
              <div class="col">
                <div class="d-flex">
                    <h6 class="mr-auto">{{users.item.data.userId}}</h6>
                    <h6 v-if="users.item.data.isAdmin" class="text-success">系统管理员</h6>
                </div>
                <div class="d-flex">
                  <div class="d-flex" style="width:150px">
                      <octicon name="note" class="mt-1 mr-1" size="16" style="color:green"/>
                      <h6 class="text-primary mb-1 selectable" style="font-size:16px" @click="selectUser(users.item)">
                        {{users.item.data.name}}
                      </h6>
                  </div>
                  <div class="d-flex ml-4">
                      <div class="form-check" style="height:30px">
                          <input type="checkbox" class="form-check-input mt-1" disabled :checked="users.item.data.inUse"/>
                          <p class="" style="font-size:16px">授权</p>
                      </div>
                  </div>
                  <div class="d-flex ml-4">
                      <octicon v-if="users.item.data.roles" name="shield" class="mt-1 mr-1" size="16" style="color:green"/>
                      <h6 class="ml-auto" style="font-size:16px">{{getRoleTypeName (users.item.data.roles)}}</h6>
                  </div>
                  <h6 class="text-secondary ml-auto mt-1" style="font-size:10px">
                      更新于 {{users.item.data.modifiedDate | date }}
                  </h6>
                </div>
              </div>
            </div>
          </template>
        </item-list>
      </div>
    </tabpage>
  </master-details>
</template>

<script>

import MasterDetails from '../components/MasterDetails/MasterDetails.vue'
import FiltersForm from '../components/FiltersForm.vue'
import ItemList from '../components/ItemList.vue'
import {createQueryString} from '../helpers/QueryHelper.js'
import typeEnums from '../helpers/Enums.js'
import _ from 'lodash'
import { mapGetters, mapMutations, mapActions } from 'vuex'


export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data () {
    return {
      users: []
    }
  },
  computed: {
    ...mapGetters(['user']),
    master () {
      const user = this.user
      const data = {
        ...this.user
      }
      return {
        editable: this.user.id !== '$$$$cross$$admin',
        logo: user.pic ? user.pic : '/static/img/clx.jpg',
        title: user.name,
        email: user.email,
        items: [
          {
            name: 'userId',
            icon: 'person'
          },
          {
            name: 'name',
            icon: 'note'
          },
          {
            name: 'email',
            icon: 'mail'
          }
        ],
        data,
        update: this.onSaveMaster
      }
    },
    tabs () {
      return [
        {
          id: 'users',
          title: '用户'
        }
      ]
    },
    authFilters () {
      return {
        search: {width: 400},
        filter: {
          label: '类型',
          value: 0,
          options: [
            { name: '所有', value: 'ALL' },
            { name: '非用户', value: 'NONUSER' },
            { name: '用户', value: 'ALLUSER' },
            { name: '系统管理员', value: 'ADMIN' },
            { name: '非系统管理员用户', value: 'NONADMINUSER' }
          ]
        },
        cmdButton: {text: '新增'}
      }
    }
  },
  async created () {
    this.onSearchUsers({search: '', filters: ['ALL']})
  },
  methods: {
    ...mapActions(['searchUsers', 'saveUserProfile']),
    ...mapMutations(['selectedUser']),
    onEditMaster () {
      this.userAttrs = {
        ...this.user
      }
    },
    async onSaveMaster (data) {
      await this.saveUserProfile(data)
    },
    getRoleTypeName (val) {
      const obj = _.find(typeEnums.roles, (role) => {
        return role.value === val
      })
      return obj ? obj.name : undefined
    },
    async onSearchUsers (cond) {
      let r = createQueryString(['TYPE'], cond)
      try {
        this.users = await this.searchUsers(r)
      } catch (e) {
      }
    },

    selectUser (data) {
      this.selectedUser(data)
      let path = {
        name: 'masterUser'
      }
      this.$router.push(path)
    },

    onCreateUser () {
      let path = {
        name: 'signup'
      }
      this.$router.push(path)
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
