// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { FloatingPortal } from '@floating-ui/react'
import { FloatingOverlay } from '@floating-ui/react'
import { FloatingFocusManager } from '@floating-ui/react'
import { useDialogState } from './useDialogState.jsx'

export const DialogContent = ({
  testId,
  children
}) => {

  const state =  useDialogState()

  return (
    <FloatingPortal>
      {state.open && (
        <FloatingOverlay className="dialog-overlay" lockScroll>
          <FloatingFocusManager
              context={state.context}
              modal={state.modal}>
            <DialogStyled
              data-testid={testId}
              ref={state.refs.floating}
              aria-labelledby={state.labelId}
              aria-describedby={state.descriptionId}
              {...state.getFloatingProps()}
            >
              {children}
            </DialogStyled>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  )
}

const DialogStyled = styled.div`
  margin: ${({ theme: { components: { dialog }}}) => dialog.contentMargin};
  background-color: white;
  padding: ${({ theme: { components: { dialog }}}) => dialog.contentPadding};
  border-radius: 4px;
  max-height: ${({ theme: { components: { dialog }}}) => dialog.maxHeight};
  z-index: 1001;
  position: relative;
  overflow: auto;
  padding-top: 0px;
`
