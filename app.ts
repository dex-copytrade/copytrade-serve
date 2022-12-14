// app.ts
import { Application, IBoot } from "egg";

export default class FooBoot implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready.
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    const ctx = this.app.createAnonymousContext();
    ctx.runInBackground(async () => {
      ctx.service.messagePush.watchAccountAction();
      ctx.service.messagePush.updateAccount();
      if (this.app.config.env !== "local") {
        ctx.logger.info("开始订阅 Order Book");
        ctx.service.orderBook.subscribeToOrderBook();

        ctx.logger.info("开始 message push");
        ctx.service.messagePush.watchAccountAction();
      }
    });

    // Server is listening.
  }

  async beforeClose() {
    // Do some thing before app close.
  }
}
