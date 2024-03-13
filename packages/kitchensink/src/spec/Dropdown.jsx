// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Menu } from '../../../components/src/dropdown'
import { MenuItem } from '../../../components/src/dropdown'
import TruckIcon from './truck.svg'

export function Dropdown() {

  const [t3Option1, sett3Option1] = React.useState(0)
  const [t3Option2, sett3Option2] = React.useState(0)

  return (
    <>
      <h1>Dropdown Menu</h1>

      <h3>Default</h3>
      <Menu placement="bottom" label='Menu' testid='test1'>
        <MenuItem key={1} label='One' />
        <MenuItem key={2} label='Two' />
      </Menu>

      <h3>Custom Icon</h3>
      <Menu testid='test-custom-icon' element={<TruckIcon />}>
        <MenuItem key={1} label='One' />
        <MenuItem key={2} label='Two' />
      </Menu>

      <h3>Custom render</h3>
      <Menu testid='test2' render={(props) => <button {...props}>MY</button>}>
        <MenuItem key={1} label='One' />
        <MenuItem key={2} label='Two' />
      </Menu>

      <h3>Custom Items</h3>
      <Menu placement="bottom" label='Menu' testid="test3">
        <MenuItem key={1} render={(props, ref) => {
          return (<button ref={ref} onClick={(e) => { sett3Option1(t3Option1 + 1); if(props.onClick) props.onClick(e)}}>Custom One</button>)
        }} />
        <MenuItem key={2} label='Two' onClick={() => {sett3Option2(t3Option2 + 1)}}/>
      </Menu>
      <div data-testid="test3-out">{t3Option1}, {t3Option2}</div>
    </>
  )
}
