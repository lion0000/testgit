import { loginFn, logoutFn } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/libs/auth'

const user = {
  state: {
    userName: '',
    id: '',
    token: getToken()
  },
  mutations: {
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  getters: {
    token: state => state.token
  },
  actions: {
    // 登录
    LoginFun ({ commit }, userInfo) {
      const userName = userInfo.name.trim()
      return new Promise((resolve, reject) => {
        loginFn(userName, userInfo.password).then(response => {
          console.log(response)
          const data = response.data
          if (data.state === 0) {
            // commit('SET_TOKEN', data.token)
            commit('SET_TOKEN', data.data.TokenInfo.Token)
            commit('SET_USERNAME', data.data.UserName)
            commit('SET_ID', data.data.UserId)
            resolve(response)
            setToken(data.data.TokenInfo.Token)
            resolve()
          } else {

          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // LoginRefresh ({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     const userName = userInfo.name.trim()
    //     loginRefresh(userName, userInfo.password).then(response => {
    //       console.log(response)
    //       const data = response.data
    //       if (data.state === 0) {
    //         // commit('SET_TOKEN', data.token)
    //         commit('SET_TOKEN', data.data.TokenInfo.Token)
    //         commit('SET_USERNAME', data.data.UserName)
    //         commit('SET_ID', data.data.UserId)
    //         resolve(response)
    //         setToken(data.data.TokenInfo.Token)
    //         resolve()
    //       } else {

    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // GetUserInfo ({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     // getUserInfo().then(response => {
    //     //   if (!response.data) {
    //     //     resolve(response)
    //     //     return
    //     //   }
    //     //   const data = response.data.data
    //     //   commit('SET_USERNAME', data.username)
    //     //   commit('SET_ID', data.id)
    //     //   resolve(response)
    //     // }).catch(error => {
    //     //   reject(error)
    //     // })
    //   })
    // },
    LogOutFun ({ commit }) {
      return new Promise((resolve, reject) => {
        logoutFn().then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default user
