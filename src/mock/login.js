const login = {
  data: {
    id: 1,
    token:
            'eyJpZHNzIjoiJDJ5JDEwJGNmMVpVb3BxM2lEUUk0bllVZXkxenUzajM0QVJlYmEuS3B4aDZ1MkNkY1J4clF6SE10MTRLIn0=_2018-04-27'
  }
}

const userInfo = {
  data: {
    status: '1',
    id: 1,
    username: 'admin',
    avatar: '',
    authRules: ['admin']
  }
}

const out = { code: 0, message: 'success' }

const password = { code: 0, message: 'success' }

export default {
  login,
  userInfo,
  out,
  password
}
