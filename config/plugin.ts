import { EggPlugin } from "egg";

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
  validate: {
    enable: true,
    package: "egg-validate",
  },
  mongoose: {
    enable: true,
    package: "egg-mongoose",
  },
  console: {
    enable: true,
    package: "egg-console",
  },
  cors: {
    enable: true,
    package: "egg-cors",
  },
  nunjucks: {
    enable: true,
    package: "egg-view-nunjucks",
  },
  ejs: {
    enable: true,
    package: "egg-view-ejs",
  },
};

export default plugin;
