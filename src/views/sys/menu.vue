<template>
    <div style="width:100%;height:100%;" ref="maxContainer">
        <div class="tool-bar-opera">
          <el-tooltip class="item" effect="dark" content="新增" placement="top">
              <i @click="insertFn" class="icon iconfont icon-add"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <i @click="deleteFn" class="icon iconfont icon-lajixiang"></i>
          </el-tooltip>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-tree ref="menu-tree" default-expand-all :expand-on-click-node="false" highlight-current :data="menuArray" :props="menuProp" @node-click="handleNodeClick"></el-tree>
          </el-col>
          <el-col :span="12">
            <el-form ref="menuFromDom" :rules="formRules" :model="menuFrom" label-width="80px">
              <el-form-item label="父节点">
                <el-input v-model="parentName" :readonly="true"></el-input>
                <el-input v-show="false" v-model="menuFrom.parentid"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="menuFrom.name"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                  <el-select v-model="menuFrom.type" placeholder="类型" >
                    <el-option label="菜单" :value="2"></el-option>
                    <el-option label="功能" :value="1"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="地址" prop="url">
                <el-input v-model="menuFrom.url" placeholder="地址"></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <el-input v-model="menuFrom.icon" placeholder="图标"></el-input>
              </el-form-item>
              <el-form-item label="html" prop="html">
                <el-input type="textarea" v-model="menuFrom.html" placeholder="html"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="menuFrom.desc" placeholder="描述"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :style="{minWidth: '120px'}" :disabled="menuFrom.parentid===undefined" @click="submitFromFn">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import { queryPowerFn, deleteMenuInfo, insertMenuInfo, modifyMenuInfo } from '@/api/menu'
export default {
  name: 'sysPower',
  data () {
    return {
      parentName: '',
      menuArray: [],
      menuProp: {
        children: 'children',
        label: 'name'
      },
      formType: 'add',
      formRules: {
        name: [
          { required: true, message: '请填写菜单名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ]
      },
      menuFrom: {}
    }
  },
  methods: {
    handleNodeClick (data, node, tree) {
      this.formType = 'modify'
      this.parentName = node.parent.data.name
      this.menuFrom = data
    },
    queryPower () {
      queryPowerFn().then(response => {
        this.menuArray = response.data.data
      })
    },
    submitFromFn () {
      this.$refs['menuFromDom'].validate(valid => {
        if (valid) {
          if (this.formType === 'add') {
            insertMenuInfo(this.menuFrom).then(res => {
              this.$message({
                message: '菜单新增成功',
                type: 'success'
              })
              this.queryPower()
              const parentid = this.menuFrom.parentid
              this.menuFrom = { parentid }
            })
          } else if (this.formType === 'modify') {
            modifyMenuInfo(this.menuFrom).then(res => {
              this.$message({
                message: '菜单修改成功',
                type: 'success'
              })
              this.queryPower()
              const parentid = this.menuFrom.parentid
              this.menuFrom = { parentid }
            })
          }
        }
      })
    },
    insertFn () {
      this.formType = 'add'
      const node = this.$refs['menu-tree'].getCurrentNode()
      this.menuFrom = {
        parentid: node.id
      }
      this.parentName = node.name
    },
    deleteFn () {
      const node = this.$refs['menu-tree'].getCurrentNode()
      if (node === null) {
        this.$message({
          message: '请选择需要删除的菜单！',
          type: 'warning'
        })
      } else if (node.id === 'root') {
        this.$message({
          message: '菜单根节点不能删除！',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确定删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenuInfo(node.id).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          })
        })
      }
    }
  },
  created () {
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
