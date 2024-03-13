// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Button } from '../../../components/src/buttons/Button'
import { SubmitButton } from '../../../components/src/buttons/Button'

export function Buttons() {

  return (
    <>
      <h1>Buttons</h1>

      <h5>Default Button</h5>
      <Button data-testid="default-button">Default Button</Button>

      <h5>Primary Button</h5>
      <Button primary data-testid="primary-button">Primary Button</Button>

      <h5>Small Button</h5>
      <Button success small data-testid="success-small-button">Small Success Button</Button>

      <h5>Submit Button</h5>
      <SubmitButton data-testid="submit-button" value="Submit Button" />
    </>
  )
}
