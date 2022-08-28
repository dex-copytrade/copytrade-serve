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
        chatId: 'oc_0f6f75dac73cba801eb8521eeb464c7c',
        params: {
            text: text
        }
    })
    return data
  }
}
