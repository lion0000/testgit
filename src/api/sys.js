import request from '@/libs/request'

export function queryUserList (data) {
  return request({
    url: '/api/user/queryFn',
    method: 'post',
    data
  })
}

export function insertUserInfo (data) {
  return request({
    url: '/api/user/insertInfo',
    method: 'post',
    data
  })
}

export function modifyUserInfo (data) {
  return request({
    url: '/api/user/modifyInfo',
    method: 'post',
    data
  })
}

export function deleteUserInfo (data) {
  return request({
    url: '/api/user/deleteInfo',
    method: 'post',
    data
  })
}

export function queryRoleList (data) {
  return request({
    url: '/api/role/queryFn',
    method: 'post',
    data
  })
}

export function queryRoleAll () {
  return request({
    url: '/api/role/queryAllFn',
    method: 'get'
  })
}

export function insertRoleInfo (data) {
  return request({
    url: '/api/role/insertInfo',
    method: 'post',
    data
  })
}

export function modifyRoleInfo (data) {
  return request({
    url: '/api/role/modifyInfo',
    method: 'post',
    data
  })
}

export function deleteRoleInfo (data) {
  return request({
    url: '/api/role/deleteInfo',
    method: 'post',
    data
  })
}

export function queryAllUser () {
  return request({
    url: '/api/user/queryUserArray',
    method: 'get'
  })
}

export function queryRoleUser (id) {
  return request({
    url: '/api/user/queryRoleUserArray',
    method: 'post',
    data: { id }
  })
}

export function modifyRoleUser (data) {
  return request({
    url: '/api/role/modifyRoleUser',
    method: 'post',
    data
  })
}

export function queryRoleMenu (id) {
  return request({
    url: '/api/role/queryRoleMenuArray',
    method: 'post',
    data: { id }
  })
}

export function modifyRoleMenu (data) {
  return request({
    url: '/api/role/modifyRoleMenu',
    method: 'post',
    data
  })
}
