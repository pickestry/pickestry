// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { isFunction } from 'lodash-es'
import { ContextMenu } from '../context-menu/index.mjs'
import { pointer } from '../core/index.mjs'

export function Table(props) {
  const {
    colDef = [],
    data = [],
    testid = 'table',
    batching = false,
    actions = [],
    actionsAlwaysVisible = false,
    dataDisplay
  } = props

  const [selectedIds, setSelectedIds] = React.useState([])

  const onRowClick = React.useCallback((id, checked) => {
    if (!id) {
      return
    }

    const idx = selectedIds.indexOf(id)
    if (checked === true && idx === -1) {
      selectedIds.push(id)
      setSelectedIds(selectedIds)
    } else if (checked === false && idx !== -1) {
      selectedIds.splice(idx, 1)
      setSelectedIds(selectedIds)
    }
  }, [selectedIds])

  const withActions = React.useMemo(() => actions.length !== 0, [actions])

  const processActions = (actions, o) => {
    const finalActions = isFunction(actions) ? actions(o) : actions

    const processedActions = finalActions.map(function({ name, action }) {
      const bound_action = (action).bind(this, o)
      return {
        name,
        action: bound_action
      }
    })

    let primaryAction = () => {}
    const maybePrimary = finalActions.find((act) => act.primary === true)
    if(maybePrimary) {
      primaryAction = (e) => {
        const t = e.target
        if(t.classList.contains('cell-data')) {
          return maybePrimary.action(o)
        }

        e.stopPropagation()
      }
    }

    return [processedActions, primaryAction]
  }

  const processDisplay = React.useCallback((o, def) =>  {
    let maybeCustom
    if (isFunction(dataDisplay)) {
      maybeCustom = dataDisplay(o, def)
    }

    return isNil(maybeCustom) ? get(o, def.name, '-') : maybeCustom
  }, [])

  const hasAction = React.useMemo(() => {
    const finalArr = isFunction(actions) ? actions({}) : actions

    return finalArr.findIndex(({primary = false}) => (primary === true)) !== -1
  }, [actions])

  return (
    <Root data-testid={testid}>
      {/* <StyledHeader>Table header</StyledHeader> */}
      <StyledTable>
        <colgroup>
        {
          colDef.map(({ width }, idx) => (<col key={idx} width={width} />))
        }
        { withActions && <col key="actions" width="50px" /> }
        </colgroup>
        <THead>
          <tr>
            {batching ? <TH key="check-box-placeholder" /> : null}
            {
              colDef.map((def, idx) => (
                <TH key={idx} abbr={def.name} type={def.type}>{def.displayName || def.name}</TH>
              ))
            }
            {withActions ? <TH key="actions-placeholder" /> : null}
          </tr>
        </THead>
        <tbody style={{ marginTop: '4px' }}>
          {
            data.map((o, idx) => {
              return (
                <StyledTR key={idx} onClick={processActions(actions, o)[1]} $hasAction={hasAction}>
                  {batching ? <StyledTD key="check-box"><input type="checkbox" onChange={(e) => { onRowClick(o.id, e.target.checked) }} /></StyledTD> : null}
                  {
                    colDef.map((def, idx) => (
                      <StyledTD key={idx} type={def.type} className="cell-data">{processDisplay(o, def)}</StyledTD>
                    ))
                  }
                  {
                    withActions && (
                      <ActionsTD key="actions-cell" className="actions" $actionsAlwaysVisible={actionsAlwaysVisible}>
                        <ContextMenu entries={processActions(actions, o)[0]} placement='bottom-end' />
                      </ActionsTD>
                    )
                  }
                </StyledTR>
              )
            })
          }
        </tbody>
      </StyledTable>
    </Root>
  )
}

const Root = styled.div`
  border: ${({theme: { components: { table } }}) => table.border};
  margin: ${({theme: { components: { table } }}) => table.margin};
  padding: ${({theme: { components: { table } }}) => table.padding};
  border-radius: ${({theme: { components: { table } }}) => table.borderRadius};
  background-color: ${({theme: { components: { table } }}) => table.backgroundColor};
  min-height:  ${({theme: { components: { table } }}) => table.minHeight};
`

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
`

const StyledTR = styled.tr`
  &:not(:last-child) > td {
    border-bottom: ${({theme: { components: { table } }}) => table.trBorderBottom};
  }

  & > td {
    vertical-align: middle;
  }

  &:hover {
    background-color: ${({ theme: { palette }, $hasAction = false }) => $hasAction ? palette.highlight : 'inherit'};
    ${({ $hasAction = false }) => $hasAction ? pointer : null}
  }

  &:hover .actions {
    visibility: visible;
    transition-property: visibility;
    transition-duration: 0s;
    transition-delay: 0s;
  }
`

const StyledTD = styled.td`
  overflow: hidden;
  padding: ${({theme: { components: { table } }}) => table.tdPadding};
  text-align: ${({ type = 'string'}) => {
  switch (type) {
    case 'string':
      return 'left'
    case 'number':
    case 'currency':
      return 'right'
    case 'date':
      return 'center'
    default:
      return 'left'
    }
  }};
`

const ActionsTD = styled(StyledTD)`
  text-align: right;
  visibility: ${({ $actionsAlwaysVisible }) => $actionsAlwaysVisible ? 'visible' : 'hidden'};
  transition-property: visibility;
  transition-duration: 0s;
  transition-delay: 0s;
`

const THead = styled.thead`
  & > tr {
    padding: 0;
  }
`

const TH = styled.th`
  font-weight: ${({theme: { components: { table } }}) => table.thFontWeight};
  padding: ${({theme: { components: { table } }}) => table.thPadding};
  border-bottom: ${({theme: { components: { table } }}) => table.thBorderBottom};
  text-align: ${({ type = 'string' }) => {
    switch (type) {
      case 'string':
        return 'left'
      case 'number':
      case 'currency':
        return 'right'
      case 'date':
        return 'center'
      default:
        return 'left'
    }
  }};
`
