import * as React from 'react'
import { Form } from '@pickestry/components'
import { NumberField } from '@pickestry/components'
import { ReadOnlyField } from '@pickestry/components'
import { appInvoker } from '../../common/appInvoker.mjs'

export const ExportBarcodes = ({
    barcode,
    barcodeCount,
    onSuccess
  }) => {

  const onSubmit = React.useCallback((o) => {
    return appInvoker.exportBarcodes(o)
      .then(({content, name, type}) => {
        const a = document.createElement('a')

        const url = window.URL.createObjectURL(new Blob([content], { type }))
        a.href = url
        a.download = name
        document.body.append(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        return
      })
  }, [])

  const entity = React.useMemo(() => {
    return {
      barcode,
      barcodeCount
    }
  }, [barcode, barcodeCount])

  return (
    <Form
      testId='export-barcodes-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      submitText='Export Barcodes'
      focus
      entity={entity}
      width="289px"
      submitClean
    >
      <NumberField name='barcodeCount' label="Barcodes" hint="How many labels to print" />
      <ReadOnlyField name='barcode' label='Barcode' />
    </Form>
  )
}
