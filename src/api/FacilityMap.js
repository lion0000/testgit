import request from '@/libs/request'

export const queryTableData = (params) => {
  return request.request({
    url: '/DeviceLog/GetimsiList',
    params,
    method: 'get'
  })
}
