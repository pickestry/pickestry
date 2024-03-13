import * as React from 'react'
import styled from 'styled-components'
import { useDialogState } from './useDialogState.jsx'

export const DialogBody = ({
  testId = 'dialog-body',
  children
}) => {

  const { setDescriptionId } = useDialogState()

  const id = React.useId()

  React.useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId('')
  }, [id, setDescriptionId])

  return (
    <Body data-testid={testId} id={id}>
      {children}
    </Body>
  )
}

const Body = styled.div`
    margin: 0;
    font-size: ${({ theme: { components: { panel } } }) => panel.bodySize};
    padding-bottom: 6px;
    margin-bottom: 9px;
    font-weight: ${({ theme: { components: { panel } } }) => panel.bodyFontWeight};
    font-style: ${({ theme: { components: { panel } } }) => panel.bodyFontStyle};
`
