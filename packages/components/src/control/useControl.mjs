import { ControlContext } from './ControlContext.mjs'

export const useControl = (name = 'control') => {
  const { invokers } = React.useContext(ControlContext)

  const found = invokers.find((o) => o.name == name)

  if(!found) throw new Error(`${name} not found`)

  return found.invoker
}
