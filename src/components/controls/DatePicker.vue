<template>
  <el-date-picker v-model="myvalue" :type="this.type" :placeholder="this.placeholder" :editable='this.editable'></el-date-picker>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    type: String,
    placeholder: String,
    value: String
  },
  data () {
    return {
      myvalue: this.value === '' ||
        this.value === null ||
        typeof this.value === 'undefined'
        ? undefined
        : new Date(this.value)
    }
  },
  watch: {
    value (val) {
      this.myvalue =
        this.value === '' ||
        this.value === null ||
        typeof this.value === 'undefined'
          ? undefined
          : new Date(this.value)
    },
    myvalue (val) {
      this.$emit(
        'input',
        val
          ? val.getFullYear() +
          '-' +
          (val.getMonth() + 1) +
          '-' +
          val.getDate() +
          ' ' +
          val.getHours() +
          ':' +
          val.getMinutes() +
          ':' +
          val.getSeconds()
          : undefined
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
