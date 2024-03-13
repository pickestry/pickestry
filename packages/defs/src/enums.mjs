// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { reportTypes } from './reports.mjs'

export const enums = {
  salesOrderStatus: [
    'created',
    'preparing',
    'prepared',
    'shipped',
    'delivered',
    'canceled'
  ],
  salesOrderStatusDefault: 'created',
  purchaseOrderStatus: [
    'created',
    'sent',
    'received',
    'canceled'
  ],
  purchaseOrderStatusDefault: 'created',
  currencyIso: [
    'usd',
    'cad'
  ],
  jobStatus: [
    'created',
    'incident',
    'started',
    'done',
    'working'
  ],
  locationTypes: [
    'warehouse',
    'shop-floor',
    'building',
    'mobile'
  ],
  units: [
    'ea',
    'g',
    'kg',
    'cm',
    'm'
  ],
  scanIntent: [
    'in',
    'out'
  ],
  channelTypes: [
    'inventory',
    'production'
  ],
  inventoryTxType: [
    'in',
    'in_negative',
    'out',
    'out_negative'
  ],
  reportTypes
}
