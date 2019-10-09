/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1565838568895_3232';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    mongoose:{
      client:{
        // url: 'mongodb://127.0.0.1/kkbjs',
        // url:"mongodb+srv://kkb:123@cluster0-6vd7d.mongodb.net/test?retryWrites=true&w=majority",
        url: 'mongodb://127.0.0.1:27017/kkbjs',
        // options:  { useNewUrlParser: true },
        options:  {},
      }
    },
    security:{
      csrf:{
        enable:false
      }
    },
    jwt:{
      secret: "kaikebajwt"
    }
  };
};



// exports.mongoose = {
//   client:{
//     // url:"mongodb+srv://lewis:mukewang@zhihu-kag3y.mongodb.net/test?retryWrites=true",
//     url: 'mongodb://127.0.0.1/kkbjs',
//     // url: 'mongodb://127.0.0.1:27017/kkbjs',
//     options: {},
//   }

// };
