// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { noop } from 'lodash-es'
import { useDialog } from './useDialog.jsx'
import { DialogContext } from './DialogContext.jsx'
import { DialogContent } from './DialogContent.jsx'

export const Dialog = ({
    children,
    testId = 'dialog',
    initialOpen = false,
    open = false,
    onOpenChange = noop,
    modal = false
}) => {

  const dialog = useDialog({
    initialOpen,
    open,
    onOpenChange,
    modal
  })

  return (
    <DialogContext.Provider value={dialog}>
      <DialogContent testId={`${testId}-content`}>
        {children}
      </DialogContent>
    </DialogContext.Provider>
  )
}
