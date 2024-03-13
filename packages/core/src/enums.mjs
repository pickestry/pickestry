// Part of Pickestry. See LICENSE file for full copyright and licensing details.

export const enums = {
  salesOrderStatus: [
    'created',
    'preparing',
    'prepared',
    'shipped',
    'delivered',
    'canceled'
  ],
  currencyIso: [
    'usd',
    'cad'
  ],
  locationTypes: [
    'warehouse',
    'building',
    'mobile'
  ]
}

export const CounterType = {
  JOB: 'JOB',
  SO: 'SO',
  PO: 'PO',
  JOB_POSITION: 'JOBPOS'
}
