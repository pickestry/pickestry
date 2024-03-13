// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { produce } from 'immer'
import { useMergeRefs } from '@floating-ui/react'
import { isString } from 'lodash-es'
import { Select } from './Select.jsx'
import { pointer } from '../core/index.mjs'

export const MultiSelect = React.forwardRef(({
  name,
  defaultSelected = [],
  options,
  onChange,
  width = '400px',
  testId,
  form
}, ref) => {

  const refSelf = React.useRef()

  const [selected, setSelected] = React.useState(defaultSelected)

  const refCombined = useMergeRefs([ref, refSelf])

  const removeSelected = React.useCallback((idx) => {
    setSelected(produce((draft) => {
      draft.splice(idx, 1)
    }))
  }, [onChange])

  const onSelect = React.useCallback((v) => {
    if(v.trim() === '') return

    setSelected(produce((draft) => {
      draft.push(v)

      if(refSelf.current) {
        refSelf.current.value = ''
        refSelf.current.focus()
      }
    }))
  }, [selected])

  React.useEffect(() => {
    onChange?.(selected)
  }, [selected, onChange])

  const finalOptions = React.useMemo(() => {
    return options
              .filter((v) => isString(v) ? !selected.includes(v) : !selected.includes(v.value))
              .map((v) => isString(v) ? { name: v, value: v } : v)
  }, [selected, options])

  return (
    <Root data-testid={testId ? testId : `mselect-${name}`}>
      <Select
        defaultValue=""
        ref={refCombined}
        options={finalOptions}
        name={name}
        onChange={onSelect}
        form={form}
      />
      {
        selected.length !== 0 && (
          <StyledDisplay width={width}>
            {
              selected.map((v, idx) => <SelectedBubble key={idx}>{v}<SelectedRemove onClick={() => removeSelected(idx)}>x</SelectedRemove></SelectedBubble>)
            }
          </StyledDisplay>
        )
      }
    </Root>
  )
})

MultiSelect.displayName = 'MultiSelect'

const Root = styled.div`
  position: relative;
  width: 412px;
`

const StyledDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
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
`

const SelectedRemove = styled.span`
  margin-left: 4px;
  ${pointer}
`
