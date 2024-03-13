// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import styled from 'styled-components'
import { isNil } from 'lodash-es'
import { Muted } from './Muted.jsx'

export function ItemCount({
  text = 'Items found: ',
  count,
  testid = 'item-count'
}) {
  return !isNil(count) && (<Root data-testid={testid}>{text} {count}</Root>)
}

const Root = styled(Muted)`
    display: block;
    margin-top: 16px;
`
