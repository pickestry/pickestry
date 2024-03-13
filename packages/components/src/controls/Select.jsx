// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isString } from 'lodash-es'
import { get } from 'lodash-es'
import { noop } from 'lodash-es'
import { cssInput } from '../core/index.mjs'

export const Select = React.forwardRef(function Select({
  name,
  onChange = noop,
  options,
  defaultValue,
  withEmptyOption = true,
  form,
  autoFocus = false
}, ref) {

  const arrEl = []
  if (withEmptyOption) {
    arrEl.push(<Option value="" key="empty">---</Option>)
  }

  options.map((item, i) => {
    const val = isString(item) ? item : get(item, 'value')
    const name = isString(item) ? item : get(item, 'name')
    arrEl.push(<Option key={i} value={val}>{name}</Option>)
  })

  return (
    <StyledSelect
      key={`${name}-${defaultValue ? defaultValue : '___none___'}`}
      data-testid={`select-${name}`}
      ref={ref}
      id={`id-${name}`}
      name={name}
      form={form}
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
      autoFocus={autoFocus}
    >
      {arrEl}
    </StyledSelect>
  )
})

const StyledSelect = styled.select`
  ${cssInput}
  // background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALhJREFUeNpiYBjsgBGZw6bpFACkNIB4wa/r+17g0whUKwGkEoD4BlDtBpg4M5phBkDMAsQ6zKKKd/6+uf+FgGEcQCwBVCsAVHsDJMeEpM4AiQ1SmADViM8wDL3IBm5A04thKA7DUPSihyHIpgA0xT9AYQplYzUMGIYXsBpIwFAGQoahRAoMAAP3BTCQP0BjGwZYoBivYVgNxGMoQcNwGkjAUJyG4TUQh6F4DSMaACNKAYQZhgUACDAADXpM6fZHOOcAAAAASUVORK5CYII=) no-repeat 97% 50% transparent;
  min-width: 30px;
  width: auto;
  padding-right: 4px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
`

const Option = styled.option`
`
