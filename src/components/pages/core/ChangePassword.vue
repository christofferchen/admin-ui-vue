<template>
  <el-col v-loading="isLoad">
    <el-form :model="formData" label-width="80px" ref="editForm" :rules="formRules" class="ItemWidth">
      <el-form-item label="原密码" prop="Password">
        <el-input v-model.trim="formData.Password" type="Password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="NewPassword">
        <el-input v-model.trim="formData.NewPassword" type="Password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="NewPassword2">
        <el-input v-model.trim="formData.NewPassword2" type="Password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="close" type="primary" @click="backToUser">保存</el-button>
        <el-button icon="check" type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>

export default {
  data () {
    return {
      isLoad: false,
      formData: {},
      formRules: {
        Password: [{required: true, message: '请输入原密码', trigger: 'blur'}],
        NewPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
        NewPassword2: [{
          required: true,
          message: '请输入重复密码',
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value && value.length < 6) {
              callback(new Error('密码不能小于6位'))
            } else if (value !== this.formData.Password) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    save () {
      let self = this
      self.isLoad = true
      self.$refs.editForm.validate(result => {
        if (result) {
          let user = JSON.parse(sessionStorage.getItem('user'))

          self.$api.users.modifyPwd({
            oldPwd: self.formData.Password,
            newPwd: self.formData.NewPassword,
            userId: user.Id
          }).then(data => {
            self.$message({type: 'info', message: '保存成功,请重新登录'})
            self.isLoad = false
            this.$router.push('/Login')
          }).catch(e => {
            self.isLoad = false
          })
        }
      })
    },
    backToUser () {
      this.$router.push('/Users')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ItemWidth {
    width: 300px;
  }
</style>
