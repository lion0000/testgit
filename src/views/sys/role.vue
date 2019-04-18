<template>
    <div style="width:100%;height:100%;" ref="maxContainer">
        <el-form :inline="true" :model="query" class="query-form" size="mini">
          <el-form-item class="query-form-item">
              <el-input v-model="query.name" placeholder="角色"></el-input>
          </el-form-item>
          <el-form-item class="query-form-item">
              <el-select v-model="query.status" placeholder="状态">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="禁用" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-button-group>
                  <el-button type="primary" icon="search" @click="queryFn">查询</el-button>
              </el-button-group>
          </el-form-item>
        </el-form>
        <div class="tool-bar-opera">
          <el-tooltip class="item" effect="dark" content="新增角色" placement="top">
              <i @click="insertFn" class="icon iconfont icon-add"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改角色" placement="top">
              <i @click="modifyFn" class="icon iconfont icon-bianji"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
              <i @click="deleteFn" class="icon iconfont icon-lajixiang"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色人员设置" placement="top">
              <i @click="setUserFn" class="icon iconfont icon-drxx08"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色菜单设置" placement="top">
              <i @click="setMenuFn" class="icon iconfont icon-jiaoseguanli"></i>
          </el-tooltip>
        </div>
        <el-table
            v-loading="loading"
            :data="list"
            ref="data-table"
            style="width: 100%;"
            max-height="500">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column fixed label="序号" type="index" show-overflow-tooltip width="50">
            </el-table-column>
            <el-table-column
                label="角色名称"
                prop="name"
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
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="描述"
                prop="desc"
                fixed>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="formData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="formData.state">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" rows="4" v-model="formData.desc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideForm">取消</el-button>
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="设置角色用户"
            :visible.sync="roleUserDialogVisible"
            width="600px"
            top="5vh">
            <el-transfer
              filterable
              :props="{
                key: 'id',
                label: 'name'
              }"
              :titles="['未拥有用户', '已拥有用户']"
              v-model="roleUserArray"
              :data="unRoleUserArray">
            </el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideUserDialog">取消</el-button>
                <el-button type="primary" @click.native="submitUserForm()">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="设置角色菜单"
            :visible.sync="roleMenuDialogVisible"
            width="600px"
            top="5vh">
            <el-tree
                ref="menu-tree"
                show-checkbox
                default-expand-all
                highlight-current
                :data="menuArray"
                node-key="id"
                :check-strictly="true"
                :props="{
                  children: 'children',
                  label: 'name'}" >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideMenuDialog">取消</el-button>
                <el-button type="primary" @click.native="submitMenuForm()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { queryRoleList, insertRoleInfo, modifyRoleInfo, deleteRoleInfo, queryAllUser, queryRoleUser, modifyRoleUser, queryRoleMenu, modifyRoleMenu } from '@/api/sys'
import { queryPowerFn } from '@/api/menu'
export default {
  name: 'sysRole',
  data () {
    return {
      query: {
        name: '',
        status: '',
        page: 1,
        limit: 20
      },
      roles: [],
      list: [],
      total: 0,
      loading: false,
      roleUserArray: [],
      unRoleUserArray: [],
      roleUserDialogVisible: false,
      roleMenuDialogVisible: false,
      menuArray: [],
      formRules: {
        name: [
          { required: true, message: '角色名称', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      formLoading: false,
      formVisible: false,
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
      queryRoleList(this.query).then(response => {
        this.loading = false
        this.list = response.data.data.rows || []
        this.total = response.data.data.count || 0
      }).catch(() => {
        this.loading = false
        this.list = []
        this.total = 0
      })
    },
    queryUser () {
      queryAllUser().then(response => {
        this.unRoleUserArray = response.data.data
      })
    },
    queryPower () {
      queryPowerFn().then(response => {
        this.menuArray = response.data.data
      })
    },
    insertFn () {
      this.formType = 'add'
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.formData = {
        state: 1
      }
      this.formVisible = true
    },
    modifyFn () {
      var selectedRow = this.$refs['data-table'].selection
      if (selectedRow.length === 1) {
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
          deleteRoleInfo(ids).then(res => {
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
            insertRoleInfo(this.formData).then(res => {
              this.$message({
                message: '角色新增成功',
                type: 'success'
              })
              this.hideForm()
              this.queryFn()
            })
          } else if (this.formType === 'modify') {
            modifyRoleInfo(this.formData).then(res => {
              this.$message({
                message: '角色修改成功',
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
    setUserFn () {
      var selectedRow = this.$refs['data-table'].selection
      if (selectedRow.length === 1) {
        queryRoleUser(selectedRow[0].id).then(response => {
          this.roleUserArray = []
          response.data.data.map(function (value) {
            this.roleUserArray.push(value.userid)
          }.bind(this))
        })
        this.roleUserDialogVisible = !this.roleUserDialogVisible
      } else {
        this.$message({
          message: '请选择一个需要设置的角色数据！',
          type: 'warning'
        })
      }
    },
    hideUserDialog () {
      this.roleUserDialogVisible = !this.roleUserDialogVisible
    },
    submitUserForm () {
      const selectedRow = this.$refs['data-table'].selection
      const roleid = selectedRow[0].id
      modifyRoleUser({ ids: this.roleUserArray, roleid }).then(res => {
        this.$message({
          message: '角色用户修改成功！',
          type: 'success'
        })
        this.hideUserDialog()
      })
    },
    setMenuFn () {
      var selectedRow = this.$refs['data-table'].selection
      if (selectedRow.length === 1) {
        if (this.$refs['menu-tree']) {
          this.$refs['menu-tree'].setCheckedKeys([])
        }
        queryRoleMenu(selectedRow[0].id).then(response => {
          let menuIds = []
          response.data.data.map(function (value) {
            menuIds.push(value.powerid)
          })
          this.$refs['menu-tree'].setCheckedKeys(menuIds)
        })
        this.roleMenuDialogVisible = !this.roleMenuDialogVisible
      } else {
        this.$message({
          message: '请选择一个需要设置的角色数据！',
          type: 'warning'
        })
      }
    },
    hideMenuDialog () {
      this.roleMenuDialogVisible = !this.roleMenuDialogVisible
    },
    submitMenuForm () {
      const selectedRow = this.$refs['data-table'].selection
      const roleid = selectedRow[0].id
      const roleMenuArray = this.$refs['menu-tree'].getCheckedKeys()
      modifyRoleMenu({ ids: roleMenuArray, roleid }).then(res => {
        this.$message({
          message: '角色菜单修改成功！',
          type: 'success'
        })
        this.hideMenuDialog()
      })
    },
    handleCurrentChange () {

    }
  },
  created () {
    this.queryFn()
    this.queryUser()
    this.queryPower()
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
