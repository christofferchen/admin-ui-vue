import EnumSelect from './EnumSelect.vue'
import DatePicker from './DatePicker.vue'
import CitySelection from './CitySelection.vue'

export default {
  install (Vue, options) {
    Vue.component(EnumSelect.name, EnumSelect)
    Vue.component(DatePicker.name, DatePicker)
    Vue.component(CitySelection.name, CitySelection)
  }
}
