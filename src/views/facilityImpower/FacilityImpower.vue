<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <div style="width: 100%;">
      <el-row :gutter="10"
              style="margin: -20px -20px 21px;padding: 20px 20px 20px 15px;background: #fff;">
        <el-col :span="8">
          <el-input v-model="fill_imsi"
                    placeholder="请输入IMEI"
                    clearable></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="search(fill_imsi)">搜索</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20"
              class="accredit_quota">
        <el-col :span="3"
                class="authorization_facility">
          <el-col>
            <div>{{current_quota}}</div>
            <div>已授权</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="12">
            <div>{{granted}}</div>
            <div>当前配额</div>
          </el-col>
          <el-col :span="12">
            <el-button @click="alterQuota">修改配额</el-button>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="12">
            <div>{{default_day}}</div>
            <div>默认授权天数</div>
          </el-col>
          <el-col :span="12">
            <el-button @click="alterDay">修改天数</el-button>
          </el-col>
        </el-col>
      </el-row>

      <div class="button_group"
           @click="toggleSelection(0)">
        <i class="el-icon-edit-outline"></i>
        <span>更改授权</span>
      </div>
      <div class="button_group"
           @click="toggleSelection(1)">
        <i class="el-icon-sort"></i>
        <span>转测试设备</span>
      </div>
      <el-upload
        class="button_group"
        :action='site'
        :headers="getToken"
        accept=".json,.JSON"
        :show-file-list="false"
        :on-change="addFile"
        :on-success="upload_success"
        ref="upload"
        :auto-upload="false">
        <div slot="trigger" @click="toggleSelection(2)">
          <i class="el-icon-download"></i>
          <span>导入离线设备</span>
        </div>
      </el-upload>

      <div class="button_group"
           @click="toggleSelection(3)">
        <i class="el-icon-upload2"></i>
        <span>导出授权文件</span>
      </div>

    </div>
    <div style="flex: 1;overflow: hidden;padding-bottom: 72px;background: #fff;">
      <el-table :data="tableData"
                height="100%"
                border
                @selection-change="selectRow"
                v-loading="loading">
        <el-table-column type="selection"
                         v-if="tableData.length!==0"></el-table-column>
        <el-table-column type="index"
                         width="50"
                         label="序号"
                         v-if="tableData.length!==0"></el-table-column>
        <el-table-column v-for='(value, item,index) in tableData[0]'
                         :key="item.id"
                         :show-overflow-tooltip="true"
                         :property="item"
                         :label="table_header[index]"></el-table-column>
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
    <el-dialog title="修改到期时间"
               :visible.sync="dialogVisible"
               width="20%">
      <el-date-picker v-model="alterDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      style="width: 100%;">
      </el-date-picker>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="modifyAccredit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入离线设备文件生成确认"
      :visible.sync="generate_dialog"
      width="20%"
      >
      <ul class="generate_list">
        <li v-for="item in generate_list" :key="item.id"><span>{{item.name}}</span>：<span>{{item.value}}</span></li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="generate_dialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {
  queryTableData,
  queryModifyAuth,
  queryChangeType,
  queryGetQuotaInfo,
  queryModifyQuota,
  queryChangeDefaultDay,
  queryDownloadLicense
} from '@/api/FacilityImpower'
import { getToken } from '@/libs/auth'
import config from '@/config'
export default {
  name: 'FacilityImpower',
  data () {
    return {
      getToken: {},
      site: config.BASE_API.prod + '/Device/RegisterByFile',
      granted: 0,
      current_quota: 0,
      default_day: 1,
      loading: false,
      currentPage: 1,
      flag: false,
      select: '',
      alterDate: '',
      fill_imsi: '',
      table_header: ['ID', '设备ID', 'IMEI', '手机厂商', '手机型号', '安卓版本', 'APP版本', '到期时间'],
      generate_dialog: false,
      generate_list: [
        { name: 'IMEI', value: '' },
        { name: '生产商', value: '' },
        { name: '型号', value: '' },
        { name: '安卓版本', value: '' },
        { name: 'APP版本', value: '' },
        { name: '设备ID', value: '' }
      ],
      dialogVisible: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 86400000
        }
      },
      DeviceIdArr: [],
      DeviceId: '',
      total_num: 0,
      page_size: 10,
      table_param: { imsi: '', pageIndex: 1, pageSize: 10 },
      value: '',
      tableData: []
    }
  },
  methods: {
    // 获取设备配置信息
    queryGetQuota () {
      queryGetQuotaInfo().then(response => {
        let data = response.data.data
        this.granted = data.MaxAuthDeviceCount
        this.current_quota = data.CurrentAuthDeviceCount
        this.default_day = data.DefaultAuthDay
      })
    },
    // 表格
    queryPower () {
      this.loading = true
      queryTableData(this.table_param).then(response => {
        let data = response.data.data
        this.total_num = data.Count
        this.tableData = data.DeviceInfoList
        this.loading = false
      })
    },
    // 搜索
    search (param) {
      this.table_param.pageIndex = 1
      this.table_param.imsi = param
      this.queryPower()
    },
    // 修改授权天数
    alterDay () {
      this.$prompt('当前默认天数：' + this.default_day + '', '修改默认授权天数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]+[0-9]*$/,
        inputErrorMessage: '天数输入不正确'
      }).then(({ value }) => {
        queryChangeDefaultDay({ defaultAuthDay: value }).then(response => {
          let data = response.data
          if (data.state === 0) {
            this.default_day = value
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: data.message
            })
          }
        })
      }).catch(() => { })
    },
    // 修改配额
    alterQuota () {
      this.$prompt('当前配额：' + this.granted + '', '修改授权配额', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (instance.inputValue < this.current_quota) {
              this.$message({
                type: 'warning',
                message: '总授权配额不能小于已授权配额'
              })
            } else {
              done()
            }
          } else {
            done()
          }
        },
        inputPattern: /^[1-9]+[0-9]*$/,
        inputErrorMessage: '配额输入不正确'
      }).then(({ value }) => {
        queryModifyQuota({ maxAuthDeviceCount: value }).then(response => {
          let data = response.data
          if (data.state === 0) {
            this.queryGetQuota()
            this.$message({
              type: 'success',
              message: data.message
            })
          } else {
            this.$message({
              type: 'warning',
              message: data.message
            })
          }
        })
      }).catch(() => { })
    },
    // 按钮判断
    toggleSelection (param) {
      if (param === 2) { // 导入离线设备
        this.flag = true
      } else if (this.DeviceIdArr.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要操作的数据'
        })
      } else {
        if (param === 0) { // 更改授权
          this.dialogVisible = true
        } else if (param === 1) { // 转测试设备
          this.$confirm('将选中授权设备转为测试设备，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            queryChangeType({ IdList: this.DeviceIdArr, DeviceType: 1 }).then(response => {
              let data = response.data
              if (data.state === 0) {
                this.$message({
                  type: 'success',
                  message: '成功转为测试设备!'
                })
                this.queryGetQuota()
                this.queryPower()
              } else {
                this.$message({
                  type: 'warning',
                  message: data.message
                })
              }
            })
          }).catch(() => {

          })
        } else if (param === 3) { // 导出授权文件
          if (this.DeviceIdArr.length > 1) {
            this.$message({
              type: 'warning',
              message: '只能导出单条数据'
            })
          } else {
            queryDownloadLicense({ deviceId: this.DeviceId }).then(response => {
              let data = response.data
              if (data.state === 0) {
                window.location.href = config.BASE_API.prod + data.data
                this.$message({
                  type: 'success',
                  message: data.message
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: data.message
                })
              }
            })
          }
        }
      }
    },
    // 导入离线设备
    addFile (file, fileList) {
      if (this.flag) {
        let _this = this
        if (file.raw) {
          let reader = new FileReader()
          reader.onload = function (e) {
            try {
              let list = JSON.parse(e.target.result)
              for (let key in list) {
                if (key === 'IMSI') {
                  _this.generate_list[0].value = list[key]
                } else if (key === 'Manufacturer') {
                  _this.generate_list[1].value = list[key]
                } else if (key === 'Model') {
                  _this.generate_list[2].value = list[key]
                } else if (key === 'AndroidVersion') {
                  _this.generate_list[3].value = list[key]
                } else if (key === 'AppVersion') {
                  _this.generate_list[4].value = list[key]
                } else if (key === 'DeviceId') {
                  _this.generate_list[5].value = list[key]
                }
                _this.generate_dialog = true
              }
            } catch (e) {
              _this.$message({
                type: 'error',
                message: '文件格式错误'
              })
              return false
            }
          }
          reader.readAsText(file.raw)
        }
        _this.flag = false
      }
    },
    // 确认上传
    submitUpload () {
      this.getToken.Token = getToken()
      this.$refs.upload.submit()
      this.loading = true
      this.generate_dialog = false
    },
    // 上传成功
    upload_success (response, file, fileList) {
      let data = response
      if (data.state === 0) {
        this.$message.success('上传成功!')
        this.queryGetQuota()
        this.queryPower()
      } else {
        this.loading = false
        this.$message.warning(data.message)
      }
    },
    // 表格勾选
    selectRow (selection) {
      this.DeviceIdArr = []
      if (selection.length > 0) {
        this.DeviceId = selection[0].DeviceId
      } else {
        this.DeviceId = ''
      }
      for (let i = 0; i < selection.length; i++) {
        this.DeviceIdArr.push(selection[i].Id)
      }
    },
    // 修改到期时间 确认
    modifyAccredit () {
      if (this.alterDate !== '') {
        queryModifyAuth({ IdList: this.DeviceIdArr, AuthEndDate: this.alterDate + ' 23:59:59' }).then(response => {
          let data = response.data
          if (data.state === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.queryPower()
            this.dialogVisible = false
            this.alterDate = ''
          } else {
            this.$message({
              type: 'warning',
              message: data.message
            })
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择日期'
        })
      }
    },
    // 每页条数
    handleSizeChange (val) {
      this.table_param.pageSize = val
      this.queryPower()
    },
    // 当前页数
    handleCurrentChange (val) {
      this.table_param.pageIndex = val
      this.queryPower()
    }
  },
  created () {
    this.queryGetQuota()
    this.queryPower()
    if (this.$route.params.Imei) {
      this.fill_imsi = this.$route.params.Imei
      this.search(this.$route.params.Imei)
    }
  }
}
</script>
<style lang="scss">
.amend_day {
  text-align: right;
  line-height: 40px;
  > span {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: -30px;
  }
}
.accredit_quota {
  margin-bottom: 20px;
  > div {
    background: #fff;
    background-clip: content-box;
    border-radius: 10px;
    // border: 1px solid #eee;
    > div {
      text-align: center;
      padding: 24px 0 !important;
      margin: 20px 0;
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
  }
  > div.el-col-6 > div {
    &:first-child {
      border-right: 1px solid #eee;
    }
    &:last-child {
      line-height: 3.5;
    }
  }
}
.button_group {
  display: inline-block;
  padding-left: 35px;
  position: relative;
  margin: 0 15px 20px 0;
  color: #666;
  cursor: pointer;
  &:hover {
    color: #61daa5;
  }
  i {
    font-size: 30px;
    position: absolute;
    left: 0;
  }
  span {
    line-height: 30px;
    font-size: 15px;
  }
}
.generate_list{
  list-style: none;
  padding: 0;
  margin: 0;
  color: #777;
  >li{
    margin-bottom: 10px;
    >span:first-child{
      display: inline-block;
      width: 70px;
      text-align: right;
    }
    &:last-child{
      margin-bottom: 0;
    }
  }

}
</style>
