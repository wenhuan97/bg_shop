<template>
  <div class="users-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-input class="search-input" placeholder="请输入用户名" v-model="text">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="loadUserList"
        ></el-button>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="dialogVisible = true"
        >添加用户</el-button
      >
      <!-- 表格 -->
      <el-table :data="userList" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStatus(scope)"
              v-model="scope.row.mg_state"
              active-color="#409eff"
              inactive-color="#C0CCDA"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" content="编辑用户" placement="top">
              <el-button
                @click="editUser(scope)"
                circle
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="删除用户" placement="top">
              <el-button
                @click="deleteUser(scope.row.id)"
                circle
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="分配角色" placement="top">
              <el-button
                @click="showAllotRoles(scope.row)"
                circle
                type="warning"
                icon="el-icon-setting"
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
        :current-page="pagenum"
        :page-sizes="[2, 3, 5]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的 对话框 -->
    <el-dialog
      destroy-on-close
      title="添加用户"
      v-loading="addLoading"
      element-loading-text="用户添加中...."
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="30%"
    >
      <el-form :model="users" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="users.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="users.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="users.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="users.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogEdit"
      width="30%"
      element-loading-text="数据修改中...."
      v-loading="loading"
      @close="closeEditDialog"
    >
      <el-form
        :model="editObj"
        :rules="editRules"
        ref="ruleEdit"
        label-width="100px"
      >
        <el-form-item label="用户名：">
          <el-input v-model="editObj.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="editObj.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="editObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      @close="closeAllotDialog"
      title="分配角色"
      :visible.sync="allotDialog"
      width="50%"
    >
      <div>所属用户：{{ userObj.username }}</div>
      <div style="margin: 15px 0">所属角色：{{ userObj.role_name }}</div>
      <div>
        <span>分配角色：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  editUserStatus,
  addUser,
  getUser,
  editUserSubmit,
  deleteUser,
  allotUser
} from '@/api/user'
import { getRolesList } from '@/api/roles'

export default {
  name: 'usersIndex',
  components: {},
  props: {},
  data() {
    // 自定义 邮箱 验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }

    var checkMobile = (rules, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        //   验证通过
        return callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }

    return {
      // 文本框搜索的内容
      text: '',
      //   select选中的并显示的值
      value: '',
      userList: [],
      userObj: {},
      roleList: [],
      pagenum: 1,
      pageSize: 2,
      total: 0, // 总数据条数
      username: '',
      password: '',
      email: '',
      mobile: '',
      dialogVisible: false,
      dialogEdit: false,
      addLoading: false,
      allotDialog: false,
      loading: false,
      //   修改用户的对象
      editObj: {},
      //   添加用户的参数
      users: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 13 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //   修改用户的验证
      editRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    //   获取用户数据列表
    this.loadUserList()
  },
  mounted() {},
  methods: {
    //   获取数据
    async loadUserList() {
      const { data } = await getUserList({
        query: this.text,
        pagenum: this.pagenum,
        pagesize: this.pageSize
      })
      this.userList = data.data.users
      this.total = data.data.total
    },
    // 切换用户状态
    async userStatus(scope) {
      const loading = this.$loading({
        lock: true,
        text: '状态修改中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const id = scope.row.id
      const type = scope.row.mg_state
      const { data } = await editUserStatus(id, type)

      if (data.meta.status === 200) {
        loading.close()
        this.$message.success('修改状态成功~')
      } else {
        loading.close()
        this.$message.error('修改失败')
      }
    },
    // 监听添加对话框的关闭事件
    closeDialog() {
      //   重置表单 达到清空文本框的效果
      this.$refs.ruleForm.resetFields()
    },
    // 监听修改对话框的关闭事件
    closeEditDialog() {
      //   重置表单 达到清空文本框的效果
      this.$refs.ruleEdit.resetFields()
    },
    // 添加用户 提交添加信息
    submitUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.addLoading = true
          const { data } = await addUser(this.users)
          if (data.meta.status === 201) {
            this.addLoading = false
            this.dialogVisible = false
            this.$message.success('添加用户成功')
            this.loadUserList()
          } else {
            this.addLoading = false
            this.$message.error('添加失败')
          }
        } else {
          return false
        }
      })
    },
    // 修改用户
    async editUser(scope) {
      this.dialogEdit = true
      const id = scope.row.id
      const { data } = await getUser(id)
      this.editObj = data.data
    },
    // 提交修改用户
    submitEditUser() {
      this.$refs.ruleEdit.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const id = this.editObj.id
          const { data } = await editUserSubmit(id, {
            email: this.editObj.email,
            mobile: this.editObj.mobile
          })
          if (data.meta.status === 200) {
            this.loading = false
            this.dialogEdit = false
            this.loadUserList()
            this.$message.success('用户资料修改成功')
          } else {
            this.loading = false
            this.$message.error('用户资料修改失败')
          }
        } else {
          return false
        }
      })
    },
    // 删除单个用户
    async deleteUser(id) {
      const result = await this.$confirm(
        '要永久删除此用户, 是否继续?',
        '提示',
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
        const { data } = await deleteUser(id)
        if (data.meta.status === 200) {
          this.$message.success('删除成功~')
          this.loadUserList()
        }
      }
    },
    // 展示分配角色对话框
    async showAllotRoles(userRole) {
      const { data } = await getRolesList()
      if (data.meta.status === 200) {
        this.roleList = data.data
      } else {
        this.$message.error('获取角色信息失败')
      }
      this.userObj = userRole
      this.allotDialog = true
    },
    // 分配角色
    async allotRoles() {
      if (!this.value) return this.$message.error('请选择要分配的角色')
      const { data } = await allotUser(this.userObj.id, this.value)
      if (data.meta.status === 200) {
        this.$message.success('分配角色成功')
        this.loadUserList()
        this.allotDialog = false
      } else {
        this.$message.error('分配失败')
      }
    },
    // 监听 关闭分配角色对话框的事件
    closeAllotDialog() {
      this.value = ''
      this.userObj = {}
    },
    // 分页器
    handleSizeChange(val) {
      this.pageSize = val
      this.loadUserList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.loadUserList()
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;

  .search-input {
    width: 480px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>
