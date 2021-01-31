<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <div class="cascader-wrap">
        <span>选择商品分类:</span>
        <el-cascader
          class="cascader"
          v-model="selectKeys"
          clearable
          :options="categories"
          @change="handleChange"
          :props="props"
        ></el-cascader>
      </div>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="showParams"
            :disabled="isBtnDiasabled"
            type="primary"
            size="small"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table :data="dyParams" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleClose(scope.row, index)"
                  style="margin: 5px"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  :enterable="false"
                  content="编辑动态参数"
                  placement="top"
                >
                  <el-button
                    @click="showEditdyParams(scope.row)"
                    circle
                    type="primary"
                    icon="el-icon-edit"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  :enterable="false"
                  content="删除动态参数"
                  placement="top"
                >
                  <el-button
                    @click="deletedyParams(scope.row)"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="showParams"
            :disabled="isBtnDiasabled"
            type="primary"
            size="small"
            >添加属性</el-button
          >
          <!-- 表格 -->
          <el-table :data="stParams" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleClose(scope.row, index)"
                  style="margin: 5px"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  :enterable="false"
                  content="编辑静态属性"
                  placement="top"
                >
                  <el-button
                    @click="showEditdyParams(scope.row)"
                    circle
                    type="primary"
                    icon="el-icon-edit"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  :enterable="false"
                  content="删除静态属性"
                  placement="top"
                >
                  <el-button
                    @click="deletedyParams(scope.row)"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加 动态参数/静态属性的 对话框 -->
    <el-dialog
      :title="activeName === 'only' ? '添加静态属性' : '添加动态参数'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
      v-loading="addLoading"
      element-loading-text="添加中...."
    >
      <el-form
        :model="ParamsObj"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'only' ? '静态属性：' : '动态参数：'"
          prop="attr_name"
        >
          <el-input v-model="ParamsObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改 动态参数/静态属性的 对话框 -->
    <el-dialog
      :title="activeName === 'only' ? '修改静态属性' : '修改动态参数'"
      :visible.sync="editDialog"
      width="50%"
      @close="closeEditDialog"
      v-loading="editLoading"
      element-loading-text="修改中...."
    >
      <el-form
        :model="ParamsObj"
        :rules="rules"
        ref="editRule"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'only' ? '静态属性：' : '动态参数：'"
          prop="attr_name"
        >
          <el-input v-model="ParamsObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate } from '@/api/goods'
import {
  getparamsList,
  addParams,
  searchParams,
  editParams,
  deleteParams
} from '@/api/params'

export default {
  name: 'paramsIndex',
  components: {},
  props: {},
  data() {
    return {
      categories: [],
      dyParams: [], // 动态参数列表
      stParams: [], // 静态参数列表
      ParamsObj: { attr_name: '' },
      addLoading: false,
      editLoading: false,
      selectKeys: [], // 选中项的id 组成的数组
      props: {
        value: 'cat_id', // 指定选项的值为选项对象的某个属性值
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      active: true, // 添加参数按钮的禁用
      dialogVisible: false,
      editDialog: false,
      rules: {
        attr_name: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 13 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    //   计算 选中的数组长度 判断 按钮是否禁用
    isBtnDiasabled() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    }
  },
  watch: {},
  created() {
    this.loadCateList()
  },
  mounted() {},
  methods: {
    async loadCateList() {
      const { data } = await getGoodsCate()
      if (data.meta.status === 200) {
        this.categories = data.data
      } else {
        this.$message.error('获取分类失败')
      }
    },
    // 监听级联的变化
    handleChange() {
      this.getParamsData()
    },
    // 获取动态和静态参数 的数据
    async getParamsData() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.dyParams = []
        this.stParams = []
        this.$message.error('注意：只允许第三级分类设置相关参数')
        return
      }
      const id = this.selectKeys[this.selectKeys.length - 1]
      const { data } = await getparamsList(id, {
        sel: this.activeName
      })
      data.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (data.meta.status === 200) {
        if (this.activeName === 'only') {
          this.stParams = data.data
        } else {
          this.dyParams = data.data
        }
      } else {
        this.$message.error('获取参数失败')
      }
    },
    // 监听tab栏的切换
    handleClick() {
      this.getParamsData()
    },
    // 显示添加动静态参数
    showParams() {
      this.dialogVisible = true
    },
    // 添加参数
    addParams() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.addLoading = true
          const id = this.selectKeys[this.selectKeys.length - 1]
          const { data } = await addParams(id, {
            attr_name: this.ParamsObj.attr_name,
            attr_sel: this.activeName
          })
          if (data.meta.status === 201) {
            this.addLoading = false
            this.dialogVisible = false
            this.$message.success('添加成功')
            this.getParamsData()
          } else {
            this.addLoading = false
            this.$message.error('添加失败')
          }
        } else {
          return false
        }
      })
    },
    // 显示编辑参数
    async showEditdyParams(scope) {
      this.editDialog = true
      // 根据id获取 参数
      const id = scope.cat_id
      const aId = scope.attr_id
      const { data } = await searchParams(id, aId, {
        sel: this.activeName
      })
      if (data.meta.status === 200) {
        this.ParamsObj = data.data
      } else {
        this.$message.error('获取失败')
      }
    },
    // 提交编辑参数
    editParams() {
      this.$refs.editRule.validate(async (valid) => {
        if (valid) {
          this.editLoading = true
          const name = this.ParamsObj.attr_name.trim()
          const id = this.ParamsObj.cat_id
          const aId = this.ParamsObj.attr_id
          const { data } = await editParams(id, aId, {
            attr_name: name,
            attr_sel: this.activeName
          })
          if (data.meta.status === 200) {
            this.editLoading = false
            this.editDialog = false
            this.getParamsData()
            this.$message.success('参数修改成功')
          } else {
            this.editLoading = false
            this.$message.error(data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    // 监听 添加参数对话框的关闭事件
    dialogClosed() {
      this.$refs.ruleForm.resetFields()
    },
    // 监听修改参数对话框的关闭事件
    closeEditDialog() {
      this.$refs.editRule.resetFields()
    },
    // 删除参数
    async deletedyParams(scope) {
      const id = scope.cat_id
      const aId = scope.attr_id
      const result = await this.$confirm(
        '要永久删除此参数, 是否继续?',
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
        const { data } = await deleteParams(id, aId)
        if (data.meta.status === 200) {
          this.$message.success('删除成功~')
          this.getParamsData()
        }
      }
    },
    // 添加 参数attt_vals的事件
    showInput(scope) {
      scope.inputVisible = true
      //   文本框立即获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(scope) {
      if (scope.inputValue.trim().length === 0) {
        scope.inputValue = ''
        scope.inputVisible = false
        return
      }
      //   添加 参数属性
      scope.attr_vals.push(scope.inputValue.trim())
      scope.inputValue = ''
      scope.inputVisible = false
      //   调用函数 持久数据
      this.saveAttrVlas(scope)
    },
    // 参数标签保存到数据库里
    async saveAttrVlas(scope) {
      //   发送请求
      const id = scope.cat_id
      const aId = scope.attr_id
      const { data } = await editParams(id, aId, {
        attr_name: scope.attr_name,
        attr_sel: scope.attr_sel,
        attr_vals: scope.attr_vals.join(' ')
      })
      if (data.meta.status === 200) {
        this.$message.success('修改参数成功')
      } else {
        this.$message.error('修改失败')
      }
    },
    // 删除参数属性
    handleClose(scope, index) {
      scope.attr_vals.splice(index, 1)
      this.saveAttrVlas(scope)
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;

  .cascader-wrap {
    display: flex;
    align-items: center;
    margin-top: 15px;
    span {
      font-size: 18px;
    }
    .cascader {
      width: 60%;
      margin-left: 20px;
    }
  }

  .input-tag {
    width: 97px;
  }
}
</style>
