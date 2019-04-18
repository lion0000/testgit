import request from '@/libs/request'

export function loginFn (username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/User/Login',
    method: 'post',
    data
  })
}

// export function loginRefresh(username, password) {
//   const data = {
//     username,
//     password
//   }
//   return request({
//     url: '/Token/Refresh',
//     method: 'post',
//     data
//   })
// }

export function logoutFn () {
  return request({
    url: '/User/Login',
    method: 'post'
  })
}

// export function getUserInfo () {
//   return request({
//     url: '/api/auth/info',
//     method: 'get'
//   })
// }
