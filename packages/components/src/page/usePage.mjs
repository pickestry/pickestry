import * as React from 'react'
import { PageContext } from './PageContext.mjs'

export const usePage = () => {
  return React.useContext(PageContext)
}
