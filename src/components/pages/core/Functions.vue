<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-col :span="12">
      <el-tree
        :data="tree"
        :props="props"
        v-loading="loading"
        defaultExpandAll="true"
        :expand-on-click-node="false"
        @current-change="currentChanged"
        node-key="Id"
        highlight-current>
      </el-tree>
    </el-col>
    <el-col :span="12">

      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <input type="hidden" v-model="editForm.ParentId"/>
        <input type="hidden" v-model="editForm.Id"/>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.FunctionName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <enum-select enumType="FunctionType" v-model="editForm.FunctionType"></enum-select>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="editForm.Url"></el-input>
        </el-form-item>
        <el-form-item label="权限码">
          <el-input v-model="editForm.AuthCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{ isAdd ? '添加' : '修改' }}</el-button>
        </el-form-item>
      </el-form>
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="editFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{ isAdd ? '添加' : '修改' }}</el-button>-->
      <!--</div>-->

    </el-col>

    <!--<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">-->
      <!--<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">-->
        <!--<input type="hidden" v-model="editForm.ParentId"/>-->
        <!--<el-form-item label="名称" prop="name">-->
          <!--<el-input v-model="editForm.FunctionName" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="类型">-->
          <!--<enum-select enumType="FunctionType" v-model="editForm.FunctionType"></enum-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="URL">-->
          <!--<el-input v-model="editForm.Url"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="权限码">-->
          <!--<el-input v-model="editForm.AuthCode"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="editFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </section>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      props: {
        label: 'FunctionName',
        children: 'Children'
      },
      tree: [],
      isAdd: false,
      editLoading: false,
      editFormVisible: false,
      editForm: {},
      editFormRules: {},
      editSubmit () {
        let success = (data) => {
          this.editForm = {ParentId: this.editForm.ParentId}
          this.isAdd = false
          this.refresh()
        }
        if (this.isAdd) {
          this.$api.functions.add(this.editForm).then(success)
        } else {
          this.$api.functions.modify(this.editForm).then(success)
        }
      }
    }
  },
  methods: {
    refresh () {
      this.loading = true
      this.$api.functions.get().then(data => {
        this.tree = [data]
        this.loading = false
      })
    },
    currentChanged (item) {
      this.isAdd = false
      this.editForm.ParentId = item.Id
      this.editForm.Id = item.Id
    },
    add () {
      if (!this.editForm.ParentId) {
        this.$message({message: '请选择父级项目', type: 'error'})
        return
      }
      this.isAdd = true
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
