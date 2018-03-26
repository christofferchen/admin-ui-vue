import api from './api'
import auth from './auth'
import formatters from './formatters'
import enums from './enums'
// import appConfigData from '../resources/appConfigData.json'
// appConfigData.apiUrl = process.env.apiUrl
export default {
  install: function (Vue, options) {
    api.setVue(Vue)
    Vue.prototype.$api = api
    Vue.prototype.$auth = auth
    Vue.prototype.$enum = enums
    Vue.prototype.$formatters = formatters
    Vue.prototype.$enums = enums.enums
    Vue.prototype.$appConfig = process.env.appConfig
    // restClient.router = Vue.$router
  },
  appConfig: process.env.appConfig,
  auth
}
