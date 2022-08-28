import { Controller } from "egg";
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render('home.ejs');
  }

  public async info() {
    const { ctx } = this;

    const data = await ctx.service.info.info();
    await ctx.render('info.ejs', { data });
  }
}
