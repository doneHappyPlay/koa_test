const { Controller } = require('egg');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }
  message(message){
    this.ctx.body = {
      code:0,
      message
    };
  }
  success(data) {
    this.ctx.body = {
      code:0,
      data,
    };
  }
  error(message,code=-1){
    this.ctx.body = {
      code,
      message
    }
  }
  notFound(message) {
    message = message || 'not found';
    this.ctx.throw(404, message);
  }
}
module.exports = BaseController;