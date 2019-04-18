import Vue from 'vue'
import Vuex from 'vuex'
import tagsView from './module/tagsView'
import user from './module/user'
import menu from './module/menu'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sideBarOpen: true
  },
  modules: {
    tagsView,
    user,
    menu
  },
  getters: {
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews
  }
})
