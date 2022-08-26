// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportOrderBook from '../../../app/service/orderBook';
import ExportTrackingAccount from '../../../app/service/trackingAccount';

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    orderBook: AutoInstanceType<typeof ExportOrderBook>;
    trackingAccount: AutoInstanceType<typeof ExportTrackingAccount>;
  }
}
