// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { produce } from 'immer'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { isNil } from 'lodash-es'
import { cssPointer } from '../../core/index.mjs'
import { MoneyTax } from '../MoneyTax.jsx'
import { Money } from '../Money.jsx'
import { NumberInput } from '../NumberInput.jsx'
import { cssNoSelect } from '../../core/index.mjs'
import { Entity } from '../entity/index.mjs'
import { ButtonLink } from '../../buttons/index.mjs'
import { amountCalc } from './AmountCalc.mjs'
import CheckIconSvg from '../../assets/check.svg'
import XIconSvg from '../../assets/x.svg'

const ITEM_IDX = 0

const PRICE_IDX = 1

const QTY_IDX = 2

const TOTAL_IDX = 3

export const NewItem = React.forwardRef(({
  linesDef,
  onAdd,
  onSearch,
  onCancel,
  onInit,
  onError,
  currency,
  symbol,
  decimal = '.',
  separator = ',',
  amountField
}, ref) => { // eslint-disable-line

  const itemRef = React.useRef(null)

  const amountRef = React.useRef(null)

  const [item, setItem] = React.useState({})

  const id = React.useMemo(() => item.id, [item])

  const empty = React.useMemo(() => isNil(id), [id])

  const onSelect = React.useCallback((o) => {
    const { id, name } = o
    setItem(produce((draft) => {
      draft.id = id
      draft.name = name
      if(amountField && o[amountField]) {
        draft.amount = o[amountField]
        draft.currency = currency
      }
    }))

    setTimeout(() => { amountRef.current?.focus() }, 300)
  }, [amountField, currency])

  const onClear = React.useCallback(() => {
    setItem({})

    return Promise.resolve()
  }, [])

  const onPriceChange = React.useCallback((v) => {
    setItem(produce((draft) => {
      set(draft, 'amount', v)
    }))
  }, [])

  const onTaxChange = React.useCallback((v) => {
    setItem(produce((draft) => {
      set(draft, 'tax', v)
    }))
  }, [])

  const onQtyChange = React.useCallback((v) => {
    setItem(produce((draft) => {
      set(draft, 'qty', v)
    }))
  }, [])

  const onTotalChange = React.useCallback((v) => {
    setItem(produce((draft) => {
      set(draft, 'total', v)
    }))
  }, [])

  const onAccept = React.useCallback(() => {
    onAdd(item)
  }, [item, onAdd])

  const getWidth = React.useCallback((idx) => get(linesDef, [idx, 'width'], '100%'), [linesDef])

  const getAlign = React.useCallback((idx) => {
    const v = get(linesDef, [idx, 'align'], 'left')

    let align
    switch(v) {
    case 'right':
      align = '-webkit-right'
      break
    case 'center':
      align = '-webkit-center'
      break
    default:
      align = v
    }

    return align
  }, [linesDef])

  const onFocusTotal = React.useCallback(() => {
    const amount = get(item, 'amount')
    const qty = get(item, 'qty')

    if(amount && qty) {
      setItem(produce((draft) => {
        const total = amountCalc.calculateTotal(draft)
        set(draft, 'total', total)
      }))
    }
  }, [item])

  const withTax = React.useMemo(() => {
    const tax1 = get(item, 'tax[0]')
    const tax2 = get(item, 'tax[1]')

    return !isNil(tax1) || !isNil(tax2)
  }, [item])

  return (
    <Root>
      <Item $width={getWidth(ITEM_IDX)} $textAlign={getAlign(ITEM_IDX)}>
        <Entity
          ref={(node) => {
            itemRef.current = node
            node && node.focus()
          }}
          onError={onError}
          name='item-new'
          onSearch={onSearch}
          width='100%'
          onInit={onInit}
          onFetch={() => Promise.resolve('')}
          onChange={onSelect}
          onClear={onClear}
          withMore
        />
      </Item>
      <Price $width={getWidth(PRICE_IDX)} $textAlign={getAlign(PRICE_IDX)} $withTax={withTax}>
        <MoneyTax
          ref={amountRef}
          name='money-new'
          onPriceChange={onPriceChange}
          onTaxChange={onTaxChange}
          defaultValue={item.amount}
          defaultTax={item.tax}
          iso={currency}
          symbol={symbol}
          decimal={decimal}
          separator={separator}
          disabled={empty}
        />
      </Price>
      <Qty $width={getWidth(QTY_IDX)} $textAlign={getAlign(QTY_IDX)}>
        <NumberInput
          width='70px'
          name='qty-new'
          value={item.qty}
          onChange={onQtyChange}
          disabled={empty}
        />
        <Unit>{ item?.unit }</Unit>
      </Qty>
      <Total $width={getWidth(TOTAL_IDX)} $textAlign={getAlign(TOTAL_IDX)}>
        <Money
          name='total-new'
          onChange={onTotalChange}
          onFocus={onFocusTotal}
          value={get(item, 'total')}
          iso={currency}
          symbol={symbol}
          decimal={decimal}
          separator={separator}
          disabled={empty}
        />
      </Total>
      <Actions>
        <AcceptButtonLink data-testid="accept" title="Accept" onClick={onAccept} disabled={empty}><CheckIcon /></AcceptButtonLink>
        <ButtonLink data-testid="cancel" title="Cacnel" onClick={onCancel}><XIcon /></ButtonLink>
      </Actions>
    </Root>
  )
})

NewItem.displayName = 'NewItem'

const Root = styled.div.attrs({
  ['data-testid']: 'row'
})`
  display: flex;
  width: 100%;

  border-radius: 4px;
  background: white;
  padding: 4px;

  ${cssNoSelect}
`

const AcceptButtonLink = styled(ButtonLink)`
  ${cssPointer}

  &:disabled {
    opacity: 0.1;
    &:hover {
      cursor: auto;
    }
  }
`

const Cell = styled.div`
  width: ${({ $width }) => $width };
  text-align: ${({ $textAlign }) => $textAlign };
  padding: 4px 2px;
  margin: auto;
`

const Item = styled(Cell)`
  & > div {
    line-height: 37px;
  }
`

const Price = styled(Cell)`
  padding-right: 27px;
  padding-top: ${({ $withTax }) => $withTax ? '19px': 'auto' };

  & > div {
    height: auto;
  }
`

const Qty = styled(Cell)`
  position: relative;

  & > span {
    line-height: 41px;
  }
`

const Unit = styled.span`
  padding-left: 4px;
  position: absolute;
  top: 0;
  right: 0;
`

const Total = styled(Cell)`
`

const Actions = styled.div`
  display: flex;
  gap: 4px;
  width: 76px;
  text-align: center;
`

export const CheckIcon = styled(CheckIconSvg)`
  stroke: ${({theme: { palette: {success}}}) => success.main};
`

export const XIcon = styled(XIconSvg)`
  stroke: ${({theme: { palette: {primary}}}) => primary.main};

  ${cssPointer}
`
