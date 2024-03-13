import * as React from 'react'
import { PageContext } from './PageContext.mjs'

export const usePageStore = (name, defaultValue) => {
  if(!name) throw new Error('page store requires a name')

  const { setItem, getItem } = React.useContext(PageContext)

  const [item, setItemInner] = React.useState(getItem(name, defaultValue))

  const setValue = React.useCallback((v) => {
    setItem(name, v)
    setItemInner(v)
  }, [setItem])

  return [item, setValue]
}
