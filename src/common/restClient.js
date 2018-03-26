import axios from 'axios'

let _Vue
let restClient = axios.create({
  baseURL: process.env.appConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})
restClient.interceptors.request.use(
  config => {
    // todo: put token in header
    let token = sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

restClient.interceptors.response.use(
  response => {
    let msg = response.data
    if (msg.new_token) {
      sessionStorage.setItem('token', msg.new_token)
    }

    if (msg.code === 'ok') {
      return msg.data
    } else if (msg.code.match(/^token./)) {
      let page = location.hash.replace('#', '')
      location.hash = '/login?lastPage=' + page
    } else {
      _Vue.prototype.$message({ message: msg.message, type: 'error' })
      return Promise.reject(msg.message)
    }
  },
  error => {
    return Promise.reject(error)
  }
)
export default {
  client: restClient,
  setVue (Vue) {
    _Vue = Vue
  }
}
