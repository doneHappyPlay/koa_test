

// 逻辑层面controller的父类，抽象一些公用方法


const Controller = require('egg').Controller
// 业务逻辑李同用的
class BaseController extends Controller{

  message(message){
    this.ctx.body = {
      code:0,
      message
    }
  }
  // @ 公用代码抽离
  success(data){
    this.ctx.body = {
      code:0,
      data
    }
  }
  error(message, code=-1){
    this.ctx.body = {
      code,
      message
    }
  }
}

module.exports = BaseController