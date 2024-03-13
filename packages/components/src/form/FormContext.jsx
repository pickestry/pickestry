// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { createContext } from 'react'


function nodef() {
  throw new Error('function not defined')
}

const props = {
  uuid: '',
  id: undefined,
  model: {},
  initModel: {},
  errors: [],
  dirty: false,
  init: nodef,
  removeFields: nodef,
  updateModel: nodef,
  updateModelBulk: nodef,
  addError: nodef,
  updateErrors: nodef,
  clearErrors: nodef,
  reset: nodef,
  resetContext: nodef,
  getValue: () => undefined
}

export const FormContext = createContext(props)
