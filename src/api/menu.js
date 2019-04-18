import request from '@/libs/request'

export function queryMenuFn () {
  return request({
    url: 'http://127.0.0.1:7001/api/menu/menuList',
    method: 'get'
  })
}

export function queryPowerFn () {
  return request({
    url: '/api/menu/powerList',
    method: 'get'
  })
}

export function deleteMenuInfo (id) {
  return request({
    url: '/api/menu/deleteInfo',
    method: 'post',
    data: { id }
  })
}

export function insertMenuInfo (data) {
  return request({
    url: '/api/menu/insertInfo',
    method: 'post',
    data
  })
}

export function modifyMenuInfo (data) {
  return request({
    url: '/api/menu/modifyInfo',
    method: 'post',
    data
  })
}
