import enumFun from './enums'

export default {
  install: function (Vue, options) {
    Vue.filter('enumText', function (val, enumName) {
      return enumFun.getText(enumName, val)
    })

    Vue.filter('date', function (value) {
      let re = /^(.+)T/
      if (re.test(value)) {
        return re.exec(value)[1]
      } else {
        return ''
      }
    })

    Vue.filter('datetime', function (value) {
      let re = /^(.+)T(.+)\.\d+/
      if (re.test(value)) {
        let matches = re.exec(value)
        return matches[1] + ' ' + matches[2]
      } else {
        return ''
      }
    })

    Vue.filter('money', function (val) {
      let isNumber = Number.isFinite(val)
      let result = '￥'
      if (!isNumber) {
        let num = Number.parseFloat(val)
        if (!num) {
          return result + '0'
        }
      }
      return result + val.toFixed(2)
    })
  }
}
