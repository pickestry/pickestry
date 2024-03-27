import * as React from 'react'
import { PageContext } from './PageContext.mjs'
import { produce } from 'immer'
import { has } from 'lodash-es'
import { get } from 'lodash-es'
import { set } from 'lodash-es'

const PAGE_STORE = new Map()

PAGE_STORE.set('/', new Map())

export const PageProvider = ({
    children,
    onNavigate
  }) => {

  const [page, setPage] = React.useState('/')

  const [meta, setMeta] = React.useState({})

  const [entries, setEntries] = React.useState({})

  const [redirects, setRedirects] = React.useState({})

  const validTarget = React.useCallback((target) => {
    return  target === '/' || has(entries, target)
  })

  const checkActive = React.useCallback((target, loose = false) => {
    if(!validTarget(target)) return false

    const on = target

    const pageParts = page.split('.')

    let active = false

    if(loose === false) {
      active = (page == on)
    } else {
      for(let i = 1; i <= pageParts.length; i++) {
        const testPath = pageParts.slice(0, i).join('.')

        if(testPath == on) {
          active = true
          break
        }
      }
    }

    return active
  }, [entries, page, validTarget])

  const updateStore = React.useCallback((target) => {
    const targetParts = target.split('.')

    const activePaths = []
    for(let i = 1; i <= targetParts.length; i++) {
      const builtPath = targetParts.slice(0, i).join('.')
      activePaths.push(builtPath)
    }

    for(const key of PAGE_STORE.keys()) {
      if(!activePaths.includes(key)) {
        PAGE_STORE.delete(key)
      }
    }

    for(const key of activePaths) {
      if(!PAGE_STORE.has(key)) {
        PAGE_STORE.set(key, new Map())
      }
    }
  }, [])

  const setItem = React.useCallback((name, value) => {
    PAGE_STORE.get(page)?.set(name, value)
  }, [page])

  const getItem = React.useCallback((name, defaultValue) => {
    if(!PAGE_STORE.get(page)?.get(name) && defaultValue) {
      PAGE_STORE.get(page)?.set(name, defaultValue)
    }

    return PAGE_STORE.get(page)?.get(name)
  }, [page])

  const doNavigate = React.useCallback((v, meta, force = false) => {
    let finalTarget
    if(v === '..') {
      const parts = page.split('.')

      if(page == '/' || parts.length === 1) {
        finalTarget = '/'
      } else {
        finalTarget = parts.slice(0, -1).join('.')
      }
    } else if(has(redirects, [v])) {
      finalTarget = get(redirects, [v])
    } else {
      finalTarget = v
    }

    if(force !== true && !validTarget(finalTarget)) throw new Error('invalid target')

    // fire event
    onNavigate?.(finalTarget, meta)

    // update cache
    updateStore(finalTarget)

    // update state
    setPage(finalTarget)
    setMeta(meta)
  }, [entries, redirects, updateStore, validTarget, page])

  const registerRender = React.useCallback(({
      target,
      redirectFrom
    }) => {
    if(redirectFrom) {
      setRedirects(produce((draft) => {
        set(draft, [redirectFrom], target)
      }))
    }

    setEntries(produce((draft) => {
      set(draft, [target], { redirectFrom })
    }))

    if(page == redirectFrom) {
      doNavigate(target, meta, true)
    }
  }, [page, doNavigate, meta])

	return (
		<PageContext.Provider
      value={{
        page,
        navigate: (v, meta = {}) => { doNavigate(v, meta) },
        meta: (name) => get(meta, name),
        metaAll: () => meta,
        setItem,
        getItem,
        checkActive,
        registerRender
      }}
    >
      { children }
		</PageContext.Provider>
	)
}
