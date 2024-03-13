/* eslint-disable no-unused-vars */

export const appInvoker = new Proxy({}, {
  get(target, prop, receiver) {
    return (...args) => window.pk.invokeApp.apply(this, [prop].concat(args))
  }
})
