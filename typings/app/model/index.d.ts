// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTrackingAccount from '../../../app/model/trackingAccount';

declare module 'egg' {
  interface IModel {
    TrackingAccount: ReturnType<typeof ExportTrackingAccount>;
  }
}
