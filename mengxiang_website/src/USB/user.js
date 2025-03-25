import request from '@/utils/request'

// 注册
export const userRegisterService = ({ username, password }) => {
  // 使用 URLSearchParams 来构建 x-www-form-urlencoded 格式的数据
  const params = new URLSearchParams({
    username,
    password,
  })

  return request.post(
    '/api/reguser', // 确保这是你想要请求的 API 路径
    params, // 将 params 作为请求体发送
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 确保请求头正确设置
      },
    },
  )
}

// 登录

export const userLoginService = ({ username, password }) => {
  // 使用 URLSearchParams 来构建 x-www-form-urlencoded 格式的数据
  const params = new URLSearchParams({
    username,
    password,
  })

  return request.post(
    '/api/login', // 确保这是你想要请求的 API 路径
    params, // 将 params 作为请求体发送
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 确保请求头正确设置
      },
    },
  )
}

// 获取用户信息
export const userGetInfoService = () =>
  request.get('/my/userinfo', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // 确保请求头正确设置
    },
  })

// 更改用户信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  // 使用 URLSearchParams 来构建 x-www-form-urlencoded 格式的数据
  const params = new URLSearchParams({
    id,
    nickname,
    email,
  })

  return request.post(
    'my/userinfo', // 确保这是你想要请求的 API 路径
    params, // 将 params 作为请求体发送
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 确保请求头正确设置
      },
    },
  )
}

// 重置密码
export const userUpdatePassService = ({ oldPwd, newPwd }) => {
  // 使用 URLSearchParams 来构建 x-www-form-urlencoded 格式的数据
  const params = new URLSearchParams({
    oldPwd,
    newPwd,
  })

  return request.post(
    'my/updatepwd', // 确保这是你想要请求的 API 路径
    params, // 将 params 作为请求体发送
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 确保请求头正确设置
      },
    },
  )
}

// 更换头像
export const userUploadAvatarService = (avatar) => {
  // 使用 URLSearchParams 构建请求体
  const params = new URLSearchParams({
    avatar: avatar,
  })

  // 发送 POST 请求
  return request.post('my/update/avatar', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // 确保请求头正确设置
    },
  })
}
