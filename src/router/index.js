import Vue from 'vue'
import Router from 'vue-router'
import pages from '../components/pages'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: pages.Main,
      children: [
        {
          path: '/sysConfig',
          component: pages.SysConfig
        },
        {
          path: '/messageRemind',
          component: pages.MessageRemind
        },
        {
          path: '/users',
          component: pages.Users
        },
        {
          path: '/roles',
          component: pages.Roles
        },
        {
          path: '/functions',
          component: pages.Functions
        },
        {
          path: '/changePassword',
          component: pages.ChangePassword
        }
      ]
    },
    {
      path: '/login',
      component: pages.Login
    },
    {
      path: '/register',
      component: pages.Register
    }
  ]
})
