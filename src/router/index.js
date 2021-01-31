import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/')
  },
  {
    path: '/home',
    name: '',
    redirect: '/welcome',
    component: () => import('@/views/layout/'),
    children: [

      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/welcome/')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('@/views/roles/')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('@/views/rights/')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('@/views/goods/')
      },
      {
        path: '/goods/add',
        name: 'goodsAdd',
        component: () => import('@/views/goods-add/')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('@/views/params/')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/categories/')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/orders/')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('@/views/reports/')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //   如果访问登录页 直接放行
  if (to.path === '/login') return next()
  const userToken = window.sessionStorage.getItem('token')
  if (!userToken) return next('/login')
  next()
})

export default router
