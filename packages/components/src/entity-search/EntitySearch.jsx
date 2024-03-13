// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
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
import { isFunction } from 'lodash-es'
import { isNil } from 'lodash-es'
import { isEmpty } from 'lodash-es'
import { Busy } from '../Busy.jsx'
import { Muted } from '../misc/index.mjs'
import { ListItem } from './ListItem.jsx'
import { cssNoSelect } from '../core/index.mjs'
import { cssInput } from '../core/index.mjs'
import { BlankLink } from '../misc/index.mjs'

let TMOUT

const TMOUT_DELAY = 300 // ms

const INIT_DRAFT = {
  text: undefined,
  limit: 5
}

export const EntitySearch = React.forwardRef(({
  name,
  form,
  testid = 'entity-search',
  width = '250px',
  onError,
  onInit,
  onSearch,
  onSelect,
  forceBusy = false,
  withMore = false
}, ref) => {

  const [draft, setDraft] = React.useState(INIT_DRAFT)

  const [busy, setBusy] = React.useState(false)

  const [open, setOpen] = React.useState(false)

  const [data, setData] = React.useState([])

  const [activeIndex, setActiveIndex] = React.useState()

  const listRef = React.useRef([])

  const onChangeInner = React.useCallback((e) => { }, []) // eslint-disable-line no-unused-vars

  const onFocusInner = React.useCallback((e) => { // eslint-disable-line no-unused-vars
    if (isFunction(onInit)) {
      const { text } = draft
      const t = text || ''
      if(t.trim() != '') return

      setBusy(true)
      onInit()
        .then((res) => {
          setData(res)
          setOpen(!isEmpty(res))
        })
        .catch((err) => { onError(err) })
        .finally(() => { setBusy(false) })
    }
  }, [onInit])

  const onBlurInner = React.useCallback((e) => { }, []) // eslint-disable-line no-unused-vars

  const doSearch = React.useCallback((text, limit = 5) => {
    const t = text || ''
    if(t.trim() == '') {
      setData([])
      setOpen(false)
      setDraft(INIT_DRAFT)
    } else {
      clearTimeout(TMOUT)
      TMOUT = setTimeout(() => {
        setBusy(true)
        onSearch(text, limit)
        .then((data) => {
          setData(data)
          setOpen(true)
          setDraft({
            text,
            limit: limit + 5
          })
        })
        .finally(() => { setBusy(false) })
      }, TMOUT_DELAY)

    }
  }, [])

  const hasText = React.useMemo(() => {
    const t = draft.text || ''
    return t.trim() != ''
  }, [draft])

  const onMore = React.useCallback(() => {
    const { text, limit } = draft
    doSearch(text, limit)
  }, [draft, doSearch])

  const onSelectInner = React.useCallback((o) => {
    onSelect(o)
    setData([])
    setOpen(false)
    setDraft(INIT_DRAFT)
  }, [onSelect])

  const finalBusy = React.useMemo(() => (forceBusy || busy), [forceBusy, busy])

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
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: '250px'
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
    <Root data-testid={testid}>
      <InputWrapper $width={width}>
        <Input
          disabled={forceBusy}
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
                onSelectInner(data[activeIndex])
              }

              if (e.key === 'Tab') {
                setOpen(false)
              }
            }
          })
          }
          onChange={(e) => { doSearch(e.target.value) }} />
        <BusyWrapper $width={width}>
          <Busy testid={`${testid}-busy`} busy={finalBusy} />
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
                      onSelectInner(o)
                    }
                  })} />
              ))
            }
            {
              isEmpty(data)
                ? <NotFoundStyled>No Results</NotFoundStyled>
                : ( hasText && withMore && (
                  <More
                    onClick={onMore}
                    aria-selected={isNil(activeIndex) ? false : activeIndex === data.length}
                    className={`${(isNil(activeIndex) ? false : activeIndex === data.length) ? 'active' : ''}`}
                    {...getItemProps({
                      ref(node) { listRef.current[data.length] = node },
                      onClick(e) {
                        e.preventDefault()
                        setOpen(false)
                        onMore()
                      }
                    })}>
                    load more
                  </More>
              ))
            }
          </FloatingPanel>
        )
      }
    </Root>
  )
})

EntitySearch.displayName = 'EntitySearch'

const Root = styled.div``

const InputWrapper = styled.div`
  position: relative;
  width: ${({$width}) => $width};

`
const BusyWrapper = styled.div`
  display: block;
  position: absolute;
  color: yellow;
  top: 9px;
  left: ${({ $width }) => +$width.substring(0, $width.length - 2) - 22 + 'px'};
`

const Input = styled.input`
  ${cssInput}
  // letter-spacing: 2px;
  width: ${({ $width }) => $width}
  text-align: left;
  z-index: 10;
`

const FloatingPanel = styled.div`
  background-color: white;
  ${({ theme }) => theme.shadow};

  overflow-y: auto;

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

const More = styled(BlankLink)`
  width: 100%;
  color: #6e6e6e;

  &.active {
    outline: 3px solid #ccc;
  }
`
