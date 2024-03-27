import * as React from 'react'
import { CrudContent } from './index.mjs'
import { useControl } from '../control/index.mjs'
import { usePage } from '../page/usePage.mjs'

export const SalesTaxView = () => {

  const { metaAll, setItem } = usePage()

  const { id } = metaAll()

  const q = {
    report_id: {
      'eq': id
    }
  }

  setItem('query', q)
  setItem('order', [['createdAt', 'ASC']])

  const appInvoker = useControl('app')

  const onExport = React.useCallback((format, query) => {
    appInvoker.exportCollection({
      model: 'ReportSalesTax',
      query,
      include: [{ association: 'Report' }, { association: 'SalesOrder' }],
      format
    }).then(({content, name, type}) => {
      // const type = (format === 'csv') ? 'text/csv' : 'application/pdf'
      const a = document.createElement('a')

      const finalBlob = new Blob([content], { type })
      const url = window.URL.createObjectURL(finalBlob)
      a.href = url
      a.download = name
      document.body.append(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    })
  }, [])

  return <CrudContent type='reportSalesTax' withBack backText='Go Back to Reports' actions={[]} globalActions={[]} onExport={onExport} />
}


