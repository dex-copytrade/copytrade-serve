const url = 'http://lark.metayu.tech/api/admin/sendChatMessage'

import { Service } from 'egg';

/**
 * Test Service
 */
export default class Lark extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sendChatMessage(text: string) {
    const { ctx } = this;
    const data = await ctx.service.utils.post(url, {
        chatId: 'oc_5e5c984285cc652aa8e07d8e746808c7',
        params: {
            text: text
        }
    })
    return data
  }
}
