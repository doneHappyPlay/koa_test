<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <img src="/logo.png" alt="">
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-mobile"></i>
        </span>
        <el-input
          ref="email"
          v-model="form.email"
          placeholder="邮箱"
          name="email"
        />
      </el-form-item>

      <el-form-item prop="nickname">
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          ref="nickname"
          v-model="form.nickname"
          placeholder="昵称"
          name="nickname"
        />
      </el-form-item>

      <el-form-item prop="emailcode" class="email-code">
        <div class="send-email-btn">
          <el-button type='primary' @click="sendCode">{{code.text}}</el-button>
        </div>
        <span class="svg-container">
          <i class="el-icon-menu"></i>
        </span>
        <el-input
          
          ref="emailcode"
          v-model="form.emailcode"
          placeholder="邮箱验证码"
          name="emailcode"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="captcha" class="email-code">
        <div class="send-email-btn">
          <img @click="resetCaptcha" :src="code.captcha" alt="">
          <!-- <el-button type='primary' @click="sendCode">{{code.text}}</el-button> -->
        </div>
        <span class="svg-container">
          <i class="el-icon-sugar"></i>
        </span>
        <el-input
          
          ref="captcha"
          v-model="form.captcha"
          placeholder="验证码"
          name="captcha"
        >
        </el-input>
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
          />
          <span class="show-pwd" @click="showPwd">
            <i v-if="passwordType === 'password'" class="el-icon-lock"></i>
            <i v-else  class="el-icon-key"></i>
          </span>
        </el-form-item>

        <el-form-item prop="repassword">
          <span class="svg-container">
          <i class="el-icon-lock"></i>

          </span>
          <el-input
            ref="repassword"
            v-model="form.repassword"
            type="password"
            placeholder="重复密码"
            name="repassword"
          />
         
        </el-form-item>
      <!-- </el-tooltip> -->

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
      <div>
        已有帐号？ 快去 <nuxt-link to="/login">登录</nuxt-link>
      </div>
      <div class="auth">
        <img @click="progress" src="@/static/weibo.svg" alt="">
        <img @click="progress" src="@/static/weixin.svg" alt="">
        <img src="@/static/github.svg" alt="">
      </div>
    </el-form>

  
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  layout:'app',
  name: 'Login',
  components: {  },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      form: {
        email: '316783812@qq.com',
        password: 'a316783812',
        repassword: 'a316783812',
        nickname:'大圣最俊朗',
        emailcode:'',
        captcha:''
      },
      code:{
        text:'发送',
        timer:60,
        captcha:'/api/user/captcha'
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
         emailcode: [
          { required: true,  message:'请输入邮箱验证码'},
          ],
        captcha: [
          { required: true,  message:'请输入验证码'},
        ],
        repassword:[
          {
            required: true,
            trigger:'blur',
            validator:(rule, value, callback) => {
              if (value!== this.form.password) {
                callback(new Error('两次输入密码要一致'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      passwordType: 'password',
      loading: false,
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       // const query = route.query
  //       // if (query) {
  //       //   this.redirect = query.redirect
  //       //   this.otherQuery = this.getOtherQuery(query)
  //       // }
  //     },
  //     immediate: true
  //   }
  // },

  methods: {
        // captcha:'/api/code'
    resetCaptcha(){
      this.code.captcha = '/api/user/captcha?_t='+new Date().getTime()
    },
    progress(){
          this.$notify({
            title: '开发中',
            type: 'warning'
          });
    },
    async sendCode(){
      let ret = await this.$http.get('user/sendcode?email='+this.form.email)
      // console.log(ret)
      if(ret.code==0){
          this.$notify({
            title: '发送成功',
            type: 'success'
          });
      }
      // this.$store.dispatch('user/sendcode',{x:2})
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          let obj = {
            email : this.form.email,
            emailcode:this.form.emailcode,
            captcha:this.form.captcha,
            nickname:this.form.nickname,
            password: md5(this.form.password),
          }
          let ret = await this.$http.post('/user/register',obj)
           this.loading = false

          if(ret.code===0){
            this.$notify({
              title: '注册成功',
              type: 'success'
            });

            setTimeout(()=>{
                this.$router.push({ path:'/login'})
            },1500)
          }
          // if()
          // console.log(ret)
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
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
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

.email-code{
  width:340px;
  position: relative;
  .send-email-btn{
    position: absolute;
    right:-110px;
    .el-button{
      width:90px;
      height:50px;
    }
    img{
            width:90px;
      height:50px;
      cursor: pointer;
    }
  }
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
