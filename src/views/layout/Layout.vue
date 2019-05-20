<template>
    <div class="layout-wrapper">
        <el-container style="height:100%;">
          <!-- <el-header class="padder-no">
            <navbar/>
          </el-header> -->
          <el-container style="height:100%;">
            <el-aside :width="asideWidth" :style="{backgroundColor: '#333',transition: '.5s'}">
              <sidebar/>
            </el-aside>
            <el-container style="height:100%;border-top: 1px solid #d8dce5;">
              <el-main class="padder-no flex-main-wrapper" style="overflow: hidden;height:100%;">
                <!-- <tagbar/> -->
                <app-container style="overflow: hidden;padding: 20px;height:100%;"/>
              </el-main>
              <!-- <el-footer class="padder-no" style="height:50px;">
                <footerbar/>
              </el-footer> -->
            </el-container>
          </el-container>
        </el-container>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Sidebar, AppContainer } from './components'
export default {
  name: 'Layout',
  components: {
    // Navbar,
    Sidebar,

    AppContainer
  },
  computed: {
    asideWidth () {
      return this.$store.state.sideBarOpen ? '150px' : '70px'
    }
  },
  mounted: function () {
    // this.queryMenuFun()
  },
  methods: {
    ...mapActions([
      // 'queryMenuFun'
    ])
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .layout-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: #f5f7f9;
  }
  .padder-no{
    padding: 0;
  }
  .flex-main-wrapper{
    display: flex;
    flex-direction: column;
    padding-bottom: 0px;
  }
</style>
