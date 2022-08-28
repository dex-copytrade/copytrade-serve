import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  // cors: {
  //   enable: true,
  //   package: 'egg-cors',
  // },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  console: {
    enable: true,
    package: 'egg-console',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  }
};

export default plugin;
