<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="pagedParam.queryDto">
        <el-form-item>
          <el-input v-model="pagedParam.queryDto.UserName" placeholder="用户名" size="4"></el-input>
        </el-form-item>
        <el-form-item>
          <enum-select v-model="pagedParam.queryDto.Status" enumType="UserStatus" placeholder="状态" size="4"></enum-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" v-on:click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" v-if="$auth.has('users.add')" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-col>
      <el-table :data="pagedList.ContentList" border stripe height="500" highlight-current-row @selection-change="updateSelected" v-loading="loading" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <!-- <el-table-column prop="Id" label="ID" width="60"></el-table-column> -->
        <el-table-column prop="UserName" label="用户名" width="120"></el-table-column>
        <el-table-column prop="TrueName" label="真实姓名" width="120"></el-table-column>
        <el-table-column prop="RoleName" label="所属角色" width="120">
          <template slot-scope="scope">
            <el-tag type="primary" v-for="item in scope.row.Roles" :key="item.Id">
              {{item.RoleName}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="PhoneNumber" label="手机" fit></el-table-column>
        <el-table-column prop="Email" label="Email" fit></el-table-column>
        <el-table-column prop="IsLocked" label="是否锁定" fit>
          <template slot-scope="scope">
            <el-tag :type="scope.row.IsLocked ? 'danger' : 'primary'">
              {{scope.row.IsLocked?'是':'否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Status === $enums.UserStatus.Enabled.value ? 'primary' : 'danger'">
              {{scope.row.Status|enumText("UserStatus")}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :formatter="$formatters.date()" label="创建时间"></el-table-column>
        <el-table-column prop="UpdateTime" :formatter="$formatters.datetime()" label="修改时间"></el-table-column>
        <el-table-column prop="LastLoginDate" :formatter="$formatters.datetime()" label="最近登录时间" fit></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" icon="edit" @click="edit(scope.row)" title="修改"></el-button>
            <el-button type="danger" size="small" @click="frozen(scope.row)" v-if="$auth.has('users.frozen') && scope.row.Status === $enums.UserStatus.Enabled.value" title="禁用">
              <i class="fa fa-ban fa-fw"></i>
            </el-button>
            <el-button type="danger" size="small" @click="unfrozen(scope.row)" v-if="$auth.has('users.unfrozen') && scope.row.Status === $enums.UserStatus.Disabled.value" title="启用">
              <i class="fa fa-circle-o fa-fw"></i>
            </el-button>
            <el-button type="warning" size="small" @click="unLock(scope.row)" v-if="$auth.has('merchant.unLock') && scope.row.IsLocked"  title="解锁">
              <i class="fa fa-unlock fa-fw"></i>
            </el-button>
            <el-button type="danger" size="small" @click="resetPWD(scope.row)" v-if="$auth.has('merchant.resetPWD')" title="重置密码">
               <i class="fa fa-registered fa-fw"></i>
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="remove(scope.row)" title="删除">
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--底部工具条及分页控件-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchFrozen" :disabled="this.selectedRows.length===0">
        <i class="fa fa-lock"></i> 批量禁用</el-button>
      <el-button type="danger" @click="batchUnfrozen" :disabled="this.selectedRows.length===0">
        <i class="fa fa-unLock"></i> 批量启用</el-button>
      <el-pagination layout="total, sizes, prev, pager, next" :current-page.sync="pagedParam.pageNo" :total="pagedList.TotalItemCount" @current-change="query" @size-change="$data.pagedParam.pageSize = arguments[0]; query()" :page-size="pagedParam.pageSize" style="float:right;">
      </el-pagination>
    </el-col>

    <!--用户编辑对话框-->
    <el-dialog :title="isAdd ? '添加' : '修改'" ref="userDialog" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名" prop="UserName">
          <input v-model="editForm.Id" type="hidden" />
          <el-input v-model.trim="editForm.UserName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实名称" prop="TrueName">
          <el-input v-model.trim="editForm.TrueName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="isAdd" prop="Password">
          <el-input v-model="editForm.Password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" v-if="isAdd" prop="Password2">
          <el-input v-model="editForm.Password2" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="PhoneNumber">
          <el-input v-model.trim="editForm.PhoneNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="Email">
          <el-input v-model.trim="editForm.Email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="editForm.Roles">
            <el-checkbox v-for="item in roleList" :label="item.Id" :value="item.Id" :key="item.Id">{{item.RoleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="简介" prop="ShortDesc">
          <el-input v-model.trim="editForm.ShortDesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="Detail">
          <el-input v-model.trim="editForm.Detail" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button icon="close" @click.native="editFormVisible = false">取消</el-button>
        <el-button icon="check" type="primary" @click.native="submitEdit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
export default {
  mounted: function () {
    this.query()
  },
  data () {
    return {
      loading: false,
      pagedParam: {
        pageNo: 1,
        pageSize: 10,
        queryDto: { UserName: '', Status: '' }
      },
      selectedRows: [],
      pagedList: {},
      roleList: [],
      editFormVisible: false,
      isAdd: false,
      editLoading: false,
      editForm: {
        Roles: []
      },
      editFormRules: {
        UserName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 20, message: '6到20个字符', trigger: 'blur' }
        ],
        TrueName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { max: 10, message: '真实姓名最多输入10个字', trigger: 'blur' }
        ],
        PhoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1[3-9][0-9]\d{8}$/,
            message: '手机号码格式错误',
            trigger: 'blur'
          }
        ],
        Password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        Password2: [
          {
            required: true,
            message: '请输入重复密码',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.editForm.Password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            }
          }
        ],
        // RoleIds: [{ required: true, message: '请选着角色', trigger: 'blur' }],
        Email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    selectedIds () {
      let ids = []
      if (this.selectedRows.length > 0) {
        ids = this.selectedRows.map(r => r.Id)
      }
      return ids
    }
  },
  methods: {
    updateSelected (sel) {
      this.selectedRows = sel
    },
    getRoleList () {
      var self = this
      if (self.roleList.length === 0) {
        self.$api.roles.query({ pageNo: 1, pageSize: 1000 }).then(data => {
          if (data) {
            self.roleList = data.ContentList
          }
        })
      }
    },
    query () {
      this.loading = true
      this.$api.users.query(this.pagedParam).then(data => {
        this.pagedList = data
        this.loading = false
      })
    },
    add () {
      let self = this
      if (self.$refs.editForm) {
        self.$refs.editForm.resetFields()
      }
      self.editForm.Roles = []
      self.isAdd = true
      self.editFormVisible = true
      self.getRoleList()
    },
    remove (row) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.op(this.$api.users.remove(row.Id))
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    edit (row) {
      this.isAdd = false
      this.editFormVisible = true
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      this.editForm.Roles = []
      this.getRoleList()
      this.$api.users.getById(row.Id).then(data => {
        data.Roles = data.Roles.map(r => r.Id)
        this.editForm = data
        this.editForm.Password2 = data.Password
      })
    },
    submitEdit () {
      let self = this
      self.editLoading = true
      self.$refs.editForm.validate(valid => {
        if (valid) {
          let roles = []
          let roleIds = self.editForm.Roles
          if (roleIds.length > 0) {
            for (let item of roleIds) {
              roles.push({ Id: item })
            }
          }
          self.editForm.Roles = roles

          if (self.isAdd) {
            self.$api.users
              .add(self.editForm)
              .then(a => {
                self.editLoading = false
                self.editFormVisible = false
                self.query()
              })
              .catch(a => {
                self.editLoading = false
              })
          } else {
            self.$api.users
              .modify(self.editForm)
              .then(a => {
                self.editLoading = false
                self.editFormVisible = false
                self.query()
              })
              .catch(a => {
                self.editLoading = false
              })
          }
        } else {
          self.editLoading = false
          return false
        }
      })
    },
    op (promise) {
      promise
        .then(data => {
          this.query()
        })
        .catch(() => {})
    },
    unLock (row) {
      this.op(this.$api.users.unLock(row.Id))
    },
    frozen (row) {
      this.op(this.$api.users.frozen([row.Id]))
    },
    unfrozen (row) {
      this.op(this.$api.users.unfrozen([row.Id]))
    },
    batchFrozen () {
      this.op(this.$api.users.frozen(this.selectedIds))
    },
    batchUnfrozen () {
      this.op(this.$api.users.unfrozen(this.selectedIds))
    },
    resetPWD (row) {
      this.$confirm('确定要重置该用户密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.users.resetPWD(row.Id).then(a => {
            this.$message({ type: 'info', message: '重置成功，重置后密码为：123456' })
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消重置' })
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
