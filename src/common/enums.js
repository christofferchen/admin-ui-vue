import enumData from '../resources/enumData.json'

let enumList = enumData
function getText (type, value) {
  let enumType = enumList[type]
  if (!enumType) {
    console.log(`没有找到${enumType}`)
    return ''
  }

  let item
  for (let i in enumType) {
    if (enumType[i].value === parseInt(value)) {
      item = enumType[i]
    }
  }
  if (!item) {
    console.log(`没有找到${enumType}.${value}`)
    return ''
  }
  return item.text
}
function enumFormater (type) {
  return (row, column, value) => {
    return getText(type, value)
  }
}

function getOptions (type) {
  let enumType = enumList[type]
  if (!enumType) {
    console.log(`没有找到${enumType}`)
    return ''
  }
  let items = []
  for (let i in enumType) {
    items.push({ name: i, text: enumType[i].text, value: enumType[i].value })
  }
  return items
}
export default {
  getText,
  enumFormater,
  getOptions,
  enums: enumList
}
