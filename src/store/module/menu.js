import { queryMenuFn } from '@/api/menu'
const menu = {
  state: {
    menuList: []
  },
  mutations: {
    SET_MENU: (state, menuData) => {
      state.menuList = menuData
    }
  },
  actions: {
    queryMenuFun ({ commit }) {
      return new Promise((resolve, reject) => {
        queryMenuFn().then(response => {
          const data = response.data
          commit('SET_MENU', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default menu
