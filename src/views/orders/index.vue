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
      <!-- 表格 -->
      <el-table border :data="orderList" stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column label="订单价格">
          <template slot-scope="scope">
            <span>{{ '￥' + scope.row.order_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip :enterable="false" content="修改地址" placement="top">
              <el-button
                @click="showEditOrders"
                circle
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="物流信息" placement="top">
              <el-button
                @click="locationOrders"
                circle
                type="success"
                icon="el-icon-location"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orders.pagenum"
        :page-sizes="[7, 15, 20]"
        :page-size="orders.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改订单的对话框 -->
    <el-dialog
      title="修改地址"
      v-loading="editLoading"
      element-loading-text="地址修改中...."
      :visible.sync="editDialog"
      @close="closeEditDialog"
      width="50%"
    >
      <el-form
        :model="searchOrders"
        :rules="editRules"
        ref="editRule"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityDate" v-model="searchOrders.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址/县" prop="address2">
          <el-input v-model="searchOrders.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editsubmitOrders">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息的对话框 -->
    <el-dialog title="物流信息" :visible.sync="KdDialog" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in wuliuList"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata'
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
      orderList: [],
      total: 0,
      editLoading: false,
      KdDialog: false,
      editDialog: false,
      searchOrders: {
        address1: [],
        address2: ''
      },
      editRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      //   中国地区信息
      cityDate,
      wuliuList: []
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
      if (data.meta.status === 200) {
        this.orderList = data.data.goods
        this.total = data.data.total
      } else {
        this.$message.error('获取失败')
      }
    },
    // 显示编辑对话框
    showEditOrders() {
      this.editDialog = true
    },
    // 提交编辑订单
    editsubmitOrders() {
      this.$refs.editRule.validate((valid) => {
        if (valid) {
          this.editDialog = false
          this.$message.success('地址修改成功')
        } else {
          return false
        }
      })
    },
    // 物流信息
    async locationOrders() {
      this.KdDialog = true
      const { data } = await this.$axios.get('./wuliu.json')
      this.wuliuList = data.data
    },
    // 每页的条数
    handleSizeChange(val) {
      this.orders.pagesize = val
      this.loadOrderList()
    },
    // 页码数
    handleCurrentChange(val) {
      this.orders.pagenum = val
      this.loadOrderList()
    },
    closeEditDialog() {
      this.$refs.editRule.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.input-with-select {
  width: 60%;
  margin-bottom: 15px;
}

.box-card {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
