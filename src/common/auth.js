let menus = null

function findMenu (currrentMenus, url) {
  for (let menu of currrentMenus) {
    if (menu.Url === url) {
      return menu
    } else if (menu.Children) {
      let found = findMenu(menu.Children, url)
      if (found) {
        return found
      }
    }
  }
}

function setBreadcrumbs (c, parents = []) {
  c.breadcrumbs = parents.concat(c.FunctionName)
  if (c.Children && c.Children.length) {
    for (let i of c.Children) {
      setBreadcrumbs(i, c.breadcrumbs)
    }
  }
}

function loadIfNotLoaded () {
  // if (menus == null) {
  menus = JSON.parse(localStorage.getItem('menus'))
  menus.menu.Children.push({
    FunctionName: '修改密码',
    Url: '/changePassword',
    Hidden: true
  })
  setBreadcrumbs(menus.menu)
  // }
}

export default {
  init (data) {
    localStorage.setItem('menus', JSON.stringify(data))
  },
  canAccessUrl (url) {
    loadIfNotLoaded()
    return typeof findMenu([menus.menu], url) !== 'undefined'
  },
  has (code) {
    loadIfNotLoaded()
    return menus.codes.includes(code)
  },
  getMenuTree () {
    loadIfNotLoaded()
    return menus.menu
  },
  getBreadcrumbs (url) {
    loadIfNotLoaded()
    let menu = findMenu(menus.menu.Children, url)
    if (menu) {
      return menu.breadcrumbs
    } else {
      return []
    }
  }
}
