<template>
  <div class="goods-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-input
        clearable
        @clear="loadGoodsList"
        placeholder="请输入内容"
        v-model="goods.query"
        class="input-with-select"
      >
        <el-button
          @click="loadGoodsList"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <!-- 添加商品的按钮 -->
      <el-button
        @click="$router.push('/goods/add')"
        class="addCate-btn"
        type="primary"
        >添加商品</el-button
      >
      <!-- 列表 -->
      <el-table
        border
        :data="goodsList"
        stripe
        style="width: 100%; margin-bottom: 15px"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column label="商品价格" width="90">
          <template slot-scope="scope">
            <span>{{ '￥' + scope.row.goods_price }}</span>
          </template></el-table-column
        >
        <el-table-column prop="goods_number" label="商品数量" width="90">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90"
        ></el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.upd_time | dateTime('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" content="编辑商品" placement="top">
              <el-button
                @click="showEditGoods(scope.row)"
                circle
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="删除商品" placement="top">
              <el-button
                @click="deleteGoods(scope.row)"
                circle
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goods.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="goods.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改商品的对话框 -->
    <el-dialog
      title="修改商品"
      v-loading="editLoading"
      element-loading-text="商品修改中...."
      :visible.sync="editDialog"
      @close="closeEditDialog"
      width="50%"
    >
      <el-form
        :model="searchGoods"
        :rules="editRules"
        ref="editRule"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="searchGoods.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="searchGoods.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="searchGoods.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="searchGoods.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editsubmitGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods, searchGoods, editGoods } from '@/api/goods'

export default {
  name: 'goodsIndex',
  components: {},
  props: {},
  data() {
    return {
      goods: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: [],
      editLoading: false,
      editDialog: false,
      //   根据id查询的商品对象
      searchGoods: {},
      editRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadGoodsList()
  },
  mounted() {},
  methods: {
    //   获取商品列表
    async loadGoodsList() {
      const { data } = await getGoodsList(this.goods)
      if (data.meta.status === 200) {
        this.goodsList = data.data.goods
        this.total = data.data.total
      } else {
        this.$message.error('获取列表失败')
      }
    },
    // 显示编辑商品对话框
    async showEditGoods(row) {
      this.editDialog = true
      const { data } = await searchGoods(row.goods_id)
      if (data.meta.status === 200) {
        this.searchGoods = data.data
      } else {
        this.$message.error('获取商品失败')
      }
    },
    // 提交编辑商品
    editsubmitGoods() {
      this.$refs.editRule.validate(async (valid) => {
        if (valid) {
          this.editLoading = true
          const id = this.searchGoods.goods_id
          const { data } = await editGoods(id, this.searchGoods)
          if (data.meta.status === 200) {
            this.editLoading = false
            this.editDialog = false
            this.loadGoodsList()
            this.$message.success('商品修改成功')
          } else {
            this.editLoading = false
            this.$message.error(data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    // 监听修改商品对话框关闭事件
    closeEditDialog() {
      this.$refs.editRule.resetFields()
    },
    // 删除商品
    async deleteGoods(scope) {
      const id = scope.goods_id
      const result = await this.$confirm(
        '要永久删除此分类, 是否继续?',
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

      if (result === 'confirm') {
        const { data } = await deleteGoods(id)
        if (data.meta.status === 200) {
          this.$message.success('删除成功~')
          this.loadGoodsList()
        }
      }
    },
    // 每页显示的数据条数
    handleSizeChange(val) {
      this.goods.pagesize = val
      this.loadGoodsList()
    },
    // 当前页码数
    handleCurrentChange(val) {
      this.goods.pagenum = val
      this.loadGoodsList()
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;

  .addCate-btn {
    margin-bottom: 15px;
    margin-left: 15px;
  }

  .input-with-select {
    width: 50%;
  }
}
</style>
