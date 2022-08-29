// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAccountTradeHistory from '../../../app/service/accountTradeHistory';
import ExportInfo from '../../../app/service/info';
import ExportLark from '../../../app/service/lark';
import ExportOrderBook from '../../../app/service/orderBook';
import ExportSettlePerp from '../../../app/service/settlePerp';
import ExportTrackingAccount from '../../../app/service/trackingAccount';
import ExportUtils from '../../../app/service/utils';

declare module 'egg' {
  interface IService {
    accountTradeHistory: AutoInstanceType<typeof ExportAccountTradeHistory>;
    info: AutoInstanceType<typeof ExportInfo>;
    lark: AutoInstanceType<typeof ExportLark>;
    orderBook: AutoInstanceType<typeof ExportOrderBook>;
    settlePerp: AutoInstanceType<typeof ExportSettlePerp>;
    trackingAccount: AutoInstanceType<typeof ExportTrackingAccount>;
    utils: AutoInstanceType<typeof ExportUtils>;
  }
}
