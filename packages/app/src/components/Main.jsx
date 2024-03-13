// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Render } from './page/index.mjs'
import { CrudContent } from './crud/index.mjs'
import { ProductCrudContent } from './crud/ProductCrudContent.jsx'
import { PipelineCrudContent } from './crud/PipelineCrudContent.jsx'
import { POCrudContent } from './crud/POCrudContent.jsx'
import { SalesOrderCrudContent } from './crud/SalesOrderCrudContent.jsx'
import { TxCrudContent } from './crud/TxCrudContent.jsx'
import { InventoryCrudContent } from './crud/InventoryCrudContent.jsx'
import { TotalsCrud } from './crud/TotalsCrud.jsx'
import { PipelineView } from './pipeline-view/index.mjs'
import { Devices } from './Devices.jsx'
import { JobsView } from './jobs/index.mjs'
import { PartsView } from './parts-view/PartsView.jsx'
import { BuyView } from './BuyView.jsx'
import { SellView } from './SellView.jsx'
import { TaxReports } from './crud/TaxReports.jsx'
import { GenerateReport } from './reports/GenerateReport.jsx'
import { SalesTaxView } from './crud/SalesTaxView.jsx'

export const Main = () => {

  return (
    <>
      <Render on='/' element={<TotalsCrud />} />
      <Render on='start' element={<TotalsCrud />} />
      <Render on='make.orders' redirectFrom='make' element={<JobsView />} />
      <Render on='make.pipelines' element={<PipelineCrudContent />} />
      <Render on='make.pipelines.view' element={<PipelineView />} />
      <Render on='make.buy' element={<POCrudContent />} />
      <Render on='make.buy.new' element={<BuyView />} />
      <Render on='make.buy.edit' element={<BuyView />} />
      <Render on='make.suppliers' element={<CrudContent type='supplier' />} />
      <Render on='products.products' redirectFrom='products' element={<ProductCrudContent />} />
      <Render on='products.products.parts' element={<PartsView />} />
      <Render on='products.packages' element={<CrudContent type='package' />} />
      <Render on='products.inventory' element={<InventoryCrudContent />} />
      <Render on='products.inventory.txs' element={<TxCrudContent />} />
      <Render on='sales.orders' redirectFrom='sales' element={<SalesOrderCrudContent />} />
      <Render on='sales.orders.new' element={<SellView />} />
      <Render on='sales.orders.edit' element={<SellView />} />
      <Render on='sales.tax' element={<TaxReports />} />
      <Render on='sales.tax.view' element={<SalesTaxView />} />
      <Render on='sales.tax.new' element={<GenerateReport type='sales-tax' />} />
      <Render on='sales.customers' element={<CrudContent type='customer' />} />
      <Render on='more.locations' redirectFrom='more' element={<CrudContent type='location' />} />
      <Render on='more.devices' element={<Devices />} />
  </>
  )
}


