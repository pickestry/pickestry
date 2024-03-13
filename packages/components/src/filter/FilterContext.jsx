// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { createContext } from 'react'

function nodef() {
  throw new Error('function not defined')
}

const props = {
  query: {},
  initQuery: {},
  config: {},
  updateQuery: nodef,
  resetQuery: nodef,
  getSelected: nodef,
  getValue: nodef,
  onDeactivate: nodef
}

export const FilterContext = createContext(props)
