<template>
  <el-form :model="editForm" label-width="100px">
    <el-row>
      <el-form-item label="成立日期" prop="RegDate">
        <date-picker v-model="editForm.RegDate" type="date" placeholder="请选择成立日期" :editable='false'></date-picker>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="支付方式" prop="RegDate">
        <enum-select v-model="editForm.PaymentMode" enumType="PaymentMode" placeholder="支付方式" size="18" :nullable="false"></enum-select>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      editForm: {
        RegDate: '2016-10-25 15:56:29'
        // ,
        // PaymentMode: 1
      }
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
