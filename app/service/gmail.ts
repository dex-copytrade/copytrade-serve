import { Service } from "egg";
import nodemailer from "nodemailer";

let transporter: any = null;

// QPMEXOOQJIDSRHWA

export default class Gmail extends Service {
  private async init() {
    transporter = nodemailer.createTransport({
      // host: 'smtp.ethereal.email',
      host: 'smtp.163.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "wq599263163@163.com",
        // 这里密码不是qq密码，是你设置的smtp授权码，去qq邮箱后台开通、查看
        pass: "QPMEXOOQJIDSRHWA",
      },
    });

  }

  public async sendMail(title, content, to) {
    if(!transporter) {
      this.init()
    }

        const mailOptions = {
      from: '"Bitverse DEX Copytrading" <wq599263163@163.com>', // sender address
      to, // list of receivers
      subject: title, // Subject line
      // 发送text或者html格式
      // text: 'Hello world?', // plain text body
      html: content, // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      // console.log('Message sent: %s', info.messageId);
      console.log(info);
    });

  }
}
