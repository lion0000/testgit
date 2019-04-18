import request from '@/libs/request'

export const queryTableData = (params) => {
  return request.request({
    url: '/DeviceLog/GetStatusInfo',
    params,
    method: 'get'
  })
}
export const queryFlipOverData = (params) => {
  return request.request({
    url: '/DeviceLog/GetList',
    params,
    method: 'get'
  })
}
