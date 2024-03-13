// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { head } from 'lodash-es'
import { isEqual } from 'lodash-es'
import { isNil } from 'lodash-es'
import { FormContext } from './FormContext.jsx'
import { produce } from 'immer'

export const FormProvider = ({ children }) => {

  const [state, setState] = React.useState({ ids: [] })

  // console.log(JSON.stringify(state, null, 2))

  const init = React.useCallback((idRaw, entity = {}) => {
    if(!idRaw) {
      throw new Error('id required')
    }

    setState(produce((draft) => {
      const idToUse = idRaw //`id${idRaw}`

      if(!draft.ids.includes(idToUse)) {
        draft.ids.push(idToUse)
      }

      set(draft, [idToUse, 'models'], entity)
      set(draft, [idToUse, 'initModels'], entity)
      set(draft, [idToUse, 'errors'], [])
    }))
  }, [])

  const getIdFromDraft = React.useCallback((draft, form) => {
    if(draft.ids.length === 0) throw new Error('empty form context')

    if(draft.ids.length > 1 && !form) throw new Error('form required')

    return form ? form : head(draft.ids)
  }, [])

  const updateModel = React.useCallback(({
    name,
    value,
    form
  }) => {
    setState(produce((draft) => {
      const id = getIdFromDraft(draft, form)

      // const v = ''+value

      if(isNil(value)) {
        delete draft[id]['models'][name]
      } else {
        set(draft, [id, 'models', name], value)
      }
    }))
  }, [getIdFromDraft])

  const removeFields = React.useCallback(({
    fields,
    form
  }) => {
    setState(produce((draft) => {
      const id = getIdFromDraft(draft, form)

      for(const field of fields) {
        delete draft[id]['models'][field]
      }
    }))
  }, [getIdFromDraft])

  const updateModelBulk = React.useCallback(({
    model,
    form
  }) => {
    setState(produce((draft) => {
      const id = getIdFromDraft(draft, form)

      set(draft, [id, 'models'], Object.assign(get(draft, [id, 'models']), model))
    }))
  }, [getIdFromDraft])

  const updateErrors = React.useCallback(({
    errors = [],
    form
  }) => {
    setState(produce((draft) => {
      try {
        const id = getIdFromDraft(draft, form)
        set(draft, [id, 'errors'], errors)
      } catch(error) {}  // eslint-disable-line no-empty
    }))
  }, [getIdFromDraft])

  const addError = React.useCallback(({
    err,
    form
  }) => {
    setState(produce((draft) => {
      try {
        const id = getIdFromDraft(draft, form)
        draft[id]['errors'].push(err)
      } catch(error) {}  // eslint-disable-line no-empty

    }))
  }, [getIdFromDraft])

  const reset = React.useCallback((form) => {
    setState(produce((draft) => {
      try {
        const id = getIdFromDraft(draft, form)
        set(draft, [id, 'models'], get(draft, [id, 'initModels']))
      } catch(error) {}  // eslint-disable-line no-empty
    }))
  }, [getIdFromDraft])

  const resetContext = React.useCallback((form) => {
    setState(produce((draft) => {
      try {
        const id = getIdFromDraft(draft, form)
        const idx = draft.ids.findIndex((_id) => _id == id)
        if(idx > -1) {
          draft.ids.splice(idx, 1)
          delete draft[id]
        }
      } catch(error) {}  // eslint-disable-line no-empty

    }))
  }, [getIdFromDraft])

  const getModel = React.useCallback((form) => {
    try {
      const id = getIdFromDraft(state, form)
      return get(state, [id, 'models'], {})
    } catch(error) {
      return {}
    }
  }, [state, getIdFromDraft])

  const getValue = React.useCallback(({
    name,
    defaultValue,
    form
  }) => {
    try {
      const id = getIdFromDraft(state, form)
      return get(state, [id, 'models', name], defaultValue)
    } catch(error) {
      return defaultValue
    }
  }, [state, getIdFromDraft])

  const isDirty = React.useCallback((form) => {
    try {
      const id = getIdFromDraft(state, form)

      return !isEqual(get(state, [id, 'models']), get(state, [id, 'initModels']))
    } catch(error) {
      return false
    }

  }, [state, getIdFromDraft])

  const uuid = React.useMemo(() => `${performance.now()}${Math.random().toString().slice(5)}`.replace('.', ''), [])

  return (
    <FormContext.Provider value={{
      uuid,
      isDirty,
      init,
      removeFields,
      updateModel,
      updateModelBulk,
      addError,
      updateErrors,
      clearErrors: (form) => { updateErrors({errors: [], form}) },
      reset,
      resetContext,
      getValue,
      getModel
    }}>
      {children}
    </FormContext.Provider>
  )
}
