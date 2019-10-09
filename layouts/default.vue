<template>


<el-container>  
  <!-- <div>{{userinfo}}</div> -->
<el-header>


<!-- <el-row>
  
  <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
  
</el-row> -->

<el-menu default-active="1" class="el-menu-demo" mode="horizontal">

  <el-menu-item index="0">
    <img class="logo" src="/logo.png" alt="">
  </el-menu-item>
  <el-menu-item index="1">
    <nuxt-link to="/">首页</nuxt-link>
  </el-menu-item>

  

    
  <el-menu-item index="4"><a href="https://www.kaikeba.com" >开课吧</a></el-menu-item>

  <el-menu-item @click="logout" v-if="userinfo.id" index="5" class="pull-right">
      <span>退出</span>
  </el-menu-item>
  <el-menu-item v-if="userinfo.id" index="6" class="pull-right">
    <nuxt-link  to="/editor/new">
    <el-button>写文章</el-button>

    </nuxt-link>


    <UserDisplay :user="userinfo">

    </UserDisplay>



  </el-menu-item>


  <el-menu-item v-if="!userinfo.id" index="5" class="pull-right">
    <nuxt-link to="/register">注册</nuxt-link>
  </el-menu-item>
  <el-menu-item v-if="!userinfo.id" index="6" class="pull-right">
    <nuxt-link to="/login">登录</nuxt-link>
  </el-menu-item>

</el-menu>
 
</el-header>

<el-main>

    <nuxt />

</el-main>

<el-footer>
  
</el-footer>
</el-container>
</template>

<script>
import UserDisplay from '~/components/UserDisplay.vue'

export default {
  components:{UserDisplay},
  mounted(){
    console.log(this.$store)
    this.getUser()
  },
  methods:{
    async getUser(){
      let token = localStorage.getItem('Kkb-Token')
      if(token){
        this.$store.dispatch('user/detail')
      }
    },
    logout(){
      localStorage.removeItem('Kkb-Token')
      this.$store.commit('user/LOGOUT')
    }
  },
  computed:{
    userinfo(){
      return this.$store.state.user
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: #eee;
}
.el-divider--horizontal{
  height: 2px;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
a{
  text-decoration: none;
}
.logo{
  height:70%;
}
.kkb-container{
  width:1200px;
  margin:0 auto;
  background: #fff;
  padding:20px;
}
.pull-right{
  float:right !important;
}

.k-container{
  width:1200px;
  margin:0 auto;
}
i.rotate180{
            transform: rotate(180deg);
        }

.ml20{
  margin-left: 20px;
}
.el-icon-thumb{
  letter-spacing: 5px;
}
</style>
