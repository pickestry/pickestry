// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { set } from 'lodash-es'
import { get } from 'lodash-es'
import { ItemsLine } from './ItemsLine'
import { NewItem } from './NewItem'
import { produce } from 'immer'
import { amountCalc } from './AmountCalc.mjs'

const DEFAULT_LINES_DEF = [{
  name: 'Product',
  width: '36%'
}, {
  name: 'Price',
  width: '20%',
  align: 'right'
}, {
  name: 'Qty',
  width: '10%',
  align: 'center'
}, {
  name: 'Total',
  width: '28%',
  align: 'right'
}]

export const Items = React.forwardRef(({
  testid = 'order-items',
  items = [],
  linesDef = DEFAULT_LINES_DEF,
  onSearch,
  onInit,
  onChange,
  onError,
  currency,
  symbol,
  decimal = '.',
  separator = ',',
  disabled = false,
  amountField
}, ref) => {

  const [edit, setEdit] = React.useState()

  const onEdit = React.useCallback((id) => {
    setEdit(id)
  }, [])

  const isNew = React.useMemo(() => {
    return edit === 'new'
  }, [edit])

  const stopEdit = React.useCallback(() => {
    setEdit(undefined)
  }, [])

  const onCancel = React.useCallback(() => {
    stopEdit()
  }, [stopEdit])

  const effectiveItems = React.useMemo(() => {
    return items.map((item) => {
      return produce(item, (draft) => {
        if(edit) {
          if(draft.id == edit) {
            draft.edit = true
            draft.passive = false
          } else {
            draft.edit = false
            draft.passive = true
          }
        } else {
          draft.edit = false
          draft.passive = disabled
        }

        draft.key = `${draft.id}-${edit}`
      })
    })
  }, [items, edit, disabled])

  const onRemove = React.useCallback((idx) => {
    const newItems = produce(items, (draft) => {
      draft.splice(idx, 1)
    })

    onChange(newItems)

    stopEdit()
  }, [items, onChange, stopEdit])

  const onItemChange = React.useCallback((idx, item) => {
    const newItems = produce(items, (draft) => {
      set(draft, [idx], item)
    })

    onChange(newItems)

    stopEdit()
  }, [items, onChange, stopEdit])

  const onItemAdd = React.useCallback((item) => {
    const newItems = produce(items, (draft) => {
      // We don't want duplicates, we will just bump qty on existing
      const idx = draft.findIndex(({ id }) => id == item.id)
      if(idx > -1) {
        const qty = get(draft, [idx, 'qty'], 1) + item.qty
        set(draft, [idx, 'qty'], qty)
        const total = amountCalc.calculateTotal(draft[idx])
        set(draft, [idx, 'total'], total)
      } else {
        draft.push(item)
      }
    })

    onChange(newItems)

    stopEdit()
  }, [items, onChange, stopEdit])

  return (
    <Root data-testid={testid}>
      <Header>
      { linesDef.map(({ name, width, align = 'left' }) => (<div key={name} style={{ width, textAlign: align, padding: '4px 2px' }}>{ name }</div>)) }
      <div style={{width: '64px'}} />
      </Header>
      {
        effectiveItems.map((item, idx) => {
          return (
            <ItemsLine
              ref={ref}
              key={item.key}
              item={item}
              linesDef={linesDef}
              onSearch={onSearch}
              onChange={(itm) => { onItemChange(idx, itm) }}
              onRemove={() => { onRemove(idx) }}
              onInit={onInit}
              onError={onError}
              currency={currency}
              symbol={symbol}
              decimal={decimal}
              separator={separator}
              edit={item.edit}
              passive={item.passive}
              onEdit={() => { onEdit(item.id) }}
              onCancel={() => { onCancel() }}
              amountField={amountField}
            />
          )
        })
      }

      {
        isNew ? (
          <NewItem
            onAdd={onItemAdd}
            linesDef={linesDef}
            onSearch={onSearch}
            onCancel={onCancel}
            onError={onError}
            currency={currency}
            symbol={symbol}
            decimal={decimal}
            separator={separator}
            amountField={amountField}
          />
        ) :  !disabled && (<button data-testid='add-new' onClick={() => { setEdit('new') }}>Add New Line</button>)
      }
    </Root>
  )
})

Items.displayName = 'Order Items'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: ${({ theme: { components: { items } } }) => items.border};
  border-radius: 4px;
  background: white;
  padding: 4px;
`

const Header = styled.div.attrs({
  ['data-testid']: 'header'
})`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 4px;
  margin-bottom: 4px;
  border-bottom: 1px solid #ccc;
`
