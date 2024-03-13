import * as React from 'react'
import { useFloating } from '@floating-ui/react'

export const usePopup = () => {

  const [open, setOpen] = React.useState(false)

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-end',
    open,
    onOpenChange: setOpen
  })

  const showPopup = React.useCallback(() => {
    setOpen(true)
  }, [])

  const closePopup = React.useCallback(() => {
    setOpen(false)
  }, [])

  return [refs, floatingStyles, open, showPopup, closePopup]
}
