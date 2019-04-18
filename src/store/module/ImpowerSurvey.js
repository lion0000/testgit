import { queryTableData, queryFlipOverData } from '@/api/ImpowerSurvey'

export default {
  actions: {
    // 查询测试列表
    queryTableData ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryTableData(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    queryFlipOverData ({ state }, params) {
      return new Promise((resolve, reject) => {
        queryFlipOverData(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }

  }
}
