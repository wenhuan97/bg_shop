import request from '@/utils/request'

// 获取参数列表
export const getparamsList = (id, sel) => {
  return request({
    method: 'GET',
    url: `/categories/${id}/attributes`,
    params: sel
  })
}
// 添加动态参数或者静态属性
export const addParams = (id, data) => {
  return request({
    method: 'POST',
    url: `/categories/${id}/attributes`,
    data
  })
}
// 根据 ID 查询参数
export const searchParams = (id, aId, sel) => {
  return request({
    method: 'GET',
    url: `/categories/${id}/attributes/${aId}`,
    params: {
      attr_sel: sel
    }
  })
}
// 编辑提交参数
export const editParams = (id, aId, data) => {
  return request({
    method: 'PUT',
    url: `/categories/${id}/attributes/${aId}`,
    data
  })
}
//  删除参数
export const deleteParams = (id, aId) => {
  return request({
    method: 'DELETE',
    url: `/categories/${id}/attributes/${aId}`
  })
}
