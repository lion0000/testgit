<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <div style="background-color: #fff;width: 100%;padding: 20px;margin: -20px;">
      <el-row :gutter="10">
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
    </div>
    <div style="width: 100%; margin-top: 35px;">
      <div class="button_group2"
           @click="modifyFn">
        <i class="el-icon-edit-outline"></i>
        <span>更改授权</span>
      </div>
      <div class="button_group2"
           @click="addFn">
        <i class="el-icon-circle-plus-outline"></i>
        <span>添加设备</span>
      </div>
      <div class="button_group2"
           @click="DelFn">
        <i class="el-icon-delete"></i>
        <span>删除设备</span>
      </div>
    </div>
    <div style="flex: 1;overflow: hidden;padding-bottom: 72px;background: #fff;">
      <!-- <el-table :data="tableData"  ref="multipleTable" @selection-change="changeFun" height="100%" border>
        <el-table-column  type="selection" width="55"  @selection-change="changeFun"></el-table-column>
        <el-table-column type="index" width="50" prop="DeviceId" label="序号"></el-table-column>
        <el-table-column v-for='(value, item) in tableData[0]' :key="item.id" :property="item" :label="item">
        </el-table-column>
      </el-table> -->
      <el-table :data="tableData"
                size="medium"
                ref="multipleTable"
                @selection-change="changeFun"
                height="100%"
                border>
        <el-table-column type="selection"
                         width="55"
                         @selection-change="changeFun">
        </el-table-column>
        <el-table-column type="index"
                         width="50"
                         prop="DeviceId"
                         label="序号">
        </el-table-column>
        <!-- <el-table-column
        prop="Id"
        label="编号"
        width="180">
      </el-table-column> -->
        <el-table-column prop="DeviceId"
                         label="设备编号"
                         width="180">
        </el-table-column>
        <el-table-column prop="Imsi"
                         label="IMEI">
        </el-table-column>
        <el-table-column prop="Manufacturer"
                         label="手机厂商">
        </el-table-column>
        <el-table-column prop="Model"
                         label="手机型号">
        </el-table-column>
        <el-table-column prop="AndroidVersion"
                         label="安卓版本">
        </el-table-column>
        <el-table-column prop="AppVersion"
                         label="软件版本">
        </el-table-column>
        <el-table-column prop="AuthEndDate"
                         label="授权到期时间">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[15, 30, 50, 100]"
                     :page-size="page_size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total_num"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
    <el-dialog title="更改到期日期"
               :visible.sync="formVisible"
               width="20%"
               top="5vh">
      <el-form>
        <el-form-item label="更改日期">
          <div class="block">
            <el-date-picker v-model="authEndDate"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click.native="formSubmit()"
                   :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加设备"
               :visible.sync="Addequipment"
               width="20%">
      <el-form :label-position="labelPosition"
               id="#addsForm"
               ref="addsForm"
               label-width="80px"
               :model="formLabelAlign">
        <el-form-item label="手机厂商"
                      prop="Manufacturer">
          <el-input v-model="formLabelAlign.Manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="手机型号"
                      prop="Model">
          <el-input v-model="formLabelAlign.Model"></el-input>
        </el-form-item>
        <el-form-item label="IMEI"
                      prop="IMSI">
          <el-input v-model="formLabelAlign.IMSI"></el-input>
        </el-form-item>
        <el-form-item label="到期时间"
                      prop="AuthEndDate">
          <div class="block">
            <el-date-picker v-model="formLabelAlign.AuthEndDate"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="addTest()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryTableData, addTestDevice, DelTestDevice, updateModifyAuth } from '@/api/TestFacility'
export default {
  name: 'TestFacility',
  data () {
    return {
      currentPage: 1,
      select: '',
      fill_imsi: '',
      total_num: 0,
      page_size: 10,
      table_param: { imsi: '', pageIndex: 1, pageSize: 15 },
      value: '',
      tableData: [],
      authEndDate: '',
      formLoading: false,
      // 更改授权弹框
      formVisible: false,
      // 添加设备弹框
      Addequipment: false,
      labelPosition: 'top',
      formLabelAlign: {
        Manufacturer: '',
        Model: '',
        IMSI: '',
        AuthEndDate: ''
      }
    }
  },
  methods: {
    // 表格
    queryPower () {
      queryTableData(this.table_param).then(response => {
        let data = response.data.data
        this.total_num = data.Count
        this.tableData = data.DeviceInfoList
      })
    },
    // 搜索
    search (param) {
      this.table_param.pageIndex = 1
      this.table_param.imsi = param
      this.queryPower()
    },
    // 表格选中的值
    changeFun (val) {
      this.multipleSelection = val
    },
    // 更改授权
    modifyFn () {
      var selected = this.$refs['multipleTable'].selection
      if (selected.length >= 1) {
        this.formVisible = true
        this.authEndDate = ''
      } else {
        this.$message({
          message: '请选择需要编辑的数据！',
          type: 'warning'
        })
      }
    },
    formSubmit () {
      const selectedtest = this.$refs['multipleTable'].selection
      let ids = []
      selectedtest.map(function (row, index) {
        ids.push(row.Id)
      })
      // const ids = selectedtest[0].DeviceId
      updateModifyAuth({ IdList: ids, AuthEndDate: this.authEndDate }).then(res => {
        let data = res.data
        if (data.state === 0) {
          this.$message({
            type: 'success',
            message: data.message
          })
          this.formVisible = false
          this.queryPower()
        } else {
          this.$message({
            type: 'info',
            message: data.message
          })
        }
      })
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
    },
    // 添加设备
    addFn () {
      this.Addequipment = true
    },
    // 新增
    addTest () {
      let test = this.formLabelAlign
      let { Manufacturer, Model, IMSI, AuthEndDate } = test
      if (Manufacturer === '' || Model === '' || IMSI === '' || AuthEndDate === '') {
        this.$message.error('新增内容每一项都不准为空')
      } else {
        addTestDevice(this.formLabelAlign).then(response => {
          let data = response.data
          if (data.state === 0) {
            this.$message({
              type: 'success',
              message: data.message
            })
            this.Addequipment = false
            this.queryPower()
            // 重置表单
            this.$refs['addsForm'].resetFields()
          } else {
            this.$message({
              type: 'info',
              message: data.message
            })
          }
        })
      }
    },
    // 删除设备
    DelFn () {
      var selectedtest = this.$refs['multipleTable'].selection
      if (selectedtest.length > 0) {
        this.$confirm('是否确定删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deviceId = []
          selectedtest.map((value, index, array) => {
            deviceId.push(value.Id)
          })
          DelTestDevice(deviceId.toString()).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.queryPower()
          })
        })
      } else {
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        })
      }
    }
  },
  created () {
    this.queryPower()
    if (this.$route.params.Imei) {
      this.fill_imsi = this.$route.params.Imei
      this.search(this.$route.params.Imei)
    }
  }
}
</script>
<style lang="scss">
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-dialog__body {
  padding: 5px 20px;
}
.el-form--label-top .el-form-item__label {
  padding: 0 0 0px 0;
}
.el-form-item {
  margin-bottom: 0;
}
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
.button_group2 {
  display: inline-block;
  padding-left: 35px;
  position: relative;
  margin: 0 15px 14px 0;
  color: #666;
  cursor: pointer;
  &:hover {
    color: #61daa5;
  }
  > i {
    font-size: 30px;
    position: absolute;
    left: 0;
  }
  > span {
    line-height: 30px;
    font-size: 15px;
  }
}
</style>
