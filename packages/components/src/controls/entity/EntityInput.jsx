// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { isNil } from 'lodash-es'
import { isEmpty } from 'lodash-es'
import { flip } from '@floating-ui/react'
import { offset } from '@floating-ui/react'
import { size } from '@floating-ui/react'
import { autoUpdate } from '@floating-ui/react'
import { useFloating } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { useRole } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useListNavigation } from '@floating-ui/react'
import { useMergeRefs } from '@floating-ui/react'
import { Busy } from '../../Busy.jsx'
import { Muted } from '../../misc/index.mjs'
import { ListItem } from './ListItem.jsx'
import { cssInput } from '../../core/index.mjs'
import { cssNoSelect } from '../../core/index.mjs'

let TMOUT

const TMOUT_DELAY = 300 // ms

export const EntityInput = React.forwardRef(({
  name,
  value,
  form,
  testid,
  width,
  onError,
  onInit,
  onSearch,
  onEntitySelect
}, ref) => {

  const [busy, setBusy] = React.useState(false)

  const [open, setOpen] = React.useState(false)

  const [data, setData] = React.useState([])

  const [activeIndex, setActiveIndex] = React.useState(null)

  const listRef = React.useRef([])

  const onChangeInner = React.useCallback((e) => { }, []) // eslint-disable-line no-unused-vars

  const onFocusInner = React.useCallback((e) => { // eslint-disable-line no-unused-vars
    if (isFunction(onInit) && isNil(value)) {
      setBusy(true)
      onInit()
        .then((res) => {
          setData(res)
          setOpen(!isEmpty(res))
        })
        .catch((err) => { onError(err) })
        .finally(() => { setBusy(false) })
    }
  }, [onInit, value])

  const onBlurInner = React.useCallback((e) => { }, []) // eslint-disable-line no-unused-vars

  const doSearch = React.useCallback((text) => {
    const t = text || ''
    if(t.trim() == '') {
      setData([])
      setOpen(false)
    } else {
      clearTimeout(TMOUT)
      TMOUT = setTimeout(() => {
        onSearch(text)
        .then((data) => {
          setData(data)
          setOpen(true)
        })
      }, TMOUT_DELAY)

    }
  }, [])

  const onInnerEntitySelect = React.useCallback((o) => {
    onEntitySelect(o)
    setData([])
    setOpen(false)
  }, [onEntitySelect])

  // floating-ui
  const {
    x,
    y,
    strategy,
    context,
    refs
  } = useFloating({
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip(),
      offset(),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`
          })
        }
      })
    ]
  })

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps
  } = useInteractions(
    [
      useDismiss(context),
      useRole(context, { role: 'listbox' }),
      useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: (index) => { setActiveIndex(index) },
        loop: true,
        virtual: true
      })
    ]
  )

  const mRefs = useMergeRefs([ref, refs.setReference])

  return (
    <>
      <InputWrapper>
        <Input
          form={form}
          name={name}
          type='text'
          role='textbox'
          autoComplete='off'
          aria-autocomplete='list'
          {
          ...getReferenceProps({
            ref: mRefs,
            className: 'root-element',
            onChange: onChangeInner,
            onFocus: onFocusInner,
            onBlur: onBlurInner,
            onKeyDown(e) {
              if (e.key === 'Enter' && open) {
                e.preventDefault()
                e.stopPropagation()
              }

              if (
                e.key === 'Enter' &&
                activeIndex != null &&
                data[activeIndex]
              ) {
                setActiveIndex(null)
                setOpen(false)
                onInnerEntitySelect(data[activeIndex])
              }

              if (e.key === 'Tab') {
                setOpen(false)
              }
            }
          })
          }
          onChange={(e) => { doSearch(e.target.value) }} />
        <BusyWrapper $width={width}>
          <Busy testid={`${testid}-busy`} busy={busy} />
        </BusyWrapper>
      </InputWrapper>
      {
        open && (
          <FloatingPanel data-testid="data-list"
            {...getFloatingProps({
              ref: refs.setFloating,
              style: {
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 1
              }
            })}>
            {
              data?.map((o, idx) => (
                <ListItem
                  key={idx}
                  item={o}
                  active={isNil(activeIndex) ? false : activeIndex === idx}
                  {...getItemProps({
                    ref(node) { listRef.current[idx] = node },
                    onClick(e) {
                      e.preventDefault()
                      setOpen(false)
                      onInnerEntitySelect(o)
                    }
                  })} />
              ))
            }
            {
              isEmpty(data) && <NotFoundStyled>No Results</NotFoundStyled>
            }
          </FloatingPanel>
        )
      }
    </>
  )
})

EntityInput.displayName = 'EntityInput'

const InputWrapper = styled.div`
  position: relative;
`
const BusyWrapper = styled.div`
  display: block;
  position: absolute;
  color: yellow;
  top: 9px;
  left: ${({ $width = '100px' }) => +$width.substring(0, $width.length - 2) - 22 + 'px'};
`

const Input = styled.input`
  ${cssInput}
  // letter-spacing: 2px;
  width: ${({ width = '250px' }) => width};
  text-align: left;
  z-index: 10;
`

const FloatingPanel = styled.div`
  background-color: white;
  ${({ theme }) => theme.shadow};

  &:focus-visible {
    outline: none;
  }
`

const NotFoundStyled = styled(Muted)`
  ${ cssNoSelect }
  display: block;
  text-align: center;
  margin: 8px;
`
