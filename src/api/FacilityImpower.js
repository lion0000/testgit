import request from '@/libs/request'

export const queryTableData = (params) => {
  return request.request({
    url: '/OfficialDevice/GetList',
    params,
    method: 'get'
  })
}
export const queryModifyAuth = (data) => {
  return request.request({
    url: '/Device/ModifyAuth',
    data,
    method: 'post'
  })
}
export const queryChangeType = (data) => {
  return request.request({
    url: '/Device/ChangeType',
    data,
    method: 'post'
  })
}
export const queryGetQuotaInfo = (params) => {
  return request.request({
    url: '/Config/GetConfigInfo',
    params,
    method: 'get'
  })
}
export const queryModifyQuota = (params) => {
  return request.request({
    url: '/Config/ModifyQuota',
    params,
    method: 'post'
  })
}
export const queryChangeDefaultDay = (params) => {
  return request.request({
    url: '/Config/ChangeDefaultAuthDay',
    params,
    method: 'post'
  })
}
export const queryDownloadLicense = (params) => {
  return request.request({
    url: '/Device/DownloadLicenseByUrl',
    params,
    method: 'get'
  })
}
