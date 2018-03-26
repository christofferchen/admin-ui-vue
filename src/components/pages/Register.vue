<template>
<el-col class="registerbg">
  <section class="registerM">
    <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
      <el-row>
        <el-col :span="22">
          <el-form-item label="商户名称" prop="Name">
            <input v-model="editForm.Id" type="hidden" />
            <el-input v-model.trim="editForm.Name" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商户简称" prop="ShortName">
            <el-input v-model.trim="editForm.ShortName" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系人" prop="LinkMan">
            <el-input v-model.trim="editForm.LinkMan" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="Phone">
            <el-input v-model.trim="editForm.Phone" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系邮箱" prop="Email">
            <el-input v-model.trim="editForm.Email" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="备注" prop="Detail">
            <el-input v-model.trim="editForm.Notes" type="textarea" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form :model="editForm" label-width="100px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="营业执照号" prop="RegNo">
            <el-input v-model.trim="editForm.RegNo" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="组织机构码" prop="CompanyNo">
            <el-input v-model.trim="editForm.CompanyNo" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="法人" prop="LegalPerson">
            <el-input v-model.trim="editForm.LegalPerson" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="法人身份证" prop="CardNo">
            <el-input v-model.trim="editForm.CardNo" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="执照注册地址" prop="RegAddress">
            <el-input v-model.trim="editForm.RegAddress" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="成立日期" prop="RegDate">
            <date-picker v-model="editForm.RegDate" type="date" placeholder="请选择成立日期" :editable='false'></date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司电话" prop="CompanyTel">
            <el-input v-model.trim="editForm.CompanyTel" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="注册资本" prop="RegMoney">
            <el-input v-model.trim="editForm.RegMoney" auto-complete="off">
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="经营范围" prop="RegContent">
            <el-input v-model.trim="editForm.RegContent" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="公司详细地址" prop="CompanyAddress">
            <el-input v-model.trim="editForm.CompanyAddress" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form :model="editForm" label-width="160px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="法人身份证正面" prop="CompanyAddress">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadCardPic1">
              <img v-if="editForm.ShowCardPic1" :src="editForm.ShowCardPic1" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="法人身份证反面" prop="CompanyAddress">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadCardPic2">
              <img v-if="editForm.ShowCardPic2" :src="editForm.ShowCardPic2" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="营业执照副本电子版" prop="CompanyAddress">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadRegPic">
              <img v-if="editForm.ShowRegPic" :src="editForm.ShowRegPic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="组织机构代码证电子版" prop="CompanyAddress">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadCompanyNoPic">
              <img v-if="editForm.ShowCompanyNoPic" :src="editForm.ShowCompanyNoPic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="22">
        <el-form-item>
        <el-button type="primary" style="width:100%;" @click.native.prevent="submit" :loading="loading">
          <i class="fa fa-sign-in"></i> 注册</el-button>
      </el-form-item>
      </el-col>
      </el-row>
    </el-form>
  </section>
  </el-col>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      editForm: {
        RegDate: ''
      },
      editFormRules: {
        Name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        ShortName: [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
        LinkMan: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        Phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        Email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      let self = this
      if (self.loading) return false
      self.$refs.editForm.validate(valid => {
        if (valid) {
          self.loading = true
          self.$api.merchants
            .register(self.editForm)
            .then(data => {
              sessionStorage.setItem('user', JSON.stringify(data.user))
              sessionStorage.setItem('token', data.token)
              self.$api.membership.getMenu().then(data => {
                self.$auth.init(data)
                // this.$router.replace({ path: '/' })
                self.$router.replace({ path: '/merchantInfo' })
              })
            })
            .catch(a => {
              self.loading = false
            })
        } else {
          return false
        }
      })
    },
    uploadCardPic1 (file, a, b, c) {
      let self = this
      this.$api.merchants.upload(file.file).then(data => {
        self.editForm.CardPic1 = data[0].ImgPath
        self.editForm.ShowCardPic1 = data[0].ShowUrl
        self.$forceUpdate()
      })
    },
    uploadCardPic2 (file) {
      let self = this
      this.$api.merchants.upload(file.file).then(data => {
        self.editForm.CardPic2 = data[0].ImgPath
        self.editForm.ShowCardPic2 = data[0].ShowUrl
        self.$forceUpdate()
      })
    },
    uploadRegPic (file) {
      let self = this
      this.$api.merchants.upload(file.file).then(data => {
        self.editForm.RegPic = data[0].ImgPath
        self.editForm.ShowRegPic = data[0].ShowUrl
        self.$forceUpdate()
      })
    },
    uploadCompanyNoPic (file) {
      let self = this
      this.$api.merchants.upload(file.file).then(data => {
        self.editForm.CompanyNoPic = data[0].ImgPath
        self.editForm.ShowCompanyNoPic = data[0].ShowUrl
        self.$forceUpdate()
      })
    },
    beforeAvatarUpload (file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg/jpg/png/bmp 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.registerbg{
background:url(../../assets/registerbg.jpg) no-repeat;
background-size:100%;
}
.registerM{
  width:1200px;
  margin:10px auto;
  background: #fff;
  opacity: 0.7;
  padding-top:10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #999;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
