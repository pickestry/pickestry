// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { default as barcode } from './barcode.mjs'
import { default as channel } from './channel.mjs'
import { default as counter } from './counter.mjs'
import { default as customer } from './customer.mjs'
import { default as device } from './device.mjs'
import { default as inventory_item } from './inventory_item.mjs'
import { default as inventory_tx } from './inventory_tx.mjs'
import { default as location } from './location.mjs'
import { default as pkg } from './package.mjs'
import { default as package_package } from './package_package.mjs'
import { default as package_product } from './package_product.mjs'
import { default as pipeline } from './pipeline.mjs'
import { default as pipeline_job } from './pipeline_job.mjs'
import { default as pipeline_stage } from './pipeline_stage.mjs'
import { default as product } from './product.mjs'
import { default as product_part } from './product_part.mjs'
import { default as purchase_order } from './purchase_order.mjs'
import { default as purchase_order_item } from './purchase_order_item.mjs'
import { default as report } from './report.mjs'
import { default as report_sales_tax } from './report_sales_tax.mjs'
import { default as sales_order } from './sales_order.mjs'
import { default as sales_order_item } from './sales_order_item.mjs'
import { default as seeder_meta } from './seeder_meta.mjs'
import { default as sequelize_meta } from './sequelize_meta.mjs'
import { default as supplier } from './supplier.mjs'
import { default as totals_overview } from './totals_overview.mjs'
import { default as unit } from './unit.mjs'
import { default as user } from './user.mjs'

export const models = [
  barcode,
  channel,
  counter,
  customer,
  device,
  inventory_item,
  inventory_tx,
  location,
  pkg,
  package_package,
  package_product,
  pipeline,
  pipeline_job,
  pipeline_stage,
  product,
  product_part,
  purchase_order,
  purchase_order_item,
  report,
  report_sales_tax,
  sales_order,
  sales_order_item,
  seeder_meta,
  sequelize_meta,
  supplier,
  totals_overview,
  unit,
  user
]

export {
  barcode,
  channel,
  counter,
  customer,
  device,
  inventory_item,
  inventory_tx,
  location,
  pkg,
  package_package,
  package_product,
  pipeline,
  pipeline_job,
  pipeline_stage,
  product,
  product_part,
  purchase_order,
  purchase_order_item,
  report,
  report_sales_tax,
  sales_order,
  sales_order_item,
  seeder_meta,
  sequelize_meta,
  supplier,
  totals_overview,
  unit,
  user
}
