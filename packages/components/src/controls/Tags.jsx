// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { cssInput } from '../core/index.mjs'
import { pointer } from '../core/index.mjs'
import { cssNoSelect } from '../core/index.mjs'
import { useMergeRefs } from '@floating-ui/react'
import { produce } from 'immer'

export const Tags = React.forwardRef(({
  name,
  defaultTags = [],
  onChange,
  width = '400px',
  placeholder = 'My Tag....',
  testId,
  form
}, ref) => {

  const refSelf = React.useRef(null)

  const [text, setText] = React.useState('')

  const [tags, setTags] = React.useState(defaultTags)

  const refCombined = useMergeRefs([ref, refSelf])

  const handleInput = React.useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setText(e.target.value)
  }, [])

  const removeTag = React.useCallback((idx) => {
    const newTags = produce(tags, (draft) => {
      draft.splice(idx, 1)
    })

    if (onChange) {
      onChange(newTags)
    }

    setTags(newTags)
  }, [tags, onChange])

  const onKeyDownInput = React.useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const newTags = produce(tags, (draft) => { draft.push(text) })

      setTags(newTags)
      setText('')

      onChange?.(newTags)

      if(refSelf.current) {
        refSelf.current.value = ''
        refSelf.current.focus()
      }
    }
  }, [text, tags, onChange])

  return (
    <Root data-testid={testId ? testId : `tags-${name}`}>
      <StyledInput
        type="text"
        ref={refCombined}
        width={width}
        name={name}
        onChange={handleInput}
        onKeyDown={onKeyDownInput}
        defaultValue={text}
        autoComplete="off"
        placeholder={placeholder}
        form={form}
      />
      {
        tags.length !== 0 && (
          <StyledDisplay width={width}>
            {
              tags.map((tag, idx) => <TagBubble key={idx}>{tag}<TagRemove onClick={() => removeTag(idx)}>x</TagRemove></TagBubble>)
            }
          </StyledDisplay>
        )
      }
    </Root>
  )
})

Tags.displayName = 'Tags'

const Root = styled.div`
    position: relative;
    width: 412px;
`

const StyledInput = styled.input`
    z-index: 10;
    width: 100%;
    ${cssInput}
    margin-bottom: 0;
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

const TagBubble = styled.span`
  ${ cssNoSelect }

  display: block;
  border-radius: 8px;
  background: #cecece;
  padding: 4px 4px 2px 4px;
  margin-top: 4px;

  & + & {
    margin-left: 4px;
  }
`

const TagRemove = styled.span`
    margin-left: 4px;
    ${pointer}
`
