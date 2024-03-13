import * as React from 'react'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'

export const LocationMappingForm = ({
  onSuccess,
  onSubmit
}) => {

  const onLocationFromSearch = React.useCallback((v) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Location',
        offset: 0,
        limit: 5,
        query: {
          name:{ 'includes' : v },
          type: { 'eq': 'shop-floor' }
        }
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const onLocationToSearch = React.useCallback((v) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Location',
        offset: 0,
        limit: 5,
        query: {
          name:{ 'includes' : v },
          type: { 'eq': 'warehouse' }
        }
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  return (
    <>
      <Form
        focus
        testId='location-map-form'
        onSubmit={onSubmit}
        onSuccess={onSuccess}
      >
        <EntityField name='locationFrom' label='Location From' hint='Shop floor' onSearch={onLocationFromSearch} />
        <EntityField name='locationTo' label='Location To' hint='Warehouse' onSearch={onLocationToSearch} />
      </Form>
    </>
  )
}
