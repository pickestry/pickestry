import * as React from 'react'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { useControl } from '@pickestry/components'

export const JobAssignPipelineForm = ({
  id,
  onSuccess
}) => {

  const [, setJob] = React.useState()

  const ctrlInvoker = useControl()

  const onSearch = React.useCallback((v, limit) => {
    return ctrlInvoker.getCollection({
      model: 'Pipeline',
      offset: 0,
      limit,
      query: {name:{includes: v}}
    })
    .then(({ data }) => data)
  }, [])

  const onSubmit = React.useCallback(({ pipelineId }) => {
    return ctrlInvoker.assignJobToPipeline({
      jobId: id,
      pipelineId
    })
  }, [id])

  React.useEffect(() => {
    ctrlInvoker.getEntity({
      model: 'PipelineJob',
      id
    }).then((entity) => {
      setJob(entity)
    })
  }, [])

  return (
    <Form
      focus
      testId='assign-job-to-pipeline'
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    >
      <EntityField
        name="pipelineId"
        label="Pipeline"
        hint="Assign to this pipeline"
        withMore
        onSearch={onSearch}
      />
    </Form>
  )
}
