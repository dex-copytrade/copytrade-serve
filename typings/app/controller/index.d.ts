// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCopyTradeMarket from '../../../app/controller/copy_trade_market';
import ExportHome from '../../../app/controller/home';
import ExportLogin from '../../../app/controller/login';
import ExportPosition from '../../../app/controller/position';
import ExportSubList from '../../../app/controller/subList';

declare module 'egg' {
  interface IController {
    copyTradeMarket: ExportCopyTradeMarket;
    home: ExportHome;
    login: ExportLogin;
    position: ExportPosition;
    subList: ExportSubList;
  }
}
