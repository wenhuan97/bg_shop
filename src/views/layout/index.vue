<template>
  <div class="layout-container">
    <el-button type="warning" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'layoutIndex',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    logout() {
      this.$confirm('您确定要退出登录吗?', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
</style>
