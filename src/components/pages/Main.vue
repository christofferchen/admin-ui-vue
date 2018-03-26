<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{collapsed ? '' : this.$appConfig.title}}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><i class="fa fa-user-circle"></i> {{ loginName }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/changePassword"><i class="fa fa-key"></i> 修改密码</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout"><i class="fa fa-sign-out"></i> 退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" :collapse='collapsed' class="el-menu-vertical-demo" unique-opened router>
          <template v-for="(item, index) in menuTree" v-if="!item.Hidden">
            <el-submenu :index="index+''" v-if="item.Children && item.Children.length" :key="item.Id">
              <template slot="title">
                <i class="fa-fw" :class="item.Icon"></i> <span slot="title">{{item.FunctionName}}</span>
              </template>
              <el-menu-item v-for="child in item.Children" :index="child.Url" :key="child.Url">
                <i class="fa-fw" :class="child.Icon"></i>
                {{child.FunctionName}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.Url" :key="item.Url">
              <i class="fa-fw" :class="item.Icon"></i>
              {{item.FunctionName}}
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(caption, i) in $auth.getBreadcrumbs($router.currentRoute.path)" v-if="i > 0" :key="caption">{{ caption }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
    <!--平台通知消息显示-->
    <el-col>
      <div v-if="isAlert">
        <div class="list-alert">
          <div class="alert-title">
            消息提醒
          <button type="button" aria-label="Close" class="el-message-box__headerbtn" style="top:7px;" @click="closeAlert">
            <i class="el-message-box__close el-icon-close" style="color:white"></i>
          </button>
       </div>
          <div class="list-box">
            <ul class="alert-ul">
              <li v-for="(list,index) in alertList" :key="list.Id"    @click="gotoDetails(list.Id,list.Url,index)" >
                  <span>{{list.Message}}</span>
                  <span>{{ $formatters.datetime()(null, null, list.CreateTime) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default {
  name: 'mainPage',
  data () {
    return {
      loginName: '',
      menuSpan: 4,
      collapsed: false,
      menuTree: this.$auth.getMenuTree().Children,
      alertList: [],
      isAlert: false
    }
  },
  methods: {
    collapse () {
      this.collapsed = !this.collapsed
      this.menuSpan = this.collapsed ? 1 : 4
    },
    logout () {
      this.$confirm('确定要退出登录吗?', '提示', { type: 'info' }).then(() => {
        sessionStorage.removeItem('user')
        this.$router.push('/login')
      })
    },
    getAlertList () {
      this.$api.MessageRemind.getUnreadList().then(data => {
        this.alertList = data
        if (this.alertList.length !== 0) {
          this.isAlert = true
        } else {
          this.isAlert = false
        }
      })
    },
    gotoDetails (Id, Url, index) {
      this.$api.MessageRemind.readMessage([Id]).then(data => {
        this.$router.push(Url)
        // self.alertList.$remove(index);
        this.alertList = this.alertList.filter(p => p.Id !== Id)
        if (this.alertList.length !== 0) {
          this.isAlert = true
        } else {
          this.isAlert = false
        }
      })
    },
    closeAlert () {
      this.isAlert = false
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    const self = this
    if (user) {
      user = JSON.parse(user)
      this.loginName = user.UserName
      setInterval(function () {
        self.getAlertList()
      }, 60000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../styles/vars";

a {
  color: #000;
  text-decoration: none;
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 64px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        margin-top: 12px;
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}

ul {
  margin: 0;
  padding: 0;
}
.list-alert {
  width: 380px;
  height: 170px;
  background-color: white;
  position: fixed;
  bottom: 20px;
  right: 20px;
  border: 1px solid #e6e6e6;
  z-index: 999;
}
.list-box {
  width: 100%;
  height: 140px;
  overflow-x: auto;
}
.list-alert ul {
  width: 95%;
  display: block;
  margin: 0 auto;
  list-style-type: square;
}
.alert-ul li {
  width: 100%;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  border-bottom: 1px solid #e6e6e6;
  cursor: pointer;
  list-style: none;
}
.alert-ul li span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.alert-ul li span:nth-of-type(1) {
  width: 55%;
  text-align: left;
  float: left;
}
.alert-ul li span:nth-of-type(2) {
  width: 45%;
  text-align: left;
  float: right;
}
.alert-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  background-color: #20a0ff;
  color: white;
}
.alert-title img {
  width: 20px;
  margin-top: 6px;
  float: right;
  margin-right: 10px;
  cursor: pointer;
}
</style>
