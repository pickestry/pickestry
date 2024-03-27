import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { usControl } from '@pickestry/components'

export const PipelineForm = ({
    id,
    onSuccess
  }) => {

  const [fetched, setFetched] = React.useState()

  const ctrlInvoker = useControl()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
        model: 'Pipeline',
        id
      })
      .then((entity) => {
        setFetched({
          name: entity.name,
          location: entity.LocationId
        })
      })
    }
  }, [id])

  const onLocationSearch = React.useCallback((v) => {
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

  const onLocationFetch = React.useCallback((id) => {
    return ctrlInvoker.getEntity({
      model: 'Location',
      id
    }).then(({name}) => name)
  }, [])

  const isNew = React.useMemo(() => !id, [id])

  const onSubmit = React.useCallback((o) => {
    return isNew
      ? ctrlInvoker.savePipeline(o)
      : ctrlInvoker.saveEntity({
        model: 'Pipeline',
        data: o
      })
  }, [isNew])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      focus
      testId='pipeline-form'
      entity={fetched}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    >
      <TextField name="name" label="Name" />
      <EntityField name='location' label='Location' hint='Shop floor' onSearch={onLocationSearch} onFetch={onLocationFetch} />
    </Form>
  )
}
