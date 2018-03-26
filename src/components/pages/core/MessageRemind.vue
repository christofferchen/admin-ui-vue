<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="pagedParam.queryDto">
        <el-form-item>
          <enum-select v-model="pagedParam.queryDto.Type" enumType="MessageRemindType" placeholder="消息类型" size="4"></enum-select>
        </el-form-item>
        <el-form-item>
          <enum-select v-model="pagedParam.queryDto.Status" enumType="MessageRemindStatus" placeholder="状态" size="4"></enum-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" v-on:click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-col>
      <el-table :data="pagedList.ContentList" border stripe height="500" highlight-current-row @selection-change="updateSelected" v-loading="loading" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="Message" label="消息"></el-table-column>
        <el-table-column prop="CreateTime" :formatter="$formatters.datetime()" label="流水时间" width="200"></el-table-column>
        <el-table-column prop="MessageType" :formatter="$formatters.enums('MessageRemindType')" label="消息类型" width="200"></el-table-column>
        <el-table-column prop="MessageStatus" :formatter="$formatters.enums('MessageRemindStatus')" label="状态" width="200"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="readMessage(scope.row)" :loading="opLoading" title="已读" v-if="$auth.has('messageRemind.readMessage')&&scope.row.MessageStatus===$enums.MessageRemindStatus.Unread.value">已读</el-button>
            <el-button type="success" size="small"  @click="processMessage(scope.row)" :loading="opLoading" title="处理" v-if="$auth.has('messageRemind.processMessage')&&scope.row.MessageStatus===$enums.MessageRemindStatus.Unread.value">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--底部工具条及分页控件-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchReadMessage" :disabled="this.selectedRows.filter(p=>p.MessageStatus===0).length===0"><i class="fa fa-lock"></i> 批量阅读</el-button>
      <el-pagination layout="total, sizes, prev, pager, next" :current-page.sync="pagedParam.pageNo" :total="pagedList.TotalItemCount" @current-change="query" @size-change="$data.pagedParam.pageSize = arguments[0]; query()" :page-size="pagedParam.pageSize" style="float:right;">
      </el-pagination>
    </el-col>

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
      opLoading: false,
      selectedRows: [],
      pagedParam: {
        pageNo: 1,
        pageSize: 10,
        queryDto: {
          Type: '',
          Status: ''
        }
      },
      pagedList: {}
    }
  },
  methods: {
    updateSelected (sel) {
      this.selectedRows = sel
    },
    query () {
      this.loading = true
      this.$api.MessageRemind.getList(this.pagedParam).then(data => {
        this.pagedList = data
        this.loading = false
      })
    },
    readMessage (row) {
      this.opLoading = true
      this.$api.MessageRemind.readMessage([row.Id])
        .then(data => {
          this.opLoading = false
          this.query()
        })
        .catch(() => {
          this.opLoading = false
        })
    },
    batchReadMessage () {
      let ids = []
      if (this.selectedRows.length > 0) {
        ids = this.selectedRows
          .filter(p => p.MessageStatus === 0)
          .map(r => r.Id)
      }
      this.$api.MessageRemind.readMessage(ids)
        .then(data => {
          this.query()
        })
        .catch(() => {})
    },
    processMessage (row) {
      this.opLoading = true
      this.$api.MessageRemind.readMessage([row.Id])
        .then(data => {
          this.opLoading = false
          this.$router.push(row.Url)
        })
        .catch(() => {
          this.opLoading = false
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
