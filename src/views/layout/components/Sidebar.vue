<template>
  <el-menu
    :default-active="onRoutes"
    :collapse="isCollapse"
    class="menu"
    active-text-color="#333">
    <div class="page_logo"></div>
    <sidebar-item v-for='item in menuArray' :key="item.text" :item='item' ></sidebar-item>
  </el-menu>
</template>
<script>
import SidebarItem from './SidebarItem.vue'
export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  computed: {
    isCollapse () {
      return !this.$store.state.sideBarOpen
    },
    menuArray () {
      return this.$store.state.menu.menuList
    },
    onRoutes () {
      return this.$route.path
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .side-wrapper{
    background-color: #545c64;
    height: 100%;
  }
  .el-menu{
    border-right: 0px;
  }
  .menu {
    width: 100% !important;
    background: #333;
  }
  .menu a{
    text-decoration: none;
  }
  .page_logo{
    height: 100px;
    background: url('../../../assets/logo.png') no-repeat center;
  }
</style>
