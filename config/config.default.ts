import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.security = {
    csrf: {
      // ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      enable: false,
    },
  },

  config.view =  {
    mapping: {
      '.nj': 'nunjucks',
      '.ejs': 'ejs',
    },
  },

  config.mongoose = {
    client: {
      url: 'mongodb://CopytradeTestUser:qazwsxrfv#$hjdsweyuuwei@43.134.151.23:27017/CopytradeTest',
      options: {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        bufferMaxEntries: 0,
      },
    },
  }

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1661496474724_8957';

  // add your egg config in here
  config.middleware = ['error'];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
