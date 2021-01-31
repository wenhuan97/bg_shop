import request from '@/utils/request'

// 获取商品分类
export const getGoodsCate = params => {
  return request({
    method: 'GET',
    url: '/categories',
    params
  })
}
// 添加分类
export const addGoodsCate = data => {
  return request({
    method: 'POST',
    url: '/categories',
    data
  })
}
// 根据 id 查询分类
export const searchGoodsCate = id => {
  return request({
    method: 'GET',
    url: `/categories/${id}`
  })
}
//  编辑提交分类
export const editGoodsCate = (id, name) => {
  return request({
    method: 'PUT',
    url: `/categories/${id}`,
    data: {
      cat_name: name
    }
  })
}
//  删除分类
export const deleteGoodsCate = id => {
  return request({
    method: 'DELETE',
    url: `/categories/${id}`
  })
}
//  获取商品列表
export const getGoodsList = params => {
  return request({
    method: 'GET',
    url: '/goods',
    params
  })
}
// 添加商品
export const addGoods = data => {
  return request({
    method: 'POST',
    url: '/goods',
    data
  })
}
// 根据id查询商品
export const searchGoods = id => {
  return request({
    method: 'GET',
    url: `goods/${id}`
  })
}
// 提交编辑商品
export const editGoods = (id, data) => {
  return request({
    method: 'PUT',
    url: `/goods/${id}`,
    data
  })
}
//  删除商品
export const deleteGoods = id => {
  return request({
    method: 'DELETE',
    url: `goods/${id}`
  })
}
