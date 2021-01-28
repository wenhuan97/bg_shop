<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加用户按钮 -->
      <el-button
        @click="showAddRole"
        class="add-btn"
        size="small"
        type="primary"
      >
        添加用户
      </el-button>
      <!-- 角色列表 -->
      <el-table border :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 展开列的 数据 -->
            <!-- 三个 for循环 最外层为 一级权限 -->
            <el-row
              :class="['bdBtm', 'box', i1 === 0 ? 'bdTop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="deleteRoleRights(scope.row, item1.id)"
                  closable
                  class="auth-wrap"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['box', i2 === 0 ? '' : 'bdTop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      @close="deleteRoleRights(scope.row, item2.id)"
                      type="success"
                      closable
                      class="auth-wrap"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="danger"
                      closable
                      @close="deleteRoleRights(scope.row, item3.id)"
                      class="auth-wrap"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" content="编辑角色" placement="top">
              <el-button
                @click="showEditRole(scope)"
                circle
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="删除角色" placement="top">
              <el-button
                @click="deleteRole(scope.row.id)"
                circle
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="分配权限" placement="top">
              <el-button
                @click="allotRole(scope.row)"
                circle
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的 对话框 -->
    <el-dialog
      title="添加用户"
      v-loading="addLoading"
      element-loading-text="用户添加中...."
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="30%"
    >
      <el-form
        :model="roleObj"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名：" prop="roleName">
          <el-input v-model="roleObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input v-model="roleObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的 对话框 -->
    <el-dialog
      title="修改用户"
      v-loading="editLoading"
      element-loading-text="用户修改中...."
      :visible.sync="editDialog"
      @close="closeEditDialog"
      width="30%"
    >
      <el-form
        :model="serachRoleObj"
        :rules="editRules"
        ref="editRule"
        label-width="100px"
      >
        <el-form-item label="角色名：" prop="roleName">
          <el-input v-model="serachRoleObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input v-model="serachRoleObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      @close="activeKeys = []"
      title="分配权限"
      :visible.sync="allotDialog"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :default-checked-keys="activeKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  deleteRoleRights,
  addRoleRights,
  addRole,
  searchRole,
  editRole,
  deleteRole
} from '@/api/roles'
import { getRightsList } from '@/api/rights'

export default {
  name: 'rolesIndex',
  components: {},
  props: {},
  data() {
    return {
      rolesList: [], // 角色列表
      roleObj: {
        roleName: '',
        roleDesc: ''
      },
      serachRoleObj: {},
      dialogVisible: false, // 添加用户的对话框显示
      editDialog: false, // 添加用户的对话框显示
      addLoading: false,
      editLoading: false,
      rightsList: [], // 权限列表
      allotDialog: false, // 分配权限的对话框
      defaultProps: {
        children: 'children', // 树形控件 通过children进行嵌套
        label: 'authName' // 用来展示的 键的名
      },
      //   被选中的 节点id 组成的数组
      activeKeys: [],
      rId: 0, // 角色的id
      //   添加用户的验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadRolesList()
  },
  mounted() {},
  methods: {
    //   获取角色列表
    async loadRolesList() {
      const { data } = await getRolesList()
      this.rolesList = data.data
    },
    // 显示添加角色的对话框
    showAddRole() {
      this.dialogVisible = true
    },
    // 添加用户
    submitRoles() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.addLoading = true
          const { data } = await addRole({
            roleName: this.roleObj.roleName,
            roleDesc: this.roleObj.roleDesc
          })
          if (data.meta.status === 201) {
            this.addLoading = false
            this.$message.success('创建角色成功')
            this.dialogVisible = false
            this.loadRolesList()
          } else {
            this.addLoading = false
            this.$message.error('添加失败')
          }
        } else {
          return false
        }
      })
    },
    // 监听添加用户对话框关闭事件
    closeDialog() {
      //   重置表单 达到清空文本框的效果
      this.$refs.ruleForm.resetFields()
    },
    // 显示编辑角色的对话框
    async showEditRole(scope) {
      this.editDialog = true
      const { data } = await searchRole(scope.row.id)
      this.serachRoleObj = data.data
    },
    // 编辑角色
    submitEditRoles() {
      this.$refs.editRule.validate(async (valid) => {
        if (valid) {
          this.editLoading = true
          const { data } = await editRole(this.serachRoleObj.roleId, {
            roleName: this.serachRoleObj.roleName,
            roleDesc: this.serachRoleObj.roleDesc
          })
          if (data.meta.status === 200) {
            this.editLoading = false
            this.editDialog = false
            this.loadRolesList()
            this.$message.success('角色修改成功')
          } else {
            this.loading = false
            this.$message.error('角色修改失败')
          }
        } else {
          return false
        }
      })
    },
    // 监听编辑用户对话框的关闭事件
    closeEditDialog() {
      //   重置表单 达到清空文本框的效果
      this.$refs.editRule.resetFields()
    },
    // 删除角色
    async deleteRole(id) {
      const result = await this.$confirm(
        '要永久删除此角色, 是否继续?',
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
        const { data } = await deleteRole(id)
        if (data.meta.status === 200) {
          this.$message.success('删除成功~')
          this.loadRolesList()
        }
      }
    },
    // 删除角色指定权限
    async deleteRoleRights(role, rightsId) {
      const result = await this.$confirm('确定要删除此权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (result === 'confirm') {
        const { data } = await deleteRoleRights(role.id, rightsId)
        if (data.meta.status === 200) {
          console.log(role)
          role.children = data.data
          this.$message.success('删除权限成功')
        }
      }
    },
    // 展示分配角色的数据
    async allotRole(scope) {
      this.rId = scope.id
      this.getNodeRights(scope, this.activeKeys)
      this.allotDialog = true
      const { data } = await getRightsList('tree')
      if (data.meta.status === 200) {
        this.rightsList = data.data
      } else {
        this.$message.error('获取权限列表失败')
      }
    },
    //  修改分配角色的数据
    async addRoleRights() {
      // 获取所有 已选中和半选中的 id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      //   以逗号分隔组成 字符串
      const kStr = keys.join(',')
      const { data } = await addRoleRights(this.rId, kStr)
      if (data.meta.status === 200) {
        this.$message.success('权限分配成功')
        this.allotDialog = false
        this.loadRolesList()
      } else {
        this.$message.error('分配权限失败')
      }
    },
    // 通过 递归 获取到 所有三级权限的id
    getNodeRights(node, arr) {
      // 判断是否为 三级权限（有无children)
      if (!node.children) {
        // 是三级节点
        return arr.push(node.id)
      }
      //   如果不是 三级节点 就使用递归 得到三级节点
      node.children.forEach((item) => {
        this.getNodeRights(item, arr)
      })
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;
  .add-btn {
    margin-bottom: 15px;
  }
}

.auth-wrap {
  margin: 10px 10px 10px 0;
}
.bdTop {
  border-top: 1px solid #ccc;
}
.bdBtm {
  border-bottom: 1px solid #ccc;
}
.box {
  display: flex;
  align-items: center;
}
</style>
