// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { V } from './layout/index.mjs'
import { Muted } from './misc/index.mjs'
import { LineItem } from './LineItem.jsx'

export function List({
  data,
  testid = 'list',
  onSelect,
  renderItem,
  displayFields = ['name'],
  onRemove
}) {

  return (
    <Root data-testid={testid}>
      {data.length === 0 ? <NoEntriesFoundCalloutStyled>Empty list!</NoEntriesFoundCalloutStyled> : null}
      <V>
        {
          data.map((d, idx) => (
            <V.Item key={d.id ? d.id : idx}>
              {
                isFunction(renderItem)
                  ? renderItem(d, onSelect)
                  : (
                    <LineItem
                      item={d}
                      onClick={ isFunction(onSelect) ? () => onSelect(d) : undefined }
                      displayFields={displayFields}
                      onRemove={ isFunction(onRemove) ? () => onRemove(d) : undefined }
                    />
                  )
              }
            </V.Item>
          ))
        }
      </V>
    </Root>
  )
}

const Root = styled.div`
`

const NoEntriesFoundCalloutStyled = styled(Muted)`
  display: block;
  text-align: center;
  margin: 40px;
`
