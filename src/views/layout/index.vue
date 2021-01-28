<template>
  <div class="layout-container">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header class="home-head">
        <!-- 左侧 -->
        <div class="home-info">
          <img src="./logo.png" alt="" />
          <span>电商后台管理系统 </span>
        </div>
        <el-button class="home-btn" type="info" size="small" @click="logout"
          >退出登录</el-button
        >
      </el-header>
      <el-container>
        <el-aside class="home-aside" :width="collapse ? '64px' : '200px'">
          <div class="menu-btn" @click="toggleCollapse">
            <i class="el-icon-s-operation"></i>
          </div>
          <el-menu
            router
            unique-opened
            :collapse="collapse"
            :collapse-transition="false"
            :default-active="$route.path"
            background-color="#313744"
            text-color="#fff"
            active-text-color="#409EFF"
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="fontObj[item.id]"></i>
                <span style="margin-left: 10px">{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="'/' + item2.path"
                v-for="item2 in item.children"
                :key="item2.id"
              >
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="home-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuList } from '@/api/author.js'

export default {
  name: 'layoutIndex',
  components: {},
  props: {},
  data() {
    return {
      menuList: [],
      // 根据循环出的 id  定义图标的对象
      fontObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      //   菜单的折叠
      collapse: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadMenuList()
  },
  mounted() {},
  methods: {
    //   获取左侧菜单列表
    async loadMenuList() {
      const { data } = await getMenuList()
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.menuList = data.data
    },

    // 折叠切换
    toggleCollapse() {
      this.collapse = !this.collapse
    },

    //   退出登录
    logout() {
      this.$confirm('您确定要退出登录吗?', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100vh;
}
.home-info {
  display: flex;
  align-items: center;
  width: 250px;
  height: 65px;
  img {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  span {
    color: #fff;
    font-size: 18px;
  }
}
.home-head {
  position: relative;
  padding: 0;
  .home-btn {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  height: 40px;
  background-color: #353c40;
}
.home-aside {
  background-color: #313744;
  .menu-btn {
    font-size: 18px;
    color: #fff;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    background-color: #455164;
  }
}
.home-main {
  background-color: #e9edf2;
}
.el-menu {
  border: none;
}
</style>
