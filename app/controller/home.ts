import { Controller } from "egg";
import { getMoney } from "../utils";

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render("home.ejs");
    // ctx.body = await ctx.service.subList.getCopyCount('sdaasdsadoiiSDLDLLwewsdsd')
    // ctx.body = await ctx.model.TrackingAccount.updateMany({ status: 1 }, { grasp: 1 });
  }

  public async info() {
    const { ctx } = this;

    const data = await ctx.service.info.info();
    await ctx.render("info.ejs", { data: { getMoney, ...data } });
  }
}
