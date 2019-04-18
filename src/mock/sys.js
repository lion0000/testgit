const userArray = {
  total: 4,
  list: [
    {
      id: 1,
      name: 'admin',
      email: '1587912668@qq.com',
      state: 1,
      createTime: '2018-11-21'
    }, {
      id: 2,
      name: 'test',
      tel: '120',
      email: '913932075@qq.com',
      state: 1,
      createTime: '2018-11-22'
    }, {
      id: 3,
      name: 'user',
      tel: '110',
      email: '913932075@qq.com',
      state: 1,
      createTime: '2018-11-22'
    }, {
      id: 4,
      name: 'user_copy',
      tel: '110',
      email: '913932075@qq.com',
      state: 1,
      createTime: '2018-11-22'
    }
  ]
}

const roleArray = {
  total: 3,
  list: [{
    id: 1,
    name: '管理员',
    state: 1,
    desc: '系统管理员',
    createTime: '2018-11-22'
  }, {
    id: 2,
    name: '测试账户',
    state: 1,
    desc: '系统测试角色',
    createTime: '2018-11-22'
  }, {
    id: 3,
    name: '普通用户',
    state: 1,
    desc: '普通操作人员角色',
    createTime: '2018-11-22'
  }]
}

const allUserArray = userArray.list

export default { userArray, roleArray, allUserArray }
