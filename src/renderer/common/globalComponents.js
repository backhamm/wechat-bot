import Vue from 'vue'
import vHeader from './VHeader'
import Breathing from './Breathing'
import { Button, Input, Select, Option, Progress, Dropdown, DropdownMenu, DropdownItem, Dialog, InputNumber, Checkbox, Message, Loading } from 'element-ui'

const elList = [Button, Input, Select, Option, Progress, Dropdown, DropdownMenu, DropdownItem, Dialog, InputNumber, Checkbox]

const componentList = [vHeader, Breathing, ...elList]

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
