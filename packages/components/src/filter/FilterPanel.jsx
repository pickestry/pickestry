// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/* eslint-disable no-unused-vars */

import * as React from 'react'
import styled from 'styled-components'
import { produce } from 'immer'
import { head } from 'lodash-es'
import { set } from 'lodash-es'
import { get } from 'lodash-es'
import { xor } from 'lodash-es'
import { useFloating } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { offset } from '@floating-ui/react'
import { arrow } from '@floating-ui/react'
import { FloatingArrow } from '@floating-ui/react'
import { autoPlacement } from '@floating-ui/react'
import { H } from '../layout/index.mjs'
import { BlankLink } from '../misc/index.mjs'
import { FilterContext } from './FilterContext.jsx'
import { Filter } from './Filter.jsx'
import { AvailableFilter } from './AvailableFilter.jsx'
import { defaultShadow } from '../core/index.mjs'

export const FilterPanel = ({
    testid = 'filter-panel',
    defs,
    config,
    onQuery,
    defaultQuery = {},
    displayDate,
    moreText = 'Filters'
  }) => {

  const [query, setQuery] = React.useState(defaultQuery)

  const active = React.useMemo(() => {
    const arr = {}
    for(const [k, v] of Object.entries(query)) {
      set(arr, [k], {
        selected: head(Object.keys(v))
      })
    }
    return arr
  }, [query])

  const usingAll = React.useMemo(() => {
    const activeNames = Object.keys(active)
    const allNames = defs.map((def) => def.name)

    return xor(activeNames, allNames).length === 0
  }, [active, defs])

  const notAllActive = React.useMemo(() => !usingAll, [usingAll])

  const getSelected = React.useCallback((name) => {
    const fromQuery = head(Object.keys(get(query, [name], {})))
    const fromDef = head(get(defs.find((def) => def.name === name), 'ops'))
    return (fromQuery || fromDef)
  }, [query, defs])

  const getValue = React.useCallback((name) => {
    return head(Object.values(get(query, [name], {})))
  }, [query])

  const updateQuery = React.useCallback((name, opValue) => {
    // TODO: use of path is a bit messed up.
    //       Try and use in one place maybe.
    // const def = defs.find((def) => def.name == name)
    // if(def) {
    //   const finalName = def.path ? def.path : name

    //   const newValue = produce(query, (draft) => {
    //     set(draft, [finalName], opValue)
    //   })

    //   setQuery(newValue)
    //   onQuery?.(newValue)
    // }
    const newValue = produce(query, (draft) => {
      set(draft, [name], opValue)
    })

    setQuery(newValue)
    onQuery?.(newValue)
  }, [query, defs])

  const resetQuery = React.useCallback((name) => {
    const newValue = produce(query, (draft) => {
      delete draft[name]
    })

    setQuery(newValue)
    onQuery?.(newValue)
  }, [query])

  const isFilterActive = React.useCallback((name) => {
    return !!active[name]
  }, [active])

  const onActivate = React.useCallback((name) => {
    setIsOpen(false)

    // find default op
    const def = defs.find((def) => def.name == name)
    if(def) {
      const op = head(def.ops)

      setQuery(produce((draft) => {
        set(draft, [name], {[op]: undefined})
      }))
    }
  }, [defs])

  const onDeactivate = React.useCallback((name) => {
    resetQuery(name)
  }, [resetQuery])

  // floating-ui
  const arrowRef = React.useRef()

  const [isOpen, setIsOpen] = React.useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    middleware: [
      offset(10),
      arrow({ element: arrowRef }),
      autoPlacement({
        alignment: 'end',
        allowedPlacements: ['bottom']
      })
    ]
  })

  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([ dismiss ])

  return (
    <Root data-testid={testid}>
      <FilterContext.Provider value={{
              updateQuery,
              getSelected,
              config,
              getValue,
              initQuery: defaultQuery,
              onDeactivate,
              resetQuery
            }}>
          <AvailableFilters>
            {
              defs.map((def) => {
                return isFilterActive(def.name) && (
                  <H.Item key={def.id || def.name}>
                    <Filter
                      name={def.name}
                      label={def.label}
                      ops={def.ops}
                      type={def.type}
                      displayDate={displayDate}
                      options={def.enumItems}
                      entitySearch={def.entitySearch}
                    />
                  </H.Item>
                )
              })
            }
          </AvailableFilters>
          { /* Available Filters */ }
          <div>
            {
              notAllActive && (
                <More
                  type='button'
                  data-testid='more'
                  ref={refs.setReference}
                  onClick={() => {setIsOpen(!isOpen)}} {...getReferenceProps()}
                >{moreText}</More>
              )
            }
            {
              isOpen && (
                <MoreFloating
                  ref={refs.setFloating}
                  data-testid="more-floating"
                  style={floatingStyles}
                  {...getFloatingProps()}
                >
                  <FloatingArrow ref={arrowRef} context={context} style={{fill: 'white'}} />
                  {
                    defs.map((def) => {
                      const { id, name, label, hint } = def

                      return !isFilterActive(name) && <AvailableFilter key={id || name} name={name} label={label} hint={hint} onClick={onActivate} />
                    })

                  }
                </MoreFloating>
              )
            }
            </div>
      </FilterContext.Provider>
    </Root>
  )
}

const Root = styled.div`
  position: relative;
  border: ${({theme: {components: { filter }}}) => filter.border};
  border-radius: ${({theme: {components: { filter }}}) => filter.borderRadius};
  background-color: ${({theme: {components: { filter }}}) => filter.backgroundColor};
  padding: ${({theme: {components: { filter }}}) => filter.padding};
  min-height: 42px;
  padding-right: 60px;
`

const AvailableFilters = styled(H)`
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 4px;
`

const More = styled(BlankLink)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${({theme: {components: { filter }}}) => filter.morePadding};
`

const MoreFloating = styled.div`
  z-index: 100;
  background-color: ${({theme: {components: { filter }}}) => filter.moreBackgroundColor};
  border: ${({theme: {components: { filter }}}) => filter.moreBorder};
  border-radius: ${({theme: {components: { filter }}}) => filter.moreBorderRadius};
  ${ defaultShadow }
`
