import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Loading,
  Message,
  Row,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Row)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Loading)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
