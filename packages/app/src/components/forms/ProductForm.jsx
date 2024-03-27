import * as React from 'react'
import { isNil } from 'lodash-es'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { SwitchField } from '@pickestry/components'
import { MoneyField } from '@pickestry/components'
import { ImageField } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { ValidInput } from '@pickestry/components'
import { Label } from '@pickestry/components'
import { DevOnly } from '@pickestry/components'
import { ProductOptionsField } from './ProductOptionsField.jsx'
import { useOptSection } from 'hooks/useOptSection.jsx'
import { useOnEvent } from 'hooks/useOnEvent.jsx'
import { useSettings } from '@pickestry/components'
import { useControl } from '@pickestry/components'

const PRODUCT_FORM_ID = 'product-form'

/**
 * onSuccess a function with a message
 */
export const ProductForm = ({
    id,
    onSuccess
  }) => {

  const [fetched, setFetched] = React.useState()

  const [units] = React.useState([
    {name: 'Each (ea)', value: 'ea'},
    {name: 'Grams (g)', value: 'g'},
    {name: 'Kilogram (kg)', value: 'kg'},
    {name: 'Meter (m)', value: 'm'},
    {name: 'Centimeter (cm)', value: 'cm'}
  ])

  const { getModel } = useForm({
    id: PRODUCT_FORM_ID,
    entity: { unit: 'ea' }
  })

  const model = React.useMemo(() => getModel(PRODUCT_FORM_ID), [getModel])

  const {
    currency,
    moneyDecimal,
    moneySeparator
  } = useSettings()

  const ctrlInvoker = useControl()

  const fetchProduct = React.useCallback((productId) => {
    ctrlInvoker.getEntity({
      model: 'Product',
      id: productId,
      include: [{ association: 'Barcode' }]
    })
    .then((entity) => {
      setFetched(entity)
    })
  }, [])

  React.useEffect(() => {
    if(id) {
      fetchProduct(id)
    }
  }, [id, fetchProduct])

  const onSubmit = React.useCallback((o) => {
    // map model
    const finalModel = produce(o, (draft) => {
      // deal with picture
      if(!draft.productPicture) {
        draft.productPicture = null
      }

      // deal with options
      if(!draft.options) {
        draft.options = null
      }

      if(isNil(draft.currency)) {
        draft.currency = currency
      }
    })

    return new Promise((resolve, reject) => {
      ctrlInvoker.saveEntity({
        model: 'Product',
        data: finalModel
      }).then((model) => {
        onSuccess?.('Successfully saved product')

        return resolve(model)
      }).catch((error) => {
        return reject(new Error('failed to save model', {cause: error}))
      })
    })
  }, [currency])

  const newEntry = React.useMemo(() => !isNil(model.id), [model])

  const hasDefinedOptions = React.useMemo(() => {
    return !isNil(get(model, 'options'))
  }, [model])

  const isVariant = React.useMemo(() => model.isVariant, [model])

  const barcode = React.useMemo(() => get(fetched, 'Barcode.value'), [fetched])

  const hasBarcode = React.useMemo(() => !isNil(barcode), [barcode])

  const productOptions = useOptSection(<ProductOptionsField />, 'Options', hasDefinedOptions)

  const productBarcode = useOptSection(
    <>
      <Label>Barcode</Label>
      <ValidInput
        key={`barcode-${barcode}`}
        name='barcode'
        value={barcode}
        onCheck={(v) => ctrlInvoker.checkBarcodeExists({ v })}
        onAccept={(v) => ctrlInvoker.addBarcodeToProduct({ id: model.id, v })}
        onRemove={() => ctrlInvoker.removeBarcodeFromProduct({ id: model.id })}
      />
    </>,
    'Barcode',
    hasBarcode)

  useOnEvent('product.updated', (data) => {
    if(data.id)
      fetchProduct(data.id)
  })

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      id={PRODUCT_FORM_ID}
      focus
      testId='product-form'
      entity={fetched}
      onSubmit={onSubmit}
      style={{width: '500px'}}
    >
      <TextField
        name="name"
        label="Name"
        width={490}
        max={70}
        hint={isVariant ? `Variant: ${Object.entries(fetched.variant).map(([k, v]) => `${k}: ${v}`, '').join(', ')}` : ''}
      />
      <TextField
        name="sku"
        label="SKU"
        width={140}
        max={14}
      />
      <ImageField name="productPicture" label="Image" />
      <SwitchField name="canBeSold" label="Can be sold" hint="Enable to show up in sales orders" />
      <MoneyField name="price" label="Price" iso={currency} decimal={moneyDecimal} separator={moneySeparator} />
      <SwitchField name="canBeBought" label="Can be bought" hint="Enable to show up in purchase orders" />
      <MoneyField name="cost" label="Cost" iso={currency} decimal={moneyDecimal} separator={moneySeparator} />
      <SelectField name="unit" label="Unit" options={units} withEmptyOption={false} />
      <div style={{marginTop: '24px'}} />
      {
        isVariant ? null : productOptions
      }
      {
        newEntry && productBarcode
      }
      <DevOnly entity={fetched} />
    </Form>
  )
}
