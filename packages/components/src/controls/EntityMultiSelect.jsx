// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { xorBy } from 'lodash-es'
import { remove } from 'lodash-es'
import { useMergeRefs } from '@floating-ui/react'
import { produce } from 'immer'
import { EntitySearch } from '../entity-search/index.mjs'
import { pointer } from '../core/index.mjs'


export const EntityMultiSelect = React.forwardRef(({
  name,
  defaultSelected = [],
  onChange,
  width = '400px',
  testId,
  form,
  onSearch
}, ref) => {

  const [error, setError] = React.useState()

  const refSelf = React.useRef()

  const [selected, setSelected] = React.useState(defaultSelected)

  const refCombined = useMergeRefs([ref, refSelf])

  const removeSelected = React.useCallback((id) => {
    const newSelected = produce(selected, (draft) => {
      remove(draft, (o) => o.id == id)
    })

    setSelected(newSelected)

    onChange?.(newSelected)
  }, [selected, onChange])

  const onSelect = React.useCallback((o) => {
    const newSelected = produce(selected, (draft) => {
      if(!selected.find(({id}) => id == o.id)) {

        draft.push(o)
      }
    })

    if(refSelf.current) {
      refSelf.current.value = ''
      refSelf.current.focus()
    }

    if(xorBy(selected, newSelected, 'id').length !== 0) {
      setSelected(newSelected)

      onChange?.(newSelected)
    }

    setError(undefined)
  }, [selected, onChange])

  return (
    <Root data-testid={testId ? testId : `mselect-${name}`}>
      <EntitySearch
        name={name}
        ref={refCombined}
        onSearch={onSearch}
        onSelect={onSelect}
        form={form}
        onError={(err) => { setError(err) } }
      />
      {
        selected.length !== 0 && (
          <StyledDisplay width={width}>
            {
              selected.map(({id, name}) => <SelectedBubble key={id}>{name}<SelectedRemove onClick={() => removeSelected(id)}>x</SelectedRemove></SelectedBubble>)
            }
          </StyledDisplay>
        )
      }
      { error && <Error data-testid={`entity-multi-selecte-${name}-error`}>{error}</Error> }
    </Root>
  )
})

EntityMultiSelect.displayName = 'EntityMultiSelect'

const Root = styled.div`
  position: relative;
  width: 412px;
`

const StyledDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({width}) => width};
  min-height: 27px;
  padding: 3px;
  z-index: 1;
  background: white;
  line-height: 1.42857143;
  color: ${({ theme }) => theme.palette.text.main};
  border-radius: 4px;
  outline: 0;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.palette.grey.light};
`

const SelectedBubble = styled.span`
  display: block;
  border-radius: 8px;
  background: #cecece;
  padding: 4px 4px 2px 4px;
  margin-top: 4px;

  & + & {
    margin-left: 4px;
  }
`

const SelectedRemove = styled.span`
  margin-left: 4px;
  ${pointer}
`

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
  margin-top: -4px;
`
