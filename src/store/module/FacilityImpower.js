import { queryTableData, queryModifyAuth, queryChangeType, queryGetQuotaInfo, queryModifyQuota, queryChangeDefaultDay, queryDownloadLicense } from '@/api/FacilityImpower'

export default {
  actions: {
    // 查询表格
    queryTableData ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryTableData(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    queryModifyAuth ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryModifyAuth(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    queryChangeType ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryChangeType(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    queryGetQuotaInfo ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryGetQuotaInfo(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    queryModifyQuota ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryModifyQuota(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    queryChangeDefaultDay ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryChangeDefaultDay(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }

  }
}
