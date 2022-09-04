// app/extend/context.ts
import { Context } from 'egg';

export default {
  success(this: Context, data) {
    return this.body = {
        code: 0,
        data,
        message: 'success'
    }
  },
  error(this: Context, { code = 500, data = null, message = 'error'}) {
    return this.body = {
        code,
        data,
        message
    }
  },
}