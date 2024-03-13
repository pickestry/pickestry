// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import  { isFunction } from 'lodash-es'
import { get } from 'lodash-es'
import { cssLineItem } from './core/index.mjs'
import { BlankLink } from './misc/BlankLink.jsx'

export function LineItem({
    testid = 'line-item',
    item,
    onClick,
    displayFields = ['name'],
    onRemove
  }) {

  const hasOnClick = React.useMemo(() => isFunction(onClick), [onClick])

  const displayValue = React.useCallback((item) => {
    let v = ''
    for(const path of displayFields) {
      v += get(item, path, '') + ' '
    }

    return v
  }, [displayFields])

  return (
    <Root
      data-testid={testid}
      $hasOnClick={hasOnClick}
      onClick={() => (hasOnClick && isFunction(onClick)) ? onClick(item.id) : undefined}
    >
      { displayValue(item) }
      { isFunction(onRemove) && <Remove style={{float: 'right'}} onClick={onRemove}>Remove</Remove> }
    </Root>
  )
}

const Root = styled.div`
  ${cssLineItem}

  &:hover > [data-action="remove"] {
    visibility: visible;
  }

  padding: ${({ theme: { components: { list } } }) => list.itemPadding};
`

const Remove = styled(BlankLink).attrs({
  'data-action': 'remove',
})`
  visibility: hidden;
`
