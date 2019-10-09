<template>
  <div class="login-container">



    <el-form ref="form" :model="form" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <img src="/logo.png" alt="">
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          ref="email"
          v-model="form.email"
          placeholder="邮箱"
          name="email"
        />
      </el-form-item>

      <!-- <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual> -->
        <el-form-item prop="password">
          <span class="svg-container">
          <i class="el-icon-lock"></i>

          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="form.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="slider">
       
        <!-- <div id="aliyun-slider" class="nc-container"></div>  -->
        <!--No-Captcha渲染的位置，其中 class 中必须包含 nc-container-->
         
        </el-form-item>

      <!-- </el-tooltip> -->

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <div>
        没有帐号？ 快去 <nuxt-link to="/register">注册</nuxt-link>
      </div>
      <div class="auth">
        <img src="@/static/weibo.svg" alt="">
        <img src="@/static/weixin.svg" alt="">
        <img src="@/static/github.svg" alt="">
      </div>
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5'

export default {
  layout:'app',
  name: 'Login',

  // head:{
  //   script:[
  //       {src:"//g.alicdn.com/sd/ncpc/nc.js?t=2015052012"},
  //   ]
  // },
  components: {  },
  data() {

    return {
      form: {
        email: '316783812@qq.com',
        password: 'a316783812',
        slider:''
      },
      slider:{

      },
      loginRules: {
        email: [
          { required: true,  message:'请输入邮箱' },
          { type:'email',message:'请输入正确的邮箱' }
        ],
        password: [
          { required: true,  message:'请输入密码'},
          { max: 12, message:'密码长度不得超过12'}
        ],
        // slider:[
        //   { required: true,  message:'请滑动滑块' },
        // ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     const query = route.query
    //     if (query) {
    //       this.redirect = query.redirect
    //       this.otherQuery = this.getOtherQuery(query)
    //     }
    //   },
    //   immediate: true
    // }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // this.initSlider()




    // this.$refs.username.focus()
    // if (this.form.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.form.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // initSlider(){
    //     let nc_token = ["FFFF0N0N0000000066DB", (new Date()).getTime(), Math.random()].join(':');
    //     let NC_Opt = 
    //     {
    //         renderTo: "#aliyun-slider",
    //         appkey: "FFFF0N0N0000000066DB",
    //         scene: "nc_login",
    //         token: nc_token,
    //         customWidth: 450,
    //         trans:{"key1":"code0"},
    //         elementID: ["usernameID"],
    //         is_Opt: 0,
    //         language: "cn",
    //         isEnabled: true,
    //         timeout: 3000,
    //         times:5,
    //         apimap: {

    //         },   
    //         callback:  (data)=> { 
    //           this.slider = data
    //           this.form.slider = data.csessionid
    //           //   window.console && console.log(nc_token)
    //           //   window.console && console.log(data.csessionid)
    //           //   window.console && console.log(data.sig)
    //         }
    //     }
    //     var nc = new noCaptcha(NC_Opt)
    //      nc.upLang('cn', {
    //         _startTEXT: "请按住滑块，拖动到最右边",
    //         _yesTEXT: "验证通过",
    //         _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
    //         _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
    //     })
    // },
    handleLogin() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          let obj = {
            email: this.form.email,
            password: md5(this.form.password),
            // ...this.slider
          }
          this.loading = false
          let ret = await this.$store.dispatch('user/login', obj)
          if(ret.code===0){
            this.$notify({
              title: '登录成功',
              type: 'success'
            });
            setTimeout(()=>{
                this.$router.push({ path:'/'})
            },1500)
          }
          // this.$store.dispatch('user/login', this.form)
          //   .then(() => {
          //     this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          //     this.loading = false
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">

.nc-container .nc_scale span{
  height:34px;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;

    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    margin-bottom:20px;
    img{
      width:200px;

    }

  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .auth{
    margin-top:10px;
    text-align: center;
    img{
      width:45px;
      height:45px;
      margin: 0 30px;
    }
  }

}
</style>
