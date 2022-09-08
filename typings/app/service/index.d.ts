// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAccountTradeHistory from '../../../app/service/accountTradeHistory';
import ExportAccountPNLStatistics from '../../../app/service/account_PNL_statistics';
import ExportGmail from '../../../app/service/gmail';
import ExportInfo from '../../../app/service/info';
import ExportLark from '../../../app/service/lark';
import ExportOrderBook from '../../../app/service/orderBook';
import ExportPosition from '../../../app/service/position';
import ExportSettlePerp from '../../../app/service/settlePerp';
import ExportSubList from '../../../app/service/subList';
import ExportTrackingAccount from '../../../app/service/trackingAccount';
import ExportTradeTalent from '../../../app/service/trade_talent';
import ExportUtils from '../../../app/service/utils';

declare module 'egg' {
  interface IService {
    accountTradeHistory: AutoInstanceType<typeof ExportAccountTradeHistory>;
    accountPNLStatistics: AutoInstanceType<typeof ExportAccountPNLStatistics>;
    gmail: AutoInstanceType<typeof ExportGmail>;
    info: AutoInstanceType<typeof ExportInfo>;
    lark: AutoInstanceType<typeof ExportLark>;
    orderBook: AutoInstanceType<typeof ExportOrderBook>;
    position: AutoInstanceType<typeof ExportPosition>;
    settlePerp: AutoInstanceType<typeof ExportSettlePerp>;
    subList: AutoInstanceType<typeof ExportSubList>;
    trackingAccount: AutoInstanceType<typeof ExportTrackingAccount>;
    tradeTalent: AutoInstanceType<typeof ExportTradeTalent>;
    utils: AutoInstanceType<typeof ExportUtils>;
  }
}
