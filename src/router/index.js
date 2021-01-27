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
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: '',
    component: () => import('@/views/layout')
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
