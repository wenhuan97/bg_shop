<template>
  <div class="good-add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 信息说明 -->
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="info"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        class="steps"
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        :model="goods"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
        class="form"
        label-position="top"
        v-loading="addLoading"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTab"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goods.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="goods.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goods.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goods.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goods.goods_cat"
                :options="goodsCates"
                clearable
                @change="handleChange"
                :props="props"
                class="cascader"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in paramsList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTable"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="successUpl"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="goods.goods_introduce" />
            <el-button @click="add" style="margin-top: 15px" type="primary"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片的对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <div class="img-wrap">
        <img :src="imgUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import _ from 'lodash'
import { getGoodsCate, addGoods } from '@/api/goods'
import { getparamsList } from '@/api/params'

export default {
  name: 'goodAdd',
  components: {},
  props: {},
  data() {
    return {
      addLoading: false,
      dialogVisible: false,
      imgUrl: '', // 预览图片的地址
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      goods: {
        goods_name: '',
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_cat: [], // 级联选中的id 数组
        pics: [], // 上传的图片数组
        goods_introduce: '', // 商品描述
        attrs: [] // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      goodsCates: [], // 商品分类
      paramsList: [], // 参数列表
      onlyTable: [], // 静态属性列表
      activeIndex: '0',
      props: {
        value: 'cat_id', // 指定选项的值为选项对象的某个属性值
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      formRules: {
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
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadGoodsCate()
  },
  mounted() {},
  methods: {
    async loadGoodsCate() {
      //   获取分类列表
      const { data } = await getGoodsCate()
      this.goodsCates = data.data
    },
    // 只允许选择三级分类
    handleChange() {
      if (this.goods.goods_cat.length === 2) {
        this.goods.goods_cat = []
        this.$message.error('只能选择三级分类')
      }
    },
    // tabs点击
    async handleClick() {
      if (this.activeIndex === '1') {
        //   获取参数列表
        const id = this.goods.goods_cat[2]
        const { data } = await getparamsList(id, {
          sel: 'many'
        })
        data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        if (data.meta.status === 200) {
          this.$message.success('获取参数成功')
          this.paramsList = data.data
        } else {
          this.$message.error(data.meta.msg)
        }
      } else if (this.activeIndex === '2') {
        //   获取动态属性列表
        const id = this.goods.goods_cat[2]
        const { data } = await getparamsList(id, {
          sel: 'only'
        })
        if (data.meta.status === 200) {
          this.$message.success('获取属性成功')
          this.onlyTable = data.data
        } else {
          this.$message.error(data.meta.msg)
        }
      }
    },
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    beforeTab(active, oldActive) {
      if (oldActive === '0' && this.goods.goods_cat.length === 0) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 上传图片成功
    successUpl(file) {
      if (file.meta.status === 200) {
        const picsInfo = {
          pic: file.data.tmp_path
        }
        this.goods.pics.push(picsInfo)
        console.log(this.goods.pics)
      }
    },
    // 删除图片
    handleRemove(file) {
      const pathFile = file.response.data.tmp_path
      const index = this.goods.pics.findIndex((item) => item.pic === pathFile)
      this.goods.pics.splice(index, 1)
      console.log(this.goods)
    },
    // 点击预览图片
    handlePreview(file) {
      this.dialogVisible = true
      this.imgUrl = file.url
    },
    // 添加商品
    add() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          this.addLoading = true
          //   const form = _.cloneDeep(this.goods)
          this.goods.goods_cat = this.goods.goods_cat.join(',')
          //   处理动态参数
          this.paramsList.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.goods.attrs.push(newInfo)
            // form.attrs = this.goods.attrs
          })
          //   处理静态属性
          this.onlyTable.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.goods.attrs.push(newInfo)
            // form.attrs = this.goods.attrs
          })
          const { data } = await addGoods(this.goods)
          if (data.meta.status === 201) {
            this.addLoading = false
            this.$message.success('商品添加成功')
            this.$router.push('/goods')
          }
        } else {
          this.addLoading = false
          this.$message.error('请填写必要的表单项')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;
  height: 100%;

  .steps {
    margin: 15px 0;
  }
  .cascader {
    width: 50%;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
}

.img-wrap {
  img {
    width: 100%;
  }
}
</style>
