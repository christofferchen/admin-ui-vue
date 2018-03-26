import restClient from './restClient'

let client = restClient.client
let api = {
  setVue(Vue) {
    restClient.setVue(Vue)
  },
  MessageRemind: {
    getUnreadList: params => client.post(`/MessageRemind/GetUnreadList`, params),
    readMessage: params => client.post(`/MessageRemind/ReadMessage`, params),
    getList: params => client.post(`/MessageRemind/GetList`, params)
  },
  membership: {
    login: params => client.post(`/membership/login`, params),
    logout: params => client.post(`/membership/logout`, params),
    getMenu: params => client.get(`/membership/getMenu`, params)
  },
  roles: {
    query: params => client.post('/roles/query', params),
    getById: params => client.post('/roles/getById', params),
    add: params => client.post('/roles/add', params),
    modify: params => client.post('/roles/modify', params),
    remove: params => client.post('/roles/remove', params),
    setRoleFunctions: params => client.post('/roles/SetRoleFunctions', params)
  },
  users: {
    query: params => client.post(`/users/query`, params),
    getById: params => client.post(`/users/getById`, params),
    frozen: params => client.post(`/users/frozen`, params),
    modify: params => client.post(`/users/modify`, params),
    modifyPwd: params => client.post(`/users/modifyPwd`, params),
    add: params => client.post(`/users/add`, params),
    remove: params => client.post(`/users/remove`, params),
    unfrozen: params => client.post(`/users/unfrozen`, params),
    unLock: params => client.post(`/users/unLock`, params),
    resetPWD: params => client.post(`/users/resetPWD`, params)
  },
  functions: {
    getTree: params => client.post(`/functions/getTree`, null),
    getRoleTree: params => client.post(`/functions/getRoleTree`, params),
    getById: params => client.post(`/functions/getById`, params),
    add: params => client.post(`/functions/add`, params),
    modify: params => client.post(`/functions/modify`, params),
    remove: params => client.post(`/functions/remove`, params)
  },
  sysConfig: {
    getAll: params => client.post('/SysConfig/GetAll', params),
    querySysConfigItemCategory: params => client.post('/SysConfig/QuerySysConfigItemCategory', params),
    save: params => client.post('/SysConfig/Save', params)
  },
  country: {
    query: params => client.post('/Territory/GetAllCountry', null)
  }
}

export default api
