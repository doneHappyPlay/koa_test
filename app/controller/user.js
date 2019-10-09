

'use strict';
const Controller = require('./base');
const md5 = require('md5')
// const Controller = require('egg').Controller;

const createUserRule = {
  email:{

  },
}
class UserController extends Controller {
  async index() {
    const { ctx } = this;
    // const user = await new ctx.model.User({username:'xx',password:"123"}).save();
    // console.log(ctx.model.Halou.find)
    const user = await ctx.model.User.find()
    // let user = await ctx.model.User.create({nickname:'54',email:'a@shengxinjing.cn',password:1})
    ctx.body  = user
  }
  async detail(){
      // console.log(this)
      let {ctx} = this
      let {email} = ctx.state
      const user = await this.checkUser(email)


    this.success(user)
  }
  async login(){
    const {ctx,app} = this
    console.log('login',ctx.request.body)
    const { email,password }= ctx.request.body
    const user = await this.ctx.model.User.findOne({
      email,
      password:password
    })

    if(user){
      const {nickname} = user
      const token = app.jwt.sign({       
        email,
        nickname,
        id:user._id
      }, app.config.jwt.secret, { // 秘钥
          // expiresIn: 60*60*24 // 过期时间
          expiresIn: '24h' // 过期时间
      });
      this.success({
        token,
        email,
      })
    }else{
      this.error('用户或者密码错误')
    }
    // await this.service.tools.checkSlider(ctx.request.body);
  }
  async checkUser(email){
    const user = await this.ctx.model.User.findOne({email})
    return user
  }
  async checkName(nickname){
    const user = await this.ctx.model.User.findOne({nickname})
    return user
  }
  async isFollow(){
    const {ctx} = this
    const me = await this.ctx.model.User.findById(ctx.state.userid);
    let isFollow = !!me.following.find(v=>v.toString()==ctx.params.id)
    console.log({isFollow})
    this.success({
      isFollow
    })
    
  }
  async follow(){
    const {ctx} = this
    const me = await this.ctx.model.User.findById(ctx.state.userid);
    let isFollow = !!me.following.find(v=>v.toString()==ctx.params.id)
    if(!isFollow){
      me.following.push(ctx.params.id);
      me.save();
      this.message('关注成功')
    }
    // const me = await User.findById(ctx.state.user._id).select('+following');

    // if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
    //   me.following.push(ctx.params.id);
    //   me.save();
    // }
  }
  async unfollow(){
    const {ctx} = this
    const me = await this.ctx.model.User.findById(ctx.state.userid);
    let index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
      this.message('取消成功')
    }
  }
  async following(){
    const {ctx} = this

    // const users = await ctx.model.User.find({ following: ctx.params.id });



    const users = await ctx.model.User.findById(ctx.params.id).populate('following');
    this.success(users.following)

  }
  async followers(){
    const {ctx} = this
    const users = await ctx.model.User.find({ following: ctx.params.id });
    this.success(users)

  }
  // async likeAnswer(ctx, next) {
  //   const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
  //   if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
  //     me.likingAnswers.push(ctx.params.id);
  //     me.save();
  //     await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } });
  //   }
  //   ctx.status = 204;
  //   await next();
  // }
  // async unlikeAnswer(ctx) {
  //   const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
  //   const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
  //   if (index > -1) {
  //     me.likingAnswers.splice(index, 1);
  //     me.save();
  //     await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } });
  //   }
  //   ctx.status = 204;
  // }
  async articleStatus(){
    const {ctx} = this
    const me = await this.ctx.model.User.findById(ctx.state.userid);
    let like = !!me.likeArticle.find(id=>id.toString()==ctx.params.id)    
    let dislike = !!me.dislikeArticle.find(id=>id.toString()==ctx.params.id)   
    this.success({
      like,dislike
    }) 
  }

  async likeArticle(){
    const {ctx} = this
     
    const me = await ctx.model.User.findById(ctx.state.userid);
    if (!me.likeArticle.find(id => id.toString()==ctx.params.id)) {
      me.likeArticle.push(ctx.params.id);
    console.log(me)

      me.save();
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { like: 1 } });
      return this.message('点赞成功')
    }
    this.message('已经赞过了')
    // likeArticle
  }

  async cancelLikeArticle(){
    const {ctx} = this
    const me = await ctx.model.User.findById(ctx.state.userid);
    const index = me.likeArticle.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.likeArticle.splice(index, 1);
      me.save();
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { like: -1 } });
      return this.message('取消成功')

    }
    this.message('已经取消了')
  }


  async dislikeArticle(){
    const {ctx} = this
     
    const me = await ctx.model.User.findById(ctx.state.userid);
    if (!me.dislikeArticle.find(id => id.toString()==ctx.params.id)) {
      me.dislikeArticle.push(ctx.params.id);
    console.log(me)

      me.save();
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { dislike: 1 } });
      return this.message('成功踩')
    }
    // await next()
    this.message('已经踩过了')
    // likeArticle
  }

  async cancelDislikeArticle(){
    const {ctx} = this
    const me = await ctx.model.User.findById(ctx.state.userid);
    const index = me.dislikeArticle.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikeArticle.splice(index, 1);
      me.save();
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { dislike: -1 } });
      return this.message('取消成功')

    }
    this.message('已经取消了')
  }


  // async listFollowing(ctx) {
  //   const user = await User.findById(ctx.params.id).select('+following').populate('following');
  //   if (!user) { ctx.throw(404, '用户不存在'); }
  //   ctx.body = user.following;
  // }
  // async listFollowers(ctx) {
  //   const users = await User.find({ following: ctx.params.id });
  //   ctx.body = users;
  // }
  // async checkUserExist(ctx, next) {
  //   const user = await User.findById(ctx.params.id);
  //   if (!user) { ctx.throw(404, '用户不存在'); }
  //   await next();
  // }
  // async follow(ctx) {
  //   const me = await User.findById(ctx.state.user._id).select('+following');
  //   if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
  //     me.following.push(ctx.params.id);
  //     me.save();
  //   }
  //   ctx.status = 204;
  // }
  // async unfollow(ctx) {
  //   const me = await User.findById(ctx.state.user._id).select('+following');
  //   const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
  //   if (index > -1) {
  //     me.following.splice(index, 1);
  //     me.save();
  //   }
  //   ctx.status = 204;
  // }



  async captcha() {
    const { ctx } = this;
    let captcha = await this.service.tools.captcha(); // 服务里面的方法
    console.log("captcha:",ctx.session.captcha)
    ctx.response.type = 'image/svg+xml';  // 知道你个返回的类型
    ctx.body = captcha.data; // 返回一张图片
  }
  

  async add(){
    // @ 验证码有效期
    let {ctx} = this
    
    let {email, emailcode, captcha,nickname} = ctx.request.body
    
    if(await this.checkUser(email)){
      return this.error('邮箱已存在，请登录')
    }
    if(await this.checkName(nickname)){
      return this.error('昵称存在，请更换')
    }
    if(emailcode!==ctx.session.emailcode){
      return this.error('邮箱验证码错误')
    }
    if(captcha.toUpperCase()!==ctx.session.captcha.toUpperCase()){
      return this.error('验证码错误')
    }
    let ret = await ctx.model.User.create(ctx.request.body)
    console.log(ret)
    if(ret._id){
      this.success('创建成功')
    }
  }
  async email(){
    // @todo  邮件模板
    const ctx = this.ctx;
    const email = ctx.query.email;  // 接收者的邮箱
    let code = Math.random().toString().slice(2,6)
    console.log('邮箱'+email+'验证码:'+code)
    ctx.session.emailcode = code
    const subject = '开课吧验证码';
    const text = '';
    const html = '<h2>验证码</h2><a class="elem-a" href="https://kaikeba.com"><span>'+code+'</span></a>';
    
    const has_send = await this.service.tools.sendMail(email, subject, text,html);
    
    if (has_send) {
      this.message('发送成功')
    }else{
      this.error('发送失败')
    }
    
  }
}

module.exports = UserController;
