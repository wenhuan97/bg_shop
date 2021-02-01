import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/index'
import './style/index.less'
// 导入字体图标
import './assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'
import './utils/dayjs'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false
Vue.component('tree-table', treeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
