import * as React from 'react'
import styled from 'styled-components'
import { cssEllipsis } from '../core/index.mjs'
import { cssPointer } from '../core/index.mjs'
import { Muted } from '../misc/Muted.jsx'


export const Radio = React.forwardRef(({
  testid = 'radio-button',
  name,
  value,
  defs = [],
  onChange,
  disabled = false,
  width = '150px',
  height = '80px'
}, ref) => {

  const onChangeInner = React.useCallback((e) => {
    onChange(e.target.id)
  }, [onChange])

  return (
    <Root ref={ref} data-testid={testid}>
      {
        defs.map((def) => (
          <Item key={def.value} $width={width} $height={height} data-testid='radio-item'>
            <RadioButton
              id={def.value}
              disabled={disabled}
              name={name}
              onChange={onChangeInner}
              value={def.value}
              checked={value == def.value}
              data-testid='radio-input'
            />
            <Label htmlFor={def.value}>
              <Title>{ def.name }</Title>
              <Desc>{ def.hint }</Desc>
            </Label>
          </Item>
        ))
      }
    </Root>
  )
})

Radio.displayName = 'Radio'

const Root = styled.div`
  display: flex;
  gap: 4px;
`

const Item = styled.div`
  position: relative;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border: 1px solid ${({ theme }) => theme.palette.grey.light};
  border-radius: 4px;
  background: white;

  &:hover {
    outline: 3px solid ${({ theme: { palette: { primary } } }) => primary.lighter};
  }
`

const Label = styled.label`
  position: absolute;
  display: block;
  z-index: 99;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  ${cssPointer}
`

const Title = styled.h1`
  font-size: 1rem;
  position: absolute;
  top: 6px;
  left: 24px;
  ${ cssEllipsis }
`

const Desc = styled(Muted)`
  position: absolute;
  top: 26px;
  left: 24px;
  right: 2px;
  bottom: 2px;
`

const RadioButton = styled.input.attrs({
  type: 'radio'
})`
  z-index: 100;
  margin-top: 7px;

  ${cssPointer}
`
