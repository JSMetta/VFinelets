import Vue from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownMenu from './DropdownMenu.vue'
import IconButton from './IconButton.vue'
import HoverableIconButton from './HoverableIconButton.vue'
import ValidateError from './ValidateError.vue'
import Tabpage from './Tabpage.vue'
import Octicon from 'vue-octicon/components/Octicon.vue'
import 'vue-octicon/icons'
import VueMaterialIcon from 'vue-material-icon'
import Modal from './Modal.vue'
import FormInput from './form/Input.vue'
import FormTextArea from './form/TextArea.vue'
import { BIcon, BIconArrowUp, BIconArrowDown } from 'bootstrap-vue'

Vue.component('BIcon', BIcon)
Vue.component('BIconArrowUp', BIconArrowUp)
Vue.component('BIconArrowDown', BIconArrowDown)
Vue.component('Octicon', Octicon)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('IconButton', IconButton)
Vue.component('HoverableIconButton', HoverableIconButton)
Vue.component('ValidateError', ValidateError)
Vue.component('Tabpage', Tabpage)
Vue.component('Modal', Modal)
Vue.component('FormInput', FormInput)
Vue.component('FormTextArea', FormTextArea)
Vue.component(VueMaterialIcon.name, VueMaterialIcon)
