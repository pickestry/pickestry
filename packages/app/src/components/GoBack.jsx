// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Link } from './page/Link.jsx'

export const GoBack = ({ title = 'Go Back' }) => {
  return <Link margin='4px 0 4px 0px' to='..'>{ title }</Link>
}
