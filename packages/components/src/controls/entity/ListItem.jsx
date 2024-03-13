// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import classnames from 'classnames'
import { pointer } from '../../core/index.mjs'

export const ListItem = React.forwardRef(({
  item,
  active = false,
  ...props
}, ref) => {

  const id = useId()

  return (
    <Item
      id={id}
      data-testid='entity-list-item'
      aria-selected={active}
      className={classnames({ 'active': active })}
      ref={ref}
      {...props}>{item.name}
    </Item>
  )
})

ListItem.displayName = 'EntityListItem'

const Item = styled.div`
  padding: 4px;

  & + & {
    margin-top: 4px;
  }

  &.active {
    background: ${({ theme }) => theme.palette.highlight};
    ${pointer}
  }
`
