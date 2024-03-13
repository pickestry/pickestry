// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash-es'
import { isUndefined } from 'lodash-es'
import { H } from '../layout/index.mjs'
import { ContextMenu } from '../context-menu/index.mjs'
import { Frame } from '../Frame.jsx'
import { Hint as HintSpan } from '../Hint.jsx'
import MenuIcon from './more-horizontal.svg'

export function Panel(props) {
  const {
    title,
    hint,
    actions,
    actionsEl = <StyledMenuIcon />,
    testid = 'panel',
    children
  } = props

  const headerEl = React.useMemo(() => {
    const arr = []

    if (title) {
      arr.push(<Title key="title">{title}</Title>)
    }

    if (!isUndefined(actions) && !isEmpty(actions)) {
      arr.push(<Actions key="actions"><ContextMenu entries={actions} element={actionsEl} /></Actions>)
    }

    return !isEmpty(arr) ? (
      <Header key="header">
        {arr}
      </Header>
    ) : null
  }, [title, actions])

  return (
    <Root $bare={props.bare} data-testid={testid}>
      { headerEl }
      { hint && <Hint>{hint}</Hint> }
      { children }
    </Root>
  )
}

const Root = styled(Frame)`
  background: white;

  & + & {
    margin-top: 12px;
  }
`

const Header = styled(H)`
  margin: ${({ theme: { components: { panel } } }) => panel.headerMargin};
  padding: ${({ theme: { components: { panel } } }) => panel.headerPadding};
  font-size: ${({ theme: { components: { panel } } }) => panel.headerFontSize};
  border-bottom: 1px solid ${({ theme: { components: { panel } } }) => panel.headerBorderBottomColor};
  font-weight: ${({ theme: { components: { panel } } }) => panel.headerFontWeight};
  font-style: ${({ theme: { components: { panel } } }) => panel.headerFontStyle};
  align-items: flex-start;
`

const Title = styled(H.Item)`
  padding: ${({ theme: { components: { panel } } }) => panel.titlePadding};
  margin: ${({ theme: { components: { panel } } }) => panel.titleMargin};
`

const Actions = styled(H.Item)`
  margin: ${({ theme: { components: { panel } } }) => panel.actionsMargin}
`

const Hint = styled(HintSpan)`
  display: block;
  position: relative;
  top: calc(-4px - 4px / 2);
  bottom: calc(4px + 20px);
  margin-bottom: 4px;
`

const StyledMenuIcon = styled(MenuIcon)`
  stroke: ${({theme: { palette: { primary } }}) => primary.main};
`
