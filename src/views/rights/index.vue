<template>
  <div class="rights-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table height="580" border :data="rightsList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '@/api/rights'

export default {
  name: 'rightsIndex',
  components: {},
  props: {},
  data() {
    return {
      rightsList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadRightsList()
  },
  mounted() {},
  methods: {
    async loadRightsList() {
      const { data } = await getRightsList('list')
      this.rightsList = data.data
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;
}
</style>
