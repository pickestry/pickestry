// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import { Alert } from '../../../components/src/Alert'

export function Alerts() {

  const [errorShow, setErrorShow] = React.useState(true)

  return (
    <>
      <h1>Alerts</h1>

      <h3>Success</h3>
      <Alert testId='success' message="This is a success message" type="success" />

      <h3>Error</h3>
      <Alert testId='error' message="This is an error" type="danger" />

      <h3></h3>
      { errorShow && <Alert testId='error-with-close' message="This is a dismissable error" type='danger' onClose={() => {setErrorShow(false)}} /> }

      <h3>Info</h3>
      <Alert testId='info' message="This is an info (it's the default type)" />

      <h3>Warning</h3>
      <Alert testId='warn' message="This is a warning" type='warn' />
    </>
  )
}
