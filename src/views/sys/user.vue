<template>
    <div style="width:100%;height:100%;" ref="maxContainer">
      <el-form :inline="true" :model="query" class="query-form" size="mini">
          <el-form-item class="query-form-item">
              <el-input v-model="query.name" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item class="query-form-item">
              <el-select v-model="query.status" placeholder="状态">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="禁用" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item class="query-form-item">
              <el-select v-model="query.role_id" placeholder="角色">
                  <el-option label="全部角色" value=""></el-option>
                  <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-button-group>
                  <el-button type="primary" icon="search" @click="queryFn">查询</el-button>
              </el-button-group>
          </el-form-item>
      </el-form>
      <div class="tool-bar-opera">
          <el-tooltip class="item" effect="dark" content="新增用户信息" placement="top">
              <i @click="insertFn" class="icon iconfont icon-add"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改用户信息" placement="top">
              <i @click="modifyFn" class="icon iconfont icon-bianji"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除用户信息" placement="top">
              <i @click="deleteFn" class="icon iconfont icon-lajixiang"></i>
          </el-tooltip>
      </div>
      <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%;"
            ref="data-table"
            max-height="500">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column fixed label="序号" type="index" show-overflow-tooltip width="50">
            </el-table-column>
            <el-table-column
                label="用户名"
                prop="name"
                fixed>
            </el-table-column>
            <el-table-column
                label="Email"
                prop="email"
                fixed>
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.state == 1 ? '正常' : '禁用'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                with="300"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background :page-size="query.limit" @current-change="handleCurrentChange" :page-sizes="[10, 15, 20, 30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog
            :title="formName"
            :visible.sync="formVisible"
            :before-close="hideForm"
            width="55%"
            top="5vh">
            <el-form :model="formData" :rules="formRules" ref="dataForm">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="formData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" v-if="formType == 'add'">
                    <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword" v-if="formType == 'add'">
                    <el-input type="password" v-model="formData.checkPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Emali" prop="email">
                    <el-input v-model="formData.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="formData.state">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideForm">取消</el-button>
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { queryUserList, insertUserInfo, modifyUserInfo, deleteUserInfo, queryRoleAll } from '@/api/sys'
export default {
  name: 'sysUser',
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      query: {
        name: '',
        status: '',
        page: 1,
        limit: 20,
        role_id: ''
      },
      roles: [],
      list: [],
      total: 0,
      loading: false,

      formLoading: false,
      formVisible: false,
      formRules: {},
      addRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      editRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      formData: {},
      formType: 'add'
    }
  },
  computed: {
    formName: function () {
      return this.formType === 'add' ? '新增' : '修改'
    }
  },
  methods: {
    queryFn () {
      this.loading = true
      queryUserList(this.query).then(response => {
        this.loading = false
        this.list = response.data.data.rows || []
        this.total = response.data.data.count || 0
      }).catch(() => {
        this.loading = false
        this.list = []
        this.total = 0
      })
    },
    queryRole () {
      queryRoleAll().then(response => {
        this.roles = response.data.data
      })
    },
    insertFn () {
      this.formType = 'add'
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.formVisible = true
      this.formData = {
        state: 1
      }
      this.formRules = this.addRules
    },
    modifyFn () {
      var selectedRow = this.$refs['data-table'].selection
      if (selectedRow.length === 1) {
        this.formRules = this.editRules
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate()
        }
        this.formType = 'modify'
        this.formVisible = true
        this.formData = selectedRow[0]
      } else {
        this.$message({
          message: '请选择一条需要编辑的数据！',
          type: 'warning'
        })
      }
    },
    deleteFn () {
      var selectedRow = this.$refs['data-table'].selection
      if (selectedRow.length > 0) {
        this.$confirm('是否确定删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          selectedRow.map((value, index, array) => {
            ids.push(value.id)
          })
          deleteUserInfo(ids).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.queryFn()
          })
        })
      } else {
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        })
      }
    },
    formSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.formType === 'add') {
            insertUserInfo(this.formData).then(res => {
              this.$message({
                message: '用户新增成功',
                type: 'success'
              })
              this.hideForm()
              this.queryFn()
            })
          } else if (this.formType === 'modify') {
            modifyUserInfo(this.formData).then(res => {
              this.$message({
                message: '用户修改成功',
                type: 'success'
              })
              this.hideForm()
              this.queryFn()
            })
          }
        }
      })
    },
    hideForm () {
      this.formVisible = !this.formVisible
      return true
    },
    handleCurrentChange () {

    }
  },
  created () {
    this.queryFn()
    this.queryRole()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
    .tool-bar-opera{
        padding: 0 5px  5px  5px;
        i{
            font-size: 26px;
            color: #409EFF;
            cursor: pointer;
        }
    }

</style>
