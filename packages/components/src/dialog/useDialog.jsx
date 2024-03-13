// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { useClick } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useRole } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { useFloating } from '@floating-ui/react'

export const useDialog = ({
  initialOpen = false,
  open: controllerOpen,
  onOpenChange: setControlledOpen,
  modal
}) => {

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen)

  const [labelId, setLabelId] = React.useState()

  const [descriptionId, setDescriptionId] = React.useState()

  const open = controllerOpen ?? uncontrolledOpen

  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const {
    placement,
    strategy,
    x,
    y,
    refs,
    context
  } = useFloating({
    open,
    onOpenChange: setOpen
  })

  const click = useClick(context, { enabled: controllerOpen == null })

  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePressEvent: undefined
  })

  const role = useRole(context)

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps
  } = useInteractions([click, dismiss, role])

  return React.useMemo(() => ({
    open,
    modal,
    setOpen,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    placement,
    strategy,
    context,
    x,
    y,
    refs,
    labelId,
    descriptionId,
    setLabelId,
    setDescriptionId
  }), [
    open,
    modal,
    setOpen,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    placement,
    strategy,
    context,
    x,
    y,
    refs,
    labelId,
    descriptionId,
    setLabelId,
    setDescriptionId
  ])
}
