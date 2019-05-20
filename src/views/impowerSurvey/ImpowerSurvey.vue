<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <div style="width: 100%;">
      <el-row :gutter="10"
              style="margin: -20px -20px 20px;padding: 20px 20px 20px 15px;background: #fff;">
        <el-col :span="8">
          <div style="display:flex;">
            <el-select v-model="select_term"
                       slot="prepend"
                       placeholder="请选择">
              <el-option label="按设备"
                         value="1"></el-option>
              <el-option label="按时间"
                         value="2"></el-option>
            </el-select>
            <el-input placeholder="请输入IMEI"
                      clearable
                      v-model="fill_imsi"
                      v-if="select_term==1"
                      class="input-with-select select_item"></el-input>
            <div class="block"
                 v-if="select_term==2">
              <el-date-picker v-model="dateArr"
                              value-format="yyyy-M-d"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="search()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="facility_data_style">
        <el-col :span="12"
                v-for="item in facility_data"
                :key="item.id">
          <el-col><span></span>{{item.title}}</el-col>
          <el-col :span="6"
                  v-for="items in item.bodyData"
                  :key="items.id">
            <div>{{items.value}}</div>
            <div>{{items.name}}</div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div style="flex: 1;overflow: hidden;padding-bottom: 72px;background: #fff;">
      <el-table :data="tableData"
                height="100%"
                border
                v-loading="loading">
        <el-table-column type="index"
                         width="50"
                         label="序号"></el-table-column>
        <el-table-column prop="DeviceId"
                         show-overflow-tooltip
                         label="设备ID"></el-table-column>
        <el-table-column prop="Imsi"
                         label="IMEI">
                         <template slot-scope="scope">
                            <el-button
                              @click.native.prevent="equipmentSkip(tableData[scope.$index])"
                              type="text">
                              {{ scope.row.Imsi }}
                            </el-button>
                          </template>
                         </el-table-column>
        <el-table-column prop="DiskUse"
                         label="数据大小(Mb)"></el-table-column>
        <el-table-column prop="TimeUse"
                         label="采集时长(min)"></el-table-column>
        <el-table-column prop="Latitude"
                         label="最后纬度"></el-table-column>
        <el-table-column prop="Longitude"
                         label="最后经度"></el-table-column>
        <el-table-column prop="TaskInfo"
                         label="任务信息"></el-table-column>
        <el-table-column prop="DateTime"
                         label="时间"></el-table-column>
        <el-table-column prop="IsTestDevice"
                         label="测试设备"></el-table-column>
        <!-- <el-table-column v-for='(value, item,index) in tableData[0]'
                         :key="item.id"
                         :show-overflow-tooltip="true"
                         :property="item"
                         :label="table_header[index]"></el-table-column> -->
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="page_size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total_num"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { queryTableData, queryFlipOverData } from '@/api/ImpowerSurvey'
export default {
  name: 'ImpowerSurvey',
  data () {
    return {
      currentPage: 1,
      dateArr: '',
      select_term: '1',
      loading: false,
      facility_data: [
        {
          title: '授权设备',
          bodyData: [
            { name: '已授权设备总数', value: 0 },
            { name: '最近一周使用设备数', value: 0 },
            { name: '采集总量', value: 0 },
            { name: '采集总时长', value: 0 }
          ]
        },
        {
          title: '测试设备',
          bodyData: [
            { name: '已授权设备总数', value: 0 },
            { name: '最近一周使用设备数', value: 0 },
            { name: '采集总量', value: 0 },
            { name: '采集总时长', value: 0 }
          ]
        }
      ],
      fill_imsi: '',
      total_num: 0,
      page_size: 10,
      page_sizes: [],
      page_index: 1,
      table_param: { imsi: '', pageIndex: 1, pageSize: 10 },
      table_header: ['设备ID', 'IMEI', '数据大小(Mb)', '采集时长(min)', '最后纬度', '最后经度', '任务信息', '时间', '测试设备'],
      tableData: []
    }
  },
  methods: {
    // 表格数据
    queryPower () {
      this.loading = true
      queryTableData(this.table_param).then(response => {
        let data = response.data.data
        let impower = data.OfficialDeviceStatisticsInfo
        let test = data.TestDeviceStatisticsInfo
        let keys = Object.getOwnPropertyNames(impower).sort()
        Object.getOwnPropertyNames(impower).forEach((val, idx, array) => {
          this.facility_data[0].bodyData[idx].value = impower[keys[idx]]
          this.facility_data[1].bodyData[idx].value = test[keys[idx]]
          if (idx === 2) {
            this.facility_data[0].bodyData[2].value = this.facility_data[0].bodyData[2].value.toFixed(2) + 'Mb'
            this.facility_data[1].bodyData[2].value = this.facility_data[1].bodyData[2].value.toFixed(2) + 'Mb'
          }
          if (idx === 3) {
            this.facility_data[0].bodyData[3].value = this.sec_to_time(Math.round(this.facility_data[0].bodyData[3].value / 1000))
            this.facility_data[1].bodyData[3].value = this.sec_to_time(Math.round(this.facility_data[1].bodyData[3].value / 1000))
          }
        })
        this.total_num = data.WebDeviceLogInfoList.Count
        this.tableData = data.WebDeviceLogInfoList.DeviceLogInfoList
        this.tableData.forEach(function (item, index) {
          item.TimeUse = (item.TimeUse / 60000).toFixed(2)
        })
        this.loading = false
      })
    },
    sec_to_time (times) {
      let timeFat
      if (times > -1) {
        let min = Math.floor(times / 60)
        let sec = times % 60
        timeFat = min + '\''
        timeFat += sec + '"'
      }
      return timeFat
    },
    equipmentSkip (data) {
      if (data.IsTestDevice === '是') {
        this.$router.push({ name: 'TestFacility', params: { Imei: data.Imsi } })
      } else {
        this.$router.push({ name: 'FacilityImpower', params: { Imei: data.Imsi } })
      }
    },
    // 翻页
    queryFlipOver () {
      this.table_param = {
        imsi: this.fill_imsi,
        pageIndex: this.page_index,
        pageSize: this.page_size
      }
      queryFlipOverData(this.table_param).then(response => {
        let data = response.data.data
        this.total_num = data.Count
        this.tableData = data.DeviceLogInfoList
        this.tableData.forEach(function (item, index) {
          item.TimeUse = (item.TimeUse / 60000).toFixed(2)
        })
      })
    },
    // 搜索
    search () {
      this.page_index = 1
      if (this.select_term === '1') {
        this.table_param = {
          imsi: this.fill_imsi,
          pageIndex: this.page_index,
          pageSize: this.page_size
        }
      } else if (this.select_term === '2' && this.dateArr.length !== 0) {
        this.table_param = {
          imsi: this.fill_imsi,
          pageIndex: this.page_index,
          pageSize: this.page_size,
          startDate: this.dateArr[0] + ' 00:00:00',
          endDate: this.dateArr[1] + ' 23:59:59'
        }
      } else if (this.select_term === '2' && this.dateArr.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择日期'
        })
      }
      this.queryPower()
    },
    // 每页条数
    handleSizeChange (val) {
      this.page_size = val
      this.queryFlipOver()
    },
    // 当前页数
    handleCurrentChange (val) {
      this.page_index = val
      this.queryFlipOver()
    }
  },
  created () {
    this.queryPower()
  }
}
</script>
<style lang="scss">
.select_item .el-input {
  width: 130px;
}
.select_item > div {
  background: #fff;
}
.facility_data_style {
  margin-bottom: 20px;
  > div {
    &:first-child > div:first-child > span {
      border-color: #61daa5;
    }
    &:last-child > div:first-child > span {
      border-color: #79a7f2;
    }
    background: #fff content-box;
    border-radius: 10px;
    > div.el-col-6 {
      &:last-child {
        border-right: none;
      }
      text-align: center;
      padding: 25px 0 !important;
      margin: 20px 0;
      border-right: 1px solid #eee;
      > div {
        &:first-child {
          font-size: 32px;
          font-weight: 600;
          color: #434343;
        }
        &:last-child {
          font-size: 14px;
          color: #aaa;
        }
      }
    }
    > div:first-child {
      border-bottom: 1px solid #eee;
      padding: 12px 40px !important;
      font-size: 18px;
      > span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 3px solid;
        position: relative;
        top: 1px;
        margin-right: 20px;
      }
    }
  }
}
</style>
