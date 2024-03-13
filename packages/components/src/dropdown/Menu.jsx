// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { FloatingTree } from '@floating-ui/react'
import { MenuComponent } from './MenuComponent.jsx'

export const Menu = React.forwardRef((props, ref) => {

  return (
    <FloatingTree>
      <MenuComponent {...props} ref={ref} />
    </FloatingTree>
  )
})

Menu.displayName = 'Menu'
