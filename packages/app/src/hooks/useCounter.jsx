import * as React from 'react'

export const useCounter = () => {
  const ref = React.useRef(0)

  const last = ref.current

  ref.current++

  return last
}
