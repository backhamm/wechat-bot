import Vue from 'vue'
import VHeader from './VHeader'
import Breathing from './Breathing'
import { Button, Input, Select, Option, Progress, Dropdown, DropdownMenu, DropdownItem, Dialog, InputNumber, Checkbox, Message, Loading, MessageBox } from 'element-ui'

export const MyLoading = Loading

const elList = [Button, Input, Select, Option, Progress, Dropdown, DropdownMenu, DropdownItem, Dialog, InputNumber, Checkbox]

const componentList = [VHeader, Breathing, ...elList]

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Loading.directive)
Vue.use({
  install(Vue) {
    componentList.forEach(item => {
      Vue.component(item.name, item)
    })
  }
})
