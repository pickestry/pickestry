/* eslint-disable no-unused-vars */

'use strict'

import { ControlContext } from './ControlContext.mjs'

export const ControlProvider = ({
  invokers,
  children
}) => {

  return (
    <ControlContext.Provider value={{ invokers}}>
      { children }
    </ControlContext.Provider>
  )
}

export const createInvoker = (invoker, name) => {
  return {
    name,
    invoker: new Proxy({}, {
      get(target, prop, receiver) {

        return (...args) => {
          try {
            return invoker[prop]?.apply(this, args)
          } catch(error) {
            console.log('Failed to invoke: ', error.message)
          }
        }
      }
    })
  }
}

export const combineInvokers = (...invokers) => {
  return invokers
}
