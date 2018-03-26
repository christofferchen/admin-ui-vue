import enums from './enums'

export default {
  enums: enums.enumFormater,
  date: () => (row, column, value) => {
    let re = /^(.+)T/
    if (re.test(value)) {
      return re.exec(value)[1]
    } else {
      return ''
    }
  },
  datetime: () => (row, column, value) => {
    let re = /^(.+)T(.+?)(\.\d+)?$/
    if (re.test(value)) {
      let matches = re.exec(value)
      return matches[1] + ' ' + matches[2]
    } else {
      return ''
    }
  },
  money: () => (row, column, value) => {
    if (value) {
      return value.toFixed(2)
    } else {
      return '0.00'
    }
  }
}
