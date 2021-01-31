<template>
  <div class="orders-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-input
        clearable
        @clear="loadOrderList"
        placeholder="请输入内容"
        v-model="orders.query"
        class="input-with-select"
      >
        <el-button
          @click="loadOrderList"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
    </el-card>
  </div>
</template>

<script>
import { getOrderList } from '@/api/orders'

export default {
  name: 'ordersIndex',
  components: {},
  props: {},
  data() {
    return {
      orders: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      orderList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadOrderList()
  },
  mounted() {},
  methods: {
    //   获取订单列表
    async loadOrderList() {
      const { data } = await getOrderList(this.orders)
      this.orderList = data.data
    }
  }
}
</script>

<style scoped lang="less">
.input-with-select {
  width: 60%;
}

.box-card {
    margin-top: 15px;
}
</style>
