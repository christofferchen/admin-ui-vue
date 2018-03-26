<template>
  <el-col v-loading="tLoading">
    <!--左边角色列表-->
    <el-col style="width:500px;">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="pagedParam.queryDto">
          <el-form-item>
            <el-input v-model="pagedParam.queryDto.RoleName" placeholder="角色名" size="4"></el-input>
          </el-form-item>
          <el-form-item>
            <enum-select v-model="pagedParam.queryDto.RoleType" enumType="RoleType" placeholder="角色类型"
                         size="4"></enum-select>
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
        <el-table :data="pagedList.ContentList" border height="500" highlight-current-row @current-change="selectRow"
                  style="width: 100%;">
          <el-table-column type="index" width="55"></el-table-column>
          <el-table-column prop="RoleName" label="角色名" width="120"></el-table-column>
          <el-table-column prop="RoleType" label="角色类型" width="120"
                           :formatter="$formatters.enums('RoleType')"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" icon="edit" @click="edit(scope.row)"></el-button>
              <el-button size="small" icon="delete" type="danger" @click="remove(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!--底部工具条及分页控件-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="sizes, prev, pager, next" :current-page.sync="pagedParam.pageNo"
                       :total="pagedList.TotalItemCount" @current-change="query" @size-change="query"
                       :page-size="pagedParam.pageSize" style="float:right;">
        </el-pagination>
      </el-col>

      <!--用户编辑对话框-->
      <el-dialog :title="isAdd ? '添加' : '修改'" v-model="dialogVisible" :close-on-click-modal="false" v-loading="dLoading"
                 size="500">
        <el-form :model="roleInfo" label-width="80px" ref="editForm">
          <el-form-item label="角色名" prop="RoleName" :rules="[{required: true, message: '角色名不能为空', trigger: 'blur'}]">
            <input v-model="roleInfo.Id" type="hidden"/>
            <el-input v-model.trim="roleInfo.RoleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="Description">
            <el-input v-model.trim="roleInfo.Description" type="textarea" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button icon="close" @click.native="dialogVisible = false">取消</el-button>
          <el-button icon="check" type="primary" @click.native="save">保存</el-button>
        </div>
      </el-dialog>
    </el-col>

    <!--右边功能树-->
    <el-col style="width:600px; height:800px; margin-left:20px; margin-top:58px;" v-loading="treeLoading">
      <el-tree :data="treeData" show-checkbox default-expand-all highlight-current node-key="Id" :props="treeProps"
               ref="funcTree" style="height:497px;overflow:scroll;">
      </el-tree>
      <el-col :span="24" class="toolbar">
        <el-button icon="check" type="primary" @click.native="saveRoleFuncs">保存</el-button>
      </el-col>
    </el-col>
  </el-col>
</template>

<script>
export default {
  data () {
    return {
      isAdd: false,
      dialogVisible: false,
      dLoading: false,
      tLoading: false,
      treeLoading: false,
      pagedParam: {pageNo: 1, pageSize: 10, queryDto: {}},
      pagedList: [],
      selectedRow: {},
      roleInfo: {},
      treeData: [],
      treeProps: {
        children: 'Children',
        label: 'FunctionName'
        // disabled: '!IsPlatformFunction'
      }
    }
  },
  mounted () {
    this.query()

    this.$api.functions.getTree().then(data => {
      this.treeData.push(data)
    })
  },
  methods: {
    query () {
      this.tLoading = true
      this.$api.roles
        .query(this.pagedParam)
        .then(data => {
          this.pagedList = data
          this.tLoading = false
        })
        .catch(e => {
          this.tLoading = false
        })
    },
    selectRow (curRow, oldRow) {
      this.selectedRow = curRow
      this.$api.functions.getRoleTree(curRow.Id).then(data => {
        this.$refs.funcTree.setCheckedNodes(data)
      })

      // this.$api.roles.getById(curRow.Id).then(data => {
      //   let funcs = data.Functions.filter(item => item.ParentId);
      //   this.$refs.funcTree.setCheckedNodes(funcs);
      // });
    },
    save () {
      this.dLoading = true
      this.$refs.editForm.validate(result => {
        if (result) {
          if (this.isAdd) {
            this.$api.roles
              .add(this.roleInfo)
              .then(a => {
                this.dLoading = false
                this.dialogVisible = false
                this.query()
              })
              .catch(a => {
                this.dLoading = false
              })
          } else {
            this.$api.roles
              .modify(this.roleInfo)
              .then(a => {
                this.dLoading = false
                this.dialogVisible = false
                this.query()
              })
              .catch(a => {
                this.dLoading = false
              })
          }
        } else {
          return false
        }
      })
    },
    edit (row) {
      this.isAdd = false
      this.dialogVisible = true
      if (self.$refs.editForm) {
        self.$refs.editForm.resetFields()
      }
      this.roleInfo = row
    },
    remove (row) {
      this.$confirm('确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.roles.remove(row.Id).then(() => {
            this.$message({type: 'success', message: '删除成功!'})
            this.query()
          })
        })
        .catch(() => {
          this.$message({type: 'info', message: '已取消删除'})
        })
    },
    add () {
      this.isAdd = true
      this.dialogVisible = true
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
    },
    saveRoleFuncs () {
      this.treeLoading = true
      let ids = this.$refs.funcTree.getCheckedKeys(false)
      if (!ids || ids.length === 0) {
        this.$message({type: 'warning', message: '请选择功能'})
      }
      if (!this.selectedRow) {
        this.$message({type: 'warning', message: '请选择角色'})
      }
      this.$api.roles
        .setRoleFunctions({roleId: this.selectedRow.Id, functionIds: ids})
        .then(data => {
          this.treeLoading = false
          this.$message({type: 'info', message: '设置成功'})
        })
        .catch(e => {
          this.treeLoading = false
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
