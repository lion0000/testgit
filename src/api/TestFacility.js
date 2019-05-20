import request from '@/libs/request'

export const queryTableData = (params) => {
  return request.request({
    url: '/TestDevice/GetList',
    params,
    method: 'get'
  })
}
export const updateModifyAuth = (data) => {
  return request.request({
    url: '/Device/ModifyAuth',
    data,
    method: 'post'
  })
}
export const addTestDevice = (data) => {
  return request.request({
    url: '/TestDevice/Add',
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data,
    method: 'post'
  })
}
export const DelTestDevice = (data) => {
  return request.request({
    url: '/TestDevice/Delete2?Id=' + data,
    method: 'post'
  })
}
