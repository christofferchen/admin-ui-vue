<template>
  <section>
    <el-tabs :v-model="categories.length>0?categories[0].Title:''">
      <el-tab-pane v-for="item in categories" :key="item.Id" :label="item.Title" :value="item.Id">
        <el-form label-width="240px">
              <el-row>
                <el-col :span="22" v-for="config in item.SysConfigItems" :key="config.Id">
                  <el-form-item :label="config.Description">
                    <el-input v-model="config.Value" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
          <el-button icon="check" type="primary" @click.native="save">保存</el-button>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      categories: []
    }
  },
  mounted () {
    this.$api.sysConfig
      .querySysConfigItemCategory({ IsBondedArea: false })
      .then(data => {
        this.categories = data
      })
  },
  methods: {
    save () {
      this.$api.sysConfig.save(this.categories).then(data => {
        this.$message({ type: 'info', message: '保存成功' })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
