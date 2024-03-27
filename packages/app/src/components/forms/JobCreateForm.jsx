import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { Label } from '@pickestry/components'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { NumberField } from '@pickestry/components'
import { DateField } from '@pickestry/components'
import { SwitchField } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { useControl } from '@pickestry/components'


export const JobCreateForm = ({ onSuccess }) => {

  const [ pkgOrProduct, setPkgOrProduct ] = React.useState()

  const {
    getValue,
    updateErrors,
    updateModel,
    reset
  } = useForm()

  const [fromProduct, setFromProduct] = React.useState(false)

  const fromPackage = React.useMemo(() => !fromProduct, [fromProduct])

  const ctrlInvoker = useControl()

  const onProductSearch = React.useCallback((v, limit = 5) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Product',
        offset: 0,
        limit,
        query: {name:{includes: v}}
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const onProductSelect = React.useCallback((id) => {
    ctrlInvoker.getEntity({
      model: 'Product',
      id
    })
    .then(setPkgOrProduct)
    .catch((err) => { updateErrors({message: err})})
  }, [])

  const onPackageSearch = React.useCallback((v = '') => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Package',
        limit: 5,
        query: {
          name: { includes: v }
        }
      })
      .then((results) => {
        resolve(results.data.map(({id, name}) => ({id, name})))
      })
      .catch(reject)
    })
  }, [])

  const onPackageSelect = React.useCallback((id) => {
    ctrlInvoker.getEntity({
      model: 'Package',
      id,
      include: {
        association: 'products'
      }
    })
    .then(setPkgOrProduct)
    .catch((err) => { updateErrors({message: err})})
  }, [])

  const onPipelineSearch = React.useCallback((v = '') => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Pipeline',
        limit: 5,
        query: {
          name: { includes: v }
        }
      })
      .then((results) => {
        resolve(results.data.map(({id, name}) => ({id, name})))
      })
      .catch(reject)
    })
  })

  const onSwitch = React.useCallback((v) => {
    setFromProduct(v)
    setPkgOrProduct(undefined)
    reset()
    updateModel({ name: 'fromProduct', value: v })
  }, [reset, updateModel])

  const onReset = React.useCallback(() => {
    setPkgOrProduct(undefined)
  }, [])

  const onSubmit = React.useCallback((o) => {
    return ctrlInvoker.createJob({
      id: o.id,
      pipelineId: o.pipelineId,
      name: o.name,
      start: o.start,
      plannedQty: o.plannedQty,
      fromPackage
    })
  }, [fromPackage])

  const plannedQty = getValue({ name: 'plannedQty' })

  const name = getValue({ name: 'name'})

  const productName = React.useMemo(() => {
    const maybeProductName = get(pkgOrProduct, 'name')
    const maybePkgMame = get(pkgOrProduct, 'products[0].name')

    return maybePkgMame ? maybePkgMame : maybeProductName
  }, [pkgOrProduct])

  const itemCount = React.useMemo(() => get(pkgOrProduct, 'products[0].PackageProduct.count', 1), [pkgOrProduct])

  React.useEffect(() => {
    if(plannedQty && !name) {
      updateModel({ name: 'name',  value: `Making ${plannedQty} ${productName}` })
    }

  }, [plannedQty, name, updateModel])

  return (
    <Form
      style={{width: '400px'}}
      focus
      testid='pipeline-job-create-form'
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    >
      <SwitchField name='fromProduct' label='From Product' hint='Create a job from a product instead of a package' onChange={onSwitch} />
      {
        fromProduct ? <EntityField
          key='product'
          name="id"
          label="Product"
          hint="Create a job for a product"
          withMore
          onInit={onProductSearch}
          onSearch={onProductSearch}
          onChange={onProductSelect}
          onClear={onReset}
        /> :
        <EntityField
          key='package'
          name="id"
          label="Package"
          hint="Create a job by choosing a package"
          onInit={onPackageSearch}
          onSearch={onPackageSearch}
          onChange={onPackageSelect}
          onClear={onReset}
        />
      }
      {
        pkgOrProduct && (
          <>
            {
              fromPackage && (
                <>
                  <br />
                  <Label>Product:</Label>{productName}
                  <br />
                  <br />
                  <Label>Items in package:</Label>{itemCount}
                  <br />
                  <br />
                </>
              )
            }
            <NumberField name="plannedQty" label="Planned Qty" hint='Number of items to produce' />
            {
              fromPackage && plannedQty && <EstimatedPackages>Estimated packages: <em>{Math.round(plannedQty / itemCount)}</em></EstimatedPackages>
            }
            <TextField name="name" label="Name" hint='A name for this job or leave empty to generate one' />
            <DateField name="start" label="Start" hint="When the start" />
            <EntityField
              name="pipelineId"
              label="Pipeline"
              onInit={onPipelineSearch}
              onSearch={onPipelineSearch}
            />

          </>
        )
      }
    </Form>
  )
}

const EstimatedPackages = styled.p`
  margin: 12px 0;
`
