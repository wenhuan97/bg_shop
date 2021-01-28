// 角色模块
import request from '@/utils/request'

// 获取角色列表
export const getRolesList = () => {
  return request({
    method: 'GET',
    url: '/roles'
  })
}
// 添加角色的权限
export const addRoleRights = (roleId, rids) => {
  return request({
    method: 'POST',
    url: `roles/${roleId}/rights`,
    data: {
      rids
    }
  })
}
// 删除角色指定权限
export const deleteRoleRights = (roleId, rightId) => {
  return request({
    method: 'DELETE',
    url: `/roles/${roleId}/rights/${rightId}`
  })
}
// 添加角色
export const addRole = data => {
  return request({
    method: 'POST',
    url: '/roles',
    data
  })
}
//  根据 ID 查询角色
export const searchRole = id => {
  return request({
    method: 'GET',
    url: `roles/${id}`
  })
}
// 提交编辑角色
export const editRole = (id, data) => {
  return request({
    method: 'PUT',
    url: `/roles/${id}`,
    data
  })
}
// 删除指定角色
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/roles/${id}`
  })
}
