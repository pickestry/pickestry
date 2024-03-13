/* eslint-disable no-unused-vars */

export const ctrlInvoker = new Proxy({}, {
  get(target, prop, receiver) {
    return (...args) => window.pk.invokeControl.apply(this, [prop].concat(args))
  }
})
