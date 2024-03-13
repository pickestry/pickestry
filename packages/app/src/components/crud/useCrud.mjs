import * as React from 'react'
import { CrudContext } from './CrudContext.mjs'

export const useCrud = () => {
  return React.useContext(CrudContext)
}
