<template>
  <el-select v-model="myvalue" :clearable="this.nullable" :placeholder="this.placeholder" :size="this.size" :disabled="this.disabled">
    <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import enums from '../../common/enums'

export default {
  name: 'EnumSelect',
  props: {
    value: {
      required: true
    },
    enumType: {
      required: true
    },
    nullable: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    disabled: String,
    size: String
  },
  data () {
    return {
      myvalue: this.value === '' || this.value === null || typeof this.value === 'undefined' ? undefined : parseInt(this.value),
      options: enums.getOptions(this.enumType)
    }
  },
  watch: {
    value (val) {
      this.myvalue = val === '' || val === null || typeof val === 'undefined' ? undefined : parseInt(val)
      // this.$forceUpdate();
    },
    myvalue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
