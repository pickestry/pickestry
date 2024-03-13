// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { useContext } from 'react'
import { DialogContext } from './DialogContext.jsx'

export const useDialogState = () => {

  const ctx = useContext(DialogContext)

  if(ctx == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />')
  }

  return ctx
}
