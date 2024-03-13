// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import { SpinnerIcon } from './SpinnerIcon'

export function Busy({
  testid = 'busy',
  busy = true,
  abs = false,
  position = {
    right: 0,
    bottom: 0
  },
  icon
}) {
  return(
    <StyledSwitchDisplay $abs={abs} data-testid={testid} $busy={busy} $position={position}>
      { icon ? icon : <SpinnerIcon /> }
    </StyledSwitchDisplay>)
}

const cssPosition = css`
  position: ${({ $abs }) => $abs ? 'absolute' : 'relative'};
  right: ${({ $position }) => $position?.right || 0};
  bottom: ${({ $position }) => $position?.bottom || 0};
`

const StyledSwitchDisplay = styled.div`
  display: ${({ $busy }) => $busy ? 'block' : 'none' };
  ${({ $position }) => $position && cssPosition}
`
