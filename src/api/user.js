import request from '@/utils/request'

// 登录
export const userLogin = (data) => {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}
// 获取用户数据列表
export const getUserList = params => {
  return request({
    method: 'GET',
    url: '/users',
    params
  })
}
// 切换用户状态
export const editUserStatus = (uId, type) => {
  return request({
    method: 'PUT',
    url: `users/${uId}/state/${type}`
  })
}
// 添加用户
export const addUser = data => {
  return request({
    method: 'POST',
    url: '/users',
    data
  })
}
// 根据id查询用户
export const getUser = id => {
  return request({
    method: 'GET',
    url: `/users/${id}`
  })
}
// 编辑用户提交
export const editUserSubmit = (id, data) => {
  return request({
    method: 'PUT',
    url: `/users/${id}`,
    data
  })
}
// 删除用户
export const deleteUser = id => {
  return request({
    method: 'DELETE',
    url: `/users/${id}`
  })
}
// 分配用户角色
export const allotUser = id => {
  return request({
    method: 'PUT',
    url: `/users/${id}/role`
  })
}
