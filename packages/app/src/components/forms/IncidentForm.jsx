import * as React from 'react'
import styled from 'styled-components'
import { Form } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { DateField } from '@pickestry/components'
import { useControl } from '@pickestry/components'

export const IncidentForm = ({
    id,
    onSuccess
  }) => {

  const [fetched, setFetched] = React.useState()

  const ctrlInvoker = useControl()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
        model: 'PipelineJob',
        id
      })
      .then((entity) => { setFetched(entity) })
    }
  }, [id])

  const onSubmit = React.useCallback((o) => {
    const {
      id,
      incidentNote,
      incidentDate
    } = o

    return ctrlInvoker.saveIncidentJob({
      id,
      incidentNote,
      incidentDate
    })
  }, [])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      testId='incident-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      entity={fetched}
      submitText='Mark as Failed'
      focus
      width="289px"
    >
      <P>Job <b>{fetched.refNum} - {fetched.name}</b> has failed.</P>
      <TextAreaField name="incidentNote" label="Description" hint="Once an incident is set, the job is considered as failed and will be marked as finished." style={{width: '289px'}} />
      <DateField name="incidentDate" label="Date" hint="When the incident occured" />
    </Form>
  )
}

const P = styled.p`
  width: 287px;
  margin-bottom: 16px;
`

