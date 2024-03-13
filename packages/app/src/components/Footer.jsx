// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { appInvoker } from '../common/appInvoker.mjs'

export const Footer = () => {

  const [version, setVersion] = React.useState()

  React.useEffect(() => {
    appInvoker.getVersion().then(setVersion)
  }, [])

  return (
    <Root>{version}</Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 37px;
  background: white;
  border-radius: 4px;
`
