// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Menu } from '../dropdown/index.mjs'
import { MenuItem } from '../dropdown/index.mjs'

export function ContextMenu(props) {

  const {
    placement,
    element,
    testid,
    entries = [],
  } = props

  return(
    <Menu testid={testid} placement={placement} element={element}>
      {
        entries.map(({name, action}, idx) => <MenuItem key={idx} label={name} onClick={() => action()} />)
      }
    </Menu>
  )
}
