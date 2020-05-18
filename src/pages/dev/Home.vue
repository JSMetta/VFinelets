<template>
  <master-details  :master="master">
    <tabpage class="col-9" :tabs="tabs" :activated="currentTab" slot="details" @changed="onPageChanged">
      <div slot="programs">
          <filters-form :config="programFilters" class="my-2" @search="onSearchPrograms" @action="onCreate"/>
          <item-list :items="programs">
            <template slot-scope="obj">
              <div class="row border-0 align-items-center p-2">
                <div class="col-11">
                  <div class="d-flex  mt-1">
                    <h6 class="text-primary mb-1 mr-auto selectable" @click="selectProgram(obj.item)">
                        <octicon name="gist" scale="1" style="color:green"/>
                        {{obj.item.data.name}}
                    </h6>
                    <h6 v-if="obj.item.data.desc" class="text-dark">
                      <octicon name="ruby" scale="1" class="mr-1" style="color:green"/>{{obj.item.data.desc}}
                    </h6>
                  </div>
                  <div class="d-flex mt-1">
                      <octicon v-if="obj.item.data.tags" name="tag" class="mt-1" size="16" style="color:green"/>
                      <h6 class="ml-1 mt-1 mr-auto"  style="font-size:10px">{{obj.item.data.tags}}</h6>
                      <octicon name="primitive-dot" scale="1.1" style="color:yellow"/>
                      <span class="ml-1" style="font-size:10px">更新于 {{obj.item.data.updatedAt | date}}</span>
                  </div>
                </div>
                <div class="col p-0">
                  <hoverable-icon-button icon="backspace" scale="1.2" variant="info" @click="onRemove(obj.item)"/>
                </div>
              </div>
            </template>
          </item-list>
        </div>
    </tabpage>
  </master-details>
</template>

<script>
import {createQueryString} from '../../../finelets/helpers/QueryHelper.js'
import MasterDetails from '../../../finelets/components/MasterDetails/MasterDetails.vue'
import FiltersForm from '../../../finelets/components/FiltersForm.vue'
import ItemList from '../../../finelets/components/ItemList.vue'
import _ from 'lodash'

const ROUTE_NAME = 'devHome'

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data () {
    return {
      currentTab: null,
      userAttrs: {
        userId: null,
        name: null,
        email: null
      },
      programs: [],
      input: '# hello'
    }
  },
  computed: {
    master () {
      const user = this.$store.getters.user
      const data = {
        ...user
      }
      return {
        editable: true,
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
          id: 'programs',
          title: '检测控制程序'
        }
      ]
    },
    programFilters () {
      return {
        search: {width: 400},
        cmdButton: {text: '新增'}
      }
    }
  },
  async created () {
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || 'programs'
    this.currentTab = tab
    await this.loadPageData(tab)
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value
    }, 300),

    async loadPageData (page) {
      const loaders = {
        programs: this.onSearchPrograms
      }
      const func = loaders[page]
      if (!func) return
      await func({search: '', filters: []})
    },

    onCreate () {
      this.$store.commit('selectedProgram')
      let path = {
        name: 'runProgram',
        query: {from: 'home'}
      }
      this.$router.push(path)
    },

    async onRemove (obj) {
      const res = await this.$store.dispatch('removeProgram', obj.links.self)
      if (res.ok) {
        const ps = [...this.programs]
        _.remove(ps, (item) => {
          return item === obj
        })
        this.programs = ps
      }
    },

    async onPageChanged (page) {
      this.$store.commit('currentPage', {route: ROUTE_NAME, page})
      await this.loadPageData(page)
    },

    async onSaveMaster (data) {
      this.$store.dispatch('saveUserProfile', data)
    },

    async onSearchPrograms (cond) {
      this.programs = []
      // cond.filters = [state.getters.selectedInstruction.data.id]
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchPrograms', r)
      this.programs = data
    },
    selectProgram (data) {
      this.$store.commit('selectedProgram', data)
      let path = {
        name: 'runProgram'
      }
      this.$router.push(path)
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
