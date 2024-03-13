// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { useDialogState } from './useDialogState.jsx'
import { cssLink } from '../core/index.mjs'

export const DialogClose = ({
  testId = 'dialog-close',
  children
})  => {

  const { setOpen } = useDialogState()

  return (
    <StyledClose data-testid={testId} className='close-link' onClick={() => setOpen(false)}>
      {children}
    </StyledClose>
  )
}

const StyledClose = styled.a` // styled(BlankLink)
  margin-left: 8px;
  font-size: 16px;
  font-weight: 400;
  right: 16px;
  top: 10px;
  position: absolute;
  ${cssLink}
`
