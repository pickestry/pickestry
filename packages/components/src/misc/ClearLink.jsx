// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { cssNoSelect } from '../core/index.mjs'
import { cssLink } from '../core/index.mjs'

export const ClearLink = styled.button`
  ${ cssLink }
  ${ cssNoSelect }
  margin-left: 15px;
  opacity: 0.4;

  &:focus {
    border: 1px dashed #9c9c9c;
    padding: 2px 4px;
    margin-left: 10px;
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`
