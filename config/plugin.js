'use strict';

// /** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.routerGroup = {
  enable: true,
  package: 'egg-router-group',
};
exports.jwt = {
  enable: true,
  package: "egg-jwt"
};
// exports.security = {
//   csrf: {
//     enable: false,
//     // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
//     // ignore: ctx => isInnerIp(ctx.ip),
//   },
// }