// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { isFunction } from 'lodash-es'
import { V } from '../layout/index.mjs'

export function StackedProps({
    entity = {},
    defs = [],
    testid = 'stacked-props'
  }) {

  const display = React.useCallback((def) => {
      const {
        path,
        defaultValue = '-',
        dataDisplay = '-'
      } = def
      if(isFunction(dataDisplay)) {
        return dataDisplay(entity, path, defaultValue)
      } else {
        return get(entity, path, defaultValue)
      }
  }, [entity])

  const magicNumber = React.useMemo(() => defs.length, [])

  return (
    <Root data-testid={testid} mn={magicNumber}>
      {
        defs.map((def, idx) => {
          const { label } = def
          const v = display(def)
          return <Item key={idx} title={label}><Label title={label}>{label}:</Label>{ v }<br /></Item>
        })
      }
    </Root>
  )
}

const Root = styled(V)`
  padding: 4px;
  height: ${({mn}) => `${mn / 2 * 58}px`};
  flex-wrap: wrap;
  justify-content: flex-start;
`

const Item = styled(V.Item)`
  display: flex;
  width: 48%;
  height: ${({theme: { components: { stacked } }}) => stacked.itemHeight};

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  & + & {
    margin-top: 0;
  }
`

const Label = styled.span`
  font-size: 14px;
  margin-right: 4px;
  font-weight: 600;
  width: 100px;
  text-align: right;
  margin-right: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
