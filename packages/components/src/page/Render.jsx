import * as React from 'react'
import { usePage } from './usePage.mjs'

/**
 *
 */
export const Render = ({
    on,
    loose = false,
    redirectFrom,
    element
  }) => {

  const {
    registerRender,
    checkActive
  } = usePage()

  React.useEffect(() => {
    registerRender({
      target: on,
      redirectFrom
    })
  }, [])

  return checkActive(on, loose) && element
}
