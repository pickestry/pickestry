// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { noop } from 'lodash-es'

export const Switch = React.forwardRef(function Switch({
  testId = 'switch',
  name,
  onChange = noop,
  onFocus = noop,
  checked = false,
  form
}, ref) {

  const id = React.useId()

  return (
    <Wrapper data-testid={testId}>
      <Input id={id}
        ref={ref}
        type="checkbox"
        onChange={(e) => {
          e.stopPropagation()
          onChange(e.target.checked)
        }}
        onFocus={onFocus}
        checked={checked}
        name={name}
        form={form} />
      <Label htmlFor={id} />
    </Wrapper>
  )
})

const Wrapper = styled.div`
  position: relative
`

const Input = styled.input`
  width: 25px;
  opacity: 0;

  &:checked + label:after {
    left: 20px;
  }

  &:checked + label {
    background-color: #bada55;
  }

  &:focus + label {
    ${({ theme }) => theme.shadow}
  }
`

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  transition: all 0.3s;

  &:after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius:50%;
    background-color: white;
    top: 1px;
    left: 1px;
    transition: all 0.3s;
  }
`
