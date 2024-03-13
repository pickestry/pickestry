// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { FilterContext } from './FilterContext.jsx'

export const useFilter = () => {
  return React.useContext(FilterContext)
}
