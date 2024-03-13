import styled from 'styled-components'
import { V } from '../layout/index.mjs'
import { cssNoSelect } from '../core/index.mjs'
import { BlankLink } from './BlankLink.jsx'

export const AmountLine = styled(V.Item).attrs({
  tabIndex: 0
})`
  margin-bottom: 4px;
  ${cssNoSelect}

  &:hover, &:focus {
    outline: 3px solid ${({ theme: { palette: { primary } } }) => primary.lighter};

    & > [data-action="remove"] {
      // visibility: visible;
      display: inline-block;
    }
  }
`

export const AmountLineRemove = styled(BlankLink).attrs({
  ['data-action']: 'remove'
})`
  // visibility: hidden;
  display: none;
  margin-left: 8px;
`
