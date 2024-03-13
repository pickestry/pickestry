// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { isNil } from 'lodash-es'
import { produce } from 'immer'
import { displayAmount } from '@pickestry/utils'
import { useMergeRefs } from '@floating-ui/react'
import { cssPointer } from '../../core/index.mjs'
import { display as displayTax } from '../Tax.jsx'
import { MoneyTax } from '../MoneyTax.jsx'
import { Money } from '../Money.jsx'
import { NumberInput } from '../NumberInput.jsx'
import { Muted } from '../../misc/Muted.jsx'
import { cssNoSelect } from '../../core/index.mjs'
import { Entity } from '../entity/index.mjs'
import { ButtonLink } from '../../buttons/index.mjs'
import { amountCalc } from './AmountCalc.mjs'
import EditIconSvg from '../../assets/edit.svg'
import TrashIconSvg from '../../assets/trash.svg'
import CheckIconSvg from '../../assets/check.svg'
import XIconSvg from '../../assets/x.svg'

const ITEM_IDX = 0

const PRICE_IDX = 1

const QTY_IDX = 2

const TOTAL_IDX = 3

export const ItemsLine = React.forwardRef(({
  item: itemFromProps,
  linesDef,
  edit = false,
  onEdit,
  onCancel,
  onChange,
  onRemove,
  onSearch,
  onError,
  onInit,
  currency,
  symbol,
  decimal = '.',
  separator = ',',
  passive = false,
  amountField
}, ref) => {

  const itemRef = React.useRef(null)

  const mRefs = useMergeRefs([ref, itemRef])

  const amountRef = React.useRef(null)

  const [item, setItem] = React.useState(itemFromProps)

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
    onChange(item)
  }, [item, onChange])

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

  React.useEffect(() => {
    if(edit && amountRef.current) {
      amountRef.current.focus()
    }
  }, [edit])

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

  const displayItem = React.useMemo(() => item.name, [item])

  const displayPrice = React.useMemo(() => {
    const tax1 = get(item, 'tax[0]')
    const tax2 = get(item, 'tax[1]')
    const amount = get(item, 'amount')

    return (
      <>
        {
          tax1 && (
            <TaxDisplay>
              { displayTax(tax1) }
            </TaxDisplay>
          )
        }
        {
          tax2 && (
            <TaxDisplay>
              { displayTax(tax2) }
            </TaxDisplay>
          )
        }
        {
          amount && currency && displayAmount(amount, currency)
        }
      </>
    )
  }, [item, displayTax, displayAmount, currency])

  const displayQty = React.useMemo(() => {
    return item.qty || 1
  }, [item])

  const displayTotal = React.useMemo(() => {
    return item.total && displayAmount(item.total, currency)
  }, [item, currency])

  const withTax = React.useMemo(() => {
    const tax1 = get(item, 'tax[0]')
    const tax2 = get(item, 'tax[1]')

    return !isNil(tax1) || !isNil(tax2)
  }, [item])

  return (
    <Root $edit={edit} $passive={passive}>
      <Item $width={getWidth(ITEM_IDX)} $textAlign={getAlign(ITEM_IDX)}>
        {
          edit
            ? (
              <Entity
                ref={mRefs}
                name={`item-${id}`}
                onSearch={onSearch}
                onInit={onInit}
                onChange={onSelect}
                onClear={onClear}
                onError={onError}
                width='100%'
                value={id}
                withMore
                onFetch={() => Promise.resolve(item.name)}
              />
            )
            : displayItem
        }
      </Item>
      <Price $width={getWidth(PRICE_IDX)} $textAlign={getAlign(PRICE_IDX)} $edit={edit} $withTax={withTax}>
        {
          edit
            ? (
                <MoneyTax
                  ref={amountRef}
                  name={`money-${id}`}
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
              )
            : displayPrice
        }
      </Price>
      <Qty $edit={edit} $width={getWidth(QTY_IDX)} $textAlign={getAlign(QTY_IDX)}>
        {
          edit
            ? (
              <NumberInput
                width='70px'
                name={`qty-${id}`}
                value={item.qty}
                onChange={onQtyChange}
                disabled={empty}
              />
            )
            : displayQty
        }
        <Unit $edit={edit}>{ item.unit }</Unit>
      </Qty>
      <Total $width={getWidth(TOTAL_IDX)} $textAlign={getAlign(TOTAL_IDX)}>
        {
          edit
            ? (
              <Money
                name={`total-${id}`}
                onChange={onTotalChange}
                onFocus={onFocusTotal}
                value={get(item, 'total')}
                iso={currency}
                symbol={symbol}
                decimal={decimal}
                separator={separator}
                disabled={empty}
              />
            )
            : displayTotal
        }
      </Total>
      <Actions>
        {
          edit && (
            <>
              <AcceptButtonLink data-testid="accept" title="Accept" onClick={onAccept} disabled={empty}><CheckIcon /></AcceptButtonLink>
              <ButtonLink data-testid="cancel" title="Cacnel" onClick={onCancel}><XIcon /></ButtonLink>
              <ButtonLink data-testid="remove" title="Remove" onClick={onRemove}><TrashIcon /></ButtonLink>
            </>
          )
        }
        { edit === false && passive === false && <Edit onClick={onEdit}><EditIcon /></Edit> }
      </Actions>
    </Root>
  )
})

ItemsLine.displayName = 'OrderItemsLine'

const AcceptButtonLink = styled(ButtonLink)`
  ${cssPointer}

  &:disabled {

    opacity: 0.1;

    &:hover {
      cursor: auto;
    }

  }
`

const cssHover = css`
  &:hover {
    div > [data-name="edit"] > svg {
      visibility: visible;
    }
  }

  &:focus-within {
    outline: 3px solid ${({ theme: { palette: { primary } } }) => primary.lighter};

    div > [data-name="edit"] > svg {
      visibility: visible;
    }
  }
`

const cssSelect = css`
  border: 1px solid #ccc;
  background: ${({ theme: { palette: { primary } } }) => primary.lighter };
`

const Root = styled.div.attrs({
  ['data-testid']: 'row'
})`
  display: flex;
  width: 100%;

  border-radius: 4px;
  background: white;
  padding: 4px;

  ${cssNoSelect}

  opacity: ${({ $passive }) => $passive ? 0.4 : 1 };

  ${({ $passive }) => $passive ? '' : cssHover }

  ${({ $edit }) => $edit ? cssSelect : '' }
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

const TaxDisplay = styled(Muted)`
  font-size: 10px;
  margin-right: 4px;
  vertical-align: super;

  &::before {
    content: '(';
  }

  &::after {
    content: ')';
  }
`

const Price = styled(Cell)`
  padding-right: ${({ $edit }) => $edit ? '27px' : '0px' };
  padding-top: ${({ $withTax, $edit }) => ($withTax && $edit) ? '19px': 'auto' };

  & > div {
    height: auto;
  }
`

const Qty = styled(Cell)`
  position: relative;

  & > span {
    line-height: ${({ $edit }) => $edit ? '41px' : '23px' };
  }
`

const cssUnitEdit = css`
  position: absolute;
  top: 0;
  right: 0;
`

const Unit = styled.span`
  padding-left: 4px;
  ${({ $edit }) => $edit ? cssUnitEdit : null }
`

const Total = styled(Cell)`
`

const Actions = styled.div`
  display: flex;
  gap: 4px;
  width: 76px;
  text-align: center;
`

const Edit = styled(ButtonLink).attrs({
  ['data-name']: 'edit'
})`
  margin: 0 auto;
  outline: none;

  > svg {
    visibility: hidden;
    width: 14px;
  }

  &:hover {
    // margin: 0 3px;
    // padding: 0 1px;
    // background-color: #efefef;
    // border-radius: 4px;
    opacity: 0.6;

    > svg {
      visibility: visible;
    }
  }
`

export const EditIcon = styled(EditIconSvg)`
  fill: ${({theme: { palette: {primary}}}) => primary.main};
  stroke: ${({theme: { palette: {primary}}}) => primary.main};

  ${cssPointer}
`

export const TrashIcon = styled(TrashIconSvg)`
  stroke: ${({theme: { palette: {danger}}}) => danger.main};

  ${cssPointer}
`

export const CheckIcon = styled(CheckIconSvg)`
  stroke: ${({theme: { palette: {success}}}) => success.main};
`

export const XIcon = styled(XIconSvg)`
  stroke: ${({theme: { palette: {primary}}}) => primary.main};

  ${cssPointer}
`
