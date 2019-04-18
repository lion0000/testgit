import Layout from '@/views/layout/Layout.vue'

export default [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: 'impowerSurvey',
    children: [
      // {
      //   path: 'dashboard',
      //   component: () => import('@/views/dashboard/Dashboard'),
      //   name: 'Dashboard',
      //   meta: { title: '首页', icon: 'dashboard', noCache: true }
      // },
      {
        // path: 'empty',
        // component: () => import('@/views/empty/Empty'),
        // name: 'empty',
        // meta: { title: '空白页', icon: 'empty' }
        path: 'impowerSurvey',
        component: () => import('@/views/impowerSurvey/ImpowerSurvey.vue'),
        name: 'ImpowerSurvey',
        meta: { title: '授权概览', icon: 'dashboard', noCache: false }
      },
      {
        path: 'facilityImpower',
        component: () => import('@/views/facilityImpower/FacilityImpower.vue'),
        name: 'FacilityImpower',
        meta: { title: '设备授权', icon: 'dashboard', noCache: false }
      },
      {
        path: 'testFacility',
        component: () => import('@/views/testFacility/TestFacility.vue'),
        name: 'TestFacility',
        meta: { title: '测试设备', icon: 'dashboard', noCache: false }
      }
    ]
  }
  // {
  //   path: '/sys',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/sys/user'),
  //       name: 'sysUser',
  //       meta: { title: '用户管理', icon: 'dashboard', noCache: false }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/sys/role'),
  //       name: 'sysRole',
  //       meta: { title: '角色管理', icon: 'dashboard', noCache: false }
  //     },
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/sys/menu'),
  //       name: 'sysMenu',
  //       meta: { title: '菜单管理', icon: 'dashboard', noCache: false }
  //     }
  //   ]
  // }
]
