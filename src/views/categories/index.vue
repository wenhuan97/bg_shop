<template>
  <div class="categories-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加分类的按钮 -->
      <el-button
        @click="showAddCate"
        class="addCate-btn"
        type="primary"
        size="small"
        >添加分类</el-button
      >
      <!-- 表格-->
      <tree-table
        class="tree-table"
        :selection-type="false"
        :data="goodsCates"
        :columns="columns"
        :expand-type="false"
        show-index
        border
        stripe
        index-text=""
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted"
            style="color: lightgreen"
            class="el-icon-success"
          ></i>
          <i v-else style="color: red" class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="handle" slot-scope="scope">
          <el-tooltip :enterable="false" content="编辑商品分类" placement="top">
            <el-button
              @click="showEditGoodsCate(scope)"
              circle
              type="primary"
              icon="el-icon-edit"
            ></el-button>
          </el-tooltip>
          <el-tooltip :enterable="false" content="删除商品分类" placement="top">
            <el-button
              @click="deleteGoodsCate(scope.row)"
              circle
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </el-tooltip>
        </template>
      </tree-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      v-loading="addLoading"
      element-loading-text="分类添加中...."
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="50%"
    >
      <el-form
        :model="goodsCateObj"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="goodsCateObj.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="父级分类：">
          <el-cascader
            class="cascader"
            clearable
            v-model="selectKeys"
            :options="cascaderCates"
            @change="handleChange"
            :props="props"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCates">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      v-loading="editLoading"
      element-loading-text="分类修改中...."
      :visible.sync="editDialog"
      @close="closeEditDialog"
      width="50%"
    >
      <el-form
        :model="searchGoodsCate"
        :rules="editRules"
        ref="editRule"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="searchGoodsCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editsubmitCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsCate,
  addGoodsCate,
  searchGoodsCate,
  editGoodsCate,
  deleteGoodsCate
} from '@/api/goods'

export default {
  name: 'categoriesIndex',
  components: {},
  props: {},
  data() {
    return {
      pagenum: 1,
      pagesize: 5,
      goodsCates: [], // 1-3级分类列表
      cascaderCates: [], // 1-2级分类
      searchGoodsCate: {}, // 查询的分类数据
      goodsCateObj: {
        cat_name: '',
        cat_pid: 0, // 父分类id
        cat_level: 0 // 分类层级
      },
      props: {
        value: 'cat_id', // 指定选项的值为选项对象的某个属性值
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true // 可选一级
      }, // 级联选择器的配置对象
      selectKeys: [], // 选中的id数组
      total: 0,
      addLoading: false,
      editLoading: false,
      dialogVisible: false, // 添加分类的隐藏
      editDialog: false,
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 13 个字符', trigger: 'blur' }
        ]
      },
      editRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 4, max: 12, message: '长度在 4 到 13 个字符', trigger: 'blur' }
        ]
      },
      //   树型表格的 列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    //   获取商品分类
    this.loadGoodsCate()
  },
  mounted() {},
  methods: {
    async loadGoodsCate() {
      const { data } = await getGoodsCate({
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      this.goodsCates = data.data.result
      this.total = data.data.total
    },
    // 显示添加分类的对话框
    async showAddCate() {
      this.dialogVisible = true
      const { data } = await getGoodsCate({
        type: 2
      })
      this.cascaderCates = data.data
    },
    // 添加分类
    async submitCates() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.addLoading = true
          const { data } = await addGoodsCate(this.goodsCateObj)
          if (data.meta.status === 201) {
            this.addLoading = false
            this.dialogVisible = false
            this.$message.success('添加用户成功')
            this.loadGoodsCate()
          } else {
            this.addLoading = false
            this.$message.error('添加失败')
          }
        } else {
          return false
        }
      })
    },
    // 级联选择器的变化
    handleChange() {
      const keys = this.selectKeys
      if (keys.length > 0) {
        //   说明选择了 父分类
        this.goodsCateObj.cat_pid = keys[keys.length - 1]
        this.goodsCateObj.cat_level = keys.length
      }
    },
    // 监听添加分类对话框的关闭事件
    closeDialog() {
      this.$refs.ruleForm.resetFields()
      this.selectKeys = []
      this.goodsCateObj.cat_pid = 0
      this.goodsCateObj.cat_level = 0
    },
    // 监听修改分类的对话框关闭事件
    closeEditDialog() {
      this.$refs.editRule.resetFields()
    },
    // 显示编辑商品分类的对话框
    async showEditGoodsCate(scope) {
      this.editDialog = true
      const { data } = await searchGoodsCate(scope.row.cat_id)
      this.searchGoodsCate = data.data
    },
    // 提交修改的分类
    editsubmitCate() {
      this.$refs.editRule.validate(async (valid) => {
        if (valid) {
          this.editLoading = true
          const id = this.searchGoodsCate.cat_id
          const name = this.searchGoodsCate.cat_name.trim()
          const { data } = await editGoodsCate(id, name)
          if (data.meta.status === 200) {
            this.editLoading = false
            this.editDialog = false
            this.loadGoodsCate()
            this.$message.success('分类修改成功')
          } else {
            this.editLoading = false
            this.$message.error(data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    // 删除商品分类
    async deleteGoodsCate(scope) {
      const id = scope.cat_id
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
        const { data } = await deleteGoodsCate(id)
        if (data.meta.status === 200) {
          this.$message.success('删除成功~')
          this.loadGoodsCate()
        }
      }
    },
    // 监听每页显示的数量
    handleSizeChange(val) {
      this.pagesize = val
      this.loadGoodsCate()
    },
    // 监听页码值
    handleCurrentChange(num) {
      this.pagenum = num
      this.loadGoodsCate()
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;

  .addCate-btn {
    margin-bottom: 15px;
  }

  .tree-table {
    margin-bottom: 15px;
  }
}
</style>
