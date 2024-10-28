import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
import './uni.promisify.adaptor'
import Api from './api/index.js'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$Api = Api
import uView from '@/uni_modules/uview-ui'
import EmptyHold from '@/components/EmptyHold.vue'
import CusNavBar from '@/components/NavBar.vue'
import Loading from '@/components/Loading.vue'

Vue.use(uView)
Vue.component('empty-hold', EmptyHold)
Vue.component('cus-nav-bar', CusNavBar)
Vue.component('cus-loading', Loading)
const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif