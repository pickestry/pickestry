import * as React from 'react'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { NumberField } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { Label } from '@pickestry/components'
import { ValidInput } from '@pickestry/components'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { useOptSection } from 'hooks/useOptSection.jsx'
import { useOnEvent } from 'hooks/useOnEvent.jsx'

export const PackageForm = ({
    id,
    onSuccess
  }) => {

  const [fetched, setFetched] = React.useState()

  const fetchPackage = React.useCallback((pkgId) => {
    return ctrlInvoker.getEntity({
      model: 'Package',
      id: pkgId,
      include: [{ association: 'Barcode' }]
    })
    .then((entity) => {
      setFetched(entity)
    })
  }, [])

  React.useEffect(() => {
    if(id) {
      fetchPackage(id)
    }
  }, [id, fetchPackage])

  const onSearch = React.useCallback((v) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Product',
        offset: 0,
        limit: 5,
        query: {name:{includes: v}}
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const onSubmit = React.useCallback((o) => {
    return o.id
        ? ctrlInvoker.updatePackage(o)
        : ctrlInvoker.savePackage(o)
  }, [])

  const isNew = React.useMemo(() => !id, [id])

  const barcode = React.useMemo(() => get(fetched, 'Barcode.value'), [fetched])

  const hasBarcode = React.useMemo(() => !isNil(barcode), [barcode])

  const pkgBarcode = useOptSection(
    <>
      <Label>Barcode</Label>
      <ValidInput
        key={`barcode-${barcode}`}
        name='barcode'
        value={barcode}
        onCheck={(v) => ctrlInvoker.checkBarcodeExists({ v })}
        onAccept={(v) => ctrlInvoker.addBarcodeToPackage({ id, v })}
        onRemove={() => ctrlInvoker.removeBarcodeFromPackage({ id })}
      />
    </>,
    'Barcode',
    hasBarcode)

  useOnEvent('package.updated', (data) => {
    if(data.id)
      fetchPackage(data.id)
  })

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      focus
      testId='package-form'
      entity={fetched}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    >
      {
        isNew && (
          <>
            <EntityField
              name="product"
              label="Product"
              hint="Product in this package"
              onSearch={onSearch}
            />
            <NumberField name="count" label="Number of units" hint="Number of units this package contains" />
          </>
        )
      }

      <TextField name="name" label="Name" hint={`${isNew ? 'Will generate one if left empty' : ''}`} />
      <div style={{marginTop: '24px'}} />
      {
        !isNew && pkgBarcode
      }
    </Form>
  )
}
