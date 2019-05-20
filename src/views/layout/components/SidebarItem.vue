<template>
    <div>
        <router-link v-if="item.leaf" :key="item.href" :to="'/'+item.href" class="link-menu">
            <el-menu-item :index='item.href'>
                <div :class="item.class"></div>
                <span slot="title">{{item.text}}</span>
            </el-menu-item>
        </router-link>
        <el-submenu :index='item.href' :key="item.href" v-if="!item.leaf">
            <template slot="title">
                <i :class="item.icon"></i>
                <span v-show="isShowTitle" >{{item.text}}</span>
            </template>
            <template v-for="childItem in item.children">
                <router-link v-if="childItem.leaf" :key="childItem.href" :to="childItem.href" class="link-menu">
                    <el-menu-item :index="childItem.href" >{{childItem.text}}</el-menu-item>
                </router-link>
            </template>
        </el-submenu>
    </div>
</template>
<script>
export default {
  name: 'SidebarItem',
  computed: {
    isShowTitle () {
      return this.$store.state.sideBarOpen
    }
  },
  props: {
    item: {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .link-menu{
        text-decoration: none;
    }
    .link-menu>li{
        height: 100px;
        line-height: 100px;
        color: #fff;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        >div.icon1{
            background: url('../../../assets/icon1_1.png') no-repeat
        }
        >div.icon2{
            background: url('../../../assets/icon2_1.png') no-repeat
        }
        >div.icon3{
            background: url('../../../assets/icon3_1.png') no-repeat
        }
        >div.icon4{
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
            background: url('../../../assets/icon4_1.png') no-repeat center center / 100%
        }

    }
    .link-menu>li:hover{
        background-color: #61DAA5;
    }
    .link-menu>li:focus{
        background-color: #333;
    }
    .link-menu.router-link-active>li{
        background-color: #61DAA5;
        color: #333;
        >div.icon1{
            background: url('../../../assets/icon1_0.png') no-repeat
        }
        >div.icon2{
            background: url('../../../assets/icon2_0.png') no-repeat
        }
        >div.icon3{
            background: url('../../../assets/icon3_0.png') no-repeat
        }
        >div.icon4{
            background: url('../../../assets/icon4_0.png') no-repeat center center / 100%
        }
    }
    .link-menu>li>div{
        width: 40px;
        height: 40px;
        font-size: 36px;
        margin: 0 auto;
    }
    .link-menu>li>span{
        text-align: center;
        line-height: 1.5;
    }
</style>
