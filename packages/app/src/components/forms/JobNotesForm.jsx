import * as React from 'react'
import styled from 'styled-components'
import { Form } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { useControl } from '@pickestry/components'

export const JobNotesForm = ({
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
    return ctrlInvoker.saveEntity({
      model: 'PipelineJob',
      data: o
    })
  }, [])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      testId='notes-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      entity={fetched}
      submitText='Add Note'
      focus
      width="289px"
    >
      <P>Add notes to <b>{fetched.refNum} - {fetched.name}</b></P>
      <TextAreaField name="notes" label="Notes" style={{width: '289px'}} />
    </Form>
  )
}

const P = styled.p`
  width: 287px;
  margin-bottom: 16px;
`
