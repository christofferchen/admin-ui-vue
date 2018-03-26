// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import controls from './components/controls'
import common from './common'
import filters from './common/filters'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/scss/font-awesome.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(controls)
Vue.use(common)
Vue.use(filters)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
