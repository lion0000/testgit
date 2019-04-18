import Mock from 'mockjs'
import login from './login'
import menu from './menu'
import sys from './sys'

/** 登录模拟数据 **/
Mock.mock('/user/login', 'post', login.login)
/** 登出模拟数据 **/
Mock.mock('/api/auth/logout', 'post', login.out)

/** 获取用户模拟数据 **/
Mock.mock('/api/auth/info', 'get', login.userInfo)

/** 获取菜单模拟数据 **/
Mock.mock('http://127.0.0.1:7001/api/menu/menuList', 'get', menu.menuArray)

/** 获取权限模拟数据 **/
Mock.mock('/api/menu/powerList', 'get', menu.powerArray)

/** 获取用户列表模拟数据 **/
Mock.mock('/api/user/queryFn', 'post', function (options) {
  const params = JSON.parse(options.body)
  if (params.name) {
    let queryData = []
    sys.userArray.list.map(function (row) {
      if (row.name.indexOf(params.name) >= 0) {
        queryData.push(row)
      }
    })
    return { total: queryData.length, list: queryData }
  }
  return sys.userArray
})

/** 获取角色列表模拟数据 **/
Mock.mock('/api/role/queryFn', 'post', function (options) {
  const params = JSON.parse(options.body)
  if (params.name) {
    let queryData = []
    sys.roleArray.list.map(function (row) {
      if (row.name.indexOf(params.name) >= 0) {
        queryData.push(row)
      }
    })
    return { total: queryData.length, list: queryData }
  }
  return sys.roleArray
})
/** 新增用户模拟数据 **/
Mock.mock('/api/user/insertInfo', 'post', login.out)
/** 修改用户模拟数据 **/
Mock.mock('/api/user/modifyInfo', 'post', login.out)
/** 删除用户模拟数据 **/
Mock.mock('/api/user/deleteInfo', 'post', login.out)
/** 查询所有用户模拟数据 **/
Mock.mock('/api/user/queryUserArray', 'get', sys.allUserArray)
/** 查询当前角色所拥有的用户id集合模拟数据 **/
Mock.mock('/api/user/queryRoleUserArray', 'post', function (options) {
  const params = JSON.parse(options.body)
  if (params.id === 1) {
    return [1, 2, 3]
  } else if (params.id === 2) {
    return [2, 3]
  } else {
    return [4]
  }
})

/** 新增角色模拟数据 **/
Mock.mock('/api/role/insertInfo', 'post', login.out)
/** 修改角色模拟数据 **/
Mock.mock('/api/role/modifyInfo', 'post', login.out)
/** 删除角色模拟数据 **/
Mock.mock('/api/role/deleteInfo', 'post', login.out)
/** 修改角色关联的用户模拟数据 **/
Mock.mock('/api/role/modifyRoleUser', 'post', login.out)

/** 删除菜单模拟数据 **/
Mock.mock('/api/menu/deleteInfo', 'post', login.out)
/** 新增菜单模拟数据 **/
Mock.mock('/api/menu/insertInfo', 'post', login.out)
/** 修改菜单模拟数据 **/
Mock.mock('/api/menu/modifyInfo', 'post', login.out)
/** 角色已拥有菜单模拟数据 **/
Mock.mock('/api/role/queryRoleMenuArray', 'post', function (options) {
  const params = JSON.parse(options.body)
  if (params.id === 1) {
    return [1, 2, 21, 22, 23, 211, 212, 213, 221, 222, 223, 231, 232, 233]
  } else if (params.id === 2) {
    return [1, 2, 21, 211, 212, 213]
  } else {
    return [1, 2, 23, 231, 232, 233]
  }
})
/** 修改角色已拥有菜单模拟数据 **/
Mock.mock('/api/role/modifyRoleMenu', 'post', login.out)
export default Mock
