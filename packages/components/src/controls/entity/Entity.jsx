// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isNil } from 'lodash-es'
import { get } from 'lodash-es'
import { isEmpty } from 'lodash-es'
import { useMergeRefs } from '@floating-ui/react'
import { cssLink } from '../../core/index.mjs'
import { cssNoSelect } from '../../core/index.mjs'
import { EntitySearch } from '../../entity-search/index.mjs'

export const Entity = React.forwardRef(({
  name,
  value,
  form,
  testid = 'entity-control',
  width = '250px',
  readOnly = false,
  onChange,
  onSearch,
  onInit,
  onFetch,
  onClear,
  withMore
}, ref) => {

  const [busy, setBusy] = React.useState(false)

  const [selected, setSelected] = React.useState()

  const [error, setError] = React.useState()

  const inputRef = React.useRef(null)

  const onSelect = React.useCallback((o) => {
    setSelected(o)
    onChange(o)
  }, [onChange])

  React.useEffect(() => {
    if(!isNil(value) && isEmpty(selected)) {
      setBusy(true)
      onFetch(value)
        .then((res) => {
          setSelected({
            id: value,
            name: res
          })
        })
        .catch((err) => {
          // TODO:
          console.log(err) // eslint-disable-line no-console
        })
        .finally(() => { setBusy(false) })
    }
  }, [value, selected])

  const clearSelected = React.useCallback((id) => {
    onClear?.(id)
      .then(() => {
        setSelected(undefined)
        if(inputRef?.current) {
          inputRef.current.focus()
        }
      })
  }, [selected])

  const displayName = React.useMemo(() => get(selected, 'name'), [selected])

  const showClear = React.useMemo(() => {
    return (readOnly === false)
  }, [readOnly])

  const mRefs = useMergeRefs([ref, inputRef])

  return (
    <Root data-testid={testid}>
      {
        displayName
          ? <EntityDisplay data-testid='entity-display'>
              {displayName}
              { showClear && <ClearLink data-testid='clear-link' type='button' tabIndex={0} onClick={() => { selected ? clearSelected(selected.id): null }}>clear</ClearLink> }
            </EntityDisplay>
          : (
            <EntitySearch
              ref={mRefs}
              name={name}
              form={form}
              testid={`${testid}-search`}
              width={width}
              onInit={onInit}
              onError={(err) => { setError(err) }}
              onSearch={onSearch}
              onSelect={onSelect}
              forceBusy={busy}
              withMore={withMore}
            />
          )
      }
      {error && <Error data-testid={`textinput-${name}-error`}>{error}</Error>}
    </Root>
  )
})

Entity.displayName = 'Entity'

const Root = styled.div`
  width: ${({ width }) => width};

  &.error > input {
    border-color: ${({ theme: { palette } }) => palette.danger.main};
  }
`

const EntityDisplay = styled.span`
`

const ClearLink = styled.button`
  ${ cssLink }
  ${ cssNoSelect }
  margin-left: 15px;
  opacity: 0.4;

  &:focus {
    border: 1px dashed #9c9c9c;
    padding: 2px 4px;
    margin-left: 10px;
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({ theme: { palette } }) => palette.danger.main};
  margin-top: -4px;
  ${ cssNoSelect }
`

