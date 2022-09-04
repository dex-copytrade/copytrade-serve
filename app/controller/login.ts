import { SIWS } from '@web3auth/sign-in-with-solana';
import { Controller } from 'egg';
import { generateNonce, ErrorTypes, SiweMessage } from 'siwe';

export default class login extends Controller {
  async ethereumNonce() {
    const { ctx } = this;
    console.log(ctx);
    ctx.session.nonce = generateNonce();
    ctx.body = ctx.helper.success({
      msg: 'nonce',
      data: ctx.session.nonce,
    });
  }

  async ethereumVerify() {
    const { ctx } = this;
    const { message, signature } = ctx.request.body;
    ctx.logger.info('message: ', message);
    ctx.logger.info('signature: ', signature);

    try {
      const siweMessage = new SiweMessage(message);
      console.log('siweMessage', siweMessage);

      const fields = await siweMessage.validate(signature);
      ctx.logger.info('fields: ', fields);

      if (fields.nonce !== ctx.session.nonce) {
        console.log(ctx.session);
        ctx.body = ctx.helper.error({
          msg: 'Invalid nonce.',
        });
        return;
      }

      ctx.session.siwe = fields;
      ctx.body = ctx.helper.success({
        msg: '验证成功',
        data: ctx.session,
      });
    } catch (e) {
      ctx.session.siwe = null;
      ctx.session.nonce = null;
      console.log('ErrorTypes', e, ErrorTypes);
      ctx.body = ctx.helper.error({
        msg: '服务端出错了',
      });
    }
  }

  async personInfomation() {
    const { ctx } = this;

    if (!ctx.session.siwe) {
      ctx.body = ctx.helper.error({
        msg: 'You have to first sign_in',
        code: 401,
      });
      return;
    }
    ctx.body = ctx.helper.success({
      msg: '验证成功',
      data: ctx.session.siwe.address,
    });
  }

  /* SOLANA */
  async solanaNonce() {
    const { ctx } = this;
    ctx.body = ctx.helper.success({
      msg: 'nonce',
      data: '123456',
    });
  }

  async solanaVerify() {
    const { ctx } = this;
    const { header, payload, signature } = ctx.request.body;
    try {
      const msg = new SIWS({ header, payload });
      const resp = await msg.verify({ payload, signature });
      if (resp.success === true) {
        ctx.body = ctx.helper.success({
          msg: 'solanaVerify',
          data: resp,
        });
      } else {
        ctx.body = ctx.helper.success({
          msg: 'solanaVerify',
          code: 100,
        });
      }
    } catch (e) {
      ctx.logger.error(e);
      ctx.body = ctx.helper.error({
        msg: 'solanaVerify fail',
        data: e,
      });
    }
  }

  async getSolanaPersonInfomation() {
    const { ctx } = this;

    if (!ctx.session.siwe) {
      ctx.body = ctx.helper.error({
        msg: 'You have to first sign_in',
        code: 401,
      });
      return;
    }
    ctx.body = ctx.helper.success({
      msg: '验证成功',
      data: ctx.session.siwe.address,
    });
  }
}
