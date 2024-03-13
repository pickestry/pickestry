// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { cssTextEllipsis } from '../core/index.mjs'
import { DialogClose } from './DialogClose.jsx'
import { useDialogState } from './useDialogState.jsx'

export const DialogHeader = React.forwardRef(function DialogHeader({
  testId = 'dialog-header',
  children
}, ref) {

  const { setLabelId } = useDialogState()

  const id = React.useId()

  React.useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId('')
  }, [id, setLabelId])

  return (
    <Header data-testid={testId} ref={ref} id={id}>
      <Title title={children}>{children}</Title>
      <DialogClose>Close</DialogClose>
    </Header>
  )
})

const Header = styled.h1`
  font-size: ${({ theme: { components: { dialog } } }) => dialog.headerFontSize};
  font-weight: ${({ theme: { components: { dialog } } }) => dialog.headerFontWeight};
  font-style: ${({ theme: { components: { dialog } } }) => dialog.headerFontStyle};
  margin: ${({ theme: { components: { dialog } } }) => dialog.headerMargin};
  padding: ${({ theme: { components: { dialog } } }) => dialog.headerPadding};
  border-bottom: 1px solid ${({ theme: { components: { dialog } } }) => dialog.headerBorderBottomColor};
`

const Title = styled.span`
  max-width: 450px;
  ${cssTextEllipsis}
`
