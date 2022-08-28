// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportAccountTradeHistory from '../../../app/service/accountTradeHistory';
import ExportLark from '../../../app/service/lark';
import ExportOrderBook from '../../../app/service/orderBook';
import ExportTrackingAccount from '../../../app/service/trackingAccount';
import ExportUtils from '../../../app/service/utils';

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    accountTradeHistory: AutoInstanceType<typeof ExportAccountTradeHistory>;
    lark: AutoInstanceType<typeof ExportLark>;
    orderBook: AutoInstanceType<typeof ExportOrderBook>;
    trackingAccount: AutoInstanceType<typeof ExportTrackingAccount>;
    utils: AutoInstanceType<typeof ExportUtils>;
  }
}
