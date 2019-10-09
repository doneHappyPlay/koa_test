// app/service/tool.js
'use strict';
const Service = require('egg').Service;
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');
const ALY = require('aliyun-sdk')

let userEmail = '316783812@qq.com'
//发送邮件
let transporter = nodemailer.createTransport({
  service: 'qq', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // SSL安全链接
  auth: {   //发送者的账户密码
    user: userEmail, //账户
    pass: 'syezobvlnoaebgdh', //smtp授权码，到邮箱设置下获取
  }
});


class ToolService extends Service {
  checkSlider({csessionid, sig, token}){
    let jaq = new ALY.JAQ({
      accessKeyId: 'LTAI4i76mVBxdd8w',
      secretAccessKey: 'Dl1vDEPivQELigQzfMlMS8jZHncHI1',
      endpoint: 'http://jaq.aliyuncs.com',
      apiVersion: '2016-11-23'
    })
    console.log(csessionid, sig, token)
    return new Promise((resolve,reject)=>{
      jaq.afsCheck({
        Platform: 3, // 必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
        Session: csessionid, // 必填参数，从前端获取，不可更改
        Sig: sig, // 必填参数，从前端获取，不可更改
        Token: token, // 必填参数，从前端获取，不可更改
        Scene: 'nc_login'// 必填参数，从前端获取，不可更改
      },function (err, d) {
        console.log('xxx',d)
        if (err) {
          console.log('error:', err)
          reject(err)
          return
        }
        // 此处无异常，但也可能调用失败
        const ErrorCode = (typeof (d.ErrorCode) === 'string') ? parseInt(d.ErrorCode) : d.ErrorCode
        if (d.hasOwnProperty('Data') && d.Data && ErrorCode === 0) { // code == 0
          console.log(">>>>>>")
          resolve(null, true)
        } else {
          const ret = {
            source: '阿里云验证', message: '验证失败，错误代码:' + ErrorCode
          }
          console.log(ret)
          reject(ret)
        }
      })
    })


    // console.log('x112311111111111111x',d)
    // if (err) {
    //   // 异常
    //   console.log('error:', err)
    //   // callback(err, data)
    //   return
    // }
    // 此处无异常，但也可能调用失败
    
    const ErrorCode = (typeof (d.ErrorCode) === 'string') ? parseInt(d.ErrorCode) : d.ErrorCode
    if (d.hasOwnProperty('Data') && d.Data && ErrorCode === 0) { // code == 0
      console.log('通过')
      // callback(null, data)
    } else {
      const ret = {
        source: '阿里云验证', message: '验证失败，错误代码:' + ErrorCode
      }
      console.log(ret)
      // callback(ret, data)
    }
  }
  async token(_id) {
    const {ctx} = this
    return ctx.app.jwt.sign({
      data: {
        _id: _id
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, ctx.app.config.jwt.secret)
  }
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      bacground: '#cc9966'
    });
    this.ctx.session.captcha = captcha.text;
    return captcha;
  }
  async sendMail(email, subject, text, html) {

    const mailOptions = {
      from: userEmail , // 发送者,与上面的user一致
      to: email,   // 接收者,可以同时发送多个,以逗号隔开
      subject,   // 标题
      text,   // 文本
      html,
    };

// let mailOptions = {
//   from: '316783812@qq.com', // 发送者昵称和地址
//   to: '316783812@qq.com', // 接收者的邮箱地址
//   subject: '一封暖暖的小邮件', // 邮件主题
//   text: 'test mail',  //邮件的text
//   // html: html  //也可以用html发送  
// };

// transporter.sendMail(mailOptions, (error, info) => {  
//   if (error) {
//   return console.log(21,error);
//   }
//   console.log('邮件发送成功 ID：', info.messageId);
// }); 
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log(123,err)
      return false;
    }
  }

}

module.exports = ToolService;