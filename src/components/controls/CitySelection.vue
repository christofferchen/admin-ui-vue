<template>
    <el-cascader v-model="defualtValue" placeholder="请选择" expand-trigger="hover" :clearable="nullable" :props="{value:'Id',label:'Name',children:'Children'}" :options="options">
    </el-cascader>
</template>

<script>
import ctiys from '../../resources/cityData.json'

export default {
  name: 'CitySelection',
  props: {
    value: { required: true },
    nullable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      options: ctiys,
      defualtValue: this.value
    }
  },
  watch: {
    value (val) {
      this.defualtValue = val
    },
    defualtValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
