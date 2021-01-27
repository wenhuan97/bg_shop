<template>
  <div class="login-container">
    <div class="login-form">
      <!-- 登录的logo -->
      <div class="login-logo">
        <img src="./logo.png" alt="" />
      </div>
      <!-- 登录的表单 -->
      <el-form
        :model="user"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="user.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!-- <i class="el-icon-lock"></i> -->
          <el-input
            prefix-icon="el-icon-lock"
            v-model="user.password"
            placeholder="请输入用户密码"
          ></el-input>
        </el-form-item>
        <!-- 登录的按钮 -->
        <el-form-item class="login-btn">
          <el-button
            style="margin-right: 20px"
            type="primary"
            size="small"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button size="small" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userLogin } from '@/api/user.js'

export default {
  name: 'loginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const { data } = await userLogin({
            username: this.user.username,
            password: this.user.password
          })
          if (data.meta.status === 200) {
            loading.close()
            //   登录成功 跳转至 主页
            this.$router.push('/')
            this.$message.success('登录成功~')
          } else {
            loading.close()
            this.$message.error('登录失败，用户名或者密码错误')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;

  .login-form {
    width: 450px;
    height: 300px;
    padding: 114px 10px 15px;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .login-logo {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      width: 125px;
      height: 125px;
      border-radius: 100%;
      background-color: #eeeeee;
      border: 10px solid #fff;
      box-shadow: 1px -1px 3px 1px #888;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .login-btn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
